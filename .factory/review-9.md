# Adversarial first-read review 9 — Photo Upload Audit

Reviewed 29 August 2026 against <https://photo-upload-audit.sociobot.in>, repository commit `16fee31f1a92b535efc50a145f9f4d8bbd033974`, and public desktop release `v0.1.5`.

## Verdict

**FAIL.** The cold first screen, one-click demo, sandbox boundary, all 30 declared claim commands, the complete 57-test suite, routing, links, accessibility baseline, and every earlier repair verify. Three claim/copy findings remain. The product uses absolute “every file” language even though it intentionally skips unsupported files, and the declared tests do not prove either the checkout's $19 one-time price or that the scanner's exported digest is actually SHA-256. There are no blocking findings in this round, but PASS requires zero findings and no untested claim.

## Findings

### High

#### F-9-1 — Absolute “every file” copy contradicts the supported-media boundary

- **Exact quote/location:** Landing h1: “Check every photo before clearing space.” Landing receipt copy: “The app compares each file’s contents, even when its name changed.” `/audit` action: “Compare every file.” README lead: “Verify every original, video, and Live Photo pair before clearing your phone.”
- **Verified behavior:** The `/audit` description and `all-files-reported` claim correctly state that unsupported files are listed as skipped rather than content-checked. The live mixed-file behavior and test use a PSD as a concrete example. `src/lib/audit.ts` assigns unsupported files a `skipped` result without calculating or comparing a digest.
- **Why this misleads:** Before choosing folders, a visitor is told that every photo or file is compared and verified. The actual, safer contract is that every selected file is listed, while only supported media is compared. The later skipped state prevents a false all-clear, but it does not make the earlier absolute sentences true.
- **Concrete fix:** Use “Check which photos reached your backup” for the h1, “The app compares each supported file’s contents, even when its name changed” in the receipt section, “Create audit receipt” for the audit action, and “Check originals, videos, and Live Photo pairs before clearing your phone” in README. Add a copy regression that rejects unqualified `every`/`each` comparison claims.

#### F-9-2 — The $19 one-time checkout price is not tested at the payment destination

- **Exact quote/location:** Landing: “$19 one-time.” and “$19 one-time purchase.” README and `/terms`: “The optional Archive License costs $19 once.” `.factory/claims.json` claim `archive-license`: “The $19 one-time Archive License saves local receipts and prints certificates.”
- **Verified behavior:** The live hosted checkout currently shows “Photo Upload Audit”, “$19.00”, “Total $19.00”, and “One-time unlock”. However, `@claim:archive-license` only confirms that `$19` is printed on the product page, then tests saving and printing with a mocked cached license. `@claim:checkout-health` only confirms a 303 redirect to Dodo. Neither test checks the amount, product, or one-time billing mode at checkout.
- **Why this misleads:** A pricing mismatch at the actual payment step would leave every declared test green. The claims rules require quantitative claims to assert the stated number, not merely repeat it in local copy.
- **Concrete fix:** Extend the checkout claim to follow the hosted checkout or inspect a stable Sociobot checkout contract, then assert the product name, a $19.00 total, and one-time—not recurring—billing. Keep this separate from the mocked entitlement-feature test.

#### F-9-3 — The SHA-256 claim has no known-vector assertion

