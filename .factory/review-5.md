# Adversarial first-read review 5 — Photo Upload Audit

Reviewed 28 August 2026 against `https://photo-upload-audit.sociobot.in` and clean repository commit `005fd20b2d89ca9cb976d889d50f22bb1ba01b57`.

## Verdict

**FAIL.** The first screen is clear, the populated sample is useful, every declared claim command passes, and the route/accessibility baseline verifies. Three blocking findings remain: the scanner can issue a false all-clear after silently dropping an unsupported photo, a delayed landing-page request writes real local storage while the demo banner says nothing is saved, and the assurance from F-4-1 remains on Terms. Four additional plain-words/claim-coverage findings remain. PASS requires zero findings and no untested claim.

## Findings

### Blocking

#### F-4-1 — Reopened: the unsupported backup-replacement assurance was moved, not removed

- **Exact quote/location:** Live `/terms`, **What the app does**: “It never replaces a second backup or a restore test.” Earlier F-4-1 identified the equivalent landing claim, “It does not … replace your backup tool.”
- **Verification:** The old landing sentence is gone, but `legalPage('terms')` in `src/main.ts` still emits the same untestable safety assurance. No entry in `.factory/claims.json` covers it.
- **Why this fails:** The earlier repair moved the assertion out of the landing page instead of removing it from the product. A visitor can still rely on an unlisted statement that the claims gate cannot verify. Under the history rule, a half-fixed earlier finding is blocking again under the same id.
- **Concrete fix:** Replace the Terms sentence with advice that makes no product-capability claim: “Keep a second backup and complete a restore test before deleting originals.” Add a copy test that confirms the replacement-assurance wording is absent from every route.

#### F-5-1 — The scanner silently ignores an unsupported photo and then reports every source file accounted for

- **Exact quote/location:** Landing h1: “Prove every photo reached your backup.” Audit receipt h2: “Every source file is accounted for.” `src/lib/audit.ts` filters input through a fixed extension set that omits `.tif`/`.tiff` and does not report skipped files.
- **Verification:** In a fresh live `/audit`, the source contained `IMG_0001.jpg` and `IMG_0002.tif`; the backup contained only the matching JPG. The receipt reported **Source files 1**, **Verified 1**, **Missing 0**, “Every source file is accounted for,” and never displayed `IMG_0002.tif`.
- **Why this fails:** A phone owner can interpret the all-clear as permission to clear the source and lose a real photo the scanner silently excluded. An unsupported-only folder produces an error, but a mixed folder hides the unsupported files.
- **Concrete fix:** Enumerate every selected file. Support common photo/video formats such as TIFF where feasible, list every skipped file and reason, and prevent the all-clear while any source file is unverified. Add a claim test with one matched JPG plus one missing unsupported photo; it must show the skipped file and must not say every source file is accounted for.

#### F-5-2 — The one-click demo writes real local storage while “nothing is saved” is visible

- **Exact quote/location:** `/demo` banner: “Demo — sample data, nothing is saved.” `.factory/demo.md`: “It never reads or writes `localStorage`.” `loadDownloads()` writes `release:photo-upload-audit` without checking whether navigation has entered demo mode.
- **Verification:** In a fresh 390 px context, I delayed the landing page’s GitHub release response by 1.5 seconds, clicked **Try it with sample data**, and waited on `/demo`. While the demo banner was visible, an instrumented `Storage.setItem` recorded `{ key: "release:photo-upload-audit", url: "https://photo-upload-audit.sociobot.in/demo" }`. The key remained in local storage. The direct `/demo` test misses this race because it never starts on the required one-click landing path.
- **Why this fails:** The demo contract prohibits writes to the real storage namespace while demo mode is active. The banner makes an absolute promise, and the required entry path violates it.
- **Concrete fix:** Keep release metadata in memory/session storage, cancel the pending release lookup on route change, or check the active route before every persistent write. Change `@claim:demo-sandbox` to start at `/`, delay the release response, click the sample action, instrument all storage APIs, and assert zero writes while the demo banner is present.

### Minor

#### F-5-3 — The changed-timestamp promise is not tested

