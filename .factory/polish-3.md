# Polish round 3 — Photo Upload Audit

Runtime repair commits: `3ab8d67`, `13a3f69`, `91afc15`, `5e19c5b`, `81ec402`, and `d79b8eb`.

The final static deployment is live at <https://photo-upload-audit.sociobot.in>. The independent live sweep is saved in `test-results/polish-3-live/report.json`; its mobile screenshots are `test-results/polish-3-live/home-390.png`, `demo-reset-390.png`, and `404-390.png`. It verified all normal routes, route metadata, 44 px touch targets, no serious/critical axe violations, no normal-route console errors, direct demo isolation, reset, Start-for-real cleanup, browser Back/Forward cleanup, focus restoration, and a real HTTP 404.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo exit clears all sample state before `/audit`; Back/Forward now uses the same cleanup boundary. | `@claim:demo-to-real`; live `/?demo=1` flow in `test-results/polish-3-live/report.json`. |
| F-1-2 | Folder identity uses `isSameEntry()` only for actual handles, so separate folders with the same name are accepted. | `@claim:same-folder-safe`. |
| F-1-3 | Explicit route files and `404.html` are deployed through the SWA response override. | Live `/does-not-exist` returned HTTP 404; `404-390.png`. |
| F-1-4 | Package, Tauri, Cargo, footer, installer copy, and service-worker cache retain the `0.1.2` release identity; static cache generation is `r4` for this repair. | `scripts/assert-version.mjs`; `@claim:unsigned-installers`; live `sw.js`. |
| F-1-5 | Every route is pre-rendered with route-specific title, description, canonical, Open Graph, and Twitter metadata. | `pre-rendered routes publish route-specific metadata and a real 404 configuration`; live report route metadata. |
| F-1-6 | Saved receipt removal persists across reload. | `@claim:receipt-removal`. |
| F-1-7 | The audit exposes current filename and count while hashing. | `@claim:scan-progress`; `phone scan progress keeps its status and current filename at 16px`. |
| F-1-8 | Copy says “Source is always first,” and the source control remains first on desktop and phone. | `@claim:source-first`. |
| F-1-9 | Unprovable refund language is absent; Terms provides billing support instead. | `route /terms has one h1 and no serious accessibility violations`; live `/terms`. |
| F-1-10 | Release integrity files and a published checksum are verified. | `@claim:release-integrity-files`. |
| F-1-11 | Replaced the hash/proof claim with a plain file-content comparison sentence. | `.factory/copy-audit.md`; live `/`. |
| F-1-12 | Replaced the abstract receipt heading with a result-specific heading. | `.factory/copy-audit.md`; live `/`. |
| F-1-13 | Replaced the abstract walkthrough heading with “Compare two folders in three steps.” | `.factory/copy-audit.md`; live `/`. |
| F-1-14 | Replaced “Resolve exceptions” with the honest review action. | `.factory/copy-audit.md`; live `/`. |
| F-1-15 | Replaced the privacy metaphor with a plain device-data heading. | `.factory/copy-audit.md`; live `/`. |
| F-1-16 | Paid copy now states the actual 25-receipt limit. | `@claim:receipt-limit`; live `/`. |
| F-1-17 | License action now names the result: “Enter license token.” | `.factory/copy-audit.md`; live `/`. |
| F-1-18 | README explains SHA-256 as a file-content fingerprint before using it. | README copy audit; clean-clone `npm test`. |
| F-1-19 | README links the operating-system-specific Tauri prerequisites. | README link review; live external link check. |
| F-1-20 | README describes direct links and real 404 responses in plain language. | README copy audit; live `/does-not-exist` HTTP 404. |
| F-2-1 | Privacy explains that uninstalling may retain app data and gives the next step. | `privacy explains that uninstalling can retain local desktop data`; live `/privacy`. |
| F-2-2 | Replaced “Watch each hash” with “Follow the file check.” | `landing uses a plain-language progress heading`; live `/`. |
| F-3-1 | Phone controls have 44 × 44 px minimum targets; meaningful copy, including progress and mobile table labels, is 16 px or larger. | `every visible phone interaction has a 44px target`; `meaningful phone copy is at least 16px`; `phone scan progress keeps its status and current filename at 16px`; `home-390.png`. |
| F-3-2 | Added the `demo-reset` claim and exact reset regression test. | `@claim:demo-reset`; `demo-reset-390.png`; live `/?demo=1`. |

## Final verification

- Fresh remote clone at `d79b8eb`: `npm ci`, all 24 exact commands from `.factory/claims.json`, then `npm test` all passed. Evidence: `test-results/polish-3-final-clean.log` (`42 passed`).
- Production cold sweep: `test-results/polish-3-live/report.json` reports six normal routes with zero serious/critical axe violations, zero small targets, zero normal-route console errors, HTTP 404 for the unknown route, isolated demo traffic, restored focus, and `photo-upload-audit-v0.1.2-r4` cache.
- Worker verifier: `test-results/polish-3-live-verify-home/verify.json` and `test-results/polish-3-live-verify-demo/verify.json` report title, `lang`, one `main`, one h1, image alt coverage, and no console errors.
- Lighthouse mobile: `test-results/polish-3-lighthouse.json` reports Performance 100, Accessibility 100, LCP 1.8 s, and CLS 0.

No review finding remains open.