- **Exact quote/location:** README: “It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result.” `/audit` metadata: “Supported media is compared by SHA-256, and unchecked files stay visible.” `.factory/claims.json` claim `hash-compare`: “Matches files by SHA-256 content, even when a backup name or timestamp differs.”
- **Verified behavior:** `@claim:hash-compare` gives both folders equal bytes and asserts the UI label “SHA-256 match”. It never compares the produced digest with a standard SHA-256 value, and it never hashes unequal bytes in that tagged test. A deterministic non-SHA digest—or even a constant digest—could satisfy its current assertions. An independent live check in this review exported `abc` as `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`, so current behavior is correct but the declared regression test does not prove the claim.
- **Why this misleads:** SHA-256 is a specific, user-relevant integrity claim in a tool used before deleting originals. A test that checks only its own label cannot catch an implementation regression.
- **Concrete fix:** Add a known-vector assertion to `@claim:hash-compare`: scan a file containing `abc`, export the receipt, and require the exact standard digest above. Also assert that unequal contents with the same filename produce `changed`.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does, in my words:** It checks a phone camera export against a backup before I clear phone space.
- **For whom:** Phone owners checking originals, videos, and Live Photo pairs.
- **What I should click first:** **Try it with sample data**; the adjacent line says a finished audit appears in one click.
- **Result:** PASS. The headline, audience, primary action, outcome, and three facts are all visible before 844 px. The wording accuracy issue is F-9-1, not an inability to identify the product.

### 1440 × 900 desktop, before scrolling

- **What it does, in my words:** It compares a camera export with a backup and identifies missing or changed media.
- **For whom:** Phone owners preparing to clear space after making a copy.
- **What I should click first:** **Try it with sample data**.
- **Result:** PASS. The same decision information is visible without scrolling.

Exact first-screen copy used for both judgments:

> “Compare a camera export with its backup”
>
> “Check every photo before clearing space”
>
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”
>
> “Try it with sample data”
>
> “See a finished audit in one click.”

## Copy audit — landing page

Counts treat hyphenated terms, versions, filenames, paths, and email addresses as one word. Headings, controls, facts, loading text, and explanatory fragments are included because each can be encountered independently. Repeated navigation labels, raw sample filenames, counters, and table column names are data rather than sentences. No item exceeds 22 words or contains a banned marketing adjective.

| Landing text | Words | Flag |
|---|---:|---|
| Compare a camera export with its backup | 7 | — |
| Check every photo before clearing space | 6 | F-9-1: unqualified `every` |
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | — |
| Try it with sample data | 5 | — |
| See a finished audit in one click. | 7 | — |
| Files stay on this device | 5 | — |
| Works without an account | 4 | — |
| Core audit and CSV are free | 6 | — |
| The receipt | 2 | — |
| See which files match or need attention | 7 | — |
| The app compares each file’s contents, even when its name changed. | 11 | F-9-1: unsupported files are not compared |
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
| Folder comparison walkthrough | 3 | — |
| Compare two folders in three steps | 6 | — |
| Pick both folders | 3 | — |
| Source is always first. | 4 | — |
| Follow the file check | 4 | — |
| The current file and count stay visible. | 7 | — |
| Review files that need attention | 5 | — |
| Each row says what happened. | 5 | — |
| Desktop app | 2 | — |
| Download the desktop app | 4 | — |
| Desktop installers for v0.1.5 are unsigned. | 6 | — |
| Checking desktop releases… | 3 | — |
| Detected: Linux | 2 | — |
| Download for Linux | 3 | — |
| Photo.Upload.Audit_0.1.5_amd64.AppImage · v0.1.5 | 2 | — |
| View all releases (external site) | 5 | — |
| Privacy and backup limits | 4 | — |
| Your photo data stays on your device | 7 | — |
| The app reads the folders you choose. | 7 | — |
| It never moves, edits, or deletes media. | 7 | — |
| No photo index or filename is sent to us. | 9 | — |
| License checks send only the license token. | 7 | — |
| It checks two folders. | 4 | — |
| Keep your existing backup and complete a restore test. | 9 | — |
| Archive License | 2 | — |
| Keep up to 25 audit receipts | 6 | — |
| $19 one-time. | 2 | F-9-2: checkout amount and billing mode untested |
| Save up to 25 local audit receipts and print verification certificates. | 11 | — |
| Scanning and CSV export stay free. | 6 | — |
| $19 one-time purchase | 3 | F-9-2: checkout amount and billing mode untested |
| Buy Archive License (external checkout) | 5 | — |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| License token | 2 | — |
| Verify license | 2 | — |
| Sociobot/Dodo processes your payment. | 4 | — |
| Email support@sociobot.in with billing questions. | 5 | — |
| Check your backup before clearing your phone. | 7 | — |
| v0.1.5 · build 1c7b93b45924 · desktop app · files stay on your device | 10 | — |

