import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../dist/site/', import.meta.url);
const origin = 'https://photo-upload-audit.sociobot.in';
const routes = {
  '/': ['Photo Upload Audit — Verify every backup file', 'Compare a camera export with any backup folder. Find missing, changed, duplicate, and unpaired Live Photo files.'],
  '/demo': ['Demo — Photo Upload Audit', 'Try a complete photo backup audit with sample files.'],
  '/audit': ['Audit folders — Photo Upload Audit', 'Choose two local folders and compare every media file by SHA-256.'],
  '/history': ['Saved receipts — Photo Upload Audit', 'Review saved local photo backup audit receipts.'],
  '/privacy': ['Privacy — Photo Upload Audit', 'How Photo Upload Audit handles files and license data.'],
  '/terms': ['Terms — Photo Upload Audit', 'Terms for using Photo Upload Audit.'],
  '/404': ['Page not found — Photo Upload Audit', 'This page could not be found.'],
};
const html = await readFile(new URL('index.html', root), 'utf8');
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
for (const [route, [title, description]] of Object.entries(routes)) {
  const canonical = `${origin}${route === '/' ? '/' : route}`;
  const rendered = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${escape(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${escape(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${escape(description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${escape(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${escape(description)}$2`);
  if (route !== '/') await writeFile(new URL(`${route.slice(1)}.html`, root), rendered);
}
