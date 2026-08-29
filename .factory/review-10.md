# Adversarial first-read review 10 — Photo Upload Audit

Reviewed 29 August 2026 against production at <https://photo-upload-audit.sociobot.in> and clean clone `15d7a17b8f2f2f22a7ca55176e33cfd193f5cf42`.

## Verdict

**PASS.** There are no findings, including no blocking or minor findings. Every declared claim was run from a clean clone, every claim-like public statement was mapped to a declared claim or is an instruction/label, and the live product passed the first-read, demo, privacy, route, link, and offline checks.

## Cold first read

### 390 × 844 phone, before scrolling

- **What it does:** Checks a camera export against its backup and identifies files that did or did not reach it.
- **For whom:** Phone owners clearing space after copying originals, videos, and Live Photo pairs.
- **First action:** Select **Try it with sample data** to see a complete audit immediately.

All three answers are supplied in the first viewport by the eyebrow, H1, audience sentence, primary action, and its adjacent outcome sentence. The three factual lines are also visible. The first-read gate passes.

### 1440 × 900 desktop, before scrolling

The same information is visible without scrolling. The result preview, original archive artwork, and source/backup framing make the product-specific comparison clear without relying on decorative copy.

## Copy audit

Word counts treat hyphenated terms, names, numbers, and paths as one word. Commands, file names, and URLs are recorded as labels rather than prose sentences. No sentence exceeds 22 words. No item uses a banned marketing adjective, unexplained metaphor, inconsistent product term, or a non-result-naming action.

### Landing sentences

| Text | Words | Result |
|---|---:|---|
| For phone owners who need to verify originals, videos, and Live Photo pairs before clearing space. | 16 | Maps to `hash-compare` / `live-photo` / `all-files-reported`. |
| See a finished audit in one click. | 7 | Maps to `demo-sandbox`. |
| Files stay on this device. | 5 | Maps to `local-only`. |
| Works without an account. | 4 | Maps to `no-account`. |
| Core audit and CSV are free. | 6 | Maps to `no-account` / `csv-export`. |
| The app compares each supported file’s contents, even when its name changed. | 12 | Maps to `hash-compare` and correctly qualifies supported files. |
| Select the folder copied from your phone. | 7 | Plain workflow instruction. |
| Select the disk or server folder that should contain it. | 10 | Plain workflow instruction. |
| Review missing, changed, duplicate, extra, and unpaired files. | 8 | Maps to `classifications` / `live-photo`. |
| Source is always first. | 4 | Maps to `source-first`. |
| The current file and count stay visible. | 7 | Maps to `scan-progress`. |
| Each row says what happened. | 5 | Verified by the visible receipt and classifications test. |
| Desktop installers for v0.1.6 are unsigned. | 6 | Maps to `unsigned-installers`. |
| The app reads the folders you choose. | 7 | Maps to `read-only`. |
| It never moves, edits, or deletes media. | 7 | Maps to `read-only`. |
| No photo index or filename is sent to us. | 9 | Maps to `local-only`. |
| License checks send only the license token. | 7 | Maps to `license-private`. |
| It checks two folders. | 4 | Accurate scope statement. |
| Keep your existing backup and complete a restore test. | 9 | Safe user advice, not a capability claim. |
| Save up to 25 local audit receipts and print verification certificates. | 11 | Maps to `receipt-limit` / `archive-license`. |
| Scanning and CSV export stay free. | 6 | Maps to `no-account` / `csv-export`. |
| $19 one-time. | 2 | Maps to `checkout-health`. |
| Sociobot/Dodo processes your payment. | 4 | Maps to `checkout-health`. |
| Email support@sociobot.in with billing questions. | 5 | Contact instruction. |
| Check your backup before clearing your phone. | 7 | Accurate product summary. |

