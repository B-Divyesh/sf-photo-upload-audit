# Photo Upload Audit — repair handoff

## Status

Repair commit: `b79460d741530d1071eb42d893ef59cf3d769ea0`.

This repair keeps the Tauri 2 desktop app and static landing deployment. It changes no researched product scope or successful free scanning behavior.

## Fixed verifier findings

- The audit rejects equal selected folder roots before scanning.
- SHA-256 matches allocate one destination file per source file. Two identical source originals can no longer be proved by one backup file.
- Live Photo pairing uses a path-and-stem index. Hashing reads `File.stream()` incrementally instead of materialising whole videos. The 100,000-file, pre-hashed comparison pilot passed in 2.1 seconds locally.
- `/demo` does not read, write, or verify real license storage. Demo state stays in memory.
- Folder inputs are visible, labelled native controls with a designed focus ring.
- Paid saved receipts have a `/history` route that reopens or removes a receipt. A clear message appears at the 25-receipt local limit.
- The service worker precaches the deployed fingerprinted JS and CSS at install, returns the app shell only for navigation fallbacks, and returns an error—not HTML—for unavailable assets.
- Mobile controls and receipt text meet the 44 px/16 px product baseline, and landing and audit pages reflow at 390 px with 200% text size.
- Claims now cover classifications, analytics, platform installers, receipt limit, checkout health, same-folder safety, and one-to-one matching.
- Versions are `0.1.1`; the tagged release will therefore build binaries from this repair rather than the old `d5f2935` artifact.

The Sociobot checkout was rechecked live on 2026-08-28. It returns HTTP 303 to `checkout.dodopayments.com`; its prior 404 is no longer present.

## Verification

Clean install and static build:

```sh
npm ci
npm run lint
npm run build
```

All passed. The production output is `dist/site/`; its current initial assets are 34.58 KB JS (12.50 KB gzip) and 19.99 KB CSS (5.32 KB gzip).

Browser and claim coverage, all passed:

```sh
npm test
npx playwright test tests/claims.spec.ts --reporter=line
npx playwright test tests/site.spec.ts --reporter=line
npx playwright test tests/performance.spec.ts --reporter=line
```

The full suite has 31 tests after the repair (17 claim tests, 13 route/mobile/accessibility tests, and the 100,000-file pilot). It checks desktop and 390 px mobile, keyboard focus, 200% text reflow, cold offline reload, response-safe service-worker behavior, no off-origin media flow, demo license isolation, receipt history, checkout redirect, and axe serious/critical violations across every route. `test-results/.last-run.json` records `passed` for the full run.

Additional checks passed:

```sh
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
npm audit --audit-level=high
```

`cargo check --locked --manifest-path src-tauri/Cargo.toml` is blocked in this worker because `glib-2.0.pc` is absent. This is a host dependency limitation, not a source error; `.github/workflows/release.yml` installs the required Linux Tauri system packages before building all desktop artifacts.

## Release and deployment

Push `main` and tag `v0.1.1`. The existing release workflow builds unsigned macOS arm64/x64, Windows, and Linux artifacts plus `SHA256SUMS` and `latest.json`. The static deployment target remains `dist/site/`.

## Needs operator action

Desktop builds are intentionally unsigned. To sign production installers, add the release workflow secrets `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` (and their associated passwords/notarization credentials if signing is enabled).
