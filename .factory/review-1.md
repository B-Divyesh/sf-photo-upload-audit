# Adversarial first-read review 1 — Photo Upload Audit

Reviewed 28 August 2026 against `https://photo-upload-audit.sociobot.in` and repository commit `f5aa30b39917783127a88500e64f46629315ba20` (the checked-out review base).

## Verdict

**FAIL.** There are 20 findings, including four blocking findings. All 17 declared claim commands pass, but the claim suite misses a demo-to-real transition that can save sample data into real receipt history and a folder-identity check that rejects two different folders with the same common name. The previously disclosed HTTP-200 404 and previously marked-fixed release version also remain unresolved.

## Findings

### Blocking

#### F-1-1 — “Start for real” carries demo data into real mode

- **Quote/location:** `/demo` banner: “Demo — sample data, nothing is saved” and “Start for real.” `.factory/demo.md`: “Start for real leaves `/demo` for `/audit` and discards the sample.”
- **Observed:** From a fresh context, `/demo` showed the seeded receipt. Selecting **Start for real** changed the URL to `/audit` and removed the demo banner, but the entire “iPhone export · 14 Jul” → “Family archive drive” sample receipt remained. With a cached valid Archive License, **Save receipt** was then visible and wrote that sample receipt to the real `audit:receipts` local-storage key.
- **Why this fails:** The user is told that leaving the sandbox starts real work and discards the sample. Instead, the UI relabels sample output as a real audit and permits it to contaminate real receipt history.
- **Concrete fix:** Clear `state.result`, `state.source`, `state.destination`, `state.filter`, and demo-only notes before navigating from `/demo` to `/audit`. Add a claim test that clicks **Start for real**, confirms that both folder pickers—not a receipt—are shown, confirms no sample filename remains, and confirms `audit:receipts` is unchanged even with a cached paid license.

#### F-1-2 — Different folders named `DCIM` are rejected as if they were the same folder

- **Quote/location:** `/audit` error: “Choose two different folders. The source and backup folder have the same root name.” README: “It refuses to compare a folder with itself.” `src/main.ts` compares only `rootLabel(...).toLocaleLowerCase()`.
- **Observed:** Two distinct temporary directories, `source/DCIM` and `backup/DCIM`, each containing a different fixture file, were selected. The app reported the same-folder error and produced no receipt. The existing claim test uses one directory twice and does not test distinct same-named folders.
- **Why this fails:** `DCIM`, `Photos`, and `Camera` are normal names on both a phone export and a backup. The web app cannot complete its core job for these legitimate inputs. A basename is not folder identity.
- **Concrete fix:** Use directory handles and `FileSystemDirectoryHandle.isSameEntry()` where supported. Provide an honest fallback where folder identity cannot be established; do not reject solely by basename. Extend `@claim:same-folder-safe` with both cases: the same handle is rejected and two different handles named `DCIM` are accepted.

#### F-1-3 — The known 404 defect remains: unknown URLs return HTTP 200

- **Quote/location:** `.factory/handoff.md` before this review: “Known low-severity deployment behavior: unknown SPA paths render the designed 404 UI with HTTP 200.” Live `/does-not-exist`.
- **Observed:** The designed “This page is missing from the archive” UI renders, but the navigation response is HTTP 200. This reproduces the unresolved handoff item.
- **Why this fails:** Crawlers, link checkers, caches, and users receive a success response for a missing page. The history rule makes an earlier unfixed item blocking in this round; it is also broken routing under the site-structure contract.
- **Concrete fix:** Serve known SPA routes through explicit rewrites and use a real styled `404.html` in `responseOverrides` with status 404. Add a deployed-response test that requests a random path and asserts both HTTP 404 and the designed 404 heading.

#### F-1-4 — Release identity is still inconsistent after the handoff marked versions fixed

