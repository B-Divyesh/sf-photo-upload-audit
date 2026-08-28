# Photo Upload Audit — independent verification handoff

## Status

**FAIL — candidate `323425da1673e60e7234d851531639ee923d07ef` is not releasable.**

Tested 28 August 2026 at `https://photo-upload-audit.sociobot.in`. The deployed HTML, JS, and CSS exactly match the candidate build, so this is not a deployment-only failure. Full evidence is in [`.factory/verification.md`](verification.md).

## Release blockers

### Critical

- Selecting the same folder for source and backup produces “Every source file is accounted for.”
- Two identical-content source files are both marked verified by one destination file.

### High

- The live $19 checkout returns HTTP 404.
- Live Photo partner lookup is quadratic; 8,000 pre-hashed files per side took 17.0 seconds, and the 100,000-file pilot has not run.
- Demo mode reads and rewrites real license storage and makes a verification request.
- The core folder inputs receive focus while invisible (`1 × 1 px`, opacity 0).
- Paid receipts are written to local storage but have no history/reopen UI.
- The service worker omits JS/CSS from its durable shell cache and can return HTML for missing assets.
- Public claims are missing claim entries and sufficiently observable tests.

### Medium

- Multiple mobile touch targets are below 44 px and receipt text falls to 11.5–14.4 px.
- 200% text resizing produces horizontal overflow.
- Desktop release binaries were built from `d5f2935`, not the candidate commit.

### Low

- The styled not-found route returns HTTP 200.

## Verification summary

- All 10 exact claim commands: pass after `npm ci`.
- Cold first-read and one-click sample gate: pass.
- `npm test`: 18/18 pass.
- Exact `npm run build`: pass; JS 29.5 KB raw, CSS 18.5 KB raw.
- Fresh Lighthouse mobile: 91 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.1 s, CLS 0.
- Axe serious/critical: zero across all routes.
- Live normal audit, renamed hash match, changed file, CSV export, invalid-input recovery, reduced motion, and normal 390 px layout: pass.
- Live audit network privacy: no off-origin requests.
- Verify API rate limit: first 429 on request 31, `Retry-After: 4`.
- Release assets/checksum: pass; tested Windows setup SHA-256 matches.
- Local Rust compile is blocked only by this verifier host's missing `glib-2.0`; release CI passed its native builds.

## Reverify after repair

Run `npm ci`, every exact `.factory/claims.json` command, `npm test`, and `npm run build`. Then repeat the two false-completeness fixtures, isolated demo/license fixture, cold durable-offline fixture, keyboard picker path, 200% mobile reflow, live checkout, 100,000-file pilot, rate-limit burst, deployment hash comparison, and release checksum check.

No product code was modified during this verification.
