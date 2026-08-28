# Adversarial first-read review 2 — Photo Upload Audit

Reviewed 28 August 2026 against `https://photo-upload-audit.sociobot.in` and checked-out commit `cdee1b0c0ce2535f6abccf938d0985b8dd6be314`.

## Verdict

**FAIL.** The core first-read, demo, claims, routing, accessibility, and prior-repair checks pass. Two findings remain: the Privacy page makes an untested, platform-dependent data-deletion assurance, and the landing page retains one unexplained technical heading. A PASS requires zero findings.

## Findings

### High

#### F-2-1 — Privacy page promises desktop-data removal that is neither tested nor reliable across installers

- **Quote/location:** `/privacy`, “Removing the desktop app removes its local data.”
- **Why this fails:** This is a privacy assurance a person can rely on before uninstalling. It has no entry in `.factory/claims.json` and no tagged test. The Tauri configuration supplies no platform-specific uninstall/data-removal behavior; in particular, moving a macOS app from Applications to Trash normally does not remove its Library/Application Support data. The statement can therefore cause a visitor to leave local receipts or a stored license behind when they expected deletion.
- **Concrete fix:** Remove the absolute statement until it is true and tested for every shipped installer. Replace it with: “Uninstalling may leave local app data behind. Check your operating system’s app-data location before sharing the computer.” If a product-controlled removal flow is added, document the exact locations and add an `@claim:desktop-data-removal` test for each installer/platform.

### Minor

#### F-2-2 — “Watch each hash” is unexplained jargon in the landing walkthrough

- **Quote/location:** landing-page walkthrough heading, “Watch each hash.”
- **Why this fails:** A first-time phone owner can understand “file” and “check,” but cannot be expected to know a hash. The adjacent sentence only describes visible progress, so the technical noun adds no useful instruction. It conflicts with the plain-words requirement to avoid jargon on first read.
- **Concrete fix:** Replace the heading with “Follow the file check.” Keep “The current file and count stay visible.” The README may retain “SHA-256 fingerprint” because it explains the term in the preceding plain-language context.

## Cold first read

### 390 × 844, before scrolling

- **What it does:** It checks that photos, videos, and Live Photo pairs from a phone reached a backup.
- **For whom:** Phone owners who want evidence before deleting files to make space.
- **First action:** **Try it with sample data**; the adjacent copy says a finished audit appears in one click.
- **Result:** PASS. The action was visible from `527–576 px`; all three plain facts also appeared in the initial viewport.

Exact text used:

> “Prove every photo reached your backup”
>
> “For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space.”
>
> “Try it with sample data”
>
> “See a finished audit in one click.”

### 1440 × 900 desktop, before scrolling

- **What it does:** It compares a camera export with a backup and identifies files needing attention.
- **For whom:** Phone owners preparing to clear space.
- **First action:** **Try it with sample data**.
- **Result:** PASS. The same headline, audience, action, outcome, and facts were visible without scrolling.

## Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | PASS | The hero action opened `/demo` directly. |
| First demo screen | PASS | The first view had the populated sample receipt (eight table rows) and the headline “Find every gap in a photo backup.” |
| Realistic sample | PASS | It exposes a missing file, changed file, duplicate, complete Live Photo, and extra backup item. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remained visible. |
| Reset | PASS | Selecting Missing then **Reset demo** restored the complete eight-row receipt. |
| Storage isolation | PASS | A pre-existing `audit:receipts` value and license token were unchanged while the demo banner was shown. Demo made no license/API request. |
| Leave demo | PASS | **Start for real** removed the banner and sample rows, then showed “Compare two photo folders”; its license check resumed only after leaving demo mode. |
| Offline/privacy exercise | PASS | The declared offline and local-only claim tests use a fresh context, service worker/offline reload, and request interception; both passed. |

## Declared claims

From the clean checked-out worktree, `npm ci` completed with zero reported vulnerabilities. I then ran every exact `test` command specified by `.factory/claims.json`; all 23 commands passed. `npm test` also passed (36 Playwright tests), and `npm run build:site` produced `dist/site/`.