- **Quote/location:** Live footer: “v0.1.0 · build 2026.08.” Landing download: `Photo.Upload.Audit_0.1.1_amd64.AppImage · v0.1.1`. `package.json`: `0.1.1`. `public/sw.js`: cache `photo-upload-audit-v0.1.2`. Landing copy: “The app is unsigned in v0.1. Your system may ask you to confirm the first launch.”
- **Observed:** The handoff said “Versions are `0.1.1`,” but the deployed footer still identifies the product as v0.1.0, while the release and package identify v0.1.1 and the cache uses v0.1.2.
- **Why this fails:** A visitor cannot tell which build they are viewing or downloading, and support cannot reliably match a report to a release. The OS-warning sentence is also an unlisted, platform-dependent claim. Because the earlier handoff marked this fixed, the regression is blocking under the history rule.
- **Concrete fix:** Derive the package, Tauri, footer, manifest, service-worker cache, and release label from one build version. Replace the vague copy with the exact current status, for example “Desktop installers for v0.1.1 are unsigned.” Add a release-identity test and either add a signing-status claim test or remove the OS-prompt prediction.

### Non-blocking product, claims, and structure findings

#### F-1-5 — Route-specific Open Graph and Twitter metadata always describe the home page

- **Quote/location:** Live `/demo`, `/audit`, `/history`, `/privacy`, `/terms`, and the not-found route all expose `og:title` and `twitter:title` as “Photo Upload Audit — Verify every backup file,” with the home description.
- **Why this fails:** Shared deep links misdescribe the destination even though the visible title, description, and canonical are route-specific.
- **Concrete fix:** Pre-render route-specific HTML metadata, or otherwise serve route-specific social tags to non-JavaScript crawlers. Add a crawl test for title, description, canonical, Open Graph, and Twitter tags on every route.

#### F-1-6 — Receipt deletion is a public but unlisted claim

- **Quote/location:** README: “Use `/history` to review or remove saved receipts.”
- **Why this fails:** `archive-license` checks saving, opening, and printing, but no claim entry or tagged test asserts removal and persistence after reload.
- **Concrete fix:** Add a `receipt-removal` claim and test that removes one saved receipt, reloads `/history`, and confirms only the selected receipt is gone.

#### F-1-7 — Visible scan progress is a public but unlisted claim

- **Quote/location:** Landing walkthrough: “The current file and count stay visible.”
- **Why this fails:** A user with a large library could rely on this feedback, but no claim test observes the hashing stage or progress update.
- **Concrete fix:** Add a `scan-progress` claim with a delayed fixture stream and assert that the current filename and increasing count remain visible, or remove the sentence.

#### F-1-8 — Source layout is a public but unlisted claim

- **Quote/location:** Landing walkthrough: “Source always stays on the left.”
- **Why this fails:** No claim entry tests the asserted orientation across desktop and mobile. On mobile, “left” is also the wrong spatial instruction once controls stack.
- **Concrete fix:** Rewrite as “Source is always first,” then add a layout/order test at desktop and 390 px, or remove the promise.

#### F-1-9 — Refund handling is a public but unlisted claim

- **Quote/location:** Landing: “Refunds are handled there.” Terms: “Sociobot/Dodo is the merchant of record and handles refunds.”
- **Why this fails:** The checkout-health test proves only that checkout redirects to Dodo. It does not prove the refund process or provide a policy destination.
- **Concrete fix:** Link to the exact refund policy and add a stable claim test for that destination, or replace the sentence with a support contact that does not overstate the tested contract.

#### F-1-10 — Release checksum artifacts are a public but unlisted claim

- **Quote/location:** README: “It also attaches `SHA256SUMS` and `latest.json` to the GitHub release.”
- **Why this fails:** `desktop-downloads` uses a mocked release containing only installers. It never asserts the two named files or verifies a checksum.
- **Concrete fix:** Add a `release-integrity-files` claim that inspects the published release, asserts both assets, downloads one small test artifact or installer range as appropriate, and validates the matching checksum.

### Plain-words findings

No landing or README sentence exceeds 22 words, and no banned marketing adjective appears. The following phrases still fail the jargon, contextual-heading, consistency, or result-naming checks.