The `/audit` button **Compare every file** is additionally flagged by F-9-1. It is outside the requested landing/README sentence inventory but repeats the same unsupported absolute.

## Copy audit — README

| README text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo pair before clearing your phone. | 12 | F-9-1: unsupported selected files are listed, not verified |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | F-9-1: `each` is unqualified; F-9-3: algorithm untested |
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
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | F-9-2/F-9-3: listed tests do not prove the full claims |
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
| The optional Archive License costs $19 once. | 7 | F-9-2: checkout amount and billing mode untested |
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

Terminology is otherwise consistent: **camera export** is the source, **backup** is the destination being checked, **receipt** is the result, **Live Photo pair** is the paired media unit, **skipped** marks an unchecked file, **Archive License** is the paid entitlement, and **demo** is the isolated sample.

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The first-screen action opens `/demo` directly from `/`. |
| Product already in use | PASS | The first demo screen contains eight realistic result rows: four verified, one missing, one changed, one duplicate, and one extra. |
| Persistent demo controls | PASS | “Demo — sample data, nothing is saved”, **Reset demo**, and **Start for real** remain present throughout demo mode. |
| Reset | PASS | Missing reduced the receipt to one row; Reset restored `All 8`, its pressed state, and all eight rows. |
| Real-storage isolation | PASS | With a pre-existing real sentinel and a delayed landing release lookup, the one-click flow made zero localStorage/sessionStorage writes in demo and opened no IndexedDB database. The sentinel remained unchanged. |
| Start for real | PASS | The sample banner and rows disappeared, `/audit` opened with empty folder selection, and real receipt storage remained unchanged. |
| Request privacy | PASS | Direct `/demo` and `?demo=1` loaded only same-origin HTML, JavaScript, and CSS. A real local scan/export made no off-origin request. The landing page separately performs its disclosed GitHub release lookup. |
| Offline | PASS | After service-worker readiness, `/demo` reloaded offline with its heading and all eight rows. |
| Fallback folder identity | PASS | Selecting the same live folder through both browser inputs produced “Folder identity could not be verified”, no all-clear, and no save or print action. |

## Declared claims

A clean `--no-local` clone was created at `/tmp/photo-upload-audit-review9-clean.bMORIL/repo`. After `npm ci`, `node scripts/run-claims.mjs` executed every exact `test` command from `.factory/claims.json` separately. Each command selected one tagged test and exited successfully.

| Claim id | Result |
|---|---|
| `demo-sandbox` | PASS |
| `demo-reset` | PASS |
| `demo-to-real` | PASS |
| `local-only` | PASS |
| `hash-compare` | PASS, but does not prove SHA-256; F-9-3 |
| `all-files-reported` | PASS |
| `audit-supported-media` | PASS |
| `live-photo` | PASS |
| `csv-export` | PASS |
| `no-account` | PASS |
| `read-only` | PASS |
| `offline-reload` | PASS |
| `license-private` | PASS |
| `archive-license` | PASS, but does not verify the checkout price or billing mode; F-9-2 |
| `receipt-metadata-only` | PASS |
| `browser-data-removal` | PASS |
| `receipt-removal` | PASS |
| `classifications` | PASS |
| `no-analytics` | PASS |
| `desktop-downloads` | PASS |
| `desktop-release-formats` | PASS |
| `release-integrity-files` | PASS |
| `unsigned-installers` | PASS |
| `receipt-limit` | PASS |
| `checkout-health` | PASS, but only checks the hosted redirect; F-9-2 |
| `same-folder-safe` | PASS |
| `scan-progress` | PASS |
| `source-first` | PASS |
| `one-to-one-match` | PASS |
| `desktop-build-identity` | PASS |

