# Polish round 2 — Photo Upload Audit

Candidate `cdee1b0c0ce2535f6abccf938d0985b8dd6be314` was repaired against every finding in `review-1.md` and `review-2.md`. The code repair is commit `c60229e`.

Shared evidence: clean-install `npm test` passed 38 Playwright tests; every one of the 23 exact claim commands in `.factory/claims.json` passed; live screenshots are `test-results/polish-2-live-demo-390.png` and `test-results/polish-2-live-privacy-390.png`. Cold live recheck: `https://photo-upload-audit.sociobot.in/demo`, `/?demo=1`, `/audit`, `/privacy`, and `/does-not-exist` (404).

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Leaving demo clears sample receipt, folders, filters, notes, and handles before `/audit`. | `@claim:demo-to-real`; live `/?demo=1` → Start for real → `/audit`; demo screenshot. |
| F-1-2 | Uses `isSameEntry()` only for real directory-handle identity; same names are allowed. | `@claim:same-folder-safe`. |
| F-1-3 | Publishes explicit route files and a styled `/404.html` response override with status 404. | pre-render route test; live `/does-not-exist` returned 404. |
| F-1-4 | Uses one `0.1.2` build version for package, Tauri config, service worker, footer, and installer sentence. | `@claim:unsigned-installers`; `scripts/assert-version.mjs`. |
| F-1-5 | Pre-renders per-route title, description, canonical, Open Graph, and Twitter metadata. | pre-render route test; live route sweep. |
| F-1-6 | Persists selective receipt removal across reload. | `@claim:receipt-removal`. |
| F-1-7 | Shows current filename and an increasing count during hashing. | `@claim:scan-progress`. |
| F-1-8 | Says “Source is always first” and preserves that order on desktop and phone. | `@claim:source-first`. |
| F-1-9 | Removes the unprovable refund assertion; Terms link to billing support instead. | copy/link crawl in `npm test`; live `/terms`. |
| F-1-10 | Verifies `SHA256SUMS`, `latest.json`, and a published release asset checksum. | `@claim:release-integrity-files`. |
| F-1-11 | Rewrites the content comparison sentence in plain language. | `.factory/copy-audit.md`; live landing page. |
| F-1-12 | Replaces the abstract receipt heading with “See which files match or need attention.” | `.factory/copy-audit.md`; live landing page. |
| F-1-13 | Replaces the abstract walkthrough heading with “Compare two folders in three steps.” | `.factory/copy-audit.md`; live landing page. |
| F-1-14 | Changes “Resolve exceptions” to “Review files that need attention.” | `.factory/copy-audit.md`; live landing page. |
| F-1-15 | Replaces the privacy metaphor with “Your photo data stays on your device.” | `.factory/copy-audit.md`; live landing page. |
| F-1-16 | States the actual 25-receipt limit. | `@claim:receipt-limit`; live paid section. |
| F-1-17 | Names the action “Enter license token.” | `.factory/copy-audit.md`; live landing page. |
| F-1-18 | Explains the SHA-256 fingerprint in README before relying on the term. | README copy audit. |
| F-1-19 | Names and links the operating-system Tauri prerequisites. | README link check. |
| F-1-20 | Explains direct-route and true-404 behavior without SPA jargon. | README copy audit; live `/does-not-exist`. |
| F-2-1 | Removes the false uninstall-deletes-data assurance. Privacy now warns that uninstalling may retain local data and directs people to their OS app-data location. | `privacy explains that uninstalling can retain local desktop data`; live `/privacy`; privacy screenshot. |
| F-2-2 | Replaces “Watch each hash” with “Follow the file check.” | `landing uses a plain-language progress heading`; live landing page. |

No finding remains open.
