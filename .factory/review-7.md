# Adversarial first-read review 7 — Photo Upload Audit

Reviewed 29 August 2026 against <https://photo-upload-audit.sociobot.in>, repository commit `0d4eb54e8e70c3e3b0c311e8d3adf259dc5cd863`, and public desktop release `v0.1.2`.

## Verdict

**FAIL.** The cold first screen, demo, copy, route structure, links, accessibility checks, and all 29 declared test commands pass. Two earlier safety findings are nevertheless reopened and blocking:

1. The live fallback folder inputs accept the same folder twice and issue “Every source file is accounted for.”
2. The desktop download presented as `v0.1.2` was built from an old commit and omits later safety repairs, including skipped-file reporting.

Historical IDs are retained below as required for regressed findings. `F-7-1` and `F-7-2` are the round-7 indexes for those reopened IDs.

## Findings

### Blocking

#### F-1-2 (F-7-1) — Reopened: the fallback pickers let one folder verify against itself

- **Exact quote/location:** `/audit` exposes “Or choose a folder from your device” beneath both the camera-export and backup controls. `.factory/claims.json` says, “The app rejects the same folder and accepts different folders with the same name.”
- **Observed live:** I assigned `tests/fixtures/same-root` to both visible file inputs. Both controls reported “1 selected files: 1 ready.” **Compare every file** stayed enabled. The result had no alert and said “Every source file is accounted for,” with `Source: same-root`, `Backup: same-root`, `Verified 1`, and `Missing 0`.
- **Code cause:** Each file-input change deletes `directoryHandles[kind]`. `runScan()` compares identity only when both `directoryHandles.source` and `.destination` exist. The passing `@claim:same-folder-safe` test covers injected `showDirectoryPicker()` handles but never the two fallback inputs exposed in the live UI.
- **Why this blocks:** This is the original false-proof failure through a second first-party picker path. A user can verify originals against themselves and clear the phone based on a false all-clear. The declared claim is false for a supported visible workflow even though its narrow test passes.
- **Concrete fix:** Do not allow an all-clear when folder identity is unknown. On supporting browsers, remove or disable the fallback path and require handles checked with `isSameEntry()`. In Tauri and other fallback environments, use a native directory API that returns canonical paths or report “Folder identity could not be verified” and withhold the all-clear. Extend `@claim:same-folder-safe` to select the same directory through every rendered picker path, plus two distinct same-named directories.

#### F-1-4 (F-7-2) — Reopened: the current-looking desktop download contains the pre-repair app

- **Exact quote/location:** Landing: “Desktop installers for v0.1.2 are unsigned,” followed by the live `Photo.Upload.Audit_0.1.2_amd64.AppImage · v0.1.2` download. Footer: “v0.1.2 · desktop app · files stay on your device.”
- **Observed:** GitHub’s release API says public release `v0.1.2` targets commit `7edc625c220bedd55141ab8ca08d9cc5900268b2`. The reviewed source is `0d4eb54`, and the latest product repair is `959dc28`. The Tauri config at the tag builds `../dist/site`, so the installer embeds the tagged web app. The published Debian package checksum matches `SHA256SUMS`, confirming the artifact checked is the advertised release.
- **Safety difference:** At `v0.1.2`, `toMediaFiles()` filters unsupported entries out before comparison and the receipt declares an all-clear when missing plus changed equals zero. The current skipped-file repair was added later. The tag also still contains “Removing the desktop app removes its local data,” “Watch each hash,” the demo release-cache storage write, and the pre-round-6 error/copy behavior. `git diff v0.1.2..HEAD -- src tests public src-tauri` reports 519 insertions and 101 deletions.
- **Why this blocks:** The product contract identifies this as a desktop app, and the live primary download gives users an older build under the same version shown by the reviewed web app. The downloadable app still contains the data-loss-risk defect from F-5-1. Version agreement in text does not establish build identity.
- **Concrete fix:** Increment the version, tag the accepted repair commit, rebuild every installer from that tag, and make the new release latest. Put the source commit in `latest.json` and the app/footer. Add a claim test that extracts a published package or inspects its embedded manifest and asserts the accepted commit/build ID, then rerun the skipped-file and same-folder flows against the packaged desktop app.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** Checks a camera export against its backup before the owner clears phone space.
- **For whom:** Phone owners checking originals, videos, and Live Photo pairs.
- **First click:** **Try it with sample data**. “See a finished audit in one click.” is visible at 609–634 px.
- **Result:** PASS. The headline, audience, action, stated outcome, and three facts all fit in the first viewport.

