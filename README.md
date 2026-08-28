# Photo Upload Audit

Verify every original, video, and Live Photo sidecar before clearing your phone.

Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. It compares every supported media file by SHA-256 content, not timestamps. The receipt separates verified, missing, changed, duplicate, extra, and unpaired files.

The scanner is read-only. Media contents, names, hashes, and reports stay on your device. Core scanning and CSV export work without an account or license.

## Try the sample

Open [`/demo`](https://photo-upload-audit.sociobot.in/demo) to see a finished audit in one click. The sample stays in memory and never touches real folders. Reset it with **Reset demo**. The installed web app and sample audit work offline after the first visit.

## Run locally

Requirements: Node.js 20 or newer. Rust stable and the Tauri 2 system dependencies are also needed for desktop development.

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Use `/audit` for real folders or `/demo` for sample data.

## Test and build

```sh
npm test
npm run build:site
```

`npm test` builds the static site and runs the Chromium claim, route, mobile, and accessibility tests. The exact deployment command is `npm run build:site`. Its output is `dist/site/`, with `dist/site/index.html` at the deploy root.

Run one product claim with its ID:

```sh
npm test -- --grep @claim:csv-export
```

All public claims and their sandboxes are listed in [`.factory/claims.json`](.factory/claims.json). The demo contract is in [`.factory/demo.md`](.factory/demo.md).

## Desktop app

The desktop shell uses Tauri 2. Start it in development with:

```sh
npm run tauri dev
```

Tags matching `v*` run [the release workflow](.github/workflows/release.yml). It builds unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` files. It also attaches `SHA256SUMS` and `latest.json` to the GitHub release.

## Archive License

The optional Archive License costs $19 once. It saves up to 25 audit receipts on the device and adds printable certificates. Scanning and CSV export stay free. Checkout and license verification use the Sociobot billing API; photo data is never included in those requests.

## Deploy

Deploy `dist/site/` as a static site. `staticwebapp.config.json` supplies SPA fallback, caching, and security headers. Do not deploy or change DNS from this repository.

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Product scope: [`.factory/brief.json`](.factory/brief.json)
- Handoff and verification: [`.factory/handoff.md`](.factory/handoff.md)
- Privacy: `/privacy`
- Terms: `/terms`

Licensed under the [MIT License](LICENSE).
