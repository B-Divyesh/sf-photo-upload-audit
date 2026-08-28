# Photo Upload Audit v0.1.0 — handoff

## What was built

- A local-first camera export versus backup scanner for images and videos.
- Streaming, one-file-at-a-time SHA-256 hashing with linear-time hash and filename indexes.
- A result receipt for verified, missing, changed, duplicate, extra, and unpaired Live Photo files.
- HEIC/HEIF/JPG plus MOV pairing. A standalone photo is not treated as a broken Live Photo.
- CSV receipt export. The scanner never writes to selected media.
- A one-click `/demo` sandbox with realistic sample gaps and no persistent demo state.
- A service worker and installable PWA shell. The demo reloads offline after its first visit.
- An optional $19 Archive License through the Sociobot billing contract. It adds local receipt history and printable certificates.
- License return capture, daily cached verification, offline optimistic restore, and manual token restore.
- Landing, audit, demo, privacy, terms, and styled 404 routes with History API navigation.
- A responsive 390 px layout, keyboard paths, route focus management, reduced motion, and print styling.
- An original generated verification landscape with source prompt and review record.
- A Tauri 2 shell plus a tag-driven GitHub Actions matrix for macOS arm64/x64, Windows, and Linux.
- Release finalization for `SHA256SUMS` and `latest.json`, plus checksum-verifying shell and PowerShell installers.

## Run and verify

```sh
npm install
npm test
npm run build:site
```

The deploy command is exactly `npm run build:site`. Output lands in `dist/site/`; `dist/site/index.html` is the static root.

Verification completed on 2026-08-28:

- `npm test`: **18 passed** in Chromium 1.58.2.
- All 10 entries in `.factory/claims.json` have exactly one matching `@claim:<id>` test.
- `verify-url.sh http://127.0.0.1:4173/`: 200 response, no console errors, title and `lang` present, one `h1`, one `main`, zero missing alt attributes, zero unnamed buttons.
- Axe integration: zero serious or critical findings on `/`, `/demo`, `/audit`, `/privacy`, `/terms`, and the 404 route.
- Mobile browser test: the complete demo works at 390×844 with no horizontal page overflow.
- Offline test: `/demo` reloads with the browser offline after service-worker installation.
- Production assets: JS **28.9 KB raw / 10.3 KB gzip**; CSS **18.5 KB raw / 5.1 KB gzip**; mobile hero **56.7 KB**.
- Lighthouse mobile: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**.
- Lighthouse details: LCP **1.7 s**, CLS **0**, total transfer **78 KB**, main-thread work **0.6 s**. The navigation-only run did not emit an INP value; interaction paths are covered by Playwright.
- `cargo check --manifest-path src-tauri/Cargo.toml` reached native dependency discovery. This worker lacks `glib-2.0`; the release workflow installs the required Linux WebKit/GTK packages before compiling.

## Product behavior notes

- Files match by SHA-256 even when names or filesystem timestamps differ.
- A same-name file with a different hash is `changed`.
- More than one destination file with the same hash is `duplicate`.
- A destination-only file is `extra`.
- Live Photo state is based on a known image/MOV pair in the source. Ordinary standalone HEIC and JPG files are not called unpaired.
- The browser and desktop UI hash one file at a time to cap memory use. The progress panel names the current file.

## Known gaps

- The 100,000-file pilot target was not available in this worker. The compare phase is O(n), but real scan time still depends on file size and disk speed.
- The local Linux worker cannot compile the Tauri shell because GTK/WebKit development packages are absent. CI installs them.
- Desktop installers remain unsigned until the operator supplies signing credentials. The landing page states this before download.
- A GitHub release is created only after the committed `v0.1.0` tag reaches GitHub and its workflow finishes. The page shows a calm browser fallback until assets exist.

## Needs operator action

1. Confirm the `v0.1.0` GitHub Actions release completes and that every `SHA256SUMS` entry matches.
2. Register `photo-upload-audit` with the Sociobot billing engine and set its return URL to `https://photo-upload-audit.sociobot.in/`.
3. Switch on signing when certificates are available. Reserve these secret names: `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
4. Run the 100,000-file pilot on representative SSD, external-drive, and network-share exports.

## Source references

- Scope: `.factory/brief.json`
- Visual system and art provenance: `.factory/design.md`
- Copy proof: `.factory/copy-audit.md`
- Claim contract: `.factory/claims.json`
- Demo contract: `.factory/demo.md`