### 1440 × 900 desktop, before scrolling

- **What it does:** Compares phone media with a backup and identifies gaps.
- **For whom:** Phone owners preparing to clear space.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same decision information is visible before scrolling.

Exact first-screen copy:

> “Compare a camera export with its backup”  
> “Check every photo before clearing space”  
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”  
> “Try it with sample data”  
> “See a finished audit in one click.”

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The home action opened `/demo` directly. |
| Product already in use | PASS | The first demo screen showed eight rows: four verified, one missing, one changed, one duplicate, and one extra. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remained visible. |
| Reset | PASS | Missing showed one row; Reset restored `All 8` and eight rows. |
| Storage isolation | PASS | With a real sentinel key present, the flow wrote no local/session storage and opened no IndexedDB database. |
| Real-data boundary | PASS | Start for real removed all sample rows, showed two empty pickers, and preserved the sentinel. |
| Request privacy | PASS | The direct demo and offline reload requested only same-origin HTML, JavaScript, and CSS. A live real-file scan made zero requests after folder selection. |
| Offline | PASS | After service-worker readiness, offline `/demo` reload restored the heading, banner, and all eight rows. |

The cold landing additionally requested the disclosed GitHub Releases API for installer discovery. It loaded no analytics, advertising, remote font, or third-party script.

## Claims

A no-local clone was created at `/tmp/photo-upload-audit-review7.yYCGcY/repo`. After `npm ci`, every exact `test` command in `.factory/claims.json` was run separately. Every command selected one tagged test and exited successfully.

| Claim | Exact command | Result |
|---|---|---|
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `demo-to-real` | `npm test -- --grep @claim:demo-to-real` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `hash-compare` | `npm test -- --grep @claim:hash-compare` | PASS |
| `all-files-reported` | `npm test -- --grep @claim:all-files-reported` | PASS |
| `audit-supported-media` | `npm test -- --grep @claim:audit-supported-media` | PASS |
| `live-photo` | `npm test -- --grep @claim:live-photo` | PASS |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS |
| `read-only` | `npm test -- --grep @claim:read-only` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `license-private` | `npm test -- --grep @claim:license-private` | PASS |
| `archive-license` | `npm test -- --grep @claim:archive-license` | PASS |
| `receipt-metadata-only` | `npm test -- --grep @claim:receipt-metadata-only` | PASS |
| `browser-data-removal` | `npm test -- --grep @claim:browser-data-removal` | PASS |
| `receipt-removal` | `npm test -- --grep @claim:receipt-removal` | PASS |
| `classifications` | `npm test -- --grep @claim:classifications` | PASS |
| `no-analytics` | `npm test -- --grep @claim:no-analytics` | PASS |
| `desktop-downloads` | `npm test -- --grep @claim:desktop-downloads` | PASS |
| `desktop-release-formats` | `npm test -- --grep @claim:desktop-release-formats` | PASS |
| `release-integrity-files` | `npm test -- --grep @claim:release-integrity-files` | PASS |
| `unsigned-installers` | `npm test -- --grep @claim:unsigned-installers` | PASS |
| `receipt-limit` | `npm test -- --grep @claim:receipt-limit` | PASS |
| `checkout-health` | `npm test -- --grep @claim:checkout-health` | PASS |
| `same-folder-safe` | `npm test -- --grep @claim:same-folder-safe` | **TEST PASS; CLAIM FAILS LIVE** — F-1-2 |
| `scan-progress` | `npm test -- --grep @claim:scan-progress` | PASS |
| `source-first` | `npm test -- --grep @claim:source-first` | PASS |
| `one-to-one-match` | `npm test -- --grep @claim:one-to-one-match` | PASS |

The full clean-clone suite passed **51/51** and `npm run build:site` produced `dist/site/` with 13.60 kB gzip initial JavaScript. The current local build and live deployment have identical SHA-256 hashes for `index.html`, JavaScript, and CSS. No claim-like sentence is absent from the manifest, but F-1-2 proves that a listed claim has incomplete coverage and is false in a visible live path. F-1-4 proves that release-format and checksum tests do not establish that the desktop package contains the reviewed build.

