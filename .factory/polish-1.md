# Polish round 1 — Photo Upload Audit

Candidate repaired from `19d07cdba8dd0f520ca0465033854859875a4862` using every finding in `review-1.md`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | `Start for real` clears the receipt, folders, filters, notes, and handles before `/audit`; `?demo=1` enters the isolated demo. | `@claim:demo-to-real` |
| F-1-2 | Added native directory-handle selection and `isSameEntry`; input fallback never rejects matching names. | `@claim:same-folder-safe` |
| F-1-3 | Known routes are explicit static rewrites; unknown routes use styled `404.html` with HTTP 404 response override. | `pre-rendered routes publish route-specific metadata and a real 404 configuration` |
| F-1-4 | Footer and installer copy use package version; build asserts Tauri and service-worker versions match it. | `@claim:unsigned-installers`, `scripts/assert-version.mjs` |
| F-1-5 | Build pre-renders unique title, description, canonical, Open Graph, and Twitter tags for every route. | `pre-rendered routes publish route-specific metadata and a real 404 configuration` |
| F-1-6 | Added persisted receipt removal claim coverage. | `@claim:receipt-removal` |
| F-1-7 | Progress now updates filename, stage, and count during hashing; added delayed-stream coverage. | `@claim:scan-progress` |
| F-1-8 | Rewrote to “Source is always first” and tested desktop/mobile ordering. | `@claim:source-first` |
| F-1-9 | Removed unprovable refund assertion; terms give the billing support contact. | `npm test` copy and link crawl coverage |
| F-1-10 | Added published-release asset and checksum verification. | `@claim:release-integrity-files` |
| F-1-11 | Rewrote content-comparison sentence in plain words. | `.factory/copy-audit.md` |
| F-1-12 | Rewrote receipt heading. | `.factory/copy-audit.md` |
| F-1-13 | Rewrote walkthrough heading. | `.factory/copy-audit.md` |
| F-1-14 | Rewrote the exception step to reporting, not fixing. | `.factory/copy-audit.md` |
| F-1-15 | Rewrote privacy heading plainly. | `.factory/copy-audit.md` |
| F-1-16 | Rewrote paid heading to the actual 25-receipt limit. | `.factory/copy-audit.md` |
| F-1-17 | Rewrote license form action. | `.factory/copy-audit.md` |
| F-1-18 | Explained SHA-256 as a content fingerprint before naming it. | README review |
| F-1-19 | Linked actionable Tauri prerequisites. | README review |
| F-1-20 | Rewrote deployment explanation in plain language. | README review |

## Verification

- `npm ci`, then `npm test`: 36 passing tests, including all 23 exact `@claim:` tests, local browser routes, mobile/reflow, offline, privacy, and axe checks.
- `npm run build:site`: passes and creates `dist/site/` plus per-route static HTML.
- `@claim:release-integrity-files` validates the public release’s `SHA256SUMS` against its published `.deb`.
- Cold live verification after deployment: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` returned 200 with one h1; `?demo=1` showed the isolated banner and cleared before `/audit`; `/does-not-exist` returned 404 with the designed heading; normal routes had no console errors. Screenshot: `test-results/polish-1-live-demo-390.png`.
