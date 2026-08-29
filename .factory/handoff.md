# Photo Upload Audit — polish 7 handoff

## Completed

- Repaired the folder-identity regression. A verified picker rejects the same directory through `isSameEntry()`. The browser/Tauri directory-input fallback is deliberately non-certifying: it still produces a useful receipt, but it marks folder identity unverified, suppresses all-clear/certification actions, and explains how to obtain a verified comparison. CSV receipts disclose this field too.
- Repaired desktop release identity. `v0.1.4` (`d8d5ac9dc4c84388611cf551fd42a4813b41764e`) embeds `build-provenance.json` in each Tauri bundle. The published `latest.json`, release target, package resource, site footer, and downloads all agree on that source commit. The landing withholds a release that does not match its own version and source build.
- The site resolves its build identity from the matching version tag when no build ID is supplied. It resolves a missing shallow-clone tag from `origin`, so later documentation-only commits cannot hide a valid installer.
- Preserved the existing product-specific visual system and all prior fixes: one-click isolated demo with reset/real exit, accessible routes and 404, legal pages, metadata, mobile geometry, local-only data, and plain-language copy.
- Updated `.factory/claims.json` to 30 claims, including `desktop-build-identity`; updated the catalog description to `Compare photo backups before clearing phone space.`; updated copy audit, README release explanation, and `.factory/polish-7.md`.
- Released through GitHub Actions and deployed the static site through the supplied work order.

## Release and deployment

- Release tag: [`v0.1.4`](https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.4)
- Release source commit: `d8d5ac9dc4c84388611cf551fd42a4813b41764e`
- Safety repair commit: `8265b8ea5dcda186b176cea8cc09dcabad0387fd`
- Release workflow: [33229721929](https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33229721929), successful macOS arm64/x64, Windows, Linux, and manifest jobs.
- Static deployment: `2df730a3-037c-4fd7-9d3c-e3cc676f3a52`
- Live URL: <https://photo-upload-audit.sociobot.in>

## How to run and verify

```sh
npm ci
npm test
npm run build:site
```

Run one declared claim with `npm test -- --grep @claim:<id>`. The direct demo is `/demo` or `?demo=1`; Reset restores the shipped sample and Start for real discards it.

## Exact evidence

- Clean **shallow** remote clone `/tmp/photo-upload-audit-polish7-final-clean.0vovBB/repo`, commit `f0540ce2bb1d617410ef3c30481f1b575ff91a9c`: `npm ci` passed with zero vulnerabilities; every 30 exact claim command passed; `npm test` passed **53/53**; `npm run build:site` passed and resolved the tagged installer build ID `d8d5ac9dc4c84388611cf551fd42a4813b41764e` through `origin`.
- Build budget: 40.99 kB raw / 13.98 kB gzip initial JavaScript; 20.81 kB raw / 5.49 kB gzip CSS.
- `@claim:desktop-build-identity` downloaded the public Debian installer, extracted its `build-provenance.json`, and matched its build ID to `latest.json` and the release target commit.
- Final cold live `verify-url.sh` passed home, `?demo=1`, `/demo`, `/audit`, `/privacy`, and `/terms` after deployment `2df730a3-037c-4fd7-9d3c-e3cc676f3a52`. Playwright axe at 390 px found zero serious/critical violations on those routes and the styled 404; normal routes had zero console/page errors. Evidence: `/tmp/photo-upload-audit-polish7-live-final/live-recheck-final.json` and matching screenshots.
- Final cold live same-folder fallback test showed the unverified-identity warning, no all-clear, and no certification controls: `/tmp/photo-upload-audit-polish7-live-final/fallback-identity-final-390.png`.
- Final cold live demo test showed banner/eight rows, one Missing row, reset to All/eight rows, and clean Start-for-real transition: `/tmp/photo-upload-audit-polish7-live-final/live-recheck-final.json`.

`cargo check` in this disposable container cannot complete because its Linux image lacks the `glib-2.0` development package. The release workflow installs the required Ubuntu dependencies and successfully built every desktop installer, including the package inspected by the claim test.

## Known gaps / next steps

None. The fallback’s refusal to issue an all-clear is intentional safety behavior, not a gap.