## Copy audit — landing page

Counts treat hyphenated terms, numbers, names, and URLs as one word. Headings, actions, and standalone fragments are included; repeated navigation, table headers, and raw filenames are not sentences. No item exceeds 22 words, uses a banned marketing adjective, changes the established terminology, or uses a non-result-naming button. The desktop sentence is linked to F-1-4 because the offered build is stale.

| Landing text | Words | Flag |
|---|---:|---|
| Compare a camera export with its backup | 7 | — |
| Check every photo before clearing space | 6 | — |
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | — |
| Try it with sample data | 5 | — |
| See a finished audit in one click. | 7 | — |
| Files stay on this device | 5 | — |
| Works without an account | 4 | — |
| Core audit and CSV are free | 6 | — |
| See which files match or need attention | 8 | — |
| The app compares each file’s contents, even when its name changed. | 11 | — |
| Audit your folders | 3 | — |
| File contents match | 3 | — |
| No backup file | 3 | — |
| Same name, different contents | 5 | — |
| 2 matching copies | 3 | — |
| Compare without changing either folder | 5 | — |
| Choose the export | 3 | — |
| Select the folder copied from your phone. | 7 | — |
| Choose the backup | 3 | — |
| Select the disk or server folder that should contain it. | 10 | — |
| Read the receipt | 3 | — |
| Review missing, changed, duplicate, extra, and unpaired files. | 8 | — |
| Compare two folders in three steps | 6 | — |
| Pick both folders | 3 | — |
| Source is always first. | 4 | — |
| Follow the file check | 4 | — |
| The current file and count stay visible. | 7 | — |
| Review files that need attention | 5 | — |
| Each row says what happened. | 5 | — |
| Download the desktop app | 4 | — |
| Desktop installers for v0.1.2 are unsigned. | 6 | F-1-4: offered release predates later repairs |
| Checking desktop releases… | 3 | — |
| View all releases | 3 | — |
| Your photo data stays on your device | 7 | — |
| The app reads the folders you choose. | 7 | — |
| It never moves, edits, or deletes media. | 7 | — |
| No photo index or filename is sent to us. | 9 | — |
| License checks send only the license token. | 7 | — |
| It checks two folders. | 4 | — |
| Keep your existing backup and complete a restore test. | 9 | — |
| Keep up to 25 audit receipts | 6 | — |
| $19 one-time. | 2 | — |
| Save up to 25 local audit receipts and print verification certificates. | 11 | — |
| Scanning and CSV export stay free. | 6 | — |
| Buy Archive License (external checkout) | 5 | — |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| Sociobot/Dodo processes your payment. | 4 | — |
| Email support@sociobot.in with billing questions. | 5 | — |
| Check your backup before clearing your phone. | 7 | — |
| v0.1.2 · desktop app · files stay on your device | 8 | F-1-4: same version labels different builds |

## Copy audit — README

