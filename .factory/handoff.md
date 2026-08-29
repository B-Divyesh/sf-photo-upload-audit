# Photo Upload Audit — polish 7 handoff

## Completed

- Repaired the folder-identity regression. A verified picker rejects the same directory through `isSameEntry()`. The browser/Tauri directory-input fallback is deliberately non-certifying: it still produces a useful receipt, but it marks folder identity unverified, suppresses all-clear/certification actions, and explains how to obtain a verified comparison. CSV receipts disclose this field too.
- Repaired desktop release identity. `v0.1.4` (`d8d5ac9dc4c84388611cf551fd42a4813b41764e`) embeds `build-provenance.json` in each Tauri bundle. The published `latest.json`, release target, package resource, site footer, and downloads all agree on that source commit. The landing withholds a release that does not match its own version and source build.
- The site resolves its build identity from the matching version tag when no build ID is supplied. A later documentation-only commit therefore cannot hide a valid installer.
- Preserved the existing product-specific visual system and all prior fixes: one-click isolated demo with reset/real exit, accessible routes and 404, legal pages, metadata, mobile geometry, local-only data, and plain-language copy.
- Updated `.factory/claims.json` to 30 claims, including `desktop-build-identity`; updated the catalog description to `Compare photo backups before clearing phone space.`; updated copy audit, README release explanation, and `.factory/polish-7.md`.
- Released through GitHub Actions and deployed the static site through the supplied work order.

## Release and deployment

- Release tag: [`v0.1.4`](https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.4)
- Release source commit: `d8d5ac9dc4c84388611cf551fd42a4813b41764e`
- Safety repair commit: `8265b8ea5dcda186b176cea8cc09dcabad0387fd`
- Release workflow: [33229721929](https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33229721929), successful macOS arm64/x64, Windows, Linux, and manifest jobs.
- Static deployment: `f091a7a6-0b69-4e19-9917-a6fad4ce6f46`
- Live URL: <https://photo-upload-audit.sociobot.in>

## How to run and verify

```sh
npm ci
npm test
npm run build:site
```

Run one declared claim with `npm test -- --grep @claim:<id>`. The direct demo is `/demo` or `?demo=1`; Reset restores the shipped sample and Start for real discards it.

## Exact evidence

- Clean remote clone `/tmp/photo-upload-audit-polish7-clean-final.rX9OC2/repo`, commit `d8d5ac9dc4c84388611cf551fd42a4813b41764e`: `npm ci` passed with zero vulnerabilities; every 30 exact claim command passed; `npm test` passed **53/53**; `npm run build:site` passed.
- Build budget: 40.99 kB raw / 13.98 kB gzip initial JavaScript; 20.81 kB raw / 5.49 kB gzip CSS.
- `@claim:desktop-build-identity` downloaded the public Debian installer, extracted its `build-provenance.json`, and matched its build ID to `latest.json` and the release target commit.
- Cold live `verify-url.sh` passed home, `?demo=1`, `/demo`, `/audit`, `/privacy`, and `/terms`. Playwright axe at 390 px found zero serious/critical violations on those routes plus the 404. Evidence: `/tmp/photo-upload-audit-polish7-live/live-recheck.json` and matching screenshots.
- Cold live same-folder fallback test showed the unverified-identity warning and no all-clear: `/tmp/photo-upload-audit-polish7-live/fallback-identity-live-390.png`.
- Cold live demo test showed banner/eight rows, reset to eight rows, and clean Start-for-real transition: `/tmp/photo-upload-audit-polish7-live/demo-live-recheck.json`.

`cargo check` in this disposable container cannot complete because its Linux image lacks the `glib-2.0` development package. The release workflow installs the required Ubuntu dependencies and successfully built every desktop installer, including the package inspected by the claim test.

## Known gaps / next steps

None. The fallback’s refusal to issue an all-clear is intentional safety behavior, not a gap.