- **Exact quote/location:** README: “It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result.”
- **Why this fails:** `hash-compare` claims and tests renamed equal-content files, but its fixture files have the same modification timestamp. The public timestamp clause is therefore untested, despite the README saying all public claims are listed.
- **Concrete fix:** Expand `hash-compare` to say “even when a backup name or timestamp differs,” and construct equal-byte `File` objects with deliberately different `lastModified` values in the tagged test.

#### F-5-4 — README changes the established Live Photo term and introduces jargon

- **Exact quote/location:** README opening: “Verify every original, video, and Live Photo sidecar before clearing your phone.” The landing page and `.factory/copy-audit.md` use **Live Photo pair**.
- **Why this fails:** “Sidecar” is unexplained file-format jargon, and using both “sidecar” and “pair” for the same concept violates the one-term rule.
- **Concrete rewrite:** “Verify every original, video, and Live Photo pair before clearing your phone.”

#### F-5-5 — “Merchant of record” is unexplained payment jargon

- **Exact quote/location:** Landing Archive License section: “Sociobot/Dodo is the merchant of record.” The same sentence appears on `/terms`.
- **Why this fails:** A first-time buyer is not told what the legal phrase changes for them.
- **Concrete rewrite:** “Sociobot/Dodo processes your payment. Email support@sociobot.in with billing questions.”

#### F-5-6 — “Local-first” is jargon in the site-wide footer

- **Exact quote/location:** Footer on every route: “v0.1.2 · local-first desktop app.”
- **Why this fails:** The audience-facing footer uses product-development jargon even though the page already has a plain privacy statement.
- **Concrete rewrite:** “v0.1.2 · desktop app · files stay on your device.”

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** Checks whether a phone’s photos, videos, and Live Photo pairs reached a backup before the owner clears space.
- **For whom:** Phone owners preparing to clear media after copying it elsewhere.
- **First click:** **Try it with sample data**; “See a finished audit in one click.” states the result.
- **Result:** PASS. The headline, audience sentence, action, adjacent outcome, and three facts all appear before 844 px.

### 1440 × 900 desktop, before scrolling

- **What it does:** Compares a camera export with a backup and identifies files needing attention.
- **For whom:** Phone owners who want to verify a copy before clearing the phone.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same decision information is visible before scrolling.

Exact first-screen copy used for both judgments:

> “Prove every photo reached your backup”
>
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”
>
> “Try it with sample data”
>
> “See a finished audit in one click.”

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The visible hero action opens `/demo` directly. |
| Product already in use | PASS | The first demo screen shows an eight-row receipt with verified, missing, changed, duplicate, extra, and paired/unpaired Live Photo states. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remain visible. |
| Reset | PASS | Missing filtered to one row; Reset restored **All 8** and all eight rows. |
| Sample/receipt isolation | PASS | A pre-existing real receipt and sentinel value were unchanged; Start for real opened empty folder selection with no sample row or save action. |
| All-storage isolation | **BLOCKING FAIL** | A delayed landing release request wrote `release:photo-upload-audit` after `/demo` and its banner were active (F-5-2). |
| Offline | PASS | After first loading live `/demo`, Cache Storage contained route HTML plus hashed JS/CSS; an offline reload restored the h1 and all eight rows. |
| Privacy requests | PASS with F-5-2 exception | Direct demo/offline traffic was same-origin. The cold landing made the disclosed GitHub Releases lookup; local scan/export tests made no off-origin request. |

## Declared claims

I created a clean local clone, ran `npm ci`, and then ran every exact command from `.factory/claims.json` separately. Every tag occurs exactly once in `tests/`. No command failed, but F-5-2 and F-5-3 show that two tests do not cover their complete public wording.

| Claim | Exact command | Result |
|---|---|---|
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS; incomplete one-click storage coverage, F-5-2 |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `demo-to-real` | `npm test -- --grep @claim:demo-to-real` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `hash-compare` | `npm test -- --grep @claim:hash-compare` | PASS; timestamp clause untested, F-5-3 |
| `live-photo` | `npm test -- --grep @claim:live-photo` | PASS |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS |
| `read-only` | `npm test -- --grep @claim:read-only` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `license-private` | `npm test -- --grep @claim:license-private` | PASS |
| `archive-license` | `npm test -- --grep @claim:archive-license` | PASS |
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

