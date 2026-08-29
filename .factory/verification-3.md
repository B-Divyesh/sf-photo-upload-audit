# Independent verification 3 — Photo Upload Audit

## Verdict

**PASS — candidate `b8696804addc6fc5774ef06e451871ebbe1a62d3` is acceptable for release.**

Verified independently on 29 August 2026 against
<https://photo-upload-audit.sociobot.in>. This candidate is a documentation-only
commit after the `v0.1.6` app source commit `350adcc5108c0d0be22d82c2b64edddf7c71429e`.
The distinction is intentional and verified: a fresh production build from the
candidate has the same deployed application bytes and retains the tagged
desktop-release build identity.

## Required first gates

### Claims

`.factory/claims.json` exists with 30 entries. From this clean checkout I ran
`npm ci`, then every exact declared command independently using the documented
demo entry point. All passed:

`demo-sandbox`, `demo-reset`, `demo-to-real`, `local-only`, `hash-compare`,
`all-files-reported`, `audit-supported-media`, `live-photo`, `csv-export`,
`no-account`, `read-only`, `offline-reload`, `license-private`,
`archive-license`, `receipt-metadata-only`, `browser-data-removal`,
`receipt-removal`, `classifications`, `no-analytics`, `desktop-downloads`,
`desktop-release-formats`, `release-integrity-files`, `unsigned-installers`,
`receipt-limit`, `checkout-health`, `same-folder-safe`, `scan-progress`,
`source-first`, `one-to-one-match`, and `desktop-build-identity`.

Each was run as `npm test -- --grep @claim:<id>` and produced one passing
Playwright test. A failure or missing manifest would have been release-blocking.

### Cold first read

**PASS.** In a fresh live browser context the first screen says “Check which
photos reached your backup,” identifies “phone owners” who need to verify
originals, videos, and Live Photo pairs, and puts **Try it with sample data**
beside “See a finished audit in one click.” The action opened the finished,
eight-row demo with its persistent “Demo — sample data, nothing is saved”
banner.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 28 packages, 0 reported vulnerabilities |
| `npm test` | PASS; 58/58 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS; `dist/site/` produced |
| initial JS/CSS | 41.02 kB / 13.98 kB gzip; 20.81 kB / 5.49 kB gzip |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |

The local production scan/exercise suite covered SHA-256 renamed-equal and
same-name-changed media, unsupported PSD visibility, complete and unpaired
HEIC/MOV files, missing/changed/duplicate/extra filtering, CSV download,
empty-folder recovery, same-folder rejection, one-backup-to-one-source
allocation, progress feedback, receipt saving/removal/quota, and the no-account
path. It also covers 100,000 pre-hashed records.

## Live product, privacy, and accessibility

- `node scripts/live-recheck.mjs https://photo-upload-audit.sociobot.in` passed
  seven routes at 390 px. It found one `h1`, one `main`, correct titles and
  route metadata, no horizontal overflow, no sub-44px visible controls, no
  serious/critical axe findings, and no console/page errors.
- The live demo had eight rows; the Missing filter showed one; Reset restored
  eight; Start for real opened an empty `/audit`. Demo storage writes, local
  storage, and session storage were all zero.
- Playwright request logs show demo traffic only to the same origin. A cold
  landing visit made same-origin asset requests plus the declared
  `api.github.com` release lookup; no analytics, advertising, tracking, remote
  font, or photo-data request was observed. The passed local-only and
  no-analytics claims also record the complete demo flow.
- Keyboard Tab order starts with the skip link and shows a designed
  `rgb(88, 229, 214) solid 3px` focus ring on every reached control. Enter on
  the sample action opened the demo. At 390 px there was no overflow or
  undersized visible target.
- With `prefers-reduced-motion: reduce`, live computed behavior had
  `scroll-behavior: auto` and `0.01ms` transitions. No console errors occurred.
- A service-worker `registration.update()` succeeded. After going offline,
  reloading `/demo` still showed all eight rows and `Demo — Photo Upload Audit`.

Response headers on the live root include a restrictive CSP with only `self`,
`api.github.com`, and the Sociobot API in `connect-src`; `nosniff`, strict
referrer policy, permissions policy, HSTS, and `frame-ancestors 'none'`. Hashed
JS/CSS are `max-age=31536000, immutable`; `sw.js` is `no-cache`.

## Deployment and desktop evidence

Fresh candidate build bytes match production exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `e5cb2e9b53f4bc63c8763cd3fbacc657971890b260696e2f732be735ec98862b` |
| `assets/index-QgRcc1aN.js` | `a373d2414d8b2473adf66e831b677e98814f72e40aebfe02744ba82674f15896` |
| `assets/index-zC9jVati.css` | `6ee865ac84c7382f0e5c5c8bd38e5d634b586631112b76148e81841888e1f432` |
| `sw.js` | `8027fa4af638562279e58eee0df7a78b475eb72b1867fc01f6acd73d270040a2` |

The public `v0.1.6` release targets `350adcc…` and publishes arm64/x64 macOS
DMGs, Windows EXE/MSI, Linux AppImage/deb, RPM, `SHA256SUMS`, and `latest.json`.
The downloaded `Photo.Upload.Audit_0.1.6_amd64.deb` hash was
`2d180aa3ad82b9a9b2631245666fb3274e7ec29615e283d47523c5bc026ab041`,
matching `SHA256SUMS`; its embedded `build-provenance.json` reports version
`0.1.6` and build `350adcc…`.

For the factory product-unlock verification endpoint, 30 rapid requests from
one client returned HTTP 200. Request 31 returned **HTTP 429** with
`Retry-After: 3`; the documented allowance is therefore enforced in observed
testing.

## Defects by severity

None found.

### Verification limitation (not a product defect)

`cargo check --locked --manifest-path src-tauri/Cargo.toml` could not complete
in this disposable Linux image because `glib-2.0.pc` is absent. The checked-in
release workflow installs `libwebkit2gtk-4.1-dev` and related native packages,
and the independently downloaded signed-by-checksum desktop artifact above
matches its declared build provenance.

## Re-run

```sh
npm ci
node scripts/run-claims.mjs
npm test
npm run typecheck
npm run lint
npm run build
node scripts/live-recheck.mjs https://photo-upload-audit.sociobot.in
```
