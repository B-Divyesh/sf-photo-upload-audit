export type AuditStatus = 'verified' | 'missing' | 'changed' | 'duplicate' | 'extra' | 'skipped';

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
  /** False when the selected file type cannot be content-checked by this release. */
  supported?: boolean;
  /** A plain-language explanation shown in the receipt when a file was skipped. */
  unsupportedReason?: string;
  /** Set when a supported file could not be read for hashing. */
  scanError?: string;
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
  /**
   * A finished receipt is only an all-clear when the product could establish
   * that the two selected directories are different directories.
   */
  folderIdentity: 'verified' | 'unverified' | 'demo';
}

export interface ScanProgress {
  stage: 'source' | 'destination' | 'compare';
  current: number;
  total: number;
  fileName: string;
}
