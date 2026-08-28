# Photo Upload Audit — adversarial review 5 handoff

## Done

- Completed cold 390×844 and 1440×900 first-read checks of the deployed site.
- Audited the live demo, Reset, Start for real, storage isolation, offline reload, request log, route metadata, Back/focus behavior, 404, visual identity, accessibility, and all discovered links.
- Read and rechecked every earlier review finding plus all polish and handoff records.
- Ran all 25 exact claim commands separately from a clean clone; all passed and every claim tag is unique.
- Ran the full clean-clone suite; all 43 tests passed and `dist/site/` was produced.
- Wrote `.factory/review-5.md`. No product code was modified.

## Verdict and remaining work

Review 5 is **FAIL**. See `.factory/review-5.md` for evidence and proposed fixes.

- Blocking F-4-1: the earlier untestable backup-replacement assurance remains on `/terms`.
- Blocking F-5-1: a mixed folder can silently omit an unsupported photo and still receive “Every source file is accounted for.”
- Blocking F-5-2: a delayed landing release lookup can write `release:photo-upload-audit` while the demo banner says nothing is saved.
- Minor F-5-3 through F-5-6: changed timestamps are not explicitly tested; “sidecar,” “merchant of record,” and “local-first” need plain, consistent wording.

## Verification commands

```sh
npm ci
npm test
npm run build:site
```

The review also ran `/opt/fleet/lib/verify-url.sh` against the live origin; it passed title, language, main landmark, image alt, control label, and console checks.