The full clean-clone suite also passed: **43/43**. It built `dist/site/`; initial JavaScript is 36.38 kB raw / 12.98 kB gzip.

Unlisted or incompletely tested claim-like copy:

- `/terms` backup-replacement assurance: F-4-1.
- README changed-timestamp clause: F-5-3.
- The absolute demo storage wording is listed, but its test bypasses the one-click path and misses F-5-2.
- The “every photo/every source file” result does not account for skipped formats: F-5-1.

## History verification

I read every earlier `review-*.md`, `polish-*.md`, and the current handoff, then rechecked live behavior and source/tests.

| Earlier finding | Current verification |
|---|---|
| F-1-1 demo receipt leakage | FIXED: live Start for real clears sample receipt/folders; `resetDemoState()` and `@claim:demo-to-real` cover Back/Forward and receipt storage. F-5-2 is a different release-cache write. |
| F-1-2 same-named folders | FIXED: identity uses `isSameEntry()`; the tagged test accepts separate handles both named `DCIM`. |
| F-1-3 HTTP-200 404 | FIXED: a fresh unknown live path returned 404 with the designed page. |
| F-1-4 version mismatch | FIXED: live footer/release and package/Tauri/service-worker checks use `0.1.2`; the version assertion passed. |
| F-1-5 route social metadata | FIXED: each live route has its own title, description, canonical, Open Graph, and Twitter values. |
| F-1-6 receipt removal | FIXED: the tagged test removes only the chosen receipt and persists the result. |
| F-1-7 scan progress | FIXED: the delayed-stream test observes filename and increasing count. |
| F-1-8 source orientation | FIXED: copy says “Source is always first,” and desktop/mobile DOM order passes. |
| F-1-9 refund assertion | FIXED: the refund assertion remains absent. |
| F-1-10 release integrity | FIXED: the latest release has `SHA256SUMS` and `latest.json`; a published Debian checksum verifies. |
| F-1-11 hash jargon/overclaim | FIXED: “Hashes prove file contents” is absent; the plain content-comparison sentence is live. |
| F-1-12 contextless receipt heading | FIXED: “See which files match or need attention.” |
| F-1-13 abstract walkthrough heading | FIXED: “Compare two folders in three steps.” |
| F-1-14 false resolve action | FIXED: “Review files that need attention.” |
| F-1-15 privacy metaphor | FIXED: “Your photo data stays on your device.” |
| F-1-16 unlimited receipt wording | FIXED: landing and tests state the 25-receipt limit. |
| F-1-17 ambiguous license action | FIXED: “Enter license token.” |
| F-1-18 unexplained README SHA-256 | FIXED for jargon: README explains it as a content fingerprint. Timestamp coverage is separately F-5-3. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links OS-specific Tauri prerequisites. |
| F-1-20 SPA jargon | FIXED: README explains direct routes and real 404 responses in plain words. |
| F-2-1 false uninstall assurance | FIXED: Privacy warns that uninstalling may retain app data and names the OS app-data check. |
| F-2-2 “Watch each hash” | FIXED: the live walkthrough says “Follow the file check.” |
| F-3-1 mobile targets/text | FIXED: exhaustive 390 px target, 16 px meaningful-copy, progress, and 200% reflow tests pass. |
| F-3-2 unlisted Reset behavior | FIXED: `demo-reset` is declared, uniquely tagged, and passed. |
| F-4-1 unsupported capability assurances | **HALF-FIXED / BLOCKING:** removed from landing, but equivalent backup-replacement wording remains on `/terms`; reopened above with the same id. |
| F-4-2 release output set | FIXED: `desktop-release-formats` checks published macOS, Windows, AppImage, Debian, and unsigned notice. |

The older independent-verification defects are also covered: same-folder and one-to-one matching, linear 100,000-file comparison, streaming hashes, demo license isolation, picker focus, receipt history, offline assets, checkout health, mobile targets/reflow, release identity, and HTTP 404 all pass their current checks. The mixed unsupported-file case in F-5-1 was not covered by the earlier unsupported-only check.

## Structure, accessibility, and links

