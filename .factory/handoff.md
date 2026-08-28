# Photo Upload Audit — polish round 4 handoff

## Delivered

The round-4 repair is committed and deployed. Final product commits are `43fb78c` (`fix: cover published desktop release formats`) and `3d4acb0` (`fix: refresh installed audit shell`). The live site is <https://photo-upload-audit.sociobot.in>.

- Removed two unsupported absence-of-feature promises from the landing boundary copy. It now gives a useful, honest backup and restore-test next step.
- Added `desktop-release-formats` to `.factory/claims.json` and an exact tagged test against the real GitHub release. It verifies the unsigned release notice plus `.dmg`, Windows `.msi`/`.exe`, `.AppImage`, and `.deb` assets.
- Strengthened the existing unsigned-installer test so the landing version, published tag, and published unsigned notice agree.
- Advanced the service-worker cache generation from `r4` to `r5`, ensuring already installed browsers receive this static repair rather than serving the former cached landing shell.
- Updated the catalog description to the verb-first sentence: “Check every photo backup before clearing space on your phone.”

Every historical finding is mapped to its repair and evidence in `.factory/polish-4.md`.

## Verification

- Final clean remote clone: `/tmp/photo-upload-audit-polish-4-final.0t0KLP/repo` at `3d4acb0`.
  - `npm ci`: passed, zero reported vulnerabilities.
  - All 25 exact commands from `.factory/claims.json`: passed, with exactly one tagged test per claim.
  - `npm test`: passed (43 tests); `test-results/.last-run.json` is `passed`.
  - `npm run build:site`: passed and produced `dist/site/`.
- Final build budget: initial JavaScript 36.38 kB raw / 12.98 kB gzip; CSS 20.13 kB raw / 5.35 kB gzip.
- Production deployment: Azure Static Web Apps deployment `52fb4fa2-7e40-4988-90bb-77869bb984ee` succeeded. Live `/sw.js` has `photo-upload-audit-v0.1.2-r5`.
- Cold live evidence: `.factory/evidence/polish-4-live/recheck/report.json` and screenshots in the same directory. `/`, `/demo`, `/audit`, `/history`, `/privacy`, and `/terms` returned 200; a random unknown route returned 404 with the styled archive page.
- `/opt/fleet/lib/verify-url.sh` passed for live home, `?demo=1`, and `/audit`; reports and screenshots are in `.factory/evidence/polish-4-live/home`, `demo`, and `audit`.
- Live Playwright axe sweep found zero serious or critical violations across all normal routes and the styled 404. The 390 px sweep found no target below 44 px. Demo reset, demo-to-real isolation, offline reload, route-focus restoration, and published installer formats all passed live.
- Lighthouse mobile report: Performance 99, Accessibility 100, FCP 995 ms, LCP 1295 ms, CLS 0 (`.factory/evidence/polish-4-live/lighthouse.json`). Lighthouse emitted a post-audit Chromium screenshot crash warning after producing the valid score JSON; the Playwright live checks and screenshots completed without that issue.

## Run and deploy

```sh
npm ci
npm test
npm run build:site
```

Deploy `dist/site/` as a static site. The factory deployment ran this work order’s configured static deployment path; no application secrets are stored in the repository.

## Known gaps / operator action

No product acceptance finding remains. Desktop installers are intentionally unsigned and accurately disclosed for v0.1.2. To sign future desktop releases, configure `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` in the GitHub release workflow environment; do not add those secrets to this repository.