| Claim id | Result |
|---|---|
| `demo-sandbox` | PASS |
| `demo-to-real` | PASS |
| `local-only` | PASS |
| `hash-compare` | PASS |
| `live-photo` | PASS |
| `csv-export` | PASS |
| `no-account` | PASS |
| `read-only` | PASS |
| `offline-reload` | PASS |
| `license-private` | PASS |
| `archive-license` | PASS |
| `receipt-removal` | PASS |
| `classifications` | PASS |
| `no-analytics` | PASS |
| `desktop-downloads` | PASS |
| `release-integrity-files` | PASS |
| `unsigned-installers` | PASS |
| `receipt-limit` | PASS |
| `checkout-health` | PASS |
| `same-folder-safe` | PASS |
| `scan-progress` | PASS |
| `source-first` | PASS |
| `one-to-one-match` | PASS |

The live checkout endpoint also returned HTTP 303 to a `checkout.dodopayments.com` hosted checkout. All landing and README product promises map to a declared claim except F-2-1, which is on the live Privacy page and is an unlisted privacy claim.

## History verification

Read in full: `review-1.md`, `polish-1.md`, both verification reports, and the handoff. Each earlier finding was rechecked against live behavior and source/tests rather than accepted from its “fixed” label.

| Earlier finding | Current check |
|---|---|
| F-1-1 demo leakage | FIXED — `resetDemoState()` clears sample state before `/audit`; live transition reached empty folder selection. |
| F-1-2 same-named folders | FIXED — source uses `FileSystemDirectoryHandle.isSameEntry()` only when handles exist; tagged test accepts distinct `DCIM` handles. |
| F-1-3 HTTP-200 not-found | FIXED — live unknown route returned HTTP 404 and the designed archive page. |
| F-1-4 release identity | FIXED — live footer, package, Tauri config, installer wording, and service-worker version use `0.1.2`; tagged version test passed. |
| F-1-5 social metadata | FIXED — live routes expose their own title, description, canonical, Open Graph, and Twitter title. |
| F-1-6 receipt removal | FIXED — `receipt-removal` claim passed after reload. |
| F-1-7 scan progress | FIXED — `scan-progress` claim passed with delayed input. |
| F-1-8 source ordering | FIXED — copy says “Source is always first”; desktop/mobile claim passed. |
| F-1-9 refund assertion | FIXED — refund assertion is absent; terms provide billing support. |
| F-1-10 release checksums | FIXED — published `SHA256SUMS` and `latest.json` are tested by the declared claim. |
| F-1-11 through F-1-17 landing plain-words repairs | FIXED except the new F-2-2 jargon issue; the prior exact phrases are absent and the new headings/actions are contextual. |
| F-1-18 through F-1-20 README plain-words repairs | FIXED — README explains the fingerprint, links Tauri prerequisites, and explains direct-link/404 behavior plainly. |

The broader earlier verification defects are also fixed in source and passing tests: one-to-one destination accounting, indexed comparison, demo isolation, visible picker focus, receipt history, offline asset caching, mobile/reflow coverage, checkout health, and current desktop release artifacts.

## Structure, interaction, and visual review

- PASS: `/`, `/demo`, `/audit`, `/history`, `/privacy`, `/terms` returned 200. `/does-not-exist` returned 404 with “This page is missing from the archive.”
- PASS: Every checked route has `lang="en"`, exactly one `main`, exactly one h1, route-specific title/description/canonical/OG/Twitter tags, favicon and Apple touch icon. No normal-route console or page errors occurred.
- PASS: Titles use the required route pattern; `/demo` is “Demo — Photo Upload Audit” and legal routes are “Privacy/Terms — Photo Upload Audit.”
- PASS: Deep links loaded the matching page; the existing route test confirms back navigation restores focus to the destination h1. Header, skip link, footer Privacy/Terms links, and build identity are consistent.
- PASS: A crawl of 19 page links found no dead navigational/download links. The `#main` fragment on the 404 document was treated as an in-page skip link, not a destination URL.
- PASS: The asymmetric dark glass archives, cyan verification channel, clipped receipt surfaces, and amber/coral exceptions implement the documented luminous-landscape identity. The mobile page is not a generic centered-hero/card template.
- PASS: There is no AI feature, provider key, or AI marketing claim. Deterministic local comparison does not imply an AI-assisted step; CSV export, saved receipts, installers, and the sample demo cover the implied practical actions.

