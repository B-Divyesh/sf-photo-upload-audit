# Adversarial first-read review 4 — Photo Upload Audit

Reviewed 28 August 2026 against `https://photo-upload-audit.sociobot.in` and the clean checked-out repository at `761f3359f5d285bf1257f3f979ec794112d4d4a8`.

## Verdict

**FAIL.** The first-read, sample audit, demo isolation, all declared claims, route behavior, links, accessibility baseline, and prior repairs verify. Two public factual statements still have no matching declared claim and sandbox test. This review requires zero findings for PASS.

## Findings

### Minor

#### F-4-1 — The landing makes two unsupported capability assurances

- **Quote/location:** Landing, **Clear boundaries**: “It does not upload photos, recognise faces, or replace your backup tool.”
- **Why this fails:** `local-only` covers the no-upload part. No `claims.json` entry or tagged test covers “recognise faces” or “replace your backup tool.” A first-time visitor can reasonably treat those as capability and safety assurances, but the claims gate cannot detect a regression or a future feature that contradicts them.
- **Concrete fix:** Remove the two untestable clauses, for example: “It checks two folders. Keep your existing backup and complete a restore test.” Alternatively add separate claims with observable tests; do not retain an absence-of-feature promise that cannot be tested.

#### F-4-2 — README promises a release output set without claim coverage

