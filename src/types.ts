export type AuditStatus = 'verified' | 'missing' | 'changed' | 'duplicate' | 'extra';

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  size: number;
  modified: number;
  type: string;
  hash?: string;
  file?: File;
}

export interface AuditRow {
  id: string;
  status: AuditStatus;
  source?: MediaFile;
  destinations: MediaFile[];
  note: string;
  livePair: 'complete' | 'unpaired' | 'not-live';
}

export interface AuditResult {
  id: string;
  createdAt: string;
  sourceLabel: string;
  destinationLabel: string;
  sourceCount: number;
  destinationCount: number;
  rows: AuditRow[];
  durationMs: number;
}

export interface ScanProgress {
  stage: 'source' | 'destination' | 'compare';
  current: number;
  total: number;
  fileName: string;
}