## Copy audit

Counts treat hyphenated terms, product names, numbers, and route labels as one word. The landing table includes headings, standalone actions, and explanatory fragments because a screen reader can encounter them independently. Read-only visual labels such as `SCAN 07/14` and file-name rows are not sentences.

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
| See which files match or need attention | 8 | — |
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
| Watch each hash | 3 | F-2-2 jargon |
| The current file and count stay visible. | 7 | — |
| Review files that need attention | 5 | — |
| Each row says what happened. | 5 | — |
| Install it where your archive lives | 6 | — |
| Desktop installers for v0.1.2 are unsigned. | 6 | — |
| Checking desktop releases… | 3 | — |
| View all releases | 3 | — |
| Your photo data stays on your device | 8 | — |
| The app reads the folders you choose. | 7 | — |
| It never moves, edits, or deletes media. | 7 | — |
| No photo index or filename is sent to us. | 9 | — |
| License checks send only the license token. | 7 | — |
| It does not upload photos, recognise faces, or replace your backup tool. | 12 | — |
| Keep up to 25 audit receipts | 7 | — |
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
| It compares a SHA-256 fingerprint of each file’s contents, so changed timestamps do not affect the result. | 16 | — |
| The receipt separates verified, missing, changed, duplicate, extra, and unpaired files. | 11 | — |
| When a browser provides folder identity, it refuses the same folder twice; it never guesses from a shared folder name. | 19 | — |
| Each backup file is assigned to only one source original. | 10 | — |
| The scanner is read-only. | 4 | — |
| Media contents, names, hashes, and reports stay on your device. | 10 | — |
| Core scanning and CSV export work without an account or license. | 11 | — |
| Try the sample | 3 | — |
| Open `/demo` or `?demo=1` to see a finished audit in one click. | 12 | — |
| The sample stays in memory and never touches real folders. | 10 | — |
| **Start for real** clears it before opening folder selection. | 8 | — |
| Reset it with **Reset demo**. | 5 | — |
| The installed web app and sample audit work offline after the first visit. | 13 | — |
| Run locally | 2 | — |
| Requirements: Node.js 20 or newer. | 5 | — |
| Desktop development also needs Rust stable and the Tauri prerequisites for your operating system. | 15 | — |
| Open `http://localhost:5173`. | 4 | — |
| Use `/audit` for real folders or `/demo` for sample data. | 10 | — |
| Test and build | 3 | — |
| `npm test` builds the static site and runs the Chromium claim, route, mobile, and accessibility tests. | 16 | — |
| The exact deployment command is `npm run build:site`. | 9 | — |
| Its output is `dist/site/`, with `dist/site/index.html` at the deploy root. | 10 | — |
| Run one product claim with its ID: | 7 | — |
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | — |
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
| `staticwebapp.config.json` keeps direct route links working, serves unknown paths as real 404 responses, and sets cache and security headers. | 18 | — |
| Do not deploy or change DNS from this repository. | 9 | — |
| Project notes | 2 | — |
| Visual system and generated-art provenance: `.factory/design.md` | 6 | — |
| Product scope: `.factory/brief.json` | 3 | — |
| Handoff and verification: `.factory/handoff.md` | 4 | — |
| Privacy: `/privacy` | 2 | — |
| Terms: `/terms` | 2 | — |
| Licensed under the MIT License. | 5 | — |

No audited landing or README item exceeds 22 words, uses a banned marketing adjective, or has an inconsistent product term. The one jargon finding is F-2-2.

## What would make this perfect

1. Correct the desktop-uninstall privacy statement and either remove it or prove the precise behavior for each installer.
2. Rename “Watch each hash” to a plain-language progress heading.
3. Re-run this full cold, claim, sandbox, history, structure, link, and copy review. A PASS then requires no findings at all.