The remaining landing copy is section naming, state data, or controls: **Compare a camera export with its backup**, **Check which photos reached your backup**, **The receipt**, **How it works**, **Folder comparison walkthrough**, **Download the desktop app**, **Privacy and backup limits**, and **Archive License** all name their content. **Detected: Linux**, the rendered installer filename/version, **$19 one-time purchase**, and the version/build footer are current state data, not promises. The result actions are **Try it with sample data**, **Audit your folders**, **Download for Linux**, **Buy Archive License**, **Review saved receipts**, **Enter license token**, and **Verify license**; each names the result or the immediate next step.

### README sentences

| Text | Words | Result |
|---|---:|---|
| Check originals, videos, and Live Photo pairs before clearing your phone. | 11 | Accurate summary; `live-photo` covers paired media. |
| Photo Upload Audit is for iPhone and Android owners who copy camera exports to a disk or server. | 18 | Audience/scope statement. |
| It compares a SHA-256 fingerprint of each supported file’s contents, so changed timestamps do not affect the result. | 19 | `hash-compare`; supported-media qualification is present. |
| The receipt separates verified, missing, changed, skipped, duplicate, extra, and unpaired files. | 12 | `classifications`, `all-files-reported`, `live-photo`. |
| It lists any selected file this version cannot check. | 9 | `all-files-reported`. |
| Browsers that verify folder identity reject the same folder and accept different folders with the same name. | 17 | `same-folder-safe`. |
| Browser folder inputs still scan. | 5 | `same-folder-safe`. |
| They never issue an all-clear because they cannot prove the folders differ. | 12 | `same-folder-safe`. |
| Each backup file is assigned to only one source original. | 10 | `one-to-one-match`. |
| The scanner is read-only. | 4 | `read-only`. |
| Media contents, names, hashes, and reports stay on your device. | 10 | `local-only`. |
| Core scanning and CSV export work without an account or license. | 11 | `no-account` / `csv-export`. |
| Open `/demo` or `?demo=1` to see a finished audit in one click. | 12 | `demo-sandbox`. |
| The sample stays in memory and never touches real folders. | 10 | `demo-sandbox`. |
| Start for real clears it before opening folder selection. | 9 | `demo-to-real`. |
| Reset it with Reset demo. | 5 | `demo-reset`. |
| The installed web app and sample audit work offline after the first visit. | 13 | `offline-reload`. |
| Requirements: Node.js 20 or newer. | 5 | Clear development instruction. |
| Desktop development also needs Rust stable and the Tauri prerequisites for your operating system. | 14 | Clear development instruction. |
| Open `http://localhost:5173`. | 3 | Local-run instruction. |
| Use `/audit` for real folders or `/demo` for sample data. | 10 | Clear local-run instruction. |
| `npm test` builds the static site and runs the Chromium claim, route, mobile, and accessibility tests. | 16 | Verified by the clean full-suite run. |
| The exact deployment command is `npm run build:site`. | 9 | Build instruction. |
| Its output is `dist/site/`, with `dist/site/index.html` at the deploy root. | 11 | Build instruction. |
| Run one product claim with its ID. | 7 | Test instruction. |
| All public claims and their sandboxes are listed in `.factory/claims.json`. | 10 | Confirmed against all 30 entries. |
| The demo contract is in `.factory/demo.md`. | 7 | Documentation pointer. |
| The desktop shell uses Tauri 2. | 6 | Implementation fact. |
| Start it in development with `npm run tauri dev`. | 7 | Development instruction. |
| Tags matching `v*` run the release workflow. | 7 | Release-process fact. |
| Published releases include unsigned `.dmg`, `.msi` or `.exe`, `.AppImage`, and `.deb` installers. | 12 | `desktop-release-formats`. |
| Each release also attaches `SHA256SUMS` and `latest.json`. | 7 | `release-integrity-files`. |
| The manifest names the release source commit. | 7 | `desktop-build-identity`. |
| Claims check formats, notice, checksum, and Debian package build identity. | 10 | Confirmed by the declared commands. |
| The optional Archive License costs $19 once. | 7 | `checkout-health`. |
| It saves up to 25 audit receipts on the device and adds printable certificates. | 14 | `receipt-limit` / `archive-license`. |
| Use `/history` to review or remove saved receipts. | 8 | `receipt-removal`. |
| Scanning and CSV export stay free. | 6 | `no-account` / `csv-export`. |
| Checkout and license verification use the Sociobot billing API; photo data is never included in those requests. | 17 | `license-private` / `local-only`. |
| Deploy `dist/site/` as a static site. | 6 | Deployment instruction. |
| `staticwebapp.config.json` keeps direct route links working, serves unknown paths as real 404 responses, and sets cache and security headers. | 16 | Verified live and by route tests. |
| Do not deploy or change DNS from this repository. | 9 | Scope instruction. |
| Licensed under the MIT License. | 5 | Repository fact. |

