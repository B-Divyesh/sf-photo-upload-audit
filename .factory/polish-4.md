# Polish round 4 — Photo Upload Audit

Final product commits: `43fb78c` and `3d4acb0`. Production deployment: Azure Static Web Apps deployment `52fb4fa2-7e40-4988-90bb-77869bb984ee` to <https://photo-upload-audit.sociobot.in>.

The clean final clone was `/tmp/photo-upload-audit-polish-4-final.0t0KLP/repo` at `3d4acb0`. It ran all 25 exact commands declared in `.factory/claims.json`, then `npm test` and `npm run build:site`. The full suite passed and `test-results/.last-run.json` reports `passed`.

Live evidence is in `.factory/evidence/polish-4-live/`: `recheck/report.json`, `recheck/home-390.png`, `recheck/demo-reset-live.png`, `recheck/does-not-exist-390.png`, plus the worker verifier screenshots in `home/`, `demo/`, and `audit/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo exit clears the sample receipt, folders, filters, notes, progress, and handles before real folder selection; history navigation repeats that boundary. | `@claim:demo-to-real`; live `recheck/demo-reset-live.png` and `recheck/report.json`. |
| F-1-2 | Folder comparison uses `isSameEntry()` only for actual directory handles, so distinct folders called `DCIM` are accepted. | `@claim:same-folder-safe`; clean-clone claim run. |
| F-1-3 | Explicit route files and `404.html` are deployed via the Static Web Apps 404 override. | Live `https://photo-upload-audit.sociobot.in/does-not-exist` returned HTTP 404; `recheck/does-not-exist-390.png`. |
| F-1-4 | Package, Tauri, footer, landing installer text, release tag, and service-worker generation remain on `0.1.2`; the static repair cache now advances to `r5`. | `@claim:unsigned-installers`; live `/sw.js` exposes `photo-upload-audit-v0.1.2-r5`. |
| F-1-5 | Pre-rendered route documents carry their own title, description, canonical, Open Graph, and Twitter tags. | `pre-rendered routes publish route-specific metadata and a real 404 configuration`; live `recheck/report.json`. |
| F-1-6 | Receipt deletion persists after reload. | `@claim:receipt-removal`. |
| F-1-7 | The audit shows a current file and a count while scanning. | `@claim:scan-progress`; `phone scan progress keeps its status and current filename at 16px`. |
| F-1-8 | Copy says source is first, and source remains first at desktop and 390 px. | `@claim:source-first`; live `recheck/audit-390.png`. |
| F-1-9 | The unprovable refund assertion remains removed; Terms directs billing questions to support. | Live `/terms` in `recheck/report.json`; route accessibility test. |
| F-1-10 | Published release integrity assets and a real checksum are checked. | `@claim:release-integrity-files`. |
| F-1-11 | Replaced the hash/proof wording with a plain content-comparison sentence. | `.factory/copy-audit.md`; live `recheck/home-390.png`. |
| F-1-12 | Replaced the abstract receipt heading with a result-specific heading. | `.factory/copy-audit.md`; live `recheck/home-390.png`. |
| F-1-13 | Replaced the abstract walkthrough heading with “Compare two folders in three steps.” | `.factory/copy-audit.md`; live `recheck/home-390.png`. |
| F-1-14 | Replaced the false “Resolve exceptions” action with a review action. | `.factory/copy-audit.md`; live `recheck/home-390.png`. |
| F-1-15 | Replaced the privacy metaphor with a direct device-data heading. | `.factory/copy-audit.md`; live `recheck/home-390.png`. |
| F-1-16 | Paid copy states the tested 25-receipt limit. | `@claim:receipt-limit`; live `/`. |
| F-1-17 | The license control names the result: “Enter license token.” | `.factory/copy-audit.md`; live `/`. |
| F-1-18 | README explains SHA-256 as a file-content fingerprint before using the algorithm name. | Clean-clone `npm test`; README copy audit in review history. |
| F-1-19 | README names Rust and links the operating-system-specific Tauri prerequisites. | README link check; clean-clone `npm test`. |
| F-1-20 | README explains direct links and true 404 responses in plain words. | Live unknown-path HTTP 404; `recheck/does-not-exist-desktop.png`. |
| F-2-1 | Privacy warns that uninstalling can retain local data and gives the operating-system app-data next step. | `privacy explains that uninstalling can retain local desktop data`; live `/privacy`. |
| F-2-2 | Replaced “Watch each hash” with “Follow the file check.” | `landing uses a plain-language progress heading`; live `recheck/home-390.png`. |
| F-3-1 | Phone controls have 44 px targets and meaningful explanatory copy is at least 16 px. | `every visible phone interaction has a 44px target`; `meaningful phone copy is at least 16px`; live `recheck/report.json`. |
| F-3-2 | Registered and tested Reset demo; it restores the All filter and all eight sample rows. | `@claim:demo-reset`; live `recheck/demo-reset-live.png`. |
| F-4-1 | Removed the unsupported face-recognition and backup-replacement assurances. The boundary now gives an honest backup-and-restore-test next step. | `.factory/copy-audit.md`; live `recheck/home-390.png` and `recheck/report.json`. |
| F-4-2 | Added the declared `desktop-release-formats` claim and a live-release test for macOS, Windows, AppImage, Debian, and the published unsigned notice. The README now points to that evidence. | `@claim:desktop-release-formats`; live release API section of `recheck/report.json`. |

## Final live check

- Cold live checks covered `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms`, and the not-found route: correct route metadata, one h1, one main landmark, image alt coverage, no serious/critical axe issues, and no small 390 px targets.
- `?demo=1` loaded eight realistic rows, retained its banner, reset from one Missing row back to All/eight rows, made no off-origin requests, and discarded the sample before `/audit` while preserving real receipt storage.
- The live demo reloaded offline after service-worker readiness. Browser Back restored home-heading focus.
- Worker URL verification passed for home, demo, and audit. The not-found document’s HTTP 404 produces Chrome’s expected network message for that document itself; no application JavaScript error occurred.
- Lighthouse mobile: Performance 100, Accessibility 100, FCP 922 ms, LCP 1222 ms, CLS 0 (`.factory/evidence/polish-4-live/lighthouse-retry.json`).

No review finding remains open.
