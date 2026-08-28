# Adversarial first-read review 6 — Photo Upload Audit

Reviewed 28 August 2026 against <https://photo-upload-audit.sociobot.in> and clean repository commit `17a66dda474fbb75e9697998e8d711a781def43e`.

## Verdict

**FAIL.** The first screen is clear, the one-click demo is useful and isolated, all 26 declared claim commands pass, all earlier findings remain fixed, and the route/accessibility baseline passes. Eight findings remain: two public statements are absent from the claims contract, one route description overstates what gets hashed, one error gives the wrong recovery instruction, three landing phrases fail the plain-words standard, and the paid checkout is not identified as an external destination. PASS requires zero findings and no untested claim.

No finding in this round meets the mandated blocking conditions: the first read passes, the demo passes, every declared claim test passes, earlier findings remain fixed, routing works, and the visual identity is distinct.

## Findings

### High

#### F-6-1 — The Audit route metadata says every media file is hashed, but some files are deliberately skipped

- **Exact quote/location:** Live `/audit` meta description and `src/main.ts` route metadata: “Choose two local folders and compare every media file by SHA-256.”
- **Observed:** The app correctly lists unsupported files as skipped, and `@claim:all-files-reported` proves that a PSD is not checked. The metadata instead says every media file is compared by SHA-256. This sentence is also absent from `.factory/claims.json` in that form.
- **Why this misleads:** Search results and shared Audit links can promise a stronger result than the scanner provides. This is especially unsafe in a product used before deleting originals.
- **Concrete fix:** Use “Choose two local folders. Supported media is compared by SHA-256, and unchecked files stay visible.” Update the pre-render metadata assertion and either map both clauses to existing claims or add one tagged route-metadata claim.

#### F-6-2 — Saved-receipt contents are covered by public privacy copy but not by a claim test

- **Exact quote/location:** Live `/history`: “They do not include the original media files.”
- **Observed:** `saveReceipt()` strips each `file` field before writing `audit:receipts`, but `@claim:archive-license` checks only that one saved record exists. No declared test inspects the stored object for `File`, `Blob`, binary content, or object URLs.
- **Why this misleads:** This is a privacy guarantee about paid saved data. A future serialization regression could include media bytes while every declared claim still passes.
- **Concrete fix:** Add a `receipt-metadata-only` claim and one tagged test that saves a real fixture audit, recursively inspects the persisted receipt, and proves no `File`, `Blob`, byte buffer, data URL, or object URL is stored.

### Minor

#### F-6-3 — The Privacy page gives an unlisted data-removal assurance

- **Exact quote/location:** Live `/privacy`: “Clear this site's browser storage to remove a saved license and receipts.”
- **Observed:** No `.factory/claims.json` entry verifies removal of both the license keys and receipt history.
- **Why this misleads:** A privacy instruction is an outcome a visitor may rely on before sharing a computer. It currently sits outside the regression gate.
- **Concrete fix:** Add a `browser-data-removal` claim and test that seeds the license, verdict, and receipts, clears site storage, reloads, and confirms all three are absent. An in-app **Clear saved data** control would make the instruction easier to perform and test.

#### F-6-4 — Folder-selection errors give the wrong next action

- **Exact quote/location:** `/audit` error wrapper always appends “Choose both folders and try again.” This follows errors such as “The source and backup folder are the same folder” and “That folder contains no files.”
- **Observed:** In the same-folder case, both folders are already chosen. In the empty-folder case, choosing both folders does not address the empty selection.
- **Why this loses a first-time visitor:** The message identifies the problem, then tells the visitor to repeat an action that cannot fix it.
- **Concrete fix:** Give each error one specific recovery: “Choose a different backup folder, then compare again” for identical folders and “Choose a folder that contains files” for an empty folder. Add assertions for the full error text.

#### F-6-5 — The landing preview uses unexplained and inconsistent hash jargon

- **Exact quote/location:** Landing receipt preview: “SHA-256 match” and “Same name, different hash.”
- **Why this loses a first-time visitor:** The landing page never explains SHA-256 or “hash,” and it uses two terms for the same concept. The nearby plain sentence already frames the useful result as comparing file contents.
- **Concrete fix:** Rewrite these two labels as “File contents match” and “Same name, different contents.” Keep the SHA-256 detail in the README or an optional technical detail.

#### F-6-6 — The first-screen eyebrow is a metaphorical slogan

- **Exact quote/location:** Landing first screen: “A receipt for your camera roll.”
- **Why this loses a first-time visitor:** It does not say that two folders are compared, and “receipt” is product terminology the visitor has not encountered yet.
- **Concrete rewrite:** “Compare a camera export with its backup.”

