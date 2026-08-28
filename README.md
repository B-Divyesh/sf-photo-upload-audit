# Photo Upload Audit

Verify every original, video, and Live Photo sidecar before clearing your phone.

Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. The receipt separates verified, missing, changed, duplicate, extra, and unpaired files. When a browser provides folder identity, it refuses the same folder twice; it never guesses from a shared folder name. Each backup file is assigned to only one source original.

The scanner is read-only. Media contents, names, hashes, and reports stay on your device. Core scanning and CSV export work without an account or license.

## Try the sample

Open [`/demo`](https://photo-upload-audit.sociobot.in/demo) or [`?demo=1`](https://photo-upload-audit.sociobot.in/?demo=1) to see a finished audit in one click. The sample stays in memory and never touches real folders. **Start for real** clears it before opening folder selection. Reset it with **Reset demo**. The installed web app and sample audit work offline after the first visit.

## Run locally

Requirements: Node.js 20 or newer. Desktop development also needs Rust stable and the [Tauri prerequisites for your operating system](https://v2.tauri.app/start/prerequisites/).

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

Tags matching `v*` run [the release workflow](.github/workflows/release.yml). Published releases include unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` installers. They also attach `SHA256SUMS` and `latest.json`; the release claims check the published formats, notice, and one checksum.

## Archive License

The optional Archive License costs $19 once. It saves up to 25 audit receipts on the device and adds printable certificates. Use `/history` to review or remove saved receipts. Scanning and CSV export stay free. Checkout and license verification use the Sociobot billing API; photo data is never included in those requests.

## Deploy

Deploy `dist/site/` as a static site. `staticwebapp.config.json` keeps direct route links working, serves unknown paths as real 404 responses, and sets cache and security headers. Do not deploy or change DNS from this repository.

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Product scope: [`.factory/brief.json`](.factory/brief.json)
- Handoff and verification: [`.factory/handoff.md`](.factory/handoff.md)
- Privacy: `/privacy`
- Terms: `/terms`

Licensed under the [MIT License](LICENSE).