- **Quote/location:** README, **Desktop app**: “It builds unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` files.”
- **Why this fails:** `unsigned-installers` verifies only the landing’s versioned unsigned wording. `release-integrity-files` verifies `SHA256SUMS`, `latest.json`, and one published checksum. Neither declared claim asserts that the published desktop release contains each named installer format. The release workflow is a factual promise to prospective desktop users and contributors, not merely a code comment.
- **Concrete fix:** Add `desktop-release-formats` to `claims.json` and a tagged test that reads the latest published release and asserts a `.dmg`, Windows `.msi` or `.exe`, `.AppImage`, and `.deb` asset, with the stated unsigned status where applicable. Or narrow the README to the formats that its declared tests verify.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** It checks whether a phone’s photos, videos, and Live Photo pairs reached a backup before the owner clears space.
- **For whom:** Phone owners preparing to remove media after copying it elsewhere.
- **First click:** **Try it with sample data**; “See a finished audit in one click.” says what follows.
- **Result:** PASS. The headline, audience, action, expected result, and all three facts were visible on the first screen.

### 1440 × 900 desktop, before scrolling

- **What it does:** It compares a camera export with a backup and reports files needing attention.
- **For whom:** Phone owners who need proof before clearing media.
- **First click:** **Try it with sample data**.
- **Result:** PASS. The same decision information appeared without scrolling.

Exact first-screen copy:

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
| One-click entry | PASS | The hero action opened `/demo` directly. |
| Product already in use | PASS | The first demo screen showed the eight-row receipt, including verified, missing, changed, duplicate, extra, and Live Photo states. |
| Persistent banner | PASS | “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remained visible. |
| Reset | PASS | Filtering to Missing produced one row; **Reset demo** restored the All filter and all eight rows. |
| Real-data isolation | PASS | A direct fresh `/demo` used no local-storage keys; a preloaded real receipt/license is protected by `@claim:demo-to-real`, and Start for real reached an empty `/audit` without sample rows. |
| Offline | PASS | After service-worker readiness, a fresh `/demo` reloaded offline with its h1 and eight sample rows. Network interception recorded no off-origin request in that offline flow. |

## Declared claims

After `npm ci`, every exact command listed in `.factory/claims.json` completed separately and passed. Every claim tag occurs exactly once in `tests/`. The full suite also passed: **42/42** (`test-results/.last-run.json` is `passed`). `npm run build:site` produced `dist/site/` with 12.99 kB gzip initial JavaScript.

| Claim ids with passing exact commands |
|---|
| `demo-sandbox`, `demo-reset`, `demo-to-real`, `local-only`, `hash-compare`, `live-photo` |
| `csv-export`, `no-account`, `read-only`, `offline-reload`, `license-private`, `archive-license` |
| `receipt-removal`, `classifications`, `no-analytics`, `desktop-downloads`, `release-integrity-files`, `unsigned-installers` |
| `receipt-limit`, `checkout-health`, `same-folder-safe`, `scan-progress`, `source-first`, `one-to-one-match` |

The declared sandbox checks exercise request interception for local-only/privacy, offline reload, demo reset and exit, CSV download, local receipt isolation, folder identity, and the hosted checkout. No declared claim failed or was left untested. F-4-1 and F-4-2 are unlisted public claims.

## History verification

I read every `review-*.md`, `polish-*.md`, the current handoff, the demo contract, and the design/brief. Each earlier finding was rechecked in live behavior and source/tests rather than accepted from a fixed label.

| Earlier finding | Current verification |
|---|---|
| F-1-1 demo leakage | FIXED: live Start for real removes the sample and `@claim:demo-to-real` covers Back/Forward and real receipt storage. |
| F-1-2 same-named folders | FIXED: handle identity uses `isSameEntry()`; `@claim:same-folder-safe` accepts distinct `DCIM` handles. |
| F-1-3 HTTP-200 not-found | FIXED: live `/does-not-exist` returned HTTP 404 and the styled archive page. |
| F-1-4 release identity | FIXED: live copy, footer, package, Tauri configuration, and service-worker cache use `0.1.2`. |
| F-1-5 social metadata | FIXED: live routes expose route-specific title, description, canonical, Open Graph, and Twitter values. |
| F-1-6 receipt removal | FIXED: `@claim:receipt-removal` persists the selected removal after reload. |
| F-1-7 scan progress | FIXED: `@claim:scan-progress` observes a filename and increasing count while hashing. |
| F-1-8 source ordering | FIXED: the copy says “Source is always first” and `@claim:source-first` covers desktop and 390 px. |
| F-1-9 refund assertion | FIXED: the assertion is absent; Terms offers billing support. |
| F-1-10 release checksums | FIXED: `@claim:release-integrity-files` verifies both named artifacts and a published checksum. |
| F-1-11 through F-1-17 landing-copy issues | FIXED: the old hash/proof, abstract-heading, false-action, quota, and ambiguous-control wording is absent. |
| F-1-18 through F-1-20 README-copy issues | FIXED: README explains the fingerprint, links Tauri prerequisites, and describes direct links/404 behavior plainly. |
| F-2-1 uninstall-data assurance | FIXED: Privacy warns that uninstalling can retain local data and gives the OS app-data next step. |
| F-2-2 “Watch each hash” jargon | FIXED: the walkthrough says “Follow the file check.” |
| F-3-1 mobile target/text defect | FIXED: the exhaustive 390 px geometry and meaningful-copy tests pass. |
| F-3-2 unlisted Reset promise | FIXED: `demo-reset` is declared and tested. |

## Structure, accessibility, links, and product fit

- PASS: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` returned 200; an unknown path returned 404.
- PASS: every route has `lang="en"`, one `main`, one h1, a route title in the prescribed pattern, description, canonical, Open Graph/Twitter metadata, favicon, and Apple touch icon.
- PASS: deep links render their route. Browser Back restores h1 focus; the route announcer is present. Header/footer, skip link, Privacy, and Terms are consistent.
- PASS: every discovered internal link, installer, GitHub release, checkout, and Param Factory link resolved (200 after redirects; the checkout is the expected hosted redirect). `mailto:` and skip fragments are explicit exceptions.
- PASS: the local 42-test sweep found no serious or critical axe violation and no ordinary-route console error. The 390 px and 200%-text checks passed.
- PASS: the asymmetric glass archive artwork, cyan verification plane, clipped surfaces, and coral/amber exceptions match `.factory/design.md`; the result is distinct from a generic SaaS template.
- PASS: no AI feature is implied by the brief. Exact local byte comparison, CSV export, receipt history, desktop installers, and the sample audit cover the useful adjacent work; adding AI or sync would weaken the local-first proof boundary.

## Copy audit

Counts treat hyphenated terms, numbers, paths, and names as one word. Standalone headings/actions are included because they can be encountered independently. Raw sample filenames, scan metadata, and table values are data rather than sentences. No audited item exceeds 22 words, uses a banned marketing adjective, changes the camera export/backup/receipt/demo terminology, or exposes a non-result-naming action. The claim-coverage flags are F-4-1 and F-4-2.

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
| It does not upload photos, recognise faces, or replace your backup tool. | 12 | F-4-1 |
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
| Start for real clears it before opening folder selection. | 8 | — |
| Reset it with Reset demo. | 5 | — |
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
| It builds unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` files. | 11 | F-4-2 |
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

## What would make this perfect

1. Remove or separately declare and test the two unobservable capability assurances in F-4-1.
2. Declare and test the complete desktop installer-format assertion, or narrow the README as described in F-4-2.
3. Repeat this cold, demo, sandbox, claim, history, metadata, link, accessibility, and copy sweep. PASS requires no findings.
