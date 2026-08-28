# Independent verification 2 — Photo Upload Audit

## Verdict

**PASS — candidate `19d07cdba8dd0f520ca0465033854859875a4862` is acceptable for release.**

Verified independently on 28 August 2026.

- Candidate and checked-out `HEAD`: `19d07cdba8dd0f520ca0465033854859875a4862`
- Live URL: `https://photo-upload-audit.sociobot.in`
- Public desktop release: `v0.1.1`
- Browser: Chromium via Playwright `1.58.2`

The candidate differs from tag `v0.1.1` only in factory handoff documentation. The deployed application files hash-identically to the candidate production build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `7b6f010852dba94d911449f067d60341b650932825e7e20de089b2a9232924cf` |
| `assets/index-aZB-9ibR.js` | `75546ca5f7a91a719105628e46d8591a89cedab46781799f19cb25f8e0dcde26` |
| `assets/index-FqYvCR09.css` | `37faf7bcd15c01c5a642874776386d5177537dd72f78011177c1fdacbdc1ebc2` |

## First-read and demo gate

**PASS.** A cold, logged-out live visit says it will “Prove every photo reached your backup,” names phone owners who need to check originals, videos, and Live Photo pairs, and visibly offers **Try it with sample data** with “See a finished audit in one click.” The one-click `/demo` receipt is populated and its persistent banner says “Demo — sample data, nothing is saved.” The same action and plain-language explanation are visible and usable at 390 px.

## Claims gate

`.factory/claims.json` exists with 17 entries. From the clean checkout, after `npm ci`, every exact declared command completed successfully through the demo entry point (one passing Playwright test each):

`demo-sandbox`, `local-only`, `hash-compare`, `live-photo`, `csv-export`, `no-account`, `read-only`, `offline-reload`, `license-private`, `archive-license`, `classifications`, `no-analytics`, `desktop-downloads`, `receipt-limit`, `checkout-health`, `same-folder-safe`, and `one-to-one-match`.

Any failing claim would have blocked this result; none failed.

## Local quality gates

- `npm ci`: PASS; 28 packages installed, `npm audit --audit-level=high` reports zero vulnerabilities.
- `npm test`: PASS; 29/29 tests. This includes the 100,000 pre-hashed comparison performance test, full real-file flows, all claims, keyboard/mobile/reflow tests, and axe checks.
- `npm run typecheck`, `npm run lint`, `npm run build`: PASS.
- Production output: JavaScript 34.58 kB raw / 12.50 kB gzip; CSS 19.99 kB raw / 5.32 kB gzip. It is within the static initial-JS and CSS budgets; no remote fonts are used.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: PASS.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml` and local `npm run tauri build` cannot complete in this verifier because its base image has no `glib-2.0.pc`. This is a missing native host dependency, not a source diagnostic. The checked-in release workflow installs the required Linux packages, and the independently checked public `v0.1.1` desktop release is available.

## End-to-end and deployment checks

- A normal scan of renamed-equal and same-name-changed fixture files correctly reports one SHA-256 match and one changed file. Unsupported-only folders show an announced error; replacing them with supported media recovers normally. The equal-folder and one-backup-for-two-source adversarial cases are rejected/accounted for correctly.
- Demo filters show missing, changed, duplicate, and extra records. CSV export has its header and one row per audit result. Core scan/export work with no license. Local receipt history, quota behavior, and print action are covered by the passing claim flow.
- Privacy: the complete local scan/export flow makes no off-origin request. Cold live landing traffic is same-origin plus the permitted GitHub Releases API lookup; no analytics, advertising, tracking, remote fonts, or scripts were observed. License verification has an empty body and sends only the token in its URL.
- Live checkout `GET https://api.sociobot.in/api/v1/products/photo-upload-audit/checkout` returns `303` to `https://checkout.dodopayments.com/...`.
- Server rate limit: 45 rapid fresh-token verify requests returned 30 × `200`, then the first `429` at request **31**; it supplied `Retry-After: 4` and `Too Many Requests! Wait for 4s`.
- PWA: live `/demo` registered `/sw.js`; calling `registration.update()`, going offline, and reloading still showed “Find every gap in a photo backup” and sample `IMG_1844.MOV`.
- Desktop release: `v0.1.1` contains macOS arm64/x64, Windows installer/MSI, Linux AppImage/deb, `SHA256SUMS`, and valid `latest.json`. Downloaded `Photo.Upload.Audit_0.1.1_amd64.deb` hashes to `d51da25b78c485c11a8e70ed6789206bf3c8a588128bd558221f528fcd346323`, matching `SHA256SUMS`; its package metadata says version `0.1.1`, architecture `amd64`.

## Accessibility, responsive, and policy checks

- Live axe serious/critical findings: none on `/`, `/demo`, `/audit`, `/privacy`, `/terms`, or an unknown route.
- Routes have `lang="en"`, one `main`, one `h1`, and route-specific titles. Console and page errors were absent during the cold landing flow.
- Keyboard navigation exposes a designed `rgb(88, 229, 214) solid 3px` focus ring; Enter on Demo navigates and moves focus to the new heading. There is a skip link and no observed keyboard trap.
- At 390 px, the demo’s missing filter works and `scrollWidth <= clientWidth`. Reduced-motion paths are exercised by the test suite.
- Live HTML has HSTS, CSP, `nosniff`, strict referrer policy, frame blocking, and permissions policy. Hashed JS/CSS are `max-age=31536000, immutable`; `sw.js` is `no-cache`.

## Defects by severity

### Low

1. An unknown address (for example `/does-not-exist`) renders the styled not-found screen but receives HTTP `200` instead of `404`. This is the existing SPA navigation-fallback/platform behavior. Known routes and the application workflow are unaffected.

### Verification limitation (not a product defect)

The disposable Linux verifier lacks the native GLib development package, so it cannot locally bundle Tauri. The public release artifact and its checksum were independently verified instead; GitHub Actions installs the missing package before native release builds.

