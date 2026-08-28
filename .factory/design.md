# Photo Upload Audit — visual thesis

## Direction

**Luminous glass data landscape.** A backup audit is an act of looking through two large, opaque collections until every item has a clear answer. The interface turns that idea into a dark, horizon-like workspace: translucent inventory planes, thin cyan scan lines, and small coral exceptions. Glass is used only where it explains comparison or depth. The working tables remain solid and quiet.

This is a single-mode, dark product. A dark field makes the luminous source/destination relationship legible, reduces glare during long scans, and gives warnings a precise role. It is not a generic gradient hero: the asymmetrical “verification landscape” is the visual anchor, and the audit receipt is the main object.

## Tokens

- `ink-950 #061015` — page background
- `ink-900 #0A1920` — solid work surface
- `glass #102B34CC` — layered inventory planes
- `glass-line #2B5965` — boundaries and controls
- `paper #F2FBFC` — primary text
- `mist #A8C5CA` — secondary text (7.4:1 on ink-950)
- `scan #58E5D6` — action and verified state (11.5:1 as text on ink-950)
- `scan-ink #032C2A` — text on scan
- `amber #FFD166` — unmatched/attention
- `coral #FF7A72` — changed/error
- `violet #9DA8FF` — duplicate/neutral exception

## Type

- Display: **Arial Narrow / Liberation Sans Narrow / system sans-serif**, 700. Condensed headings resemble a labelled archive drawer without pretending to be technical terminal text.
- Body: **Inter-compatible system stack** (`ui-sans-serif`, `system-ui`, sans-serif), 400–700. No font download is needed, keeping the app offline and fast.
- File counts, hashes, and sizes use the system monospace stack with tabular figures.
- Scale: 14, 16, 18, 24, 36, 64 px. Body never drops below 16 px.

## Space and shape

An 8 px base grid. Main section gaps are 64–112 px; work surfaces use 24–32 px padding. Corners use a clipped 14 px shape rather than default pill cards. Controls are at least 44 px high. The landing page alternates a narrow editorial column with a wide audit landscape. Tables become stacked file records below 720 px.

## Interaction grammar

The source is always left/first and the destination is right/second. A cyan beam moves once across the comparison plane when a scan starts. Rows resolve in place; filters expose rather than rearrange the receipt. Coral marks changed files, amber marks missing files, violet marks duplicates, and every color has a text label.

Keyboard paths follow reading order. Folder pickers are buttons, filters are native buttons with pressed state, and every result table has a text summary. Focus uses a 3 px cyan/black double ring.

## Motion policy

One signature motion: a 900 ms scan beam crosses the audit plane when comparison begins. Route panels enter with a 180 ms opacity and 8 px rise. Progress is determinate when file counts are known. Nothing loops. Under `prefers-reduced-motion: reduce`, the beam is hidden, panels appear instantly, smooth scrolling stops, and progress changes without transition.

## Asset plan and provenance

- `assets/src/verification-landscape.png`: original generated master showing two abstract glass archives joined by a verification plane.
- `public/art/verification-landscape-960.webp` and `-1440.webp`: responsive, optimized derivatives. The 960 px file is the mobile hero and stays below 300 KB.
- `public/og-image.jpg`: 1200×630 crop/composition derived from the same artwork.
- Interface icons and the aperture/check wordmark are hand-authored SVG paths. They are functional UI assets, not generated substitutes.

### Prompt sheet

Use case: stylized-concept. Asset: wide landing hero for an offline photo-backup audit utility. Subject: two translucent archival shelves made of stacked photo and video panes, separated by a narrow luminous verification channel; a few clearly visible amber gaps and coral mismatches; no interface screenshot. World: abstract dark data landscape, calm horizon, photographic depth. Materials: smoked teal glass, fine etched grid lines, tiny pearl-like checksum points, subtle film-edge details. Light: internal cyan glow with restrained amber and coral accents, deep inky shadows. Lens/composition: wide isometric editorial scene, main structures on the right and center, useful dark negative space at upper left, crisp foreground, soft distant haze. Palette words: midnight ink, sea glass, electric mint, archive amber, signal coral. Avoid: text, letters, numbers, logos, watermarks, people, faces, phones, laptops, cloud icons, padlocks, generic gradient blobs, neon cyberpunk city, excessive bloom, illegible UI, brands.

Generated with the factory Azure image model (`factory-image`) on 2026-08-28. The generated image is original for this product. Review criteria: no text artifacts, brands, human figures, misleading UI, broken geometry, or visible seams.

## Why it fits

Photo backup tools usually imitate file managers or cloud dashboards. This product is about evidence between two places. The layered landscape makes that relationship visible, while the solid receipt below keeps a 100,000-file audit readable and serious.
