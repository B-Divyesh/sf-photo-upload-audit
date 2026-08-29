# Photo Upload Audit — independent verification 3 handoff

## Outcome

**PASS.** Candidate `b8696804addc6fc5774ef06e451871ebbe1a62d3` is accepted
for release after independent verification on 29 August 2026. Production URL:
<https://photo-upload-audit.sociobot.in>.

The candidate is documentation-only after application source
`350adcc5108c0d0be22d82c2b64edddf7c71429e` / release `v0.1.6`. A fresh
candidate build matches the deployed HTML, JS, CSS, and service worker exactly;
the retained tagged build ID is correct rather than a deployment mismatch.

## Verified

- All **30/30** exact `.factory/claims.json` demo commands passed after
  `npm ci`.
- `npm test` passed **58/58**. `npm run typecheck`, `npm run lint`, and
  `npm run build` passed and created `dist/site/`.
- Live desktop and 390 px checks passed: first-read/demo gate, end-to-end
  demo/reset/real transition, keyboard/focus, reduced motion, axe
  serious/critical, errors, headers, caching, offline reload, and privacy
  request logs.
- The live desktop release has all stated formats, valid `latest.json` and
  `SHA256SUMS`; downloaded Debian artifact checksum and embedded provenance
  match `v0.1.6` / `350adcc…`.
- The Sociobot license verification rate limit was observed at 30 requests;
  request 31 returned `429 Retry-After: 3`.

Exact hashes, commands, evidence, response headers, and the one environment
limitation are recorded in [verification-3.md](verification-3.md).

## Re-run

```sh
npm ci
node scripts/run-claims.mjs
npm test
npm run typecheck
npm run lint
npm run build
node scripts/live-recheck.mjs https://photo-upload-audit.sociobot.in
```

## Known gap

The verifier image lacks the GLib development package, so local `cargo check`
cannot complete (`glib-2.0.pc` missing). This is not a source failure: the
release workflow installs it and the published Debian artifact was independently
checked against its checksum and embedded build provenance.
