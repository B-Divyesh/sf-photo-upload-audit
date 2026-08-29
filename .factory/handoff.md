# Photo Upload Audit — polish round 9 handoff

## Outcome

**PASS.** Release `v0.1.6` repairs all cumulative findings through adversarial
review 9. The repair commit is `350adcc5108c0d0be22d82c2b64edddf7c71429e` and
the release workflow source commit is the same. Production is deployed at
<https://photo-upload-audit.sociobot.in>.

The product keeps its luminous-glass audit identity. The repair narrows public
copy to the supported-media boundary, makes the primary audit action honest,
and upgrades the claim suite from label checks to observable checkout and
cryptographic evidence.

## What changed

- First-screen heading: “Check which photos reached your backup.” The receipt
  and README say that **supported** files are content-compared; selected but
  unsupported files are listed as skipped.
- The audit action is “Create audit receipt.” Demo mode remains one click at
  `/demo` and `?demo=1`, with its persistent banner, reset, and isolated
  in-memory state.
- `@claim:hash-compare` exports the standard SHA-256 digest of `abc`
  (`ba7816bf…f20015ad`) and proves unequal same-name media is changed.
- `@claim:checkout-health` follows the public Sociobot redirect to Dodo and
  asserts the product name, `Total $19.00`, and one-time unlock text.
- `v0.1.6` unifies package, Cargo, Tauri, service-worker cache, footer,
  release manifest, and installer provenance. Tagged source identity is stable
  for documentation-only builds.

The complete finding-to-evidence table is in [polish-9.md](polish-9.md).

## Verification

### Clean clone

Fresh clone: `/tmp/photo-upload-audit-polish9-clean.k9GsgC/repo` at
`350adcc5108c0d0be22d82c2b64edddf7c71429e`.

```sh
npm ci
node scripts/run-claims.mjs .factory/evidence/polish-9-clean
npm test
npm run build:site
```

- `npm ci`: 0 vulnerabilities.
- The exact command for every `.factory/claims.json` item passed: **30/30**.
- Full browser/unit/integration/performance/accessibility/privacy/offline suite:
  **58/58 passed**.
- Static build output: JavaScript **41.02 kB raw / 13.98 kB gzip**; CSS
  **20.81 kB raw / 5.49 kB gzip**.

### Desktop release

- GitHub Actions run
  [33235419527](https://github.com/B-Divyesh/sf-photo-upload-audit/actions/runs/33235419527)
  passed macOS arm64/x64, Windows, Linux, and manifest jobs.
- [v0.1.6](https://github.com/B-Divyesh/sf-photo-upload-audit/releases/tag/v0.1.6)
  publishes unsigned `.dmg`, `.msi`/`.exe`, `.AppImage`, `.deb`, `.rpm`,
  `SHA256SUMS`, and `latest.json`; its release source is `350adcc…`.

### Production

- Deployed `dist/site/` with the configured Azure Static Web App
  `sf-photo-upload-audit` (production) to
  `https://agreeable-ocean-0f3aa9f10.7.azurestaticapps.net`, verified through
  the custom domain.
- `scripts/live-recheck.mjs` cold-checked `/`, `?demo=1`, `/demo`, `/audit`,
  `/history`, `/privacy`, and `/terms`: HTTP 200, route titles/metadata,
  `lang=en`, one h1, one main, legal links, no console errors, no mobile
  overflow/small targets, and no serious/critical Playwright-axe findings.
- Demo had eight rows, reset returned all eight, Start for real opened an empty
  audit, storage writes were zero, all requests were same-origin, and an
  offline reload restored eight rows. The unknown route returned HTTP 404 with
  “This page is missing from the archive.”
- `/opt/fleet/lib/verify-url.sh` passed production: title, lang, h1, main, alt
  text, labelled buttons, and no console errors. Evidence is under
  `.factory/evidence/polish-9-live/`.
- Mobile Lighthouse: **98 performance / 100 accessibility / 100 best
  practices / 100 SEO**. FCP 1.3 s, LCP 2.2 s, TBT 100 ms, CLS 0. Raw report:
  `.factory/evidence/polish-9-live/lighthouse-mobile.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build:site
```

Deploy `dist/site/` to the configured static app. The desktop release workflow
runs from tags matching `v*`.

## Known gaps

None. Desktop installers are intentionally unsigned; the landing page and
release state this plainly.
