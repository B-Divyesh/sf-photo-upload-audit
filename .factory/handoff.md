# Photo Upload Audit — review 7 handoff

## Completed

- Performed the full adversarial review against the live site at 390 × 844 and 1440 × 900 without modifying product code.
- Read the brief, design, claims, demo contract, all six earlier reviews, all six polish reports, verification reports, and prior handoff.
- Wrote `.factory/review-7.md` with the cold read, complete landing/README copy audit, all claim results, cumulative history audit, structure/accessibility/link checks, missed-leverage assessment, and verdict.

## Verdict and open blockers

**FAIL.** Two historical findings are reopened:

- `F-1-2` (`F-7-1`): selecting the same directory through both fallback folder inputs produces a false all-clear.
- `F-1-4` (`F-7-2`): the live desktop download is release `v0.1.2` from commit `7edc625`, before later safety repairs, while the current/live web app uses the same version label.

No product source was changed.

## Verification

- Clean no-local clone: `/tmp/photo-upload-audit-review7.yYCGcY/repo` at `0d4eb54`.
- `npm ci`: passed with zero vulnerabilities.
- All 29 exact commands from `.factory/claims.json`: command exit status passed, one test per tag. Independent live behavior disproved the broad `same-folder-safe` claim through the untested fallback path.
- `npm test`: 51/51 passed.
- `npm run build:site`: passed; `dist/site/` produced 13.60 kB gzip initial JavaScript.
- Live/current `index.html`, JavaScript, and CSS SHA-256 hashes match the clean build.
- Live demo: eight rows, Reset restored all eight, no browser-storage writes, no IndexedDB, Start for real cleared the sample, and offline reload passed with only same-origin requests.
- Live route/link/metadata crawl: known routes 200, unknown route 404, no dead links, route-specific metadata, and Back focused the destination h1.
- Live Playwright axe: zero violations on six normal routes and 404 at 390 px. Worker URL verification passed home and demo without console errors.
- Desktop evidence: public `v0.1.2` release API targets `7edc625`; the downloaded Debian checksum matches published `SHA256SUMS`; the tag’s Tauri build embeds `dist/site` from that old source.

## How to reproduce

```sh
npm ci
npm test
npm run build:site
```

For `F-1-2`, open `/audit`, use both “Or choose a folder from your device” inputs to select the same directory, then choose **Compare every file**.

For `F-1-4`, compare `git diff v0.1.2..HEAD -- src tests public src-tauri`.

## Next steps

1. Enforce folder identity for every picker path and expand `@claim:same-folder-safe`.
2. Bump the version and publish installers from the accepted repaired commit with a testable build ID.
3. Re-run review 8 from a clean context, including packaged desktop flows.