#### F-1-11 — “Hashes prove file contents” is jargon and overstates certainty

- **Quote/location:** Landing receipt section: “Hashes prove file contents.”
- **Why this fails:** A first-time phone owner may not know what a hash is, and “prove” is stronger than the comparison performed.
- **Concrete rewrite:** “The app compares each file’s contents, even when its name changed.”

#### F-1-12 — “One answer for every file” does not identify the result out of context

- **Quote/location:** Landing h2: “One answer for every file.”
- **Why this fails:** A screen-reader heading list does not say what the answer is.
- **Concrete rewrite:** “See which files match or need attention.”

#### F-1-13 — “From folders to proof” is an abstract heading

- **Quote/location:** Landing h2: “From folders to proof.”
- **Why this fails:** It does not identify the three-step walkthrough without surrounding copy.
- **Concrete rewrite:** “Compare two folders in three steps.”

#### F-1-14 — “Resolve exceptions” claims an action the product does not provide

- **Quote/location:** Landing walkthrough frame: “Resolve exceptions.”
- **Why this fails:** The app reports exceptions; it does not move, repair, or resolve files.
- **Concrete rewrite:** “Review files that need attention.”

#### F-1-15 — “Your archive is not our library” is a metaphorical privacy heading

- **Quote/location:** Landing h2: “Your archive is not our library.”
- **Why this fails:** Out of context, it does not state the privacy boundary.
- **Concrete rewrite:** “Your photo data stays on your device.”

#### F-1-16 — “Keep a record of every audit” conflicts with the 25-receipt limit

- **Quote/location:** Landing paid-tier h2: “Keep a record of every audit.” The next sentence says “Save up to 25 local audit receipts.”
- **Why this fails:** “Every” implies no quota, while the paid feature has a fixed limit.
- **Concrete rewrite:** “Keep up to 25 audit receipts.”

#### F-1-17 — “Have a license? Paste it” is not a result-naming button

- **Quote/location:** Landing Archive License button: “Have a license? Paste it.”
- **Why this fails:** The control reveals a form; it does not accept a paste at that moment, and “it” is ambiguous.
- **Concrete rewrite:** “Enter license token.”

#### F-1-18 — README introduces SHA-256 without explaining it

- **Quote/location:** README: “It compares every supported media file by SHA-256 content, not timestamps.”
- **Why this fails:** The algorithm name appears before a plain explanation.
- **Concrete rewrite:** “It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result.”

#### F-1-19 — README setup uses an unexplained dependency phrase

- **Quote/location:** README: “Rust stable and the Tauri 2 system dependencies are also needed for desktop development.”
- **Why this fails:** “System dependencies” gives a new contributor no actionable OS-specific requirement.
- **Concrete rewrite:** “Desktop development also needs Rust stable and the Tauri prerequisites for your operating system,” with a link to the exact prerequisite list.

#### F-1-20 — README deploy copy uses unexplained “SPA fallback” jargon

- **Quote/location:** README: “`staticwebapp.config.json` supplies SPA fallback, caching, and security headers.”
- **Why this fails:** It does not explain the operational result.
- **Concrete rewrite:** “`staticwebapp.config.json` keeps direct route links working and sets cache and security headers.”

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does, in my words:** It checks whether photos, videos, and Live Photo pairs from a phone reached a backup.
- **For whom:** Phone owners who want to verify a backup before clearing space.
- **First click:** **Try it with sample data**; the adjacent text says “See a finished audit in one click.”
- **Result:** PASS. The headline, audience sentence, action, expected outcome, and all three facts are visible in the first 844 px.

### 1440 × 900 desktop, before scrolling

- **What it does, in my words:** It compares a phone photo export with a backup and identifies files needing attention.
- **For whom:** Phone owners about to clear space.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same information is visible without scrolling.

Exact first-screen text used for this judgment:

