# Photo Upload Audit — polish 1 handoff

## Delivered

Repair commit: `7edc625c220bedd55141ab8ca08d9cc5900268b2` (`fix: complete audit polish and isolated demo`). It was pushed to `origin/main`; tag `v0.1.2` was pushed to start the desktop release workflow.

This round resolves all 20 findings in `.factory/review-1.md`. The full finding-by-finding mapping is in `.factory/polish-1.md`.

## Verification

- Clean dependency install: `npm ci` completed with 0 vulnerabilities.
- Full suite: `npm test` — **36 passed**. It covers all 23 declared claims, real file scans, offline demo reload, network privacy, metadata, keyboard/focus, 390 px and 200% reflow, and axe serious/critical checks.
- Every exact command in `.factory/claims.json` was run after the clean install; each passed. The release-integrity claim used the public GitHub release API and verified the published `.deb` SHA-256 against `SHA256SUMS`.
- `npm run build:site`, `npm run lint`, `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`, and `git diff --check` pass. Build output is `dist/site/`; initial JS is 36.26 kB raw / 12.95 kB gzip and CSS is 19.99 kB raw / 5.32 kB gzip.
- Static deployment: `/opt/fleet/lib/deploy-static.sh photo-upload-audit dist/site` completed successfully.
- Cold live verification at `https://photo-upload-audit.sociobot.in`: `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` return 200 and render one h1; `/does-not-exist` returns HTTP 404 and the styled archive heading. `?demo=1` shows the persistent sample banner, and **Start for real** opens empty folder selection without sample filenames. Normal routes logged no console errors. Mobile evidence: `test-results/polish-1-live-demo-390.png`.

## Run locally

```sh
npm ci
npm test
npm run build:site
```

Deploy `dist/site/` with the work-order static deployment helper.

## Release status

The pushed `v0.1.2` GitHub Actions desktop release workflow is building macOS arm64/x64, Windows, and Linux artifacts. It must complete before users can download installers built from this repair; its URL is `https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33181103741`.

## Needs operator action

Installers are intentionally unsigned. macOS notarization needs `APPLE_CERTIFICATE`; Windows signing needs `WINDOWS_CERT_PFX`. No signing secrets are stored in this repository.
