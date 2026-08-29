# Adversarial first-read review 8 — Photo Upload Audit

Reviewed 29 August 2026 against <https://photo-upload-audit.sociobot.in>, repository commit `7911fd806c3b512fdc4260dcbd9d28295bac0be6`, and public desktop release `v0.1.4`.

## Verdict

**FAIL.** No blocking issue remains: the cold first screen, one-click sandbox, all 30 declared claim commands, complete 53-test suite, routing, release identity, links, and accessibility checks pass. Two minor landing-page labels still fail the supplied plain-words rule. A PASS requires zero findings.

## Findings

### Minor

#### F-8-1 — “Inside the app” is a generic decorative section label

- **Exact quote/location:** Landing page, standalone eyebrow above “Compare two folders in three steps”: “Inside the app”.
- **Why this fails:** The label could appear unchanged on any software page. It does not name the folder-comparison walkthrough, and the following h2 already supplies the useful information.
- **Concrete fix:** Delete the eyebrow, or replace it with “Folder comparison walkthrough”.

#### F-8-2 — “Clear boundaries” is a mood label, not a section name

- **Exact quote/location:** Landing page, standalone eyebrow above “Your photo data stays on your device”: “Clear boundaries”.
- **Why this fails:** A first-time visitor or screen-reader user cannot infer that this section covers local file handling and backup limits. The phrase carries no product-specific information.
- **Concrete fix:** Replace it with “Privacy and backup limits”, or remove it and retain the direct h2.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** Compares a camera export with its backup before the owner clears phone space.
- **For whom:** Phone owners checking originals, videos, and Live Photo pairs.
- **First click:** **Try it with sample data**. The action opens a finished sample audit.
- **Result:** PASS. The job, audience, primary action, and three facts are visible without scrolling.

### 1440 × 900 desktop, before scrolling

- **What it does:** Checks a phone photo export against a backup and identifies files needing attention.
- **For whom:** Phone owners preparing to clear space.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same decision information is visible before scrolling.

Exact first-screen copy used for both judgments:

> “Compare a camera export with its backup”  
> “Check every photo before clearing space”  
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”  
> “Try it with sample data”  
> “See a finished audit in one click.”

## Copy audit — landing page

Counts treat hyphenated terms, versions, filenames, paths, and email addresses as one word. Headings, standalone labels, controls, facts, loading text, and explanatory fragments are included. Repeated navigation, raw sample filenames, counters, and table column names are data rather than sentences. No item exceeds 22 words, contains a banned marketing adjective, changes the established terminology, or uses a non-result-naming button. The two generic labels are findings F-8-1 and F-8-2.

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
| The receipt | 2 | — |
| See which files match or need attention | 7 | — |
| The app compares each file’s contents, even when its name changed. | 11 | — |
| Audit your folders | 3 | — |
| File contents match | 3 | — |
| No backup file | 3 | — |
| Same name, different contents | 4 | — |
| 2 matching copies | 3 | — |
| How it works | 3 | — |
| Compare without changing either folder | 5 | — |
| Choose the export | 3 | — |
| Select the folder copied from your phone. | 7 | — |
| Choose the backup | 3 | — |
| Select the disk or server folder that should contain it. | 10 | — |
| Read the receipt | 3 | — |
| Review missing, changed, duplicate, extra, and unpaired files. | 8 | — |
| Inside the app | 3 | F-8-1: generic decorative label |
| Compare two folders in three steps | 6 | — |
| Pick both folders | 3 | — |
| Source is always first. | 4 | — |
| Follow the file check | 4 | — |
| The current file and count stay visible. | 7 | — |
| Review files that need attention | 5 | — |
| Each row says what happened. | 5 | — |
| Desktop app | 2 | — |
| Download the desktop app | 4 | — |
| Desktop installers for v0.1.4 are unsigned. | 6 | — |
| Checking desktop releases… | 3 | — |
| Detected: Linux | 2 | — |
| Download for Linux | 3 | — |
| Photo.Upload.Audit_0.1.4_amd64.AppImage · v0.1.4 | 2 | — |
| View all releases (external site) | 5 | — |
| Clear boundaries | 2 | F-8-2: mood label does not name the section |
| Your photo data stays on your device | 7 | — |
| The app reads the folders you choose. | 7 | — |
| It never moves, edits, or deletes media. | 7 | — |
| No photo index or filename is sent to us. | 9 | — |
| License checks send only the license token. | 7 | — |
| It checks two folders. | 4 | — |
| Keep your existing backup and complete a restore test. | 9 | — |
| Archive License | 2 | — |
| Keep up to 25 audit receipts | 6 | — |
| $19 one-time. | 2 | — |
| Save up to 25 local audit receipts and print verification certificates. | 11 | — |
| Scanning and CSV export stay free. | 6 | — |
| $19 one-time purchase | 3 | — |
| Buy Archive License (external checkout) | 5 | — |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| License token | 2 | — |
| Verify license | 2 | — |
| Sociobot/Dodo processes your payment. | 4 | — |
| Email support@sociobot.in with billing questions. | 5 | — |
| Check your backup before clearing your phone. | 7 | — |
| v0.1.4 · build d8d5ac9dc4c8 · desktop app · files stay on your device | 10 | — |