No unlisted public claim remains. README headings, code snippets, and links are instructions or navigation rather than capability promises.

## Demo, sandbox, and privacy

- Direct production `/demo` and `/?demo=1` each opened an eight-row, realistic finished receipt with **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real**.
- Selecting **missing 1** reduced the receipt to one row; **Reset demo** restored **All 8** and all eight rows.
- **Start for real** opened `/audit`, removed the sample row and banner, and left both browser storage areas empty.
- Production demo request log contained only the site document, JS, and CSS; no off-origin request was made. The demo made no `localStorage` or `sessionStorage` write.
- After one live `/demo` visit, setting the browser context offline and reloading still showed the demo H1, banner, and eight rows under service-worker control.
- The normal landing page's GitHub request is solely for the optional desktop-release panel; it contains no photo data. It is not made in demo mode. The media/privacy claims correctly concern the audited media and are verified by request interception.

## Claims and clean-clone verification

Fresh clone: `/tmp/photo-upload-audit-review-10-clean` at `15d7a17b8f2f2f22a7ca55176e33cfd193f5cf42`.

- `npm ci` completed with zero vulnerabilities.
- `node scripts/run-claims.mjs /tmp/photo-upload-audit-review-10-clean-claims-rerun` ran every exact command in `.factory/claims.json`: **30/30 passed**. This covers the demo boundary/reset/exit, privacy request logs, content comparison including the SHA-256 known vector, offline reload, CSV, classifications, receipt privacy/removal, billing, release integrity, source ordering, and one-to-one matching.
- `npm test` passed **58/58** in the clean clone. It built `dist/site/`; initial JavaScript was **13.98 kB gzip** and CSS **5.49 kB gzip**.

## Earlier finding verification

Every earlier review and polish document was read. The following table records a live and source/test recheck rather than accepting an earlier "fixed" marker.

