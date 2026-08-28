import type { AuditResult, AuditRow, MediaFile, ScanProgress } from '../types';

const MEDIA_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'heic', 'heif', 'png', 'gif', 'webp', 'dng', 'raw',
  'mov', 'mp4', 'm4v', 'avi', '3gp', 'mts', 'webm',
]);

export function isMedia(name: string): boolean {
  return MEDIA_EXTENSIONS.has(name.split('.').pop()?.toLowerCase() ?? '');
}

export function fileStem(name: string): string {
  return name.replace(/\.[^.]+$/, '').toLocaleLowerCase();
}

export function isLivePart(file: MediaFile): boolean {
  return /\.(heic|heif|jpg|jpeg|mov)$/i.test(file.name);
}

export function toMediaFiles(files: FileList | File[]): MediaFile[] {
  return Array.from(files)
    .filter((file) => isMedia(file.name))
    .map((file, index) => {
      const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      return {
        id: `${relativePath}:${file.size}:${file.lastModified}:${index}`,
        name: file.name,
        path: relativePath,
        relativePath,
        size: file.size,
        modified: file.lastModified,
        type: file.type,
        file,
      };
    });
}

export async function hashFile(file: File): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashFiles(files: MediaFile[], stage: 'source' | 'destination', onProgress?: (progress: ScanProgress) => void): Promise<void> {
  for (let index = 0; index < files.length; index += 1) {
    const media = files[index];
    if (!media.hash && media.file) media.hash = await hashFile(media.file);
    onProgress?.({ stage, current: index + 1, total: files.length, fileName: media.name });
    if (index % 8 === 0) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

function livePartner(file: MediaFile, all: MediaFile[]): MediaFile | undefined {
  if (!isLivePart(file)) return undefined;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const partnerExtensions = extension === 'mov' ? ['heic', 'heif', 'jpg', 'jpeg'] : ['mov'];
  const stem = fileStem(file.name);
  const parent = file.relativePath.slice(0, -file.name.length).toLocaleLowerCase();
  return all.find((other) => {
    const otherExt = other.name.split('.').pop()?.toLowerCase() ?? '';
    return other.id !== file.id && fileStem(other.name) === stem && partnerExtensions.includes(otherExt)
      && other.relativePath.slice(0, -other.name.length).toLocaleLowerCase() === parent;
  });
}

function sourceLivePairState(file: MediaFile, source: MediaFile[], destinationHashes: Map<string, MediaFile[]>, currentMatched: boolean): AuditRow['livePair'] {
  const partner = livePartner(file, source);
  if (!partner) return 'not-live';
  return currentMatched && Boolean(partner.hash && destinationHashes.has(partner.hash)) ? 'complete' : 'unpaired';
}

function localLivePairState(file: MediaFile, files: MediaFile[]): AuditRow['livePair'] {
  return livePartner(file, files) ? 'complete' : 'not-live';
}

function byName(files: MediaFile[]): Map<string, MediaFile[]> {
  const map = new Map<string, MediaFile[]>();
  for (const file of files) {
    const key = file.name.toLocaleLowerCase();
    map.set(key, [...(map.get(key) ?? []), file]);
  }
  return map;
}

function byHash(files: MediaFile[]): Map<string, MediaFile[]> {
  const map = new Map<string, MediaFile[]>();
  for (const file of files) {
    if (!file.hash) continue;
    map.set(file.hash, [...(map.get(file.hash) ?? []), file]);
  }
  return map;
}

export async function compareLibraries(
  source: MediaFile[],
  destination: MediaFile[],
  labels = { source: 'Camera export', destination: 'Backup' },
  onProgress?: (progress: ScanProgress) => void,
): Promise<AuditResult> {
  const started = performance.now();
  await hashFiles(source, 'source', onProgress);
  await hashFiles(destination, 'destination', onProgress);
  onProgress?.({ stage: 'compare', current: 0, total: source.length + destination.length, fileName: '' });
  const destinationHashes = byHash(destination);
  const destinationNames = byName(destination);
  const usedDestinationIds = new Set<string>();
  const rows: AuditRow[] = source.map((sourceFile) => {
    const exact = destinationHashes.get(sourceFile.hash ?? '') ?? [];
    if (exact.length) {
      exact.forEach((file) => usedDestinationIds.add(file.id));
      return {
        id: `source:${sourceFile.id}`,
        status: exact.length > 1 ? 'duplicate' : 'verified',
        source: sourceFile,
        destinations: exact,
        note: exact.length > 1 ? `${exact.length} matching backup copies` : 'SHA-256 match',
        livePair: sourceLivePairState(sourceFile, source, destinationHashes, true),
      };
    }
    const sameName = destinationNames.get(sourceFile.name.toLocaleLowerCase()) ?? [];
    if (sameName.length) {
      sameName.forEach((file) => usedDestinationIds.add(file.id));
      return {
        id: `source:${sourceFile.id}`,
        status: 'changed',
        source: sourceFile,
        destinations: sameName,
        note: 'Same name, different SHA-256',
        livePair: sourceLivePairState(sourceFile, source, destinationHashes, false),
      };
    }
    return {
      id: `source:${sourceFile.id}`,
      status: 'missing',
      source: sourceFile,
      destinations: [],
      note: sourceLivePairState(sourceFile, source, destinationHashes, false) === 'unpaired' ? 'Missing file; Live Photo partner is not present' : 'No matching backup file',
      livePair: sourceLivePairState(sourceFile, source, destinationHashes, false),
    };
  });
  for (const file of destination) {
    if (!usedDestinationIds.has(file.id)) {
      rows.push({
        id: `destination:${file.id}`,
        status: 'extra',
        destinations: [file],
        note: 'Only in the backup folder',
        livePair: localLivePairState(file, destination),
      });
    }
  }
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    sourceLabel: labels.source,
    destinationLabel: labels.destination,
    sourceCount: source.length,
    destinationCount: destination.length,
    rows,
    durationMs: performance.now() - started,
  };
}

export function summary(result: AuditResult) {
  const count = (status: AuditRow['status']) => result.rows.filter((row) => row.status === status).length;
  return {
    verified: count('verified'),
    missing: count('missing'),
    changed: count('changed'),
    duplicate: count('duplicate'),
    extra: count('extra'),
    unpaired: result.rows.filter((row) => row.livePair === 'unpaired').length,
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function resultToCsv(result: AuditResult): string {
  const headers = ['status', 'source_path', 'destination_paths', 'bytes', 'sha256', 'live_pair', 'note'];
  const lines = result.rows.map((row) => [
    row.status,
    row.source?.relativePath ?? '',
    row.destinations.map((file) => file.relativePath).join(' | '),
    row.source?.size ?? row.destinations[0]?.size ?? 0,
    row.source?.hash ?? row.destinations[0]?.hash ?? '',
    row.livePair,
    row.note,
  ].map(csvCell).join(','));
  return [headers.join(','), ...lines].join('\n');
}