> “Prove every photo reached your backup”  
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”  
> “Try it with sample data”  
> “See a finished audit in one click.”

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | Home action opens `/demo` directly. |
| Realistic populated first screen | PASS | Seven source files and eight backup files produce verified, missing, changed, duplicate, extra, and Live Photo states immediately. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** are visible. |
| Reset | PASS | After filtering to missing files, Reset restored the initial complete receipt. |
| Demo storage isolation | PASS | Pre-existing real local-storage values remained unchanged; demo startup made no off-origin request and wrote no storage. |
| Offline demo | PASS | In a fresh context, after service-worker readiness, offline reload restored the sample receipt with no off-origin requests. |
| Leave demo | **BLOCKING FAIL** | F-1-1: `/audit` retained the sample receipt and allowed it to be saved to real history. |

## Declared claims

Each command below was run exactly as listed in `.factory/claims.json` after `npm ci`. Every command built the site and ran one matching tagged test.

| Claim | Exact command | Result |
|---|---|---|
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `hash-compare` | `npm test -- --grep @claim:hash-compare` | PASS |
| `live-photo` | `npm test -- --grep @claim:live-photo` | PASS |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS |
| `read-only` | `npm test -- --grep @claim:read-only` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `license-private` | `npm test -- --grep @claim:license-private` | PASS |
| `archive-license` | `npm test -- --grep @claim:archive-license` | PASS |
| `classifications` | `npm test -- --grep @claim:classifications` | PASS |
| `no-analytics` | `npm test -- --grep @claim:no-analytics` | PASS |
| `desktop-downloads` | `npm test -- --grep @claim:desktop-downloads` | PASS |
| `receipt-limit` | `npm test -- --grep @claim:receipt-limit` | PASS |
| `checkout-health` | `npm test -- --grep @claim:checkout-health` | PASS |
| `same-folder-safe` | `npm test -- --grep @claim:same-folder-safe` | PASS, but incomplete; see F-1-2 |
| `one-to-one-match` | `npm test -- --grep @claim:one-to-one-match` | PASS |

Unlisted public claims are findings F-1-4 and F-1-6 through F-1-10. No declared claim was left untested.

## History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I read the full handoff and both verification reports, then rechecked their issues on the live site and in code.

| Earlier issue | Current status |
|---|---|
| Same-folder selection | HALF-FIXED / BLOCKING: identical roots are rejected, but distinct same-named roots are also rejected (F-1-2). |
| One destination used for multiple sources | FIXED: the exact tagged test passes. |
| Quadratic 100,000-file comparison and whole-file hashing | FIXED: indexed comparison and streaming hashing are present; the 100,000-file test passes. |
| Demo reads real license state | FIXED on demo entry: a preloaded real token is untouched and no verification request occurs. Leaving demo still leaks sample state (F-1-1). |
| Invisible folder-picker focus | FIXED: full-size focused native controls and the keyboard test pass. |
| Saved receipts cannot be reviewed | FIXED: `/history` opens a saved receipt. Removal remains an unlisted claim (F-1-6). |
| Offline shell misses JS/CSS | FIXED: fresh offline `/demo` reload succeeds after the first visit. |
| Mobile touch/text/reflow defects | FIXED by the existing 390 px and 200% tests; live axe has no serious or critical findings. |
| Missing claims | PARTLY FIXED: 17 entries run, but six live/README promises remain unlisted (F-1-4, F-1-6–F-1-10). |
| Dead checkout | FIXED: the endpoint redirects to hosted Dodo checkout and resolves successfully. |
| Stale desktop release | HALF-FIXED: v0.1.1 downloads resolve, but the live footer still says v0.1.0 (F-1-4). |
| Unknown path returns 200 | UNFIXED / BLOCKING: reproduced on live `/does-not-exist` (F-1-3). |
| Unsigned installers | DISCLOSED, NOT FIXED: the live page and README say the binaries are unsigned. |

## Structure, accessibility, and link crawl