- PASS: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200; an unknown route returns 404.
- PASS: every route has `lang="en"`, one `main`, one h1, an appropriate route title, description, canonical, Open Graph/Twitter metadata, favicon, and 180 px Apple touch icon. The Open Graph image is 1200×630.
- PASS: direct links render the correct state. Browser Back restores `/` and focuses its h1; the polite route announcer is present.
- PASS: the header/footer shell, skip link, Privacy, Terms, and build identity are consistent. The designed 404 retains the product’s archive visual language and a route home.
- PASS: every discovered internal route, current Linux installer, GitHub release, checkout, Param Factory link, and README external link resolves. Checkout redirects to the hosted Dodo page.
- PASS: live axe checks found zero violations on all seven checked routes. Normal routes produced no console/page errors; 390 px has no horizontal overflow. `verify-url.sh` passed title, language, main, alt, labeling, and console checks.
- PASS: the asymmetric glass archive art, cyan scan channel, clipped surfaces, and status colors match `.factory/design.md` and do not resemble a generic centered SaaS template.
- PASS: favicon, manifest, robots, sitemap, service worker, Open Graph image, and touch icon return 200. The initial JS is well below the 150/200 kB thresholds.

## Copy audit — landing page

Counts treat hyphenated terms, product names, numbers, and filenames as one word. Standalone headings and actions are included because they can be encountered independently. Raw sample filenames and scan counters are data, not sentences. No item exceeds 22 words or uses a banned marketing adjective.

| Text | Words | Flag |
|---|---:|---|
| A receipt for your camera roll | 6 | — |
| Prove every photo reached your backup | 6 | F-5-1 outcome overstates silently filtered input |
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | — |
| Try it with sample data | 5 | — |
| See a finished audit in one click. | 7 | — |
| Files stay on this device | 5 | — |
| Works without an account | 4 | — |
| Core audit and CSV are free | 6 | — |
| See which files match or need attention | 7 | — |
| The app compares each file’s contents, even when its name changed. | 11 | — |
| Audit your folders | 3 | — |
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
| Install it where your archive lives | 6 | — |
| Desktop installers for v0.1.2 are unsigned. | 6 | — |
| Detected: Linux | 2 | — |
| Download for Linux | 3 | — |
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
| Buy Archive License | 3 | — |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| Sociobot/Dodo is the merchant of record. | 6 | F-5-5 jargon |
| Verify every file before you clear your phone. | 8 | F-5-1 outcome overstates silently filtered input |
| local-first desktop app | 3 | F-5-6 jargon |

## Copy audit — README

| Text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo sidecar before clearing your phone. | 12 | F-5-4 inconsistent jargon |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | F-5-3 untested clause |
| The receipt separates verified, missing, changed, duplicate, extra, and unpaired files. | 11 | — |
| When a browser provides folder identity, it refuses the same folder twice; it never guesses from a shared folder name. | 20 | — |
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
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | F-4-1/F-5-3 contradict this |
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

Terminology is otherwise consistent: **camera export** for the source, **backup** for the destination, **receipt** for output, **Archive License** for the paid entitlement, and **demo** for the sample sandbox.

## Missed leverage

The obvious missing feature is not AI or sync. It is a complete skipped-file inventory: every selected source entry the scanner cannot hash should appear in the receipt with its extension and reason, and an all-clear must be impossible until the visitor resolves those entries. This is the concrete fix for F-5-1 and follows directly from the brief’s “every original, video, and Live Photo sidecar” job. AI would add no value to byte-for-byte verification, and sync would weaken the local-only boundary.

## What would make this perfect

1. Prevent a clean receipt when any selected source file was skipped; list skipped files and test a mixed supported/unsupported folder.
2. Stop every persistent write while the demo banner is active and test the real landing-to-demo path with delayed background requests.
3. Remove the backup-replacement assurance from Terms, completing F-4-1 rather than relocating it.
4. Add explicit changed-timestamp claim coverage.
5. Replace “sidecar,” “merchant of record,” and “local-first” with the proposed plain terms.
6. Repeat the full cold, demo, claim, history, route, link, accessibility, and copy audit. PASS requires no remaining finding.
