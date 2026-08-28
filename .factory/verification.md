# Independent product verification — Photo Upload Audit

## Verdict

**FAIL — do not release candidate `323425da1673e60e7234d851531639ee923d07ef`.**

Verified independently on 28 August 2026 against:

- Candidate: `323425da1673e60e7234d851531639ee923d07ef`
- Live URL: `https://photo-upload-audit.sociobot.in`
- Release: `v0.1.0`
- Browser: Chromium 140 via Playwright 1.58.2

The deployed web files exactly match the candidate build. The failure is caused by product correctness, demo isolation, keyboard access, offline durability, and a dead paid checkout—not by a stale web deployment.

## Mandatory first gates

### Claims

`.factory/claims.json` exists with 10 entries and exactly one matching test tag per entry. On the untouched clone, invoking the commands before dependency installation produced `tsc: not found`, as expected for a clean Node checkout. After the documented clean install (`npm ci`), every exact command passed:

| Claim | Exact command result |
|---|---|
| `demo-sandbox` | PASS, 1 test |
| `local-only` | PASS, 1 test |
| `hash-compare` | PASS, 1 test |
| `live-photo` | PASS, 1 test |
| `csv-export` | PASS, 1 test |
| `no-account` | PASS, 1 test |
| `read-only` | PASS, 1 test |
| `offline-reload` | PASS, 1 test |
| `license-private` | PASS, 1 test |
| `archive-license` | PASS, 1 test |

The green claim suite is not sufficient for acceptance. It does not cover same-folder selection, one-to-one file accounting, a live checkout, retrieval of saved receipts, durable offline assets, or real-data isolation while demo mode reads an existing license. Public claims about changed/duplicate/extra reporting, no analytics, installers, and “up to 25” receipts also have no dedicated claim entries.

### Cold first read

PASS. At both desktop and 390 px, the first screen answers all three questions in plain words:

- What it does: proves every photo reached a backup.
- Who it is for: phone owners checking originals, videos, and Live Photo pairs before clearing space.
- What to click: **Try it with sample data**, followed by “See a finished audit in one click.”

The action is visible in the first 844 px on mobile (top `527 px`, height `48.8 px`) and opens a populated receipt at `/demo` in one click.

## Release-blocking defects

### Critical

1. **The scanner gives unsafe proof when the same folder is selected twice.** Selecting `tests/fixtures/readonly-source` for both inputs returned “Every source file is accounted for,” with `Source: readonly-source`, `Backup: readonly-source`, and one verified file. There is no same-root guard. A user can accidentally verify the originals against themselves and then clear the phone based on a false receipt.

2. **One backup file can verify multiple source originals.** With two source files (`first.jpg`, `second.jpg`) containing identical bytes and one destination file (`only-copy.jpg`) containing those bytes, the receipt reported source files `2`, verified `2`, missing `0`. Both rows pointed to the same destination file. Destination matches are not allocated one-to-one, so the core completeness result is false for duplicate-content originals.

### High

1. **The advertised paid checkout is dead.** `GET https://api.sociobot.in/api/v1/products/photo-upload-audit/checkout` returned HTTP `404` with `{"error":"enabled factory product","status":404}`. The live **Buy Archive License** link points there. The builder handoff itself says product registration is still operator work.

2. **The 100,000-file goal is incompatible with the comparison algorithm.** `livePartner()` linearly scans the full collection for every JPG/HEIC/MOV row. A pre-hashed benchmark isolating comparison produced:

   | Files per side | Compare time |
   |---:|---:|
   | 1,000 | 299 ms |
   | 2,000 | 1,095 ms |
   | 4,000 | 4,140 ms |
   | 8,000 | 17,015 ms |

   Doubling input takes about four times as long, demonstrating quadratic behavior. No 100,000-file pilot exists. In addition, `hashFile()` calls `file.arrayBuffer()`, loading an entire photo or video into memory rather than streaming it.

3. **Demo mode touches real license state.** In a fresh context preloaded with a stale real-mode license, opening `/demo` read `sb_license:photo-upload-audit`, requested `.../verify?license=real-user-token`, and rewrote `sb_license_verdict:photo-upload-audit` while the banner said “sample data, nothing is saved.” This violates the required separate demo namespace and `.factory/demo.md`, which says demo never reads or writes local storage.

4. **The two core folder pickers have no visible keyboard focus.** Tabbing reaches `#source-folder` and `#destination-folder`, not their visible labels. Each focused input is `1 × 1 px`, `opacity: 0`, and `pointer-events: none`; its focus ring is therefore invisible. Keyboard users cannot see which core control is active.

5. **Saved paid receipts cannot be opened or reviewed.** `saveReceipt()` writes `audit:receipts`, but no route or component reads that key. Search finds only the write at `src/main.ts:300-301`. The paid promise to “Keep a record of every audit” produces inaccessible browser data rather than usable history.

6. **The installed/offline shell does not durably cache its JS or CSS.** Cache Storage after first install contains route HTML, the manifest, favicon, and hero image, but not `/assets/index-CMBZqyM4.js` or `/assets/index-DjhJFio5.css`. With the ordinary HTTP cache cleared and the browser offline, `/demo` reloads blank with zero `h1` elements. The service worker returns `/` HTML for missing JS/CSS, producing strict-MIME console errors. The existing claim test performs an extra online reload that runtime-caches those assets and misses this failure.

7. **The claims contract is incomplete.** The landing page and README promise missing/changed/duplicate/extra classification, no analytics, platform downloads, and up to 25 receipts without one dedicated `.factory/claims.json` entry and observable sandbox test for each. The archive test checks a link `href` but not the live purchase path; the no-account test only checks that picker buttons exist rather than running scan plus export.

