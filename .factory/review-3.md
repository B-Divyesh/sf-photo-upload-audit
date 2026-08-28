# Adversarial first-read review 3 — Photo Upload Audit

Reviewed 28 August 2026 against `https://photo-upload-audit.sociobot.in` and clean commit `73aaddd78b14709221fdd9c94bb032aa6d8b152a`.

## Verdict

**FAIL.** The first read, core demo flow, all 23 declared claim commands, routing, metadata, links, offline reload, and serious/critical axe checks pass. Two findings remain. One is blocking because a mobile accessibility defect recorded in the earlier verification history was marked fixed but is still present. The README also makes a testable Reset promise that has no claim entry or tagged test. PASS requires zero findings and no untested claim.

## Findings

### Blocking

#### F-3-1 — The earlier mobile target and text-size defect is still present

- **Quote/location:** 390 px live pages. Header **Demo** is `39.9 × 44 px`; **Audit** is `35.3 × 44 px`. Landing **Audit your folders** is `182.3 × 19 px`. Footer **Privacy**, **Terms**, and **Built by Param Factory** are only `24.8 px` high. The hero result explanation is `14.72 px`; receipt notes and walkthrough explanations are `14.4 px`; mobile nav text is `13.44 px`.
- **History:** `.factory/verification.md` recorded this combined target/text defect. Review 1 later called the mobile defects fixed based on general 390 px and reflow tests, but the current live measurements and `src/styles.css` confirm that the target and font-size parts were not fixed. The current test checks only folder-picker geometry, not all interactive elements or meaningful text.
- **Why this fails:** Narrow or short targets are easier to miss on a phone, and the meaningful explanatory copy falls below `.factory/design.md`'s 16 px minimum. Axe reports no serious/critical violation because it does not enforce this product contract. Under the history rule, a previously marked-fixed defect that remains is blocking.
- **Concrete fix:** Give every phone link and button a target of at least `44 × 44 px`, including header, inline, legal-page, and footer links. Raise meaningful labels and explanatory copy to at least `16 px`; decorative metadata can be separately documented if intentionally smaller. Add a 390 px test that enumerates every visible interactive target and fails when either dimension is below 44 px, plus a computed-font-size test for meaningful copy.

### High

#### F-3-2 — “Reset demo” is a public but unlisted functional claim

- **Quote/location:** README: “Reset it with **Reset demo**.” The persistent `/demo` banner also exposes **Reset demo**.
- **Observed:** Reset works live: after filtering to the one missing row, it restored the All filter and all eight rows. However, `.factory/claims.json` has no reset claim, and `rg` finds no test that clicks **Reset demo**. `@claim:demo-sandbox` only checks the initial seeded receipt.
- **Why this fails:** The README makes a testable promise about recovering the sample state, but the claims gate cannot catch a reset regression. Manual success in this review does not satisfy the requirement that every public claim have one tagged sandbox test.
- **Concrete fix:** Add a `demo-reset` claim and one `@claim:demo-reset` test. The test should enter `/demo`, select Missing, confirm one row, click **Reset demo**, then confirm the All filter and all eight original rows. Alternatively, extend the declared `demo-sandbox` claim and its sole tagged test to state and verify reset behavior explicitly.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** It checks whether photos, videos, and Live Photo pairs reached a backup.
- **For whom:** Phone owners who want to verify a copy before clearing space.
- **First action:** **Try it with sample data**. The adjacent sentence says a finished audit appears in one click.
- **Result:** PASS. The headline, audience sentence, action, result explanation, and all three facts are visible without scrolling.

### 1440 × 900 desktop, before scrolling

- **What it does:** It compares a phone photo export with a backup and identifies files needing attention.
- **For whom:** Phone owners preparing to clear space.
- **First action:** **Try it with sample data**.
- **Result:** PASS. The same information is visible before scrolling.

Exact first-screen text used for both judgments:

> “Prove every photo reached your backup”  
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”  
> “Try it with sample data”  
> “See a finished audit in one click.”

## Copy audit

Counts treat hyphenated terms, product names, numbers, filenames, and route names as one word. Headings, actions, and explanatory fragments are included because they must make sense independently. Raw receipt column labels and sample filenames are data, not sentences. No item exceeds 22 words, uses a banned marketing adjective, changes an established product term, or uses a non-result-naming button. F-3-2 is the only claim-coverage flag.

### Landing page

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
| It does not upload photos, recognise faces, or replace your backup tool. | 12 | — |
| Keep up to 25 audit receipts | 6 | — |
| $19 one-time. | 2 | — |
| Save up to 25 local audit receipts and print verification certificates. | 11 | — |
| Scanning and CSV export stay free. | 6 | — |
| Buy Archive License | 3 | — |
| Review saved receipts | 3 | — |
| Enter license token | 3 | — |
| Sociobot/Dodo is the merchant of record. | 6 | — |
| Verify every file before you clear your phone. | 8 | — |
| local-first desktop app | 3 | — |