| README text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo pair before clearing your phone. | 12 | — |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | — |
| The receipt separates verified, missing, changed, skipped, duplicate, extra, and unpaired files. | 12 | — |
| It lists any selected file this version cannot check. | 9 | — |
| When a browser provides folder identity, it refuses the same folder twice; it never guesses from a shared folder name. | 20 | F-1-2: the visible fallback bypasses identity |
| Each backup file is assigned to only one source original. | 10 | — |
| The scanner is read-only. | 4 | — |
| Media contents, names, hashes, and reports stay on your device. | 10 | — |
| Core scanning and CSV export work without an account or license. | 11 | — |
| Try the sample | 3 | — |
| Open `/demo` or `?demo=1` to see a finished audit in one click. | 12 | — |
| The sample stays in memory and never touches real folders. | 10 | — |
| Start for real clears it before opening folder selection. | 9 | — |
| Reset it with Reset demo. | 5 | — |
| The installed web app and sample audit work offline after the first visit. | 13 | — |
| Run locally | 2 | — |
| Requirements: Node.js 20 or newer. | 5 | — |
| Desktop development also needs Rust stable and the Tauri prerequisites for your operating system. | 14 | — |
| Open `http://localhost:5173`. | 2 | — |
| Use `/audit` for real folders or `/demo` for sample data. | 10 | — |
| Test and build | 3 | — |
| `npm test` builds the static site and runs the Chromium claim, route, mobile, and accessibility tests. | 16 | — |
| The exact deployment command is `npm run build:site`. | 8 | — |
| Its output is `dist/site/`, with `dist/site/index.html` at the deploy root. | 10 | — |
| Run one product claim with its ID: | 7 | — |
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | — |
| The demo contract is in `.factory/demo.md`. | 6 | — |
| Desktop app | 2 | — |
| The desktop shell uses Tauri 2. | 6 | — |
| Start it in development with: | 5 | — |
| Tags matching `v*` run the release workflow. | 7 | — |
| Published releases include unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` installers. | 12 | — |
| They also attach `SHA256SUMS` and `latest.json`; the release claims check the published formats, notice, and one checksum. | 17 | — |
| Archive License | 2 | — |
| The optional Archive License costs $19 once. | 7 | — |
| It saves up to 25 audit receipts on the device and adds printable certificates. | 14 | — |
| Use `/history` to review or remove saved receipts. | 8 | — |
| Scanning and CSV export stay free. | 6 | — |
| Checkout and license verification use the Sociobot billing API; photo data is never included in those requests. | 17 | — |
| Deploy | 1 | — |
| Deploy `dist/site/` as a static site. | 6 | — |
| `staticwebapp.config.json` keeps direct route links working, serves unknown paths as real 404 responses, and sets cache and security headers. | 19 | — |
| Do not deploy or change DNS from this repository. | 9 | — |
| Project notes | 2 | — |
| Visual system and generated-art provenance: `.factory/design.md` | 6 | — |
| Product scope: `.factory/brief.json` | 3 | — |
| Handoff and verification: `.factory/handoff.md` | 4 | — |
| Privacy: `/privacy` | 2 | — |
| Terms: `/terms` | 2 | — |
| Licensed under the MIT License. | 5 | — |

## Terminology

| Concept | One term used |
|---|---|
| Files copied from a phone | camera export |
| Copy being checked | backup |
| Comparison output | receipt |
| File-content fingerprint | SHA-256 fingerprint |
| HEIC/JPG plus MOV unit | Live Photo pair |
| A selected type the app cannot check | skipped file |
| Optional paid entitlement | Archive License |
| Saved paid audit output | saved receipt |
| Seeded isolated experience | demo |

## Earlier finding verification

Every `review-1.md` through `review-6.md`, `polish-1.md` through `polish-6.md`, and the prior handoff was read. “Current web” below means both current source and live behavior; the deployed HTML, JavaScript, and CSS hash-identically to the clean build.

| Earlier finding | Current verification |
|---|---|
| F-1-1 demo state leakage | FIXED in current web: sample state clears before `/audit`, including Back/Forward. |
| F-1-2 folder identity | **REGRESSED / BLOCKING:** handle path passes, fallback inputs issue a same-folder all-clear (F-7-1). |
| F-1-3 HTTP-200 404 | FIXED: a fresh unknown live path returns 404 with the designed page. |
| F-1-4 release identity | **REGRESSED / BLOCKING:** live/current and the downloadable artifact share `v0.1.2` but contain different builds (F-7-2). |
| F-1-5 route social metadata | FIXED in current web: every route has its own OG/Twitter title and description. |
| F-1-6 receipt removal | FIXED in current web and tagged test. |
| F-1-7 scan progress | FIXED in current web and delayed-file test. |
| F-1-8 source order | FIXED in current web at desktop and 390 px. |
| F-1-9 refund claim | FIXED: refund wording remains absent. |
| F-1-10 release integrity | FIXED for artifact integrity: files and checksum verify. Integrity does not prove freshness; see F-1-4. |
| F-1-11 hash/proof overclaim | FIXED in current web. |
| F-1-12 contextless result heading | FIXED: “See which files match or need attention.” |
| F-1-13 abstract process heading | FIXED: “Compare two folders in three steps.” |
| F-1-14 false resolve action | FIXED: copy says review. |
| F-1-15 privacy metaphor | FIXED: the heading states the on-device boundary. |
| F-1-16 unlimited receipt wording | FIXED: the 25-receipt limit is explicit and tested. |
| F-1-17 ambiguous license action | FIXED: “Enter license token.” |
| F-1-18 README SHA-256 jargon | FIXED: README explains a content fingerprint and timestamp effect. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links OS prerequisites. |
| F-1-20 SPA jargon | FIXED: README explains direct routes and real 404s. |
| F-2-1 false uninstall assurance | FIXED in current web; **still present in the stale desktop source under F-1-4**. |
| F-2-2 “Watch each hash” | FIXED in current web; **still present in the stale desktop source under F-1-4**. |
| F-3-1 mobile targets/text | FIXED in current web: exhaustive geometry/text tests pass. The tagged desktop source predates these CSS repairs. |
| F-3-2 unlisted Reset | FIXED: `demo-reset` is declared and passes. |
| F-4-1 unsupported capability assurance | FIXED in current web; **the stale desktop Terms still contains the old replacement assurance under F-1-4**. |
| F-4-2 release output set | FIXED: the public release contains every declared format. |
| F-5-1 silently skipped media | FIXED in current web; **UNFIXED / BLOCKING in the current desktop download under F-1-4**. |
| F-5-2 demo storage race | FIXED in current web; **the stale desktop source still writes the release cache to local storage under F-1-4**. |
| F-5-3 timestamp clause | FIXED: the claim fixture uses different names and timestamps. |
| F-5-4 Live Photo terminology | FIXED in current README and web copy. |
| F-5-5 payment jargon | FIXED in current web; stale desktop copy still says “merchant of record” under F-1-4. |
| F-5-6 “local-first” jargon | FIXED in current web; stale desktop footer still uses it under F-1-4. |
| F-6-1 Audit metadata overclaim | FIXED in current web and `audit-supported-media`; stale desktop uses the old description under F-1-4. |
| F-6-2 saved-receipt contents | FIXED in current source and `receipt-metadata-only`. |
| F-6-3 browser-data removal | FIXED in current web; stale desktop lacks the control and retains the old advice under F-1-4. |
| F-6-4 wrong error recovery | FIXED in current web; stale desktop contains the old errors under F-1-4. |
| F-6-5 preview hash jargon | FIXED in current web; stale desktop contains the old labels under F-1-4. |
| F-6-6 metaphorical eyebrow | FIXED in current web; stale desktop contains the old slogan under F-1-4. |
| F-6-7 desktop-section metaphor | FIXED in current web; stale desktop contains the old heading under F-1-4. |
| F-6-8 undisclosed external checkout | FIXED in current web; stale desktop omits the external disclosure under F-1-4. |

## Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200. A fresh unknown path returns HTTP 404.
- Every route has `lang="en"`, one `main`, one h1, a route-specific title, description, canonical, Open Graph/Twitter metadata, SVG favicon, and Apple touch icon. The product Open Graph image is 1200 × 630.
- Deep links render the correct state. Browser Back restored `/` and focused “Check every photo before clearing space”; the polite route announcer is present.
- All discovered internal routes, the hosted checkout, release page, Param Factory link, and README links resolved. Mail links and `#main` were treated as explicit exceptions.
- The worker URL verifier passed home and demo with no console errors, missing alt text, or unlabeled buttons.
- Live Playwright axe at 390 px reported zero violations on all six routes and the designed 404. The clean suite also passed 44 px targets, 200% reflow, visible picker focus, and reduced-motion rules.
- The asymmetrical glass archives, cyan verification channel, clipped receipt surfaces, and amber/coral exceptions implement `.factory/design.md`. The result is not a generic SaaS template.
- Initial JavaScript is 13.60 kB gzip. No third-party fonts or scripts load.

## Missed leverage

No separate finding. Exact byte comparison, Live Photo pairing, CSV export, local receipt history, and desktop installers are the expected adjacent capabilities. AI would reduce confidence in a deterministic completeness check, and sync would conflict with the stated device-only boundary. The missing leverage is release provenance, already covered by F-1-4: users need the downloadable desktop app to contain the reviewed scanner.

## What would make this perfect

1. Close every folder-selection path that can compare a directory with itself, and test each rendered picker path.
2. Publish a new desktop version from the accepted repaired commit, expose its source build ID, and exercise core safety flows against the packaged app.
3. Repeat the entire cold-read, demo, claims, history, copy, route, link, accessibility, privacy, and package-provenance review. PASS requires zero findings.