#### F-6-7 — The desktop section heading uses a location metaphor

- **Exact quote/location:** Landing h2: “Install it where your archive lives.”
- **Why this loses a first-time visitor:** The heading does not directly name desktop downloads and “where your archive lives” can mean a disk, server, or computer.
- **Concrete rewrite:** “Download the desktop app.”

#### F-6-8 — The purchase link leaves the site without saying so

- **Exact quote/location:** Landing Archive License action: “Buy Archive License,” linking to `https://api.sociobot.in/.../checkout` and then `checkout.dodopayments.com`.
- **Why this loses a first-time visitor:** The site-structure contract requires external links to say they are external. The adjacent payment sentence names the processor but does not identify the link’s navigation behavior.
- **Concrete fix:** Give the link an accessible suffix such as “Buy Archive License (external checkout)” and retain the visible payment explanation.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does, in my words:** It checks whether photos, videos, and Live Photo pairs reached a backup before I clear phone space.
- **For whom:** Phone owners who copied media elsewhere and want to verify it.
- **First click:** **Try it with sample data**; “See a finished audit in one click.” states the result.
- **Result:** PASS. The headline, audience sentence, action, outcome, and all three facts are visible before 844 px.

### 1440 × 900 desktop, before scrolling

- **What it does, in my words:** It compares a phone camera export with a backup and identifies files needing attention.
- **For whom:** Phone owners preparing to clear space.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same decision information is visible before scrolling.

Exact first-screen copy used for both judgments:

> “Check every photo before clearing space”  
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”  
> “Try it with sample data”  
> “See a finished audit in one click.”

## Copy audit — landing page

Counts treat hyphenated terms, numbers, filenames, URLs, and product names as one word. Headings, controls, explanatory fragments, and visible receipt evidence are included because each can be encountered independently. Repeated navigation labels and raw file paths are omitted. No item exceeds 22 words or contains a banned marketing adjective. No unflagged item changes the established camera export / backup / receipt / demo terminology.

| Landing text | Words | Flag |
|---|---:|---|
| A receipt for your camera roll | 6 | F-6-6: metaphorical slogan |
| Check every photo before clearing space | 6 | — |
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | — |
| Try it with sample data | 5 | — |
| See a finished audit in one click. | 7 | — |
| Files stay on this device | 5 | — |
| Works without an account | 4 | — |
| Core audit and CSV are free | 6 | — |
| See which files match or need attention | 7 | — |
| The app compares each file’s contents, even when its name changed. | 11 | — |
| Audit your folders | 3 | — |
| SHA-256 match | 2 | F-6-5: unexplained jargon |
| No backup file | 3 | — |
| Same name, different hash | 4 | F-6-5: unexplained jargon |
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
| Install it where your archive lives | 6 | F-6-7: metaphorical heading |
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
| Buy Archive License | 3 | F-6-8: external destination is not identified |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| Sociobot/Dodo processes your payment. | 4 | — |
| Email support@sociobot.in with billing questions. | 5 | — |
| Check your backup before clearing your phone. | 7 | — |
| v0.1.2 · desktop app · files stay on your device | 8 | — |

## Copy audit — README

Code spans are counted by their rendered whitespace-separated words. Headings and standalone lead-ins are included. No README sentence exceeds 22 words, contains a banned marketing adjective, uses an inconsistent product term, or needs a rewrite.

| README text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo pair before clearing your phone. | 12 | — |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | — |
| The receipt separates verified, missing, changed, skipped, duplicate, extra, and unpaired files. | 12 | — |
| It lists any selected file this version cannot check. | 9 | — |
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
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | F-6-1, F-6-2, and F-6-3 make this statement false |
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

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The first-screen action opens `/demo` from `/`. |
| Product already in use | PASS | The first demo screen shows eight realistic rows: verified, missing, changed, duplicate, extra, and paired/unpaired Live Photo results. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remain visible. |
| Reset | PASS | Filtering to Missing showed one row; Reset restored **All 8** and all eight rows. |
| Real-storage isolation | PASS | In a fresh context with a sentinel real key and a delayed GitHub release request, demo wrote no local/session key and opened no IndexedDB database. The sentinel was unchanged. |
| Leave demo | PASS | **Start for real** reached empty `/audit`, removed all sample filenames, and retained the pre-existing real key unchanged. |
| Request privacy | PASS | Direct `/demo` requested only same-origin HTML, JS, and CSS. The landing page made only the disclosed GitHub Releases lookup in addition to same-origin assets; no analytics, ad, font, or photo-data request appeared. |
| Offline | PASS | After service-worker readiness, live `/demo` reloaded offline with its h1 and all eight rows. |

