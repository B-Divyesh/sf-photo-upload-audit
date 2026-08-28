import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
const tauri = JSON.parse(await readFile(new URL('../src-tauri/tauri.conf.json', import.meta.url)));
const cargo = await readFile(new URL('../src-tauri/Cargo.toml', import.meta.url), 'utf8');
const sw = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');

if (tauri.version !== packageJson.version || !cargo.includes(`version = "${packageJson.version}"`) || !sw.includes(`photo-upload-audit-v${packageJson.version}`)) {
  throw new Error('package.json, Tauri, Cargo, and the service-worker cache must use the same version');
}
