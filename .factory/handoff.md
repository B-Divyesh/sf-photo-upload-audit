# Photo Upload Audit — review 9 handoff

## Outcome

Adversarial review 9 is complete with verdict **FAIL**. No product code was modified. The review records three high-severity claim/copy findings in `.factory/review-9.md`:

- `F-9-1`: absolute “every file” language conflicts with the supported-media/skipped-file boundary.
- `F-9-2`: the declared tests do not verify the hosted checkout's $19 one-time price.
- `F-9-3`: the declared SHA-256 test has no known-vector assertion.

All findings from reviews 1–8 were independently rechecked and remain fixed.

## Verification performed

Clean clone: `/tmp/photo-upload-audit-review9-clean.bMORIL/repo` at `16fee31f1a92b535efc50a145f9f4d8bbd033974`.

```sh
npm ci
node scripts/run-claims.mjs
npm test
npm run build
```

- All **30/30** exact commands in `.factory/claims.json` passed separately.
- The complete suite passed **57/57**.
- `npm run build` produced `dist/site/`; initial JavaScript is 41.02 kB raw / 13.99 kB gzip.
- The live HTML, JavaScript, and CSS hashes match the clean build.
- Cold production checks covered 390 × 844 and 1440 × 900 first screens, all routes, route metadata, link crawl, h1/main structure, focus restoration, console output, mobile geometry, and Playwright axe.
- The designed unknown route returned HTTP 404. All discovered HTTP links resolved.
- One-click demo entry showed eight populated rows; Reset restored all eight; Start for real opened an empty audit. Demo made no storage write, direct demo traffic was same-origin, and offline reload restored the sample.
- The fallback same-folder flow remained non-certifying and exposed no save/print controls.
- The live hosted checkout currently shows Photo Upload Audit at $19.00 as a one-time unlock.
- A live `abc` fixture exported the correct SHA-256 digest, `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`.

Temporary browser evidence is under `/tmp/photo-upload-audit-review9-live/` and `/tmp/photo-upload-audit-review9-verify-*`.

## Known gaps and next steps

1. Apply the exact copy rewrites in `F-9-1` and add a regression against unqualified `every`/`each` claims.
2. Extend checkout coverage to assert the hosted product, $19 total, and one-time mode.
3. Extend `@claim:hash-compare` with a standard SHA-256 vector and unequal-content case.
4. Run review 10 from a clean clone and fresh production browser context. PASS requires zero findings.
