# Photo Upload Audit — review 1 handoff

## Outcome

Adversarial first-read review 1 is complete. Verdict: **FAIL** with 20 findings, four blocking.

The full report is [`.factory/review-1.md`](review-1.md). Product code was not modified.

## Blocking findings

1. **Start for real** removes the demo banner but carries the sample receipt into `/audit`; a cached paid license can save it into real receipt history.
2. The same-folder guard compares only the selected root name, so two different folders named `DCIM` are rejected.
3. Unknown live URLs still render the designed not-found screen with HTTP 200, reproducing the prior handoff gap.
4. Release identity remains inconsistent: the live footer says v0.1.0, the package/release say v0.1.1, and the service-worker cache says v0.1.2.

## Verification performed

- Cold live visits at 390 × 844 and 1440 × 900.
- Demo entry, reset, storage isolation, offline reload, **Start for real**, and paid-history contamination checks.
- Every exact command in `.factory/claims.json`: 17/17 passed.
- `npm test`: 29/29 passed; production build emitted `dist/site/`.
- Live axe integration on all routes: no serious or critical violations.
- Deep-link, back/focus, metadata, console, 404 status, and complete discovered-link crawl.
- Prior handoff and both verification reports rechecked against live behavior and source.
- Landing and README sentence-by-sentence word-count audit.

## Reproduce the two newly exposed core failures

1. Open `/demo`, select **Start for real**, and inspect `/audit`: the sample receipt remains. With a cached valid license, select **Save receipt** and inspect `localStorage['audit:receipts']`.
2. Select two different local directories that are both named `DCIM`; the app reports that the source and backup have the same root name and refuses to scan.

## Working tree and next steps

Only `.factory/review-1.md` and this handoff are intended review changes. The next implementation should address all report findings, add the missing adversarial tests, deploy the repaired site, and then run the entire review from scratch.
