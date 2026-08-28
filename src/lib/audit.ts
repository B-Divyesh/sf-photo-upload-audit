import type { AuditResult, AuditRow, MediaFile, ScanProgress } from '../types';

const MEDIA_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'heic', 'heif', 'png', 'gif', 'webp', 'tif', 'tiff', 'dng', 'raw',
  'cr2', 'cr3', 'nef', 'arw', 'orf', 'rw2', 'raf',
  'mov', 'mp4', 'm4v', 'avi', '3gp', 'mts', 'webm', 'mkv', 'mpg', 'mpeg', 'wmv',
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

export function toMediaFile(file: File, index: number, suppliedPath?: string): MediaFile {
  const relativePath = suppliedPath || (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const supported = isMedia(file.name);
  return {
    id: `${relativePath}:${file.size}:${file.lastModified}:${index}`,
    name: file.name,
    path: relativePath,
    relativePath,
    size: file.size,
    modified: file.lastModified,
    type: file.type,
    file,
    supported,
    ...(supported ? {} : {
      unsupportedReason: extension
        ? `This file type is not checked by this version (.${extension}).`
        : 'This file has no extension, so this version cannot check it.',
    }),
  };
}

/**
 * Keep every selected entry. A receipt must surface a file the current
 * version cannot check instead of silently excluding it from an all-clear.
 */
export function toMediaFiles(files: FileList | File[]): MediaFile[] {
  return Array.from(files).map((file, index) => toMediaFile(file, index));
}

// Web Crypto only accepts a complete buffer for digest(), which is a poor fit for
// videos.  This small incremental SHA-256 implementation keeps at most one 64
// byte block (plus the browser's stream chunk) in memory.
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const rotateRight = (value: number, bits: number) => (value >>> bits) | (value << (32 - bits));

class StreamingSha256 {
  private readonly state = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  private readonly buffer = new Uint8Array(64);
  private buffered = 0;
  private bytes = 0;

  update(input: Uint8Array): void {
    this.bytes += input.byteLength;
    let offset = 0;
    if (this.buffered) {
      const needed = 64 - this.buffered;
      const take = Math.min(needed, input.byteLength);
      this.buffer.set(input.subarray(0, take), this.buffered);
      this.buffered += take;
      offset += take;
      if (this.buffered === 64) { this.process(this.buffer); this.buffered = 0; }
    }
    while (offset + 64 <= input.byteLength) { this.process(input.subarray(offset, offset + 64)); offset += 64; }
    if (offset < input.byteLength) { this.buffer.set(input.subarray(offset)); this.buffered = input.byteLength - offset; }
  }

  digest(): string {
    const bitLength = BigInt(this.bytes) * 8n;
    const paddingLength = this.buffered < 56 ? 56 - this.buffered : 120 - this.buffered;
    const padding = new Uint8Array(paddingLength + 8);
    padding[0] = 0x80;
    for (let index = 0; index < 8; index += 1) padding[paddingLength + index] = Number((bitLength >> BigInt((7 - index) * 8)) & 0xffn);
    this.update(padding);
    return Array.from(this.state, (word) => word.toString(16).padStart(8, '0')).join('');
  }

  private process(block: Uint8Array): void {
    const words = new Uint32Array(64);
    for (let index = 0; index < 16; index += 1) words[index] = ((block[index * 4] << 24) | (block[index * 4 + 1] << 16) | (block[index * 4 + 2] << 8) | block[index * 4 + 3]) >>> 0;
    for (let index = 16; index < 64; index += 1) {
      const a = words[index - 15]; const b = words[index - 2];
      words[index] = (rotateRight(a, 7) ^ rotateRight(a, 18) ^ (a >>> 3)) + words[index - 16] + (rotateRight(b, 17) ^ rotateRight(b, 19) ^ (b >>> 10)) + words[index - 7];
    }
    let [a, b, c, d, e, f, g, h] = this.state;
    for (let index = 0; index < 64; index += 1) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + choice + SHA256_K[index] + words[index]) >>> 0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    this.state[0] = (this.state[0] + a) >>> 0; this.state[1] = (this.state[1] + b) >>> 0;
    this.state[2] = (this.state[2] + c) >>> 0; this.state[3] = (this.state[3] + d) >>> 0;
    this.state[4] = (this.state[4] + e) >>> 0; this.state[5] = (this.state[5] + f) >>> 0;
    this.state[6] = (this.state[6] + g) >>> 0; this.state[7] = (this.state[7] + h) >>> 0;
  }
}

export async function hashFile(file: File): Promise<string> {
  const hasher = new StreamingSha256();
  const reader = file.stream().getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) hasher.update(value);
    }
  } finally {
    reader.releaseLock();
  }
  return hasher.digest();
}

async function hashFiles(files: MediaFile[], stage: 'source' | 'destination', onProgress?: (progress: ScanProgress) => void): Promise<void> {
  for (let index = 0; index < files.length; index += 1) {
    const media = files[index];
    if (!media.hash && media.file) {
      try {
        media.hash = await hashFile(media.file);
      } catch {
        media.scanError = 'This file could not be read for a content check.';
      }
    }
    onProgress?.({ stage, current: index + 1, total: files.length, fileName: media.name });
    if (media.file && index % 8 === 0) await new Promise<void>((resolve) => {
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
      else setTimeout(resolve, 0);
    });
  }
}