## Declared claims

A `--no-local` clone was created at `/tmp/photo-upload-audit-review6.0twZWw/repo`. After `npm ci`, every exact `test` command from `.factory/claims.json` ran separately. Each command selected exactly one tagged test and passed.

| Claim id | Exact command | Result |
|---|---|---|
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS, 1 test |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS, 1 test |
| `demo-to-real` | `npm test -- --grep @claim:demo-to-real` | PASS, 1 test |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, 1 test |
| `hash-compare` | `npm test -- --grep @claim:hash-compare` | PASS, 1 test |
| `all-files-reported` | `npm test -- --grep @claim:all-files-reported` | PASS, 1 test |
| `live-photo` | `npm test -- --grep @claim:live-photo` | PASS, 1 test |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS, 1 test |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS, 1 test |
| `read-only` | `npm test -- --grep @claim:read-only` | PASS, 1 test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 1 test |
| `license-private` | `npm test -- --grep @claim:license-private` | PASS, 1 test |
| `archive-license` | `npm test -- --grep @claim:archive-license` | PASS, 1 test |
| `receipt-removal` | `npm test -- --grep @claim:receipt-removal` | PASS, 1 test |
| `classifications` | `npm test -- --grep @claim:classifications` | PASS, 1 test |
| `no-analytics` | `npm test -- --grep @claim:no-analytics` | PASS, 1 test |
| `desktop-downloads` | `npm test -- --grep @claim:desktop-downloads` | PASS, 1 test |
| `desktop-release-formats` | `npm test -- --grep @claim:desktop-release-formats` | PASS, 1 test |
| `release-integrity-files` | `npm test -- --grep @claim:release-integrity-files` | PASS, 1 test |
| `unsigned-installers` | `npm test -- --grep @claim:unsigned-installers` | PASS, 1 test |
| `receipt-limit` | `npm test -- --grep @claim:receipt-limit` | PASS, 1 test |
| `checkout-health` | `npm test -- --grep @claim:checkout-health` | PASS, 1 test |
| `same-folder-safe` | `npm test -- --grep @claim:same-folder-safe` | PASS, 1 test |
| `scan-progress` | `npm test -- --grep @claim:scan-progress` | PASS, 1 test |
| `source-first` | `npm test -- --grep @claim:source-first` | PASS, 1 test |
| `one-to-one-match` | `npm test -- --grep @claim:one-to-one-match` | PASS, 1 test |

The clean-clone full suite also passed **45/45**. `npm run build:site` produced `dist/site/`; initial JavaScript is 37.71 kB raw / 13.31 kB gzip. No declared test failed. F-6-1, F-6-2, and F-6-3 are unlisted public claims.

## Earlier finding verification

Every earlier `review-*.md`, `polish-*.md`, and the existing handoff was read. Each earlier finding was checked against the live product and current source/tests.