Summary: **30/30 exact commands passed**. The clean-clone full suite passed **57/57**. `npm run build` passed and produced `dist/site/`; initial JavaScript is 41.02 kB raw / 13.99 kB gzip. No declared command failed, but F-9-2 and F-9-3 leave parts of declared claims untested. F-9-1 is unqualified live/README claim copy not represented by the qualified claims contract.

The current live checkout was independently opened and showed the correct product, one-time wording, and $19.00 total. A live known-vector scan also exported the correct SHA-256 for `abc`. These checks establish current behavior; they do not replace the missing tagged regressions.

## Earlier finding verification

Every `review-1.md` through `review-8.md`, `polish-1.md` through `polish-8.md`, and the prior handoff was read. The deployed HTML, JavaScript, and CSS hash-identically to the clean build. Each historical finding was rechecked in live behavior and current code/tests.

| Earlier finding | Round-9 verification |
|---|---|
| F-1-1 demo state leakage | FIXED: Start for real clears sample state and opens empty folder selection; `demo-to-real` passes. |
| F-1-2 same-folder identity | FIXED: handles use `isSameEntry`; browser fallback results remain explicitly unverified and cannot certify. |
| F-1-3 HTTP-200 404 | FIXED: a fresh unknown path returns HTTP 404 with the designed recovery page. |
| F-1-4 release identity | FIXED: site, v0.1.5 manifest, release target, and packaged Debian provenance name build `1c7b93b459243…`. |
| F-1-5 route social metadata | FIXED: each route has its own title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-6 receipt removal | FIXED: selective removal persists after reload. |
| F-1-7 scan progress | FIXED: current file and count remain visible in the delayed-file test. |
| F-1-8 source order | FIXED: source precedes backup at desktop and 390 px. |
| F-1-9 refund assertion | FIXED: refund wording is absent; billing questions use the support address. |
| F-1-10 release integrity | FIXED: `SHA256SUMS`, `latest.json`, and a published installer checksum verify. |
| F-1-11 hash/proof overclaim | FIXED: the old “Hashes prove file contents” wording is absent. F-9-3 concerns test coverage for the remaining named algorithm. |
| F-1-12 contextless receipt heading | FIXED: “See which files match or need attention.” |
| F-1-13 abstract walkthrough heading | FIXED: “Compare two folders in three steps.” |
| F-1-14 false resolve action | FIXED: the walkthrough asks users to review files. |
| F-1-15 privacy metaphor | FIXED: the h2 directly states that photo data stays on the device. |
| F-1-16 unlimited receipt wording | FIXED: copy and enforcement use the 25-receipt limit. |
| F-1-17 ambiguous license action | FIXED: “Enter license token.” |
| F-1-18 unexplained README SHA-256 | FIXED for wording: README introduces a content fingerprint. F-9-3 is a new test-coverage gap. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links the OS prerequisites. |
| F-1-20 SPA jargon | FIXED: README describes direct links and real 404 responses in plain language. |
| F-2-1 uninstall-data assurance | FIXED: Privacy warns that uninstalling may retain data and states the next check. |
| F-2-2 “Watch each hash” | FIXED: “Follow the file check.” |
| F-3-1 mobile targets/text | FIXED: all seven live routes have no sub-44 px target or overflow; computed-copy tests pass. |
| F-3-2 unlisted Reset behavior | FIXED: Reset is declared, tested, and restored all eight live rows. |
| F-4-1 unsupported replacement assurance | FIXED: the assurance is absent; Terms gives user advice. |
| F-4-2 release output set | FIXED: current release contains every stated desktop format. |
| F-5-1 silently skipped media | FIXED: unsupported entries remain visible and block an all-clear. F-9-1 concerns contradictory pre-scan absolutes. |
| F-5-2 demo storage race | FIXED: delayed one-click entry made no demo storage write. |
| F-5-3 timestamp clause | FIXED: equal bytes with different names and timestamps match. |
| F-5-4 Live Photo terminology | FIXED: public copy consistently uses “Live Photo pair.” |
| F-5-5 payment jargon | FIXED: copy says Sociobot/Dodo processes payment and gives a billing contact. |
| F-5-6 “local-first” jargon | FIXED: footer says files stay on the device. |
| F-6-1 Audit metadata overclaim | FIXED: metadata qualifies supported media and exposes unchecked files. |
| F-6-2 saved-receipt contents | FIXED: persisted receipts are recursively checked for media objects and bytes. |
| F-6-3 browser-data removal | FIXED: the confirmed control removes license, verdict, and receipts. |
| F-6-4 wrong error recovery | FIXED: same-folder and empty-folder errors give different corrective actions. |
| F-6-5 preview hash jargon | FIXED: preview labels describe file contents. |
| F-6-6 metaphorical first-screen eyebrow | FIXED: it names the camera-export comparison. |
| F-6-7 desktop-section metaphor | FIXED: “Download the desktop app.” |
| F-6-8 undisclosed checkout | FIXED: the action visibly says “external checkout.” |
| F-7-1 fallback same-folder all-clear | FIXED: the live fallback shows an unverified warning and withholds all-clear, save, and print controls. |
| F-7-2 stale desktop package | FIXED: v0.1.5 package provenance matches its manifest and source release. |
| F-8-1 generic “Inside the app” label | FIXED: live copy says “Folder comparison walkthrough.” |
| F-8-2 mood-led “Clear boundaries” label | FIXED: live copy says “Privacy and backup limits.” |

