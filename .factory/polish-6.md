# Polish round 6 — Photo Upload Audit

Repair commits: `51583e450e46caccc95acbba0cc2f3a0104d1125` and `959dc2878ae46b4fca1469f1973c2e858d4f40f9` (final). Static deployment `443835a3-dced-4f8e-8dbb-3bd2be03fdc3` is live at <https://photo-upload-audit.sociobot.in>.

I read every `review-*.md` and `polish-*.md` before repairing. The table records every cumulative finding, including findings already fixed in earlier rounds and rechecked in this round. Live screenshots and verifier reports are in `.factory/evidence/polish-6-live/` (ignored evidence output).

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo exit clears the seeded receipt, folders, filter, notes, progress, and handles before `/audit`. | `@claim:demo-to-real`; `demo-to-real-live-390.png`; live `?demo=1` → `/audit`. |
| F-1-2 | Folder identity uses `isSameEntry()` only for actual directory handles, allowing separate folders with the same name. | `@claim:same-folder-safe`; clean-clone claim run. |
| F-1-3 | Explicit route files and the Static Web Apps override serve the designed `404.html` with HTTP 404. | Live `/does-not-exist-polish-6` → 404; `404-live-390.png`. |
| F-1-4 | Package, Tauri, Cargo, footer, service-worker cache, and installer wording derive from version `0.1.2`. | `scripts/assert-version.mjs`; `@claim:unsigned-installers`. |
| F-1-5 | Route documents are pre-rendered with route-specific title, description, canonical, Open Graph, and Twitter metadata. Runtime metadata also updates for `?demo=1`. | Pre-render metadata test; live `?demo=1` verifier title is `Demo — Photo Upload Audit`. |
| F-1-6 | Receipt deletion persists after reload. | `@claim:receipt-removal`. |
| F-1-7 | Scan progress exposes current file and count while content checks run. | `@claim:scan-progress`; phone progress test. |
| F-1-8 | Copy and layout retain source before backup on desktop and phone. | `@claim:source-first`. |
| F-1-9 | Unsupported refund assertion is absent; Terms gives the billing support route. | Terms copy regression in `npm test`; live `/terms`. |
| F-1-10 | Published release checksums and manifest are verified against a published installer. | `@claim:release-integrity-files`. |
| F-1-11 | Landing explains file-content comparison without the prior hash/proof overclaim. | Copy audit; live home screenshot. |
| F-1-12 | Receipt heading now names match and attention outcomes. | Copy audit; live home screenshot. |
| F-1-13 | Walkthrough heading names the two-folder comparison task. | Copy audit; live home screenshot. |
| F-1-14 | Walkthrough says to review exceptions instead of claiming to resolve them. | Copy audit; live home screenshot. |
| F-1-15 | Privacy heading directly states the on-device boundary. | Copy audit; live home screenshot. |
| F-1-16 | Paid copy gives the actual 25-receipt limit. | `@claim:receipt-limit`. |
| F-1-17 | License action names its result. | Copy audit; live home screenshot. |
| F-1-18 | README explains SHA-256 as a file-content fingerprint before using it. | README audit; `@claim:hash-compare`. |
| F-1-19 | README names Rust and links OS-specific Tauri prerequisites. | README link coverage in `npm test`. |
| F-1-20 | README explains direct links and real 404 responses in plain language. | Live 404 check; route suite. |
| F-2-1 | Privacy warns that uninstalling can leave app data and names the OS app-data next step. | Privacy route test; live `/privacy`. |
| F-2-2 | Progress copy says “Follow the file check.” | Plain-language regression; live home screenshot. |
| F-3-1 | Every visible 390 px interaction has a 44 px target; meaningful phone copy is at least 16 px. | Exhaustive target/text and 200% reflow tests; verifier mobile screenshots. |
| F-3-2 | Reset demo is declared and restores the full sample receipt. | `@claim:demo-reset`; `demo-reset-live-390.png`. |
| F-4-1 | Removed unsupported backup-replacement assurances; users are directed to keep a second backup and test a restore. | Terms copy regression; live `/terms`. |
| F-4-2 | Published desktop formats and unsigned notice are declared and checked. | `@claim:desktop-release-formats`. |
| F-5-1 | Every selected file is retained; TIFF is checked, unsupported entries are shown as skipped, and skipped source entries block an all-clear. | `@claim:all-files-reported`. |
| F-5-2 | Release metadata is memory-only and the landing request is aborted on demo entry, so the demo does not write browser storage. | `@claim:demo-sandbox`; live demo recheck recorded `writes: []`. |
| F-5-3 | Hash matching covers equal bytes with both different names and timestamps. | `@claim:hash-compare`. |
| F-5-4 | README uses the consistent plain term “Live Photo pair.” | Copy audit and `npm test` copy regression. |
| F-5-5 | Payment copy says that Sociobot/Dodo processes payment and supplies billing email. | Terms copy regression; live `/terms`. |
| F-5-6 | Footer says “desktop app · files stay on your device.” | Copy audit; live footer screenshot. |
| F-6-1 | Audit metadata now says supported media is compared and unchecked files remain visible. | `@claim:audit-supported-media`; live `/audit` metadata check. |
| F-6-2 | Added an explicit receipt-metadata-only claim that recursively rejects stored media fields, blobs, bytes, data URLs, and object URLs. | `@claim:receipt-metadata-only`. |
| F-6-3 | Privacy now offers an in-app, two-step Clear saved data control that removes the license, verdict, and receipts. | `@claim:browser-data-removal`; `privacy-clear-confirm-live-390.png`. |
| F-6-4 | Same-folder and empty-folder errors give distinct recovery actions. | Folder-error regression; `@claim:same-folder-safe`. |
| F-6-5 | Preview labels say “File contents match” and “Same name, different contents.” | Landing copy regression; `home-copy-live-390.png`. |
| F-6-6 | First-screen eyebrow says “Compare a camera export with its backup.” | Copy audit; `home-copy-live-390.png`. |
| F-6-7 | Desktop section heading says “Download the desktop app.” | Landing copy regression; `home-copy-live-390.png`. |
| F-6-8 | Purchase action visibly and accessibly says “external checkout” and has `rel="external"`. | Landing copy regression; live home check. |