- Route titles match the required pattern and stay below 60 characters.
- `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms`, and the not-found UI each have `lang="en"`, one `main`, and one `h1`.
- Descriptions and canonicals update by route. Open Graph and Twitter metadata do not (F-1-5).
- Favicon, Apple touch icon, 1200 × 630 Open Graph image, `robots.txt`, and `sitemap.xml` return 200.
- Deep links load the right screen. Browser back returns to the prior route and focuses its h1. Route changes announce the heading.
- Every discovered internal link, GitHub release/download link, checkout link, and Param Factory link resolves. `mailto:` links were treated as explicit exceptions.
- Live axe integration found zero serious or critical violations on all checked routes at 390 px. Normal route loads produced no console errors or horizontal overflow.
- The visual identity is distinct: the asymmetrical glass archive, cyan verification channel, clipped receipt surfaces, and exception colors implement `.factory/design.md`. It is not a generic centered SaaS hero or three-card template.
- The not-found page is visually designed, but its HTTP status fails (F-1-3).

## Copy audit — landing page

Counts treat hyphenated terms, numbers, route names, and product names as one word. Navigation and raw receipt column labels are not sentences; all landing headings, sentences, facts, action labels, and explanatory fragments are included.

| Text | Words | Flag |
|---|---:|---|
| A receipt for your camera roll | 6 | — |
| Prove every photo reached your backup | 6 | — |
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | — |
| Try it with sample data | 5 | — |
| See a finished audit in one click. | 7 | — |
| Files stay on this device | 5 | — |
| Works without an account | 4 | — |
| Core audit and CSV are free | 6 | — |
| One answer for every file | 5 | F-1-12 |
| Hashes prove file contents. | 4 | F-1-11 |
| Names only help explain a mismatch. | 6 | — |
| Audit your folders | 3 | — |
| Compare without changing either folder | 5 | — |
| Choose the export | 3 | — |
| Select the folder copied from your phone. | 7 | — |
| Choose the backup | 3 | — |
| Select the disk or server folder that should contain it. | 10 | — |
| Read the receipt | 3 | — |
| Review missing, changed, duplicate, extra, and unpaired files. | 8 | — |
| From folders to proof | 4 | F-1-13 |
| Pick both folders | 3 | — |
| Source always stays on the left. | 6 | F-1-8 |
| Watch each hash | 3 | — |
| The current file and count stay visible. | 7 | F-1-7 |
| Resolve exceptions | 2 | F-1-14 |
| Each row says what happened. | 5 | — |
| Install it where your archive lives | 6 | — |
| The app is unsigned in v0.1. | 6 | F-1-4 |
| Your system may ask you to confirm the first launch. | 10 | F-1-4 |
| Detected: Linux | 2 | — |
| Download for Linux | 3 | — |
| View all releases | 3 | — |
| Your archive is not our library | 6 | F-1-15 |
| The app reads the folders you choose. | 7 | — |
| It never moves, edits, or deletes media. | 7 | — |
| No photo index or filename is sent to us. | 9 | — |
| License checks send only the license token. | 7 | — |
| It does not upload photos, recognise faces, or replace your backup tool. | 12 | — |
| Keep a record of every audit | 6 | F-1-16 |
| $19 one-time. | 2 | — |
| Save up to 25 local audit receipts and print verification certificates. | 11 | — |
| Scanning and CSV export stay free. | 6 | — |
| Buy Archive License | 3 | — |
| Review saved receipts | 3 | — |
| Have a license? Paste it. | 5 | F-1-17 |
| Sociobot/Dodo is the merchant of record. | 6 | — |
| Refunds are handled there. | 4 | F-1-9 |
| Verify every file before you clear your phone. | 8 | — |

## Copy audit — README

Code-block commands are excluded because they are commands, not sentences. Headings and standalone documentation labels are included.

