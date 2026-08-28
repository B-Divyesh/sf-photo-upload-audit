# Photo Upload Audit — polish 2 handoff

## Completed

Commit `c60229e` closes both remaining adversarial-review findings: it replaces the platform-false desktop uninstall assurance with careful, actionable privacy guidance and replaces “Watch each hash” with “Follow the file check.” It also adds two regression tests, updates the copy audit, and changes the catalog line to the verb-first, 58-character sentence: “Verify your photo backup before clearing space on your phone.”

All earlier review findings (F-1-1 through F-1-20) were rechecked rather than assumed fixed. Their current code, claim, and live evidence is mapped in `.factory/polish-2.md`.

## Verification

- Clean install: `npm ci` completed with 0 vulnerabilities.
- All 23 exact commands declared in `.factory/claims.json` were run as `npm test -- --grep @claim:<id>` and passed: `demo-sandbox`, `demo-to-real`, `local-only`, `hash-compare`, `live-photo`, `csv-export`, `no-account`, `read-only`, `offline-reload`, `license-private`, `archive-license`, `receipt-removal`, `classifications`, `no-analytics`, `desktop-downloads`, `release-integrity-files`, `unsigned-installers`, `receipt-limit`, `checkout-health`, `same-folder-safe`, `scan-progress`, `source-first`, and `one-to-one-match`.
- Full local browser/unit/integration suite: `npm test` passed **38/38** Playwright tests, including browser accessibility, offline reload, privacy-request interception, mobile 390 px, 200% text reflow, keyboard route focus, demo isolation, and release integrity.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run build:site` passed. `dist/site/` was generated. Production bundles: 36.34 kB JS (12.98 kB gzip) and 19.99 kB CSS (5.32 kB gzip).
- Mobile Lighthouse against the deployed landing page: **99 performance, 100 accessibility**; LCP 1.8 s, CLS 0. The JSON report is `.factory/lighthouse.json` (ignored build evidence).
- Cold production Playwright recheck passed at `https://photo-upload-audit.sociobot.in`: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` all returned 200 with one `main`, one `h1`, route title, and no normal-route console errors. `/?demo=1` showed the isolated banner and seed, then **Start for real** reached an empty `/audit`. `/does-not-exist` showed the designed page and returned HTTP 404. Live axe found no serious or critical issues.
- Live evidence screenshots: `test-results/polish-2-live-demo-390.png` and `test-results/polish-2-live-privacy-390.png`.

## Deployment

Built `dist/site/` was deployed to Azure Static Web Apps production resource `sf-photo-upload-audit` using the work-order identity. The public domain and Azure hostname both serve `assets/index-Z2gPAbMj.js`, the repaired production build.

## Run and deploy

Run `npm ci && npm test`. Build the landing site with `npm run build:site`; deploy `dist/site/` to the configured Static Web App. The desktop release workflow remains `.github/workflows/release.yml`.

## Known gaps

None.