## Verification

- Fresh no-local clone at `/tmp/photo-upload-audit-polish6-final.zf8wzq/repo`, commit `959dc28`: `npm ci`, all 29 exact commands from `.factory/claims.json`, `npm test`, and `npm run build:site` passed. The log is `/tmp/photo-upload-audit-polish6-final-clean.log`; it records 29 one-test claim runs and **51 passed** in the full suite.
- The final static build produced `dist/site/`; initial JavaScript is 39.85 kB raw / 13.60 kB gzip and CSS is 20.63 kB raw / 5.45 kB gzip.
- `verify-url.sh` passed cold on `/`, `?demo=1`, `/audit`, `/privacy`, and `/terms`: correct title, `lang`, one main landmark, one h1, image alt coverage, labelled buttons, and zero console errors. Screenshot/report paths are under `.factory/evidence/polish-6-live/{home,demo,audit,privacy,terms}/`.
- Cold production recheck: demo showed its persistent banner and eight rows, reset from Missing to All/eight, made no local/session storage write, cleared before real folder selection, and reloaded offline after service-worker readiness. An unknown route returned HTTP 404 with the designed recovery page.
- Live Playwright axe checks at 390 px found zero serious or critical violations on `/`, `?demo=1`, `/audit`, `/privacy`, `/terms`, and the 404 route.
- Mobile Lighthouse: Performance **100**, Accessibility **100**, FCP **0.91 s**, LCP **1.77 s**, CLS **0**. Evidence: `.factory/evidence/polish-6-live/lighthouse-mobile.json`.

No review finding or known product gap remains open.