### README

| Text | Words | Flag |
|---|---:|---|
| Photo Upload Audit | 3 | — |
| Verify every original, video, and Live Photo sidecar before clearing your phone. | 12 | — |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | — |
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 17 | — |
| The receipt separates verified, missing, changed, duplicate, extra, and unpaired files. | 11 | — |
| When a browser provides folder identity, it refuses the same folder twice; it never guesses from a shared folder name. | 20 | — |
| Each backup file is assigned to only one source original. | 10 | — |
| The scanner is read-only. | 4 | — |
| Media contents, names, hashes, and reports stay on your device. | 10 | — |
| Core scanning and CSV export work without an account or license. | 11 | — |
| Try the sample | 3 | — |
| Open `/demo` or `?demo=1` to see a finished audit in one click. | 12 | — |
| The sample stays in memory and never touches real folders. | 10 | — |
| **Start for real** clears it before opening folder selection. | 9 | — |
| Reset it with **Reset demo**. | 5 | F-3-2: unlisted functional claim |
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
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | F-3-2: false until Reset is listed |
| The demo contract is in `.factory/demo.md`. | 6 | — |
| Desktop app | 2 | — |
| The desktop shell uses Tauri 2. | 6 | — |
| Start it in development with: | 5 | — |
| Tags matching `v*` run the release workflow. | 7 | — |
| It builds unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` files. | 11 | — |
| It also attaches `SHA256SUMS` and `latest.json` to the GitHub release; the integrity claim checks those files and one published checksum. | 20 | — |
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

Terminology remains consistent: files copied from a phone are the **camera export**, the checked copy is the **backup**, the comparison output is a **receipt**, and the seeded isolated experience is the **demo**.

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The first-screen action opens `/demo`. `/?demo=1` is also covered by the declared transition test. |
| Product already in use | PASS | The first demo screen shows eight realistic results across verified, missing, changed, duplicate, extra, and Live Photo states. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remain visible. |
| Reset behavior | PASS live, UNLISTED claim | Missing reduced the table to one row; Reset restored All and eight rows. See F-3-2 for missing claim coverage. |
| Real-storage isolation | PASS | Preloaded `audit:receipts` and license keys were byte-for-byte unchanged throughout demo use and reset. |
| Leave demo | PASS | **Start for real** reached `/audit`, removed the banner and sample names, displayed empty folder controls, and left real receipt storage unchanged. |
| Network privacy | PASS | No off-origin request occurred during the isolated demo flow. |
| Offline | PASS | A fresh live context registered `sw.js`; after network disable, `/demo` reloaded with the sample receipt. |

## Declared claims

The repository was cloned with `--no-local` into `/tmp/photo-upload-audit-review3.8lpZmc/repo`. `npm ci` completed with zero reported vulnerabilities. Every exact `test` command from `.factory/claims.json` was then run separately at clean commit `73aaddd`; every command passed one matching tagged test. A tag count confirmed exactly one `@claim:<id>` occurrence for each entry.

| Claim id | Exact command | Result |
|---|---|---|
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS, 1 test |
| `demo-to-real` | `npm test -- --grep @claim:demo-to-real` | PASS, 1 test |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, 1 test |
| `hash-compare` | `npm test -- --grep @claim:hash-compare` | PASS, 1 test |
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
| `release-integrity-files` | `npm test -- --grep @claim:release-integrity-files` | PASS, 1 test |
| `unsigned-installers` | `npm test -- --grep @claim:unsigned-installers` | PASS, 1 test |
| `receipt-limit` | `npm test -- --grep @claim:receipt-limit` | PASS, 1 test |
| `checkout-health` | `npm test -- --grep @claim:checkout-health` | PASS, 1 test |
| `same-folder-safe` | `npm test -- --grep @claim:same-folder-safe` | PASS, 1 test |
| `scan-progress` | `npm test -- --grep @claim:scan-progress` | PASS, 1 test |
| `source-first` | `npm test -- --grep @claim:source-first` | PASS, 1 test |
| `one-to-one-match` | `npm test -- --grep @claim:one-to-one-match` | PASS, 1 test |

The full clean suite also passed, **38/38**, and produced `dist/site/` with 36.34 kB raw / 12.98 kB gzip initial JavaScript. Claim-like landing and README copy maps to these entries except the Reset promise in F-3-2. No declared claim failed.

## History verification

I read `review-1.md`, `polish-1.md`, `review-2.md`, `polish-2.md`, the current handoff, and both earlier verification reports. Each numbered review finding was checked against the live site and code/tests.

| Earlier finding | Current verification |
|---|---|
| F-1-1 demo leakage | FIXED: live Start for real cleared sample state; `resetDemoState()` clears receipt, folders, filter, progress, errors, notes, and handles. |
| F-1-2 same-named folders | FIXED: `isSameEntry()` is used for actual handles; the claim accepts distinct handles both named `DCIM`. |
| F-1-3 HTTP-200 not-found | FIXED: a random live path returned 404 and the designed archive page. |
| F-1-4 release identity | FIXED: live copy, footer, package, Tauri config, and service-worker cache all say `0.1.2`. |
| F-1-5 route social metadata | FIXED: every route has its own title, description, canonical, Open Graph title/description, and Twitter title. |
| F-1-6 receipt removal | FIXED: the exact tagged persistence test passed. |
| F-1-7 scan progress | FIXED: the delayed-stream claim test observed filename and increasing count. |
| F-1-8 source order | FIXED: the live copy says “Source is always first”; desktop and 390 px order tests passed. |
| F-1-9 refund assertion | FIXED: the assertion remains absent; Terms directs billing questions to support. |
| F-1-10 release integrity | FIXED: the latest release exposes both named files and the tagged test verified a published checksum. |
| F-1-11 hash jargon/overclaim | FIXED: replaced with the plain content-comparison sentence. |
| F-1-12 contextless receipt heading | FIXED: “See which files match or need attention.” |
| F-1-13 abstract walkthrough heading | FIXED: “Compare two folders in three steps.” |
| F-1-14 false “Resolve” action | FIXED: “Review files that need attention.” |
| F-1-15 privacy metaphor | FIXED: “Your photo data stays on your device.” |
| F-1-16 unlimited “every audit” wording | FIXED: copy states the 25-receipt limit. |
| F-1-17 ambiguous license action | FIXED: “Enter license token.” |
| F-1-18 README SHA-256 jargon | FIXED: README explains it as a content fingerprint and explains the timestamp consequence. |
| F-1-19 vague desktop prerequisites | FIXED: README names Rust and links the operating-system prerequisites. |
| F-1-20 SPA jargon | FIXED: README states the direct-link and real-404 outcomes plainly. |
| F-2-1 false uninstall assurance | FIXED: live Privacy warns that uninstalling may retain app data and gives the next check. |
| F-2-2 “Watch each hash” jargon | FIXED: live copy and source use “Follow the file check.” |

The earlier verification's mobile target/text-size defect is not fixed despite the later review history saying mobile defects were fixed; it is reopened as blocking F-3-1. The separate 200% horizontal-overflow defect is fixed: `/` and `/audit` remain within 390 px at a 32 px root size.

## Structure, accessibility, and link crawl

- PASS: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200. A random unknown path returns 404 with “This page is missing from the archive.”
- PASS: Each route has `lang="en"`, one `main`, one h1, a route-specific title, description, canonical, Open Graph data, Twitter title, favicon, and 180 px Apple touch icon. The Open Graph image is a real 1200 × 630 product image.
- PASS: `robots.txt` and `sitemap.xml` return 200; the sitemap lists all six real routes.
- PASS: All crawled internal links, the detected Linux installer, GitHub release, checkout, and Param Factory destination resolve. `mailto:` and in-page skip links are explicit exceptions.
- PASS: Route navigation and browser Back focus the destination h1. Deep links load the right screen. Header/footer content is consistent.
- PASS: Live axe found no serious or critical violation on all six routes; normal routes produced no console or page error. F-3-1 remains because axe does not enforce the stated target/font dimensions.
- PASS: The dark asymmetrical glass archive, cyan verification plane, clipped receipt surfaces, and amber/coral exception language match `.factory/design.md`. This is not a generic centered SaaS hero or three-card template.
- PASS: The first-load JavaScript is 12.98 kB gzip, below the stated budget.

## Missed leverage

No finding. The brief implies deterministic local comparison, Live Photo pairing, a portable report, and optional receipt history. CSV export, local saved receipts, a desktop build, and the isolated sample cover those needs. Sync would weaken the local-first boundary, and an AI step would add uncertainty to a job that depends on exact byte comparison. No provider key or decorative AI feature is present.

## What would make this perfect

1. Bring every mobile interactive target and meaningful text up to the documented 44 px and 16 px minimums, then add exhaustive computed-geometry regression coverage.
2. Register and test the public Reset demo promise in `.factory/claims.json`.
3. Re-run the complete cold, demo, claims, history, structure, link, accessibility, and copy review. PASS requires no remaining finding.
