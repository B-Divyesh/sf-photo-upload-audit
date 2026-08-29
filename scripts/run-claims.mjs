import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const claims = JSON.parse(await readFile(new URL('../.factory/claims.json', import.meta.url), 'utf8'));
const outputDir = path.resolve(process.argv[2] || '.factory/evidence/polish-8-clean');
await mkdir(outputDir, { recursive: true });

const results = [];
for (const claim of claims) {
  const expected = `npm test -- --grep @claim:${claim.id}`;
  if (claim.test !== expected) throw new Error(`${claim.id} declares ${claim.test}; expected ${expected}`);
  const startedAt = new Date().toISOString();
  const started = Date.now();
  console.log(`\n=== ${claim.id}: ${claim.test} ===`);
  const run = spawnSync('npm', ['test', '--', '--grep', `@claim:${claim.id}`], { cwd: path.resolve('.'), encoding: 'utf8' });
  process.stdout.write(run.stdout || '');
  process.stderr.write(run.stderr || '');
  const result = { id: claim.id, test: claim.test, startedAt, durationMs: Date.now() - started, status: run.status };
  results.push(result);
  await writeFile(path.join(outputDir, 'claim-results.json'), `${JSON.stringify({ claims: results }, null, 2)}\n`);
  if (run.status !== 0) process.exit(run.status || 1);
}

console.log(`\n${results.length}/${claims.length} exact claim commands passed.`);