## Copy audit — README

| README text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo pair before clearing your phone. | 12 | — |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | — |
| The receipt separates verified, missing, changed, skipped, duplicate, extra, and unpaired files. | 12 | — |
| It lists any selected file this version cannot check. | 9 | — |
| Browsers that verify folder identity reject the same folder and accept different folders with the same name. | 17 | — |
| Browser folder inputs still scan. | 5 | — |
| They never issue an all-clear because they cannot prove the folders differ. | 12 | — |
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
| Each release also attaches `SHA256SUMS` and `latest.json`. | 7 | — |
| The manifest names the release source commit. | 7 | — |
| Claims check formats, notice, checksum, and Debian package build identity. | 10 | — |
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

Terminology remains consistent: **camera export** is the source, **backup** is the checked destination, **receipt** is the result, **Live Photo pair** is the paired media unit, **skipped** marks an unchecked file, **Archive License** is the paid entitlement, and **demo** is the isolated sample.

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The first-screen action opened `/demo` directly. |
| Product already in use | PASS | The first demo screen showed eight populated rows: four verified, one missing, one changed, one duplicate, and one extra. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved”, **Reset demo**, and **Start for real** remained present. |
| Reset | PASS | Missing showed one row; Reset restored `All 8`, its pressed state, and all eight rows. |
| Storage isolation | PASS | With a real sentinel present and the GitHub release lookup delayed, the one-click flow recorded no localStorage, sessionStorage, or IndexedDB write. No IndexedDB database existed. |
| Real-data boundary | PASS | Start for real removed the banner and every sample row, opened empty folder selection, and preserved the real sentinel. |
| Request privacy | PASS | Direct demo traffic was same-origin. The cold landing made only its installer lookup to GitHub in addition to same-origin assets; no analytics, advertising, font, license, or photo-data request occurred. |
| Offline | PASS | After service-worker readiness, an offline `/demo` reload restored the heading, banner, and eight rows. |

The browser folder-input fallback was also retested live with the same directory selected twice. It reported “Folder identity could not be verified”, showed “This receipt cannot confirm your backup”, and exposed no save or print action.

## Claims

A fresh non-local clone was created at `/tmp/photo-upload-audit-review8.iCL86q/repo`. `npm ci` completed with no reported vulnerability. Every exact `test` command from `.factory/claims.json` then ran separately and selected its tagged test.

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
| `same-folder-safe` | `npm test -- --grep @claim:same-folder-safe` | PASS |
| `scan-progress` | `npm test -- --grep @claim:scan-progress` | PASS |
| `source-first` | `npm test -- --grep @claim:source-first` | PASS |
| `one-to-one-match` | `npm test -- --grep @claim:one-to-one-match` | PASS |
| `desktop-build-identity` | `npm test -- --grep @claim:desktop-build-identity` | PASS |

The clean-clone summary is **30/30 claim commands passed**. The complete suite then passed **53/53**, and `npm run build` produced `dist/site/`. Initial JavaScript is 40.99 kB raw / 13.98 kB gzip. The deployed HTML, JavaScript, and CSS have the same SHA-256 hashes as the clean build.

Every claim-like product sentence on the live landing page and in README maps to a claims entry. The repository-operation statements in README were separately confirmed by the full test and build runs. No unlisted or untested product claim was found.

## Earlier finding verification

Every `review-1.md` through `review-7.md`, `polish-1.md` through `polish-7.md`, and the prior handoff was read. Each earlier finding was checked against current live behavior and current source/tests.