| Earlier finding | Current verification |
|---|---|
| F-1-1 demo leakage | FIXED: live **Start for real** opens an empty audit; `resetDemoState()` clears all sample fields; the tagged transition test passes. |
| F-1-2 same-named folders | FIXED: source uses `isSameEntry()` for actual handles; the test accepts distinct handles both named `DCIM`. |
| F-1-3 HTTP-200 404 | FIXED: a new unknown live route returned HTTP 404 and the designed archive page. |
| F-1-4 release identity | FIXED: live footer/download, package, Tauri config, and service-worker cache use `0.1.2`; version assertions pass. |
| F-1-5 route social metadata | FIXED: every live route has its own title, description, canonical, OG title/description, and Twitter title. F-6-1 concerns the accuracy of one current description, not route reuse. |
| F-1-6 receipt removal | FIXED: the tagged test removes only the selected receipt and persists the result. |
| F-1-7 scan progress | FIXED: the delayed-stream test observes the current filename and increasing count. |
| F-1-8 source order | FIXED: “Source is always first” and the desktop/phone DOM order both pass. |
| F-1-9 refund claim | FIXED: refund wording remains absent; billing questions point to support. |
| F-1-10 release checksums | FIXED: the live release exposes `SHA256SUMS` and `latest.json`; a published `.deb` checksum passes. |
| F-1-11 hash/proof overclaim | FIXED: “Hashes prove file contents” is absent. F-6-5 is a narrower unresolved jargon issue in evidence labels. |
| F-1-12 contextless result heading | FIXED: the heading says “See which files match or need attention.” |
| F-1-13 abstract process heading | FIXED: the process is named “Compare two folders in three steps.” |
| F-1-14 false resolve action | FIXED: the action says “Review files that need attention.” |
| F-1-15 metaphorical privacy heading | FIXED: the h2 says “Your photo data stays on your device.” |
| F-1-16 unlimited receipt wording | FIXED: landing copy and the claim state the 25-receipt limit. |
| F-1-17 ambiguous license action | FIXED: the control says “Enter license token.” |
| F-1-18 unexplained README SHA-256 | FIXED: README introduces it as a content fingerprint and states the timestamp effect. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links OS-specific Tauri prerequisites. |
| F-1-20 SPA jargon | FIXED: README describes direct-route and true-404 behavior in plain words. |
| F-2-1 false uninstall assurance | FIXED: Privacy now warns that uninstalling may retain local data and gives the OS app-data next step. |
| F-2-2 “Watch each hash” | FIXED: the walkthrough says “Follow the file check.” |
| F-3-1 mobile targets/text | FIXED: live 390 px enumeration found no target below 44 px, no meaningful text below the tested baseline, and no overflow. |
| F-3-2 unlisted Reset behavior | FIXED: `demo-reset` is declared, uniquely tagged, and passes; live Reset restored eight rows. |
| F-4-1 unsupported capability assurances | FIXED: the old face-recognition and backup-replacement assertions are absent; Terms gives user advice instead. |
| F-4-2 release output set | FIXED: `desktop-release-formats` verifies current macOS, Windows, AppImage, Debian, and unsigned-release output. |
| F-5-1 silently skipped media | FIXED: all selected files remain in the receipt, TIFF is checked, unsupported PSD is shown as skipped, and no all-clear appears. |
| F-5-2 demo storage race | FIXED: a live delayed-release one-click flow recorded no storage write after demo entry; the release request is aborted and its cache is memory-only. |
| F-5-3 timestamp clause | FIXED: `hash-compare` uses equal bytes with deliberately different names and timestamps. |
| F-5-4 inconsistent Live Photo term | FIXED: public copy uses “Live Photo pair” or “partner”; “sidecar” is absent. |
| F-5-5 payment jargon | FIXED: public copy says Sociobot/Dodo processes payment and gives the billing contact. |
| F-5-6 “local-first” jargon | FIXED: the footer says “desktop app · files stay on your device.” |

No earlier finding is reopened.

## Structure, accessibility, links, and visual identity

- PASS: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200. A fresh unknown route returns 404 with “This page is missing from the archive.”
- PASS: every route has `lang="en"`, one `main`, one h1, a route-specific title under 60 characters, description, canonical, OG/Twitter metadata, SVG favicon, and 180 px Apple touch icon. The OG image is 1200 × 630.
- PASS: `robots.txt`, `sitemap.xml`, manifest, service worker, icons, and OG image return 200. The sitemap contains all six public routes.
- PASS: deep links render the correct state. Browser Back restores `/` and focuses its h1; the polite route announcer updates.
- PASS: all discovered internal routes, the current installer, release page, Sociobot site, and hosted checkout resolve. `mailto:` and in-page fragments are explicit exceptions. F-6-8 is disclosure, not a dead link.
- PASS: the shared header/footer, skip link, Privacy/Terms links, keyboard focus, 44 px phone targets, 200% reflow, and reduced-motion styles are present.
- PASS: Playwright axe found zero violations on all six routes and the 404 at 390 px. The worker URL verifier reported correct title/language/main/h1/alt/button coverage and zero console errors on all six normal routes. The 404 produced only the expected browser network error for its 404 document.
- PASS: the asymmetrical glass archive art, cyan verification channel, clipped receipt surfaces, and amber/coral status language match `.factory/design.md`. This is not a generic SaaS template.
- PASS: first-load JS is 13.31 kB gzip. No third-party font or script is loaded.

## Missed leverage

No additional AI, import, export, or sync feature is justified by the brief. The core result depends on deterministic byte comparison, so an AI classification step would reduce confidence rather than improve it. CSV export, local receipt history, desktop installers, and the sample audit cover the adjacent tasks. Sync would conflict with the stated device-only data boundary. F-6-3 identifies a useful local-data control, but it is a privacy/control repair rather than an AI or sync opportunity.

## What would make this perfect

1. Correct the `/audit` description and add regression coverage for its exact, qualified claim.
2. Add claim entries and tagged tests for saved-receipt contents and complete browser-data removal.
3. Give same-folder and empty-folder failures specific recovery instructions.
4. Replace the three flagged landing phrases with the proposed plain wording.
5. Identify the paid action as an external checkout.
6. Re-run the complete first-read, demo, claims, history, copy, route, link, accessibility, and privacy review. PASS requires no remaining finding.
