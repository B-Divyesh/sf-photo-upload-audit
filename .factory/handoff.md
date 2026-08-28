# Photo Upload Audit — polish round 3 handoff

## Completed

Repaired and deployed every finding from reviews 1–3. The final runtime revision is `d79b8eb` and is live at <https://photo-upload-audit.sociobot.in>.

- Added the isolated `demo-reset` claim and its exact sample-reset test.
- Enforced 44 px phone targets and 16 px meaningful mobile copy, including live scan progress and mobile receipt labels.
- Kept demo data out of real mode across Start for real and browser Back/Forward. Real receipt storage remains untouched.
- Preserved route titles, metadata, focus behavior, legal pages, real 404 responses, local-first privacy, and the luminous glass archive visual system.
- Advanced the service-worker cache to `photo-upload-audit-v0.1.2-r4` so existing installed browsers receive this static repair.
- Updated the catalog description; it is verb-first and 62 characters: “Verify every photo backup before clearing space on your phone.”

The complete finding map is `.factory/polish-3.md`.

## Verification

- Final clean remote clone: `/tmp/photo-upload-audit-final.jNyDXR/repo` at `d79b8eb`.
  - `npm ci`: passed, zero reported vulnerabilities.
  - Every one of the 24 exact claim commands in `.factory/claims.json`: passed, one matching tagged test each.
  - `npm test`: **42 passed**. Evidence: `test-results/polish-3-final-clean.log`.
- Build: `npm run build:site` passed and produced `dist/site/`.
  - Initial JS: 36.37 kB raw / 12.99 kB gzip.
  - CSS: 20.13 kB raw / 5.35 kB gzip.
- Production deployment: Azure Static Web Apps deployment `937693bb-a948-45fc-abda-d73cf1548b7a` completed successfully.
  - Live HTML serves `assets/index-BRjBS_92.js`, matching the final build.
  - Live `/does-not-exist` returns HTTP 404 with the styled archive page.
  - Cold live report: `test-results/polish-3-live/report.json`.
  - Worker URL verifier passed for `/` and `/?demo=1`: `test-results/polish-3-live-verify-home/verify.json`, `test-results/polish-3-live-verify-demo/verify.json`.
  - Live Playwright axe sweep found zero serious or critical issues on `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms`.
  - Lighthouse mobile: Performance **100**, Accessibility **100**, LCP **1.8 s**, CLS **0** (`test-results/polish-3-lighthouse.json`).

## Known gaps and operator notes

No acceptance findings remain.

Desktop installers are intentionally unsigned and honestly disclosed for v0.1.2. If signing becomes required, the operator needs to provide `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` to the release workflow; no signing secrets are stored in this repository.
