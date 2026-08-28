# Photo Upload Audit — polish round 5 handoff

## Delivered

- Repaired every finding from `review-1.md` through `review-5.md`; the complete ID-by-ID record is in `.factory/polish-5.md`.
- The scanner now preserves every selected entry. It hashes TIFF and other common camera formats, shows uncheckable files as `skipped` with a reason, and never presents an all-clear when a source file was skipped.
- Demo metadata is memory-only. A pending landing release lookup is aborted on navigation, so the one-click demo path writes neither `localStorage` nor `sessionStorage` while its isolation banner is visible.
- Rewrote the remaining headline, README, Terms, payment, and footer wording in plain, consistent language. Route metadata now uses the same honest first-screen wording.
- Deployed static build `7f5f7f01-750a-4919-a5ef-5d534d62c506` to <https://photo-upload-audit.sociobot.in>.

## Commits and push

- `5481cf7` — scanner, demo-isolation, metadata, copy, claims, and test repair.
- `4bb4042` — retry the public hosted-checkout health check on a short cold start.
- Both were pushed to `origin/main` before deployment.

## Verification

Final clean clone: `/tmp/photo-upload-audit-polish5-final.andf5G/repo` at `4bb4042`.

1. `npm ci` completed with zero reported vulnerabilities.
2. Every one of the 26 exact commands in `.factory/claims.json` was run individually and passed.
3. `npm test` passed all 45 unit, claim, browser, mobile, accessibility, privacy, offline, route, and performance tests.
4. `npm run build:site` passed and generated `dist/site/`. First-load JS is 37.71 kB raw / 13.31 kB gzip; CSS is 20.27 kB raw / 5.38 kB gzip.
5. Production cold checks passed for `/`, `?demo=1`, `/audit`, and `/terms` with `verify-url.sh`: expected title, `lang`, one h1, one main, alt coverage, labelled buttons, and no console errors.
6. The production demo delayed-release race recorded no storage writes; Reset returned eight rows; Start for real reached empty folder selection; a production mixed JPG/TIFF/PSD audit showed one skipped PSD and no all-clear. Screenshot: `.factory/evidence/polish-5-live/skipped-file-live-390.png`.
7. Production `/does-not-exist-polish-5` returned HTTP 404 with “This page is missing from the archive.” All normal routes had correct title/canonical/h1/main values.
8. Production axe via Playwright found no serious or critical violation on home, demo, audit, or Terms. A direct axe CLI attempt could not locate Chrome in this worker; Playwright axe ran against the supplied browser.
9. Live 390 px target/reflow sweep found no target under 44 px and no horizontal overflow. Lighthouse mobile recorded Performance 95, Accessibility 100, FCP 1.01 s, LCP 2.12 s, and CLS 0 (`.factory/evidence/polish-5-live/lighthouse-mobile.json`).

## Run and deploy

```sh
npm ci
npm test
npm run build:site
```

Deploy `dist/site/` as the static site root. The desktop release workflow remains `.github/workflows/release.yml`; it builds unsigned macOS, Windows, and Linux installers when a `v*` tag is pushed.

## Known gaps / next steps

No unresolved product, review, or deployment finding remains. Desktop installers are intentionally unsigned, as stated and tested. The static site has no runtime analytics or photo-upload service.
