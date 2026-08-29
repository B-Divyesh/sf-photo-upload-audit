# Polish round 9 — cumulative finding closure

Release candidate: `350adcc5108c0d0be22d82c2b64edddf7c71429e` / `v0.1.6`.

This round rechecked every finding in reviews 1–9 rather than accepting an earlier
"fixed" label. The evidence directory named below is generated after deployment:
`.factory/evidence/polish-9-live/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo exit clears the receipt, picks, handles, filters, notes, and progress before `/audit`; `?demo=1` starts the isolated sample. | `@claim:demo-to-real`; `demo-to-real-390.png`; live `/?demo=1` → `/audit`. |
| F-1-2 | Directory handles use `isSameEntry()`; distinct folders named `DCIM` are allowed, while unverified browser inputs cannot certify an all-clear. | `@claim:same-folder-safe`; `audit-390.png`. |
| F-1-3 | Known routes are explicit documents and the designed 404 uses the Static Web Apps 404 response override. | pre-render route test; `not-found-390.png`; live unknown-path HTTP 404. |
| F-1-4 | Package, Cargo, Tauri, cache, footer, manifest, release tag, and installer provenance use `v0.1.6` / its tagged source. | `scripts/assert-version.mjs`; `@claim:desktop-build-identity`; `home-390.png`. |
| F-1-5 | Prerendering writes unique title, description, canonical, Open Graph, and Twitter metadata for all routes. | pre-render route test; `home-390.png`, `demo-390.png`, `audit-390.png`, `history-390.png`, `privacy-390.png`, `terms-390.png`. |
| F-1-6 | Saved-receipt removal remains selective and survives reload. | `@claim:receipt-removal`; `history-390.png`. |
| F-1-7 | Scan progress shows a current filename and completed/total count. | `@claim:scan-progress`; phone progress regression. |
| F-1-8 | Source stays first in copy, DOM order, desktop layout, and stacked phone layout. | `@claim:source-first`; `audit-390.png`. |
| F-1-9 | Unsupported refund language remains removed; Terms gives the billing support address. | terms/plain-copy regression; `terms-390.png`. |
| F-1-10 | Published `SHA256SUMS` and `latest.json` are checked against an installer. | `@claim:release-integrity-files`; v0.1.6 release check. |
| F-1-11 | Plain copy describes a file-content comparison rather than a hash proof. | copy audit; `home-390.png`. |
| F-1-12 | Receipt heading names matching files and files needing attention. | first-screen/copy tests; `home-390.png`. |
| F-1-13 | Walkthrough heading names the two-folder comparison. | section-label test; `home-390.png`. |
| F-1-14 | Workflow asks the user to review exceptions, not resolve files the app cannot repair. | plain-preview copy test; `home-390.png`. |
| F-1-15 | Privacy heading states the on-device boundary directly. | `@claim:local-only`; `privacy-390.png`. |
| F-1-16 | Paid copy states and enforces the 25-receipt limit. | `@claim:receipt-limit`; `home-390.png`. |
| F-1-17 | The license control is labelled “Enter license token.” | `@claim:archive-license`; `home-390.png`. |
| F-1-18 | README explains SHA-256 as a file-content fingerprint. | `@claim:hash-compare`; README copy audit. |
| F-1-19 | README names Rust and links the operating-system Tauri prerequisites. | full suite link coverage; README. |
| F-1-20 | README explains direct links and real 404 behavior without fallback jargon. | pre-render route test; `not-found-390.png`. |
| F-2-1 | Privacy warns that uninstalling may retain desktop data and says to check the OS app-data location. | privacy uninstall regression; `privacy-390.png`. |
| F-2-2 | Progress wording is “Follow the file check,” not hash jargon. | plain-language regression; `home-390.png`. |
| F-3-1 | All visible phone controls are at least 44 px; meaningful copy is at least 16 px; 200% text does not overflow. | mobile target, text-size, and reflow tests; all live route screenshots. |
| F-3-2 | Reset demo is declared and restores All plus all eight sample rows. | `@claim:demo-reset`; `demo-reset-390.png`. |
| F-4-1 / reopened F-4-1 | The product does not claim to replace a backup; Terms instructs users to retain a backup and test a restore. | Terms/public-copy regression; `terms-390.png`. |
| F-4-2 | The release workflow and claim cover unsigned macOS, Windows, AppImage, and Debian installers. | `@claim:desktop-release-formats`; v0.1.6 release. |
| F-5-1 | All selected entries are listed; unsupported entries are `skipped` and block all-clear status. | `@claim:all-files-reported`; `audit-390.png`. |
| F-5-2 | Demo has no real storage writes and stops release lookup before sample mode. | `@claim:demo-sandbox`; `demo-query-390.png`. |
| F-5-3 | Equal bytes match despite renamed files and changed timestamps. | strengthened `@claim:hash-compare`; CSV vector evidence. |
| F-5-4 | Public wording consistently uses “Live Photo pair.” | `@claim:live-photo`; copy audit; `demo-390.png`. |
| F-5-5 | Payment copy names Sociobot/Dodo and supplies the billing contact. | `@claim:checkout-health`; `terms-390.png`. |
| F-5-6 | Footer uses the plain description “desktop app · files stay on your device.” | `@claim:local-only`; live route screenshots. |
| F-6-1 | Audit metadata and UI say supported media is compared and unchecked files remain visible. | `@claim:audit-supported-media`; `audit-390.png`. |
| F-6-2 | Receipt persistence recursively rejects files, blobs, bytes, data URLs, and object URLs. | `@claim:receipt-metadata-only`; `history-390.png`. |
| F-6-3 | Privacy has a confirmed control clearing license, verdict, and receipts. | `@claim:browser-data-removal`; `privacy-390.png`. |
| F-6-4 | Same-folder and empty-folder errors state distinct causes and the next action. | folder-error regression; `audit-390.png`. |
| F-6-5 | Preview labels describe visible results, not hash jargon. | plain-preview copy regression; `home-390.png`. |
| F-6-6 | First-screen eyebrow says “Compare a camera export with its backup.” | first-screen regression; `home-390.png`. |
| F-6-7 | Desktop section heading says “Download the desktop app.” | `@claim:desktop-downloads`; `home-390.png`. |
| F-6-8 | The purchase control says “external checkout” and has external-link semantics. | landing checkout regression; `home-390.png`. |
| F-7-1 | Browser fallback receipts explicitly mark folder identity unverified and withhold all-clear/certificate actions. | `@claim:same-folder-safe`; `audit-390.png`. |
| F-7-2 | Installers embed `build-provenance.json`; `latest.json`, tag, and download panel agree on source commit. Tagged-source builds keep that identity. | `@claim:desktop-build-identity`; stale-release regression; v0.1.6 release. |
| F-8-1 | Generic “Inside the app” was replaced by “Folder comparison walkthrough.” | section-label regression; `home-390.png`. |
| F-8-2 | Mood label “Clear boundaries” was replaced by “Privacy and backup limits.” | section-label regression; `home-390.png`. |
| F-9-1 | H1 now says “Check which photos reached your backup”; receipt copy says “each supported file”; README and audit action avoid unsupported absolute comparison promises. | `public comparison copy qualifies the supported-media boundary`; `home-390.png`; `audit-390.png`. |
| F-9-2 | Checkout claim now follows the Dodo page and asserts Photo Upload Audit, `Total $19.00`, and “One-time unlock.” | `@claim:checkout-health`; live hosted checkout check. |
| F-9-3 | SHA-256 claim now exports the `abc` known vector (`ba7816…15ad`) and asserts unequal same-name media is changed. | `@claim:hash-compare`; exported CSV assertion. |

## Verification record

- Fresh-clone claim run, full suite, release, deployment, live cold-route sweep, and Lighthouse results are recorded in `.factory/handoff.md` after their completion.
- There are no deferred findings or TODOs in this round.