function liveKey(file: MediaFile): string | undefined {
  if (!isLivePart(file)) return undefined;
  const parent = file.relativePath.slice(0, -file.name.length).toLocaleLowerCase();
  return `${parent}\u0000${fileStem(file.name)}`;
}

function livePartners(files: MediaFile[]): Map<string, MediaFile[]> {
  const index = new Map<string, MediaFile[]>();
  for (const file of files) {
    const key = liveKey(file);
    if (key) index.set(key, [...(index.get(key) ?? []), file]);
  }
  return index;
}

function livePartner(file: MediaFile, index: Map<string, MediaFile[]>): MediaFile | undefined {
  const key = liveKey(file);
  if (!key) return undefined;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const partnerExtensions = extension === 'mov' ? ['heic', 'heif', 'jpg', 'jpeg'] : ['mov'];
  return (index.get(key) ?? []).find((other) => {
    const otherExt = other.name.split('.').pop()?.toLowerCase() ?? '';
    return other.id !== file.id && partnerExtensions.includes(otherExt);
  });
}

function sourceLivePairState(file: MediaFile, sourceIndex: Map<string, MediaFile[]>, destinationHashes: Map<string, MediaFile[]>, currentMatched: boolean): AuditRow['livePair'] {
  const partner = livePartner(file, sourceIndex);
  if (!partner) return 'not-live';
  return currentMatched && Boolean(partner.hash && destinationHashes.has(partner.hash)) ? 'complete' : 'unpaired';
}

function localLivePairState(file: MediaFile, index: Map<string, MediaFile[]>): AuditRow['livePair'] {
  return livePartner(file, index) ? 'complete' : 'not-live';
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
  const sourceCandidates = source.filter((file) => file.supported !== false);
  const destinationCandidates = destination.filter((file) => file.supported !== false);
  await hashFiles(sourceCandidates, 'source', onProgress);
  await hashFiles(destinationCandidates, 'destination', onProgress);
  const sourceChecked = sourceCandidates.filter((file) => !file.scanError);
  const destinationChecked = destinationCandidates.filter((file) => !file.scanError);
  onProgress?.({ stage: 'compare', current: 0, total: sourceChecked.length + destinationChecked.length, fileName: '' });
  const destinationHashes = byHash(destinationChecked);
  const destinationNames = byName(destinationChecked);
  const sourceHashes = byHash(sourceChecked);
  const sourceLiveIndex = livePartners(sourceChecked);
  const destinationLiveIndex = livePartners(destinationChecked);
  const usedDestinationIds = new Set<string>();
  const rows: AuditRow[] = sourceChecked.map((sourceFile) => {
    const exact = destinationHashes.get(sourceFile.hash ?? '') ?? [];
    const available = exact.filter((file) => !usedDestinationIds.has(file.id));
    if (available.length) {
      const allocated = available[0];
      usedDestinationIds.add(allocated.id);
      const matchingSourceCount = sourceHashes.get(sourceFile.hash ?? '')?.length ?? 1;
      const hasExtraCopies = exact.length > matchingSourceCount;
      // A sole original may legitimately point at every duplicate backup copy.
      // With repeated source bytes, reserve one destination for each source first.
      const canShowAllCopies = hasExtraCopies && matchingSourceCount === 1;
      if (canShowAllCopies) exact.forEach((file) => usedDestinationIds.add(file.id));
      return {
        id: `source:${sourceFile.id}`,
        status: canShowAllCopies ? 'duplicate' : 'verified',
        source: sourceFile,
        destinations: canShowAllCopies ? exact : [allocated],
        note: canShowAllCopies ? `${exact.length} matching backup copies` : 'SHA-256 match',
        livePair: sourceLivePairState(sourceFile, sourceLiveIndex, destinationHashes, true),
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
        livePair: sourceLivePairState(sourceFile, sourceLiveIndex, destinationHashes, false),
      };
    }
    return {
      id: `source:${sourceFile.id}`,
      status: 'missing',
      source: sourceFile,
      destinations: [],
      note: sourceLivePairState(sourceFile, sourceLiveIndex, destinationHashes, false) === 'unpaired' ? 'Missing file; Live Photo partner is not present' : 'No matching backup file',
      livePair: sourceLivePairState(sourceFile, sourceLiveIndex, destinationHashes, false),
    };
  });
  for (const file of source.filter((item) => item.supported === false || item.scanError)) {
    rows.push({
      id: `source:${file.id}`,
      status: 'skipped',
      source: file,
      destinations: [],
      note: file.scanError ?? file.unsupportedReason ?? 'This file was not checked.',
      livePair: 'not-live',
    });
  }
  for (const file of destinationChecked) {
    if (!usedDestinationIds.has(file.id)) {
      rows.push({
        id: `destination:${file.id}`,
        status: 'extra',
        destinations: [file],
        note: 'Only in the backup folder',
        livePair: localLivePairState(file, destinationLiveIndex),
      });
    }
  }
  for (const file of destination.filter((item) => item.supported === false || item.scanError)) {
    rows.push({
      id: `destination:${file.id}`,
      status: 'skipped',
      destinations: [file],
      note: file.scanError ?? file.unsupportedReason ?? 'This file was not checked.',
      livePair: 'not-live',
    });
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
    skipped: count('skipped'),
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