| Earlier finding | Round-8 verification |
|---|---|
| F-1-1 demo state leakage | FIXED: live Start for real clears the sample; `demo-to-real` passes. |
| F-1-2 folder identity | FIXED: verified handles use `isSameEntry`; live fallback results are explicitly non-certifying; `same-folder-safe` passes. |
| F-1-3 HTTP-200 404 | FIXED: a fresh unknown live path returns HTTP 404 with the designed page. |
| F-1-4 release identity | FIXED: live site, release `v0.1.4`, `latest.json`, and packaged build identity agree on `d8d5ac9dc4c84388611cf551fd42a4813b41764e`; `desktop-build-identity` passes. |
| F-1-5 route social metadata | FIXED: every live route has its own title, description, canonical, Open Graph, and Twitter values. |
| F-1-6 receipt removal | FIXED: the tagged removal test passes after reload. |
| F-1-7 scan progress | FIXED: the delayed-file tagged test observes the current file and count. |
| F-1-8 source order | FIXED: source precedes backup at desktop and 390 px. |
| F-1-9 refund claim | FIXED: refund wording remains absent; Terms gives a billing contact. |
| F-1-10 release integrity | FIXED: the current release exposes both integrity files and its checksum test passes. |
| F-1-11 hash/proof overclaim | FIXED: landing copy describes file-content comparison plainly. |
| F-1-12 contextless result heading | FIXED: “See which files match or need attention.” |
| F-1-13 abstract process heading | FIXED: “Compare two folders in three steps.” |
| F-1-14 false resolve action | FIXED: the walkthrough asks the visitor to review files. |
| F-1-15 privacy metaphor | FIXED: the h2 directly states that photo data stays on the device. |
| F-1-16 unlimited receipt wording | FIXED: the 25-receipt limit is explicit and tested. |
| F-1-17 ambiguous license action | FIXED: the action says “Enter license token”. |
| F-1-18 README SHA-256 jargon | FIXED: README first explains it as a content fingerprint. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links the operating-system prerequisites. |
| F-1-20 SPA jargon | FIXED: README explains direct links and real 404 responses in plain words. |
| F-2-1 false uninstall assurance | FIXED: Privacy warns that uninstalling may retain app data and gives the next check. |
| F-2-2 “Watch each hash” | FIXED: the current phrase is “Follow the file check”. |
| F-3-1 mobile targets/text | FIXED: live 390 px enumeration found no target below 44 px, no overflow, and the full geometry tests pass. |
| F-3-2 unlisted Reset | FIXED: `demo-reset` is declared and passes; live Reset restores eight rows. |
| F-4-1 unsupported capability assurance | FIXED: replacement assurances are absent; Terms gives deletion advice instead. |
| F-4-2 release output set | FIXED: the public release contains the declared macOS, Windows, AppImage, and Debian formats; the claim passes. |
| F-5-1 silently skipped media | FIXED: unsupported entries stay visible as skipped and prevent an all-clear; the mixed-file claim passes. |
| F-5-2 demo storage race | FIXED: the delayed one-click live flow recorded no browser-storage write. |
| F-5-3 timestamp clause | FIXED: equal bytes with different names and timestamps are covered. |
| F-5-4 Live Photo terminology | FIXED: public copy consistently uses “Live Photo pair”. |
| F-5-5 payment jargon | FIXED: copy says Sociobot/Dodo processes payment and provides support email. |
| F-5-6 “local-first” jargon | FIXED: footer says “desktop app · files stay on your device”. |
| F-6-1 Audit metadata overclaim | FIXED: metadata qualifies supported media and says unchecked files remain visible. |
| F-6-2 saved-receipt contents | FIXED: the tagged test recursively excludes media objects and bytes. |
| F-6-3 browser-data removal | FIXED: the confirmed control removes the license, verdict, and receipts. |
| F-6-4 wrong error recovery | FIXED: same-folder and empty-folder failures name different corrective actions. |
| F-6-5 preview hash jargon | FIXED: preview labels describe file contents. |
| F-6-6 metaphorical first-screen eyebrow | FIXED: the eyebrow names the camera-export comparison. |
| F-6-7 desktop-section metaphor | FIXED: the h2 says “Download the desktop app”. |
| F-6-8 undisclosed external checkout | FIXED: the action visibly says “external checkout”. |
| F-7-1 fallback same-folder all-clear | FIXED: the live fallback with the same directory shows an unverified warning and no certification controls. |
| F-7-2 stale desktop package | FIXED: `v0.1.4` embeds the source build named by its release manifest; the live download and tagged test agree. |

No earlier finding is reopened.

## Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200. A fresh unknown route returns 404 with “This page is missing from the archive” and a home action.
- Every route has `lang="en"`, one `main`, one h1, an appropriate route-specific title, a description, canonical, Open Graph/Twitter metadata, SVG favicon, and Apple touch icon. The Open Graph image is the product artwork at 1200 × 630.
- Deep links render the correct state. Browser Back restores `/`, focuses its h1, and updates the polite route announcer.
- Every discovered live-site link resolved, including the current installer, release page, hosted checkout, and Param Factory site. `mailto:` and `#main` links are explicit non-HTTP exceptions. The README’s external Tauri prerequisite link returned 200, and every repository-relative README link exists.
- The worker URL verifier passed with no console errors, one h1, one main, `lang`, image alt coverage, and labelled buttons. Live Playwright axe found zero violations on all six routes. At 390 px, no visible interaction was below 44 × 44 px and no route overflowed horizontally.
- CSP, referrer, content-type, permissions, and frame-ancestor policies are configured as response headers. No third-party font or script loads.
- The asymmetrical glass archives, cyan verification channel, clipped receipt surfaces, and amber/coral exception colors implement `.factory/design.md`. The site is visually distinct rather than a generic SaaS template.

## Missed leverage

No additional AI, import/export, or sync finding is warranted. Exact byte comparison and Live Photo pairing are deterministic tasks; an AI step would reduce confidence. Folder import is the core flow, CSV export is present, local receipt history is available, and remote sync would conflict with the stated device-only boundary. No provider key or decorative AI feature is present.

## What would make this perfect

1. Remove or rewrite “Inside the app” so the label names the folder-comparison walkthrough.
2. Replace “Clear boundaries” with “Privacy and backup limits”, or remove the redundant label.
3. Re-run the complete cold, demo, claims, history, structure, link, accessibility, and copy review. PASS then requires no findings.
