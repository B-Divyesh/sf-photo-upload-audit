# Photo Upload Audit — review 6 handoff

## Completed

- Performed the adversarial first-read review against the live site at 390 × 844 and 1440 × 900.
- Audited all landing and README copy, entered and reset the one-click sample, checked storage isolation and offline reload, and reviewed every earlier review/polish finding.
- Ran every exact command in `.factory/claims.json` separately from a clean `--no-local` clone.
- Checked live routes, metadata, 404 status, links, browser history/focus, phone targets and overflow, request traffic, and accessibility.
- Wrote the complete result to `.factory/review-6.md`. Product code was not modified.

## Verification

- Clean clone: `/tmp/photo-upload-audit-review6.0twZWw/repo` at `17a66dda474fbb75e9697998e8d711a781def43e`.
- `npm ci`: passed with zero audit findings.
- All 26 exact claim commands: passed, one tagged test each.
- `npm test`: passed, 45/45.
- `npm run build:site`: passed and produced `dist/site/`; JavaScript is 37.71 kB raw / 13.31 kB gzip.
- Live Playwright axe sweep: zero violations on `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms`, and a designed 404 at 390 px.
- `/opt/fleet/lib/verify-url.sh`: passed on all six normal live routes with zero console errors.
- Live unknown route: HTTP 404. Crawled internal, release, installer, factory, and checkout destinations resolved.
- Live delayed one-click demo: no demo-time local/session storage write; Reset restored eight rows; Start for real removed sample data; direct `/demo` reloaded offline.

## Result and next steps

Verdict: **FAIL** with eight findings. No blocking finding was observed. The next repair should correct the inaccurate Audit metadata, register and test the two uncovered privacy claims, make error recovery instructions specific, replace the flagged landing jargon/metaphors, and label the external checkout. See `.factory/review-6.md` for exact quotes and fixes.
