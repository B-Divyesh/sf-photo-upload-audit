# Polish round 7 — Photo Upload Audit

Released desktop source: `d8d5ac9dc4c84388611cf551fd42a4813b41764e` (`v0.1.4`). The safety repair is `8265b8ea5dcda186b176cea8cc09dcabad0387fd`; the follow-up release-provenance repair is `d8d5ac9dc4c84388611cf551fd42a4813b41764e`. Release workflow [33229721929](https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33229721929) passed on macOS arm64/x64, Windows, and Linux. Static deployment `f091a7a6-0b69-4e19-9917-a6fad4ce6f46` is live at <https://photo-upload-audit.sociobot.in>.

I read every `review-*.md` and `polish-*.md`. This map retains every historical ID and records the round-7 recheck, not just the two regressions in review 7. Live evidence is in `/tmp/photo-upload-audit-polish7-live/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Leaving demo clears sample folders, receipt, state, and handles before real folder selection. | `@claim:demo-to-real`; live one-click result in `demo-live-recheck.json`. |
| F-1-2 | Verified directory handles use `isSameEntry()` rather than a folder name. | `@claim:same-folder-safe`; clean-clone run. |
| F-1-3 | The designed not-found document is served with a real 404. | Live `/does-not-exist-polish-7` → 404; `_does-not-exist-polish-7-axe-390.png`. |
| F-1-4 | The site accepts downloads only when tag and source commit match; packages carry a readable provenance file. | `@claim:desktop-build-identity`; live `home-release-live-1366.png`. |
| F-1-5 | Every pre-rendered route has its own title, description, canonical, Open Graph, and Twitter metadata. | Full route/metadata test; `live-recheck.json`. |
| F-1-6 | Receipt removal persists after a reload. | `@claim:receipt-removal`. |
| F-1-7 | Progress shows the current file and count while checking. | `@claim:scan-progress`; mobile progress test. |
| F-1-8 | Source stays before backup at desktop and phone widths. | `@claim:source-first`. |
| F-1-9 | Unsupported refund assurance remains removed; Terms directs billing questions to support. | Terms copy regression; live `/terms`. |
| F-1-10 | Published checksums and the release manifest are verified against an installer. | `@claim:release-integrity-files`. |
| F-1-11 | Landing copy describes content comparison without the old hash/proof overclaim. | `.factory/copy-audit.md`; live home. |
| F-1-12 | The result heading names matching and attention outcomes. | Copy regression; live home. |
| F-1-13 | The walkthrough heading names the two-folder task. | `.factory/copy-audit.md`; live home. |
| F-1-14 | The walkthrough asks people to review, not resolve, exceptions. | Copy regression; live home. |
| F-1-15 | Privacy copy states the device boundary directly. | Copy audit; live `/privacy`. |
| F-1-16 | The paid receipt limit is explicitly 25 and enforced. | `@claim:receipt-limit`. |
| F-1-17 | The license action says what entering it does. | Copy audit; live home. |
| F-1-18 | README explains the file-content fingerprint and proves names/timestamps do not affect content matching. | `@claim:hash-compare`; README audit. |
| F-1-19 | README names Rust and links the operating-system Tauri prerequisites. | README link regression in the full suite. |
| F-1-20 | README describes direct links and real 404s in plain language. | Route suite; live 404 check. |
| F-2-1 | Privacy warns that uninstalling can retain desktop data and gives the OS app-data next step. | Privacy regression; live `/privacy`. |
| F-2-2 | Progress copy says “Follow the file check.” | Copy regression; `.factory/copy-audit.md`. |
| F-3-1 | Phone controls are at least 44 px, meaningful copy is at least 16 px, and 200% text does not overflow. | Full suite mobile geometry/reflow tests; `__demo_1-axe-390.png`. |
| F-3-2 | Reset demo is claimed, restores all eight rows, and returns to All. | `@claim:demo-reset`; `demo-reset-live-390.png`. |
| F-4-1 | Unsupported backup-replacement assurances are absent; Terms gives user advice instead. | Terms/public-copy regression; live `/terms`. |
| F-4-2 | Every promised unsigned desktop format is published and checked. | `@claim:desktop-release-formats`; `v0.1.4` release. |
| F-5-1 | All selected entries appear in the receipt; skipped source items block an all-clear. | `@claim:all-files-reported`. |
| F-5-2 | Release lookup is memory-only and is aborted when demo begins, so demo writes no real browser storage. | `@claim:demo-sandbox`; live `demo-live-recheck.json`. |
| F-5-3 | Equal bytes with different names and timestamps still match. | `@claim:hash-compare`. |
| F-5-4 | Public copy consistently uses “Live Photo pair.” | README/copy regression; `.factory/copy-audit.md`. |
| F-5-5 | Payment text says Sociobot/Dodo processes payment and gives a billing contact. | Terms/public-copy regression; live `/terms`. |
| F-5-6 | Footer uses the plain description “desktop app · files stay on your device.” | `home-release-live-1366.png`. |
| F-6-1 | Audit metadata says supported media is compared and unchecked files remain visible. | `@claim:audit-supported-media`; live `/audit`. |
| F-6-2 | Saved receipts are recursively checked to exclude media bytes, blobs, URLs, and files. | `@claim:receipt-metadata-only`. |
| F-6-3 | Privacy includes a confirmed in-app control that removes license, verdict, and receipts. | `@claim:browser-data-removal`; live `/privacy`. |
| F-6-4 | Same-folder and empty-folder errors give different corrective actions. | Folder-error regression in the full suite. |
| F-6-5 | Preview labels describe file contents, not hashes. | Public-copy regression; live home. |
| F-6-6 | The first-screen eyebrow names the camera-export comparison. | `.factory/copy-audit.md`; live home. |
| F-6-7 | Desktop section heading names the desktop app download. | Public-copy regression; live home. |
| F-6-8 | Purchase link visibly and accessibly identifies an external checkout. | Public-copy regression; live home. |
| F-7-1 | Fallback directory inputs no longer claim folder identity. Their result is labelled unverified, blocks all-clear/certification actions, and explains how to verify folders. | Expanded `@claim:same-folder-safe`; `fallback-identity-live-390.png`; live `/audit`. |
| F-7-2 | Version is `0.1.4`; Tauri bundles `build-provenance.json`, `latest.json` records the source commit, and the landing refuses a stale release. Documentation-only and shallow-clone builds keep the tagged build identity. | `@claim:desktop-build-identity`; live `home-release-live-1366.png`; <https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.4>. |

## Verification

- Clean remote clone: `/tmp/photo-upload-audit-polish7-clean-final.rX9OC2/repo` at `d8d5ac9dc4c84388611cf551fd42a4813b41764e`. `npm ci` passed with zero vulnerabilities. Every one of the 30 exact commands in `.factory/claims.json` passed separately. `npm test` then passed **53/53**, including Playwright axe, mobile, privacy, offline, routing, release, and package checks. `npm run build:site` passed.
- Final build output is `dist/site/`; initial JavaScript is 40.99 kB raw / **13.98 kB gzip**, CSS is 20.81 kB raw / **5.49 kB gzip**.
- Release API confirms `v0.1.4`, target/source commit `d8d5ac9dc4c84388611cf551fd42a4813b41764e`, every promised installer format, `SHA256SUMS`, and `latest.json`. The Debian claim extracts `build-provenance.json` and matches its `build_id` to that manifest source commit.
- Cold production `verify-url.sh` passed on `/`, `?demo=1`, `/demo`, `/audit`, `/privacy`, and `/terms`: title, `lang`, one h1, main, alt coverage, labelled buttons, and no console errors. Reports/screenshots are under `/tmp/photo-upload-audit-polish7-live/`.
- Cold live Playwright axe at 390 px found zero serious/critical violations and zero console/page errors on normal routes; the styled unknown route returned HTTP 404. See `live-recheck.json` and `*-axe-390.png`.
- Cold live sample check: home → Try it with sample data showed the banner and eight rows; Missing showed one row; Reset restored All/eight; Start for real opened an empty `/audit`. See `demo-live-recheck.json` and `demo-reset-live-390.png`.
- Cold live fallback check forced the browser directory-input path, selected the same directory twice, and showed the folder-identity warning without an all-clear. See `fallback-identity-live-390.png` and `live-recheck.json`.

No review finding or known product gap remains open.
