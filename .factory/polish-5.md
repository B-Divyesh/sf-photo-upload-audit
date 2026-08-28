# Polish round 5 — Photo Upload Audit

Repair commits: `5481cf7` and `4bb4042`. Static deployment `7f5f7f01-750a-4919-a5ef-5d534d62c506` is live at <https://photo-upload-audit.sociobot.in>.

The final clean clone, `/tmp/photo-upload-audit-polish5-final.andf5G/repo` at `4bb4042`, ran `npm ci`, all 26 exact claim commands in `.factory/claims.json`, `npm test` (45 passing), and `npm run build:site`. The landing bundle is 13.31 kB gzip; CSS is 5.38 kB gzip.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo exit clears receipt, folders, filter, progress, notes, and handles before real folder selection. | `@claim:demo-to-real`; live one-click report: no sample rows after `/audit`. |
| F-1-2 | Directory identity uses `isSameEntry()` only for real handles, allowing different folders with the same name. | `@claim:same-folder-safe`; clean-clone claim run. |
| F-1-3 | Static route files and `404.html` remain configured for a real HTTP 404. | Live `https://photo-upload-audit.sociobot.in/does-not-exist-polish-5` → HTTP 404 with the archive heading. |
| F-1-4 | Version remains unified at `0.1.2`; the static cache generation advances to `r6`. | `scripts/assert-version.mjs`; `@claim:unsigned-installers`; live `/sw.js`. |
| F-1-5 | Routes remain pre-rendered with their own title, description, canonical, Open Graph, and Twitter tags. | Route metadata test; live `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms` check. |
| F-1-6 | Removing one saved receipt persists after reload. | `@claim:receipt-removal`. |
| F-1-7 | The receipt shows file name and count while content checks run. | `@claim:scan-progress`; phone progress test. |
| F-1-8 | Source stays first in copy, DOM order, and stacked phone layout. | `@claim:source-first`. |
| F-1-9 | Unsupported refund wording remains absent; billing questions have a support route. | Terms live check; link/accessibility suite. |
| F-1-10 | Release artifacts and a published checksum remain verified. | `@claim:release-integrity-files`. |
| F-1-11 | Landing explains content comparison without hash/proof jargon. | `.factory/copy-audit.md`; live home screenshot. |
| F-1-12 | Receipt heading identifies match and attention outcomes. | `.factory/copy-audit.md`; live home screenshot. |
| F-1-13 | Walkthrough heading names the folder-comparison task. | `.factory/copy-audit.md`; live home screenshot. |
| F-1-14 | Walkthrough now says to review, not resolve, files. | `.factory/copy-audit.md`; live home screenshot. |
| F-1-15 | Privacy heading and boundary copy are direct. | `.factory/copy-audit.md`; live home screenshot. |
| F-1-16 | Paid tier states the tested 25-receipt limit. | `@claim:receipt-limit`. |
| F-1-17 | License control names the result: “Enter license token.” | `.factory/copy-audit.md`; live home screenshot. |
| F-1-18 | README explains the SHA-256 fingerprint in plain context. | README review; `@claim:hash-compare`. |
| F-1-19 | README names Rust and links the operating-system Tauri prerequisites. | README link coverage in `npm test`. |
| F-1-20 | README explains direct routes and true 404s in plain language. | Live 404 check; route suite. |
| F-2-1 | Privacy warns that uninstalling can retain local app data. | Privacy route accessibility test; live `/privacy`. |
| F-2-2 | Progress heading says “Follow the file check.” | Plain-language test; live home screenshot. |
| F-3-1 | Phone interactions are at least 44 px; meaningful phone copy is at least 16 px. | Local exhaustive target/text tests; live 390 px sweep reports no small targets or overflow. |
| F-3-2 | Reset demo is declared and restores all eight sample rows. | `@claim:demo-reset`; live demo report. |
| F-4-1 | Replaced the Terms replacement assurance with user advice: keep a second backup and run a restore test. | Terms copy regression test; live `/terms` report. |
| F-4-2 | Published desktop format claim checks macOS, Windows, AppImage, Debian, and unsigned release wording. | `@claim:desktop-release-formats`. |
| F-5-1 | Scanner preserves every selected file, checks TIFF, shows unsupported entries as `skipped`, and suppresses all-clear when a source entry is skipped. | `@claim:all-files-reported`; live 390 px receipt: `.factory/evidence/polish-5-live/skipped-file-live-390.png`. |
| F-5-2 | Release metadata is memory-only and its request is aborted when leaving home, so demo never writes real browser storage. | Strengthened `@claim:demo-sandbox`; live delayed one-click check recorded `writes: []`, `localKeys: []`, `sessionKeys: []`. |
| F-5-3 | Hash claim now covers equal bytes with different names and deliberately different timestamps. | `@claim:hash-compare`. |
| F-5-4 | README and demo documentation consistently say “Live Photo pair” or “partner.” | Copy regression test; `.factory/copy-audit.md`. |
| F-5-5 | Buyer copy now says Sociobot/Dodo processes payment and gives the billing email. | Terms copy regression test; live `/terms`. |
| F-5-6 | Footer says “desktop app · files stay on your device.” | Copy regression test; live home screenshot. |

## Live recheck

- `verify-url.sh` passed for home, `?demo=1`, `/audit`, and `/terms`: route title, `lang`, one main, one h1, image alt coverage, labelled buttons, and zero console errors. Screenshots are under `.factory/evidence/polish-5-live/{home,demo,audit,terms}/`.
- Production one-click demo entered `/demo`, displayed the persistent banner and eight rows, reset from one Missing row to All/eight, made no local/session storage write during a delayed release lookup, and cleared the sample before `/audit`.
- Live `?demo=1` reloaded offline after service-worker readiness with its heading and all eight rows.
- Playwright axe checks on home, demo, audit, and Terms found zero serious or critical violations. The standalone axe CLI could not locate Chrome in this worker; Playwright axe used the preinstalled browser instead.
- Mobile Lighthouse: Performance 95, Accessibility 100, FCP 1.01 s, LCP 2.12 s, CLS 0. Evidence: `.factory/evidence/polish-5-live/lighthouse-mobile.json`.
