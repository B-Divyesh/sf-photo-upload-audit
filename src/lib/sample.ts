import type { AuditResult, MediaFile } from '../types';
import { compareLibraries } from './audit';

const sample = (id: string, path: string, size: number, hash: string): MediaFile => ({
  id,
  name: path.split('/').pop() ?? path,
  path,
  relativePath: path,
  size,
  modified: Date.parse('2026-07-14T09:30:00Z'),
  type: path.endsWith('.MOV') ? 'video/quicktime' : 'image/heic',
  hash,
});

export async function makeSampleAudit(): Promise<AuditResult> {
  const source = [
    sample('s1', 'iPhone Export/2026/IMG_1842.HEIC', 2_841_112, 'a1'),
    sample('s2', 'iPhone Export/2026/IMG_1842.MOV', 4_102_882, 'a2'),
    sample('s3', 'iPhone Export/2026/IMG_1843.HEIC', 3_020_440, 'b1'),
    sample('s4', 'iPhone Export/2026/IMG_1844.HEIC', 2_922_105, 'c1'),
    sample('s5', 'iPhone Export/2026/IMG_1844.MOV', 4_881_102, 'c2'),
    sample('s6', 'iPhone Export/2026/IMG_1845.HEIC', 3_440_030, 'd1'),
    sample('s7', 'iPhone Export/2026/IMG_1845.MOV', 5_012_913, 'd2'),
  ];
  const destination = [
    sample('d1', 'Archive/2026/IMG_1842.HEIC', 2_841_112, 'a1'),
    sample('d2', 'Archive/2026/IMG_1842.MOV', 4_102_882, 'a2'),
    sample('d3', 'Archive/2026/IMG_1843.HEIC', 2_999_100, 'changed-b1'),
    sample('d4', 'Archive/2026/IMG_1845.HEIC', 3_440_030, 'd1'),
    sample('d5', 'Archive/copies/IMG_1845.HEIC', 3_440_030, 'd1'),
    sample('d6', 'Archive/2025/IMG_0971.HEIC', 2_400_001, 'old-extra'),
    sample('d7', 'Archive/2026/IMG_1845.MOV', 5_012_913, 'd2'),
    sample('d8', 'Archive/2026/IMG_1844.HEIC', 2_922_105, 'c1'),
  ];
  return compareLibraries(source, destination, { source: 'iPhone export · 14 Jul', destination: 'Family archive drive' });
}