### Medium

1. **Mobile accessibility misses the product contract.** At 390 px, visible targets below `44 × 44 px` include **Start for real** (`102.8 × 21.7`), **Demo** (`39.9 × 44`), **Audit** (`35.3 × 44`), inline/footer links, and the wordmark. Receipt text computes to `14.4 px`, paths to `11.84 px`, status labels to `11.52 px`, and the build label to `12 px`, despite the design rule that body text never drops below 16 px.

2. **Text at 200% causes horizontal overflow.** With root text resized from 16 to 32 px in a 390 px viewport, `/` measured `439 px` wide and `/audit` measured `417 px`. The unbroken AppImage filename expands the download grid on the landing page.

3. **Published desktop binaries are not built from the candidate commit.** GitHub Actions run `33166508346` succeeded at `d5f293540efdc70661cce7978b8f3ac69f546733`; the candidate is the later `323425d`. The extracted `.deb` contains `index-CcgLqeBn.js`, while the candidate/live build contains `index-CMBZqyM4.js`. The web deployment matches the candidate, but the downloadable app does not carry the candidate build identity.

### Low

1. Unknown paths render the styled not-found page but return HTTP `200`, not `404`.

## What passed

### Build and repository gates

- `npm ci`: PASS, 28 packages, zero audit findings.
- `npm test`: PASS, 18/18.
- `npm run build`: PASS; this includes `tsc --noEmit`.
- No lint script exists.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: PASS.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml`: stopped at missing verifier-host `glib-2.0`; this is an environment limitation. The published Linux CI job installed the native packages and passed.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.

### Normal and recovery flows

- A real browser audit of two source fixtures and two destination fixtures produced one renamed SHA-256 match and one same-name changed file.
- CSV download contained the header plus one row per result.
- No off-origin request occurred during the live file scan/export flow.
- An unsupported text-only folder showed an announced error and disabled scan. Replacing it with valid uppercase `.JPG` inputs recovered and completed.
- Invalid license restore stored only the token, made a bodyless verify request, and showed “License no longer active.” The free scan remained available.

### Accessibility and responsive checks

- Axe found zero serious/critical issues on `/`, `/demo`, `/audit`, `/privacy`, `/terms`, and the styled not-found route on the live site.
- Each route has `lang="en"`, one `main`, one `h1`, and an appropriate title.
- Keyboard navigation on the landing page has visible focus, activates the sample link with Enter, moves focus to the demo `h1`, and has no trap.
- 390 px demo has no page-level horizontal overflow at normal text size.
- Reduced motion is honored: the spinner is hidden, scrolling is automatic, and transitions collapse to `0.01 ms`.
- Console/page errors: none during normal route, demo, audit, keyboard, or mobile runs.

### Performance and response policy

- Candidate production assets: JS `29,512 B` raw / `10,375 B` gzip; CSS `18,516 B` raw / `5,113 B` gzip; mobile hero `56,678 B`; no web fonts.
- Fresh Lighthouse mobile: Performance `91`, Accessibility `100`, Best Practices `100`, SEO `100`; LCP `2.1 s`, CLS `0`, total transfer `81 KiB`.
- A real filter interaction under 4× CPU throttling produced a `72 ms` Event Timing interaction duration.
- HTML caches for 30 seconds; hashed JS/CSS use `max-age=31536000, immutable`; `sw.js` uses `no-cache`.
- Live responses include HSTS, CSP, `nosniff`, referrer policy, permissions policy, and frame blocking. No CDN fonts/scripts or analytics were observed.

### Deployment and releases

- Live and local SHA-256 values match exactly:

  - `index.html`: `9d813e910d06a03cf275bb6c9f6a93daf540ab4396c43eae3449eecb77be5929`
  - JS: `8807b3e4a402ec93e127bb3dc0d706c4824260f1c463297fdbd4ea2149640873`
  - CSS: `767c4dff4bcd4b556daca7655b82350f8f97efe2a59afad1f9de7aa4128bccdc`

- Release `v0.1.0` is public with Windows, Linux, macOS arm64/x64, `SHA256SUMS`, and valid `latest.json` assets.
- The Windows setup executable downloaded successfully. Actual SHA-256 `31a2728efb11b35944ee64e0a171921efeaf2b203e01b921570ce46fa6727463` exactly matches `SHA256SUMS`.
- OS detection displays real Linux, Windows, Apple silicon, and Intel links.
- Service-worker registration, explicit update, a warm offline reload, and the sample receipt pass when runtime assets have been cached.

### Server endpoint rate limiting

The product is static; the only runtime API is the Sociobot license service. A sequential rapid burst against the verify endpoint returned 30 HTTP `200` responses, then HTTP `429` on request 31 with `Retry-After: 4` and body `Too Many Requests! Wait for 4s`. Rate limiting passes at the observed threshold of 31 requests in this burst.

## Required before reverification

1. Reject identical source/destination roots and allocate destination matches one-to-one.
2. Index Live Photo stems instead of repeatedly scanning; hash large files incrementally; run the 100,000-file pilot.
3. Keep demo startup entirely away from real license/storage state.
4. Make the visible folder controls keyboard-focusable with a visible ring.
5. Register and verify the live billing product; add a usable receipt-history screen and quota errors.
6. Precache versioned JS/CSS and never return HTML for missing asset requests.
7. Add the missing claim entries and adversarial tests, including live checkout health.
8. Fix text size, touch targets, and 200% reflow.
9. Tag and build desktop artifacts from the accepted commit.