| Earlier finding(s) | Recheck result |
|---|---|
| F-1-1 | Live demo exit removed the sample before folder selection; `demo-to-real` passed. |
| F-1-2 | `isSameEntry()` handles verified folders; fallback receipts state identity is unverified; `same-folder-safe` passed. |
| F-1-3 | A random unknown production route returned the designed page with HTTP 404. |
| F-1-4 | Live footer, package, release, and installer provenance identify v0.1.6 / build `350adcc…`; release claims passed. |
| F-1-5 | Every tested route had its own title, description, canonical, OG, and Twitter metadata. |
| F-1-6 | `receipt-removal` passed after reload. |
| F-1-7 | `scan-progress` observed a current file and count. |
| F-1-8 | `source-first` passed at desktop and 390 px. |
| F-1-9 | Unsupported refund language remains absent; Terms has the billing contact. |
| F-1-10 | `release-integrity-files` verified both named files and an asset checksum. |
| F-1-11 | The removed hash/proof overclaim is absent; content comparison wording is plain. |
| F-1-12 | The receipt heading names matching and attention-needed files. |
| F-1-13 | The workflow heading names the two-folder comparison. |
| F-1-14 | The workflow asks the visitor to review, not falsely resolve, exceptions. |
| F-1-15 | Privacy uses the direct on-device boundary heading. |
| F-1-16 | The tested 25-receipt limit is visible in paid copy. |
| F-1-17 | The license action is **Enter license token**. |
| F-1-18 | README introduces SHA-256 as a content fingerprint; its known vector is tested. |
| F-1-19 | README names Rust and links Tauri prerequisites. |
| F-1-20 | README explains direct routes and true 404s without fallback jargon. |
| F-2-1 | Privacy accurately warns that uninstalling may retain local app data. |
| F-2-2 | The prior hash jargon is replaced with **Follow the file check**. |
| F-3-1 | Route tests confirm 44 px phone targets, 16 px meaningful copy, and no 390 px overflow. |
| F-3-2 | `demo-reset` is declared and restores all eight rows. |
| F-4-1 | Backup-replacement and face-recognition assurances remain absent; safe backup advice remains. |
| F-4-2 | `desktop-release-formats` validates the stated published release set. |
| F-5-1 | Unsupported selected files remain visible and block an all-clear. |
| F-5-2 | Demo blocks release lookup and writes no real storage. |
| F-5-3 | Renamed/equal-byte and timestamp-different files match in `hash-compare`. |
| F-5-4 | Public copy consistently says **Live Photo pair**. |
| F-5-5 | Payment copy names Sociobot/Dodo and provides support contact. |
| F-5-6 | Footer uses the plain on-device description. |
| F-6-1 | Audit metadata and UI say supported media is compared and unchecked files remain visible. |
| F-6-2 | `receipt-metadata-only` rejects files, blobs, bytes, and data/object URLs. |
| F-6-3 | Confirmed privacy control clears license, verdict, and receipts. |
| F-6-4 | Empty-folder and same-folder errors give distinct recoveries. |
| F-6-5 | Receipt preview labels describe file results, not hashes. |
| F-6-6 | First-screen eyebrow names the camera-export/backup task. |
| F-6-7 | Desktop section says **Download the desktop app**. |
| F-6-8 | Purchase control visibly identifies the external checkout. |
| F-7-1 | Fallback inputs retain the unverified warning and cannot certify an all-clear. |
| F-7-2 | Published installer provenance, tag, manifest, and source commit agree. |
| F-8-1 | **Folder comparison walkthrough** replaced the generic prior label. |
| F-8-2 | **Privacy and backup limits** replaced the mood-led prior label. |
| F-9-1 | Public comparison language consistently qualifies supported files. |
| F-9-2 | `checkout-health` reaches the hosted page and verifies Photo Upload Audit, $19.00, and one-time purchase. |
| F-9-3 | `hash-compare` exports and asserts the SHA-256 `abc` known vector. |

## Structure, accessibility, links, and product fit

- Production `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` returned HTTP 200. An unknown route returned HTTP 404. Each had one H1, one main landmark, `lang=en`, route-specific metadata, skip link, consistent header/footer, and Privacy/Terms links.
- Back navigation from Demo restored home and focus to the new H1 in the route test. No console errors were observed in the fresh home, demo, or offline passes.
- The route suite reported no serious or critical axe violations. Phone controls and readable copy passed the geometry tests.
- Crawled internal links and displayed external destination links resolved. The AppImage download, release page, checkout endpoint, and factory site each returned HTTP 200; mail links are explicit `mailto:` links.
- CSP, `X-Content-Type-Options`, and `Referrer-Policy` are served as headers. The 404 configuration is a real `responseOverrides` 404, not a hash-route imitation.
- The implementation matches the brief without decorative AI: a local file comparison needs neither a remote model nor a fake AI feature. CSV export, receipt history, desktop installers, and offline sample are present. The dark glass archive visual language is distinct and follows `.factory/design.md`; it is not a generic SaaS hero.

## What would make this perfect

No further change is required for the reviewed scope. Maintain the same checks when changing the release lookup, demo storage boundary, supported-media list, or billing destination, because those are the areas where a regression would alter a visitor-facing promise.
