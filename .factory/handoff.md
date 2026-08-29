# Photo Upload Audit — round 8 handoff

## Outcome

Round 8 passes with no unresolved finding. Every finding in reviews 1–8 is mapped in `.factory/polish-8.md` to its repair, test, screenshot, and live check.

- Live site: <https://photo-upload-audit.sociobot.in>
- Repair commit and desktop release source: `1c7b93b4592431be3243bfa66d43af404aac5213`
- Verification tooling commit: `9a5f15d994813b7023d52596f67b0c627e7fad01`
- Desktop release: [v0.1.5](https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.5)
- Release workflow: [33232637005](https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33232637005), all macOS arm64/x64, Windows, Linux, and manifest jobs passed
- Static deployment: `61291f8b-f19b-4276-8fd5-b602810b2573`

## Changes

- Replaced the two remaining generic landing labels with “Folder comparison walkthrough” and “Privacy and backup limits.”
- Added exact regressions for those labels, direct `?demo=1`, first-screen phone and desktop content, all route metadata/legal links/axe checks, and the claim manifest's one-test-per-claim contract.
- Updated the unsigned-installer claim and every product/build identifier to v0.1.5.
- Published v0.1.5 installers for macOS arm64/x64, Windows, and Linux, plus `latest.json` and `SHA256SUMS`.
- Added `scripts/run-claims.mjs` to execute every claim command exactly as declared and `scripts/live-recheck.mjs` for cold production checks.
- Updated `.factory/catalog-description.txt` to the 68-character verb-first line: “Compare a camera export with its backup before clearing phone space.”
- Updated the copy audit and cumulative polish evidence without changing the product's luminous archive/checksum visual system.

## Verification evidence

Fresh remote clone: `/tmp/photo-upload-audit-polish8-clean.3Rvh9z/repo` at `9a5f15d994813b7023d52596f67b0c627e7fad01`.

```sh
npm ci
node scripts/run-claims.mjs
npm test
npm run build:site
```

- `npm ci`: passed, zero vulnerabilities.
- Claim runner: **30/30 passed**, each exact `.factory/claims.json` command executed separately. Results: `.factory/evidence/polish-8-clean/claim-results.json`.
- Full Playwright/unit/integration suite: **57/57 passed**. It covers demo isolation/reset/exit, content comparison, every file classification, CSV, receipts, privacy, offline reload, accessibility, keyboard/focus, 200% reflow, mobile controls, routing, metadata, 404 behavior, release integrity, build provenance, and the 100,000-file performance fixture.
- Build: `dist/site/`; initial JS 41.02 kB raw / **13.99 kB gzip**; CSS 20.81 kB raw / **5.49 kB gzip**.
- Work-order build command `npm ci && npm test && npm run build:site`: passed in `/work/repo`.
- Release integrity: downloaded `Photo.Upload.Audit_0.1.5_amd64.AppImage` (77 MB) from the live GitHub release; its SHA-256 matched `5ed4d33a120d34130a305818ae1d2d415367b033f107a58113ea5ab3ab57d2c0` in `SHA256SUMS`.
- Cold live browser recheck: seven real routes returned 200 with correct titles, landmarks, legal links, phone geometry, zero console/page errors, and zero serious/critical axe findings. The designed unknown route returned HTTP 404. Report: `.factory/evidence/polish-8-live/live-recheck.json`.
- Worker `verify-url.sh`: passed `/`, `/?demo=1`, `/audit`, `/history`, `/privacy`, and `/terms`; reports and screenshots are under `.factory/evidence/polish-8-live/verify-*`.
- Live demo: direct query entry showed the banner and eight rows; Missing showed one; Reset restored eight; Start for real opened an empty audit. It made zero storage writes and no off-origin requests. Offline reload restored all eight rows.
- Mobile Lighthouse: **100 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP 0.9 s, LCP 1.9 s, TBT 50 ms, CLS 0. Report: `.factory/evidence/polish-8-live/lighthouse-mobile.json`.
- Screenshots: `.factory/evidence/polish-8-live/home-390.png`, `demo-reset-390.png`, `demo-to-real-390.png`, `audit-390.png`, `history-390.png`, `privacy-390.png`, `terms-390.png`, and `not-found-390.png`.

## Run and verify

```sh
npm ci
npm test
npm run build:site
npm run dev
```

Use `http://localhost:5173/?demo=1` for the isolated sample. Run `node scripts/run-claims.mjs` to execute the claim manifest. Run `node scripts/live-recheck.mjs https://photo-upload-audit.sociobot.in .factory/evidence/polish-8-live` for the production audit.

## Known gaps

None.

## Needs operator action

None for this release. Installers are intentionally unsigned and the site says so. Future signing would require the repository secrets `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` (plus their associated passwords); signing is not represented as complete.