| Text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo sidecar before clearing your phone. | 12 | — |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares every supported media file by SHA-256 content, not timestamps. | 11 | F-1-18 |
| The receipt separates verified, missing, changed, duplicate, extra, and unpaired files. | 11 | — |
| It refuses to compare a folder with itself and assigns each backup file to only one source original. | 18 | F-1-2 |
| The scanner is read-only. | 4 | — |
| Media contents, names, hashes, and reports stay on your device. | 10 | — |
| Core scanning and CSV export work without an account or license. | 11 | — |
| Try the sample | 3 | — |
| Open `/demo` to see a finished audit in one click. | 10 | — |
| The sample stays in memory and never touches real folders. | 10 | — |
| Reset it with **Reset demo**. | 5 | — |
| The installed web app and sample audit work offline after the first visit. | 13 | — |
| Run locally | 2 | — |
| Requirements: Node.js 20 or newer. | 5 | — |
| Rust stable and the Tauri 2 system dependencies are also needed for desktop development. | 14 | F-1-19 |
| Open `http://localhost:5173`. | 4 | — |
| Use `/audit` for real folders or `/demo` for sample data. | 10 | — |
| Test and build | 3 | — |
| `npm test` builds the static site and runs the Chromium claim, route, mobile, and accessibility tests. | 16 | — |
| The exact deployment command is `npm run build:site`. | 9 | — |
| Its output is `dist/site/`, with `dist/site/index.html` at the deploy root. | 10 | — |
| Run one product claim with its ID: | 7 | — |
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | F-1-6–F-1-10 show this is incomplete |
| The demo contract is in `.factory/demo.md`. | 6 | — |
| Desktop app | 2 | — |
| The desktop shell uses Tauri 2. | 6 | — |
| Start it in development with: | 5 | — |
| Tags matching `v*` run the release workflow. | 7 | — |
| It builds unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` files. | 11 | F-1-4 |
| It also attaches `SHA256SUMS` and `latest.json` to the GitHub release. | 10 | F-1-10 |
| Archive License | 2 | — |
| The optional Archive License costs $19 once. | 7 | — |
| It saves up to 25 audit receipts on the device and adds printable certificates. | 14 | — |
| Use `/history` to review or remove saved receipts. | 8 | F-1-6 |
| Scanning and CSV export stay free. | 6 | — |
| Checkout and license verification use the Sociobot billing API; photo data is never included in those requests. | 17 | — |
| Deploy | 1 | — |
| Deploy `dist/site/` as a static site. | 6 | — |
| `staticwebapp.config.json` supplies SPA fallback, caching, and security headers. | 8 | F-1-20 |
| Do not deploy or change DNS from this repository. | 9 | — |
| Project notes | 2 | — |
| Visual system and generated-art provenance: `.factory/design.md` | 6 | — |
| Product scope: `.factory/brief.json` | 3 | — |
| Handoff and verification: `.factory/handoff.md` | 4 | — |
| Privacy: `/privacy` | 2 | — |
| Terms: `/terms` | 2 | — |
| Licensed under the MIT License. | 5 | — |

## Missed leverage

No AI feature is justified for deterministic file integrity comparison, and no provider key or decorative AI feature is present. CSV export, saved receipt history, desktop installers, and an offline sample already cover the obvious import/export and local-use expectations. No additional AI, sync, or import feature is raised as a finding.

## Verification summary

- `npm ci`: PASS; zero audit vulnerabilities.
- All 17 exact claim commands: PASS, one tagged test each.
- `npm test`: PASS, 29/29; build output is `dist/site/` with 34.58 kB JavaScript (12.50 kB gzip) and 19.99 kB CSS (5.32 kB gzip).
- Live axe integration: zero serious or critical violations on `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms`, and the not-found UI.
- Live offline/network interception: PASS for initial demo sandbox and offline reload.
- Link crawl: PASS for every discovered live link; all HTTP targets resolved to 200 after redirects.
- Console: no errors on checked live routes.

## What would make this perfect

There is still work to do. A perfect next review would find that **Start for real** opens an empty real audit without carrying or saving sample state; folder identity distinguishes two separate `DCIM` folders; unknown routes return a real 404; every release surface reports one version; every public promise has an observable claim test; route shares carry correct metadata; and every flagged heading, sentence, and button uses the concrete rewrites above. It would also re-run the full checklist from a fresh context and return zero findings.