No earlier finding is reopened.

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200. A fresh unknown route returns 404.
- Every route has `lang="en"`, one `main`, one h1, a route-specific title, description, canonical, Open Graph/Twitter metadata, SVG favicon, Apple touch icon, and product-specific 1200 × 630 Open Graph image.
- Heading levels are ordered. Header, skip link, four-item navigation, footer, Privacy, Terms, build ID, and product one-liner are consistent.
- Deep links render the correct screen. Link navigation and browser Back move focus to the destination h1 and update the polite route announcer.
- Every discovered live route, installer, release page, checkout, Param Factory link, and README link resolves. `mailto:` and `#main` are explicit non-HTTP exceptions. The checkout resolves to the hosted Dodo page.
- Live Playwright axe found zero serious or critical violations on all routes. The worker URL verifier found no console error, missing alt text, or unlabelled button on home or demo. At 390 px there is no horizontal overflow and no visible target below 44 × 44 px.
- CSP, frame restrictions, referrer policy, permissions policy, and content-type protection are response headers. No third-party font or script loads. Reduced motion disables the scan beam and transitions.
- The asymmetrical glass archives, cyan verification channel, clipped receipt surfaces, and amber/coral exceptions implement `.factory/design.md`. The site is visually distinct rather than a generic SaaS template.
- Initial JavaScript is 13.99 kB gzip, below the static-product limit.

## Missed leverage

No separate AI, import/export, or sync finding is warranted. The core task depends on deterministic local byte comparison, so AI would reduce rather than improve confidence. Folder import is the core workflow, CSV export and local receipt history already cover portability, and remote sync would conflict with the device-only boundary. No provider key or decorative AI feature is present.

## What would make this perfect

1. Qualify or replace every absolute comparison/verification sentence so it matches the supported-media and skipped-file behavior.
2. Make the hosted checkout's product, $19 total, and one-time billing mode part of a declared automated claim test.
3. Add a standard SHA-256 vector and unequal-content assertion to the tagged hash claim.
4. Re-run the full cold-read, demo, claims, history, copy, route, link, accessibility, privacy, and release-provenance review. PASS requires no remaining finding.
