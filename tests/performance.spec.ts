import { test, expect } from '@playwright/test';
import { compareLibraries } from '../src/lib/audit';
import type { MediaFile } from '../src/types';

test('100,000-file pre-hashed comparison stays linear', async () => {
  const makeFile = (side: string, index: number): MediaFile => ({
    id: `${side}-${index}`,
    name: `IMG_${index}.JPG`,
    path: `${side}/IMG_${index}.JPG`,
    relativePath: `${side}/IMG_${index}.JPG`,
    size: 1024,
    modified: 0,
    type: 'image/jpeg',
    hash: `hash-${index}`,
  });
  const source = Array.from({ length: 50_000 }, (_, index) => makeFile('Camera', index));
  const destination = Array.from({ length: 50_000 }, (_, index) => makeFile('Backup', index));
  const started = performance.now();
  const result = await compareLibraries(source, destination);
  const elapsed = performance.now() - started;
  expect(result.rows).toHaveLength(50_000);
  expect(elapsed).toBeLessThan(10_000);
});
