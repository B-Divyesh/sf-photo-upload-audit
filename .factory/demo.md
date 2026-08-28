# Demo sandbox

- URL: `https://photo-upload-audit.sociobot.in/demo` or `https://photo-upload-audit.sociobot.in/?demo=1` (local: `http://localhost:4173/demo`).
- The sample models an iPhone export with seven files and an archive with eight files.
- It includes verified HEIC/MOV Live Photo pairs, one missing MOV partner, one changed HEIC, one duplicated HEIC, and one extra archive file.
- **Reset demo** recreates the sample in memory. **Start for real** clears the sample receipt, filters, notes, selected folders, and demo-only handles before opening `/audit`.
- Demo state is in-memory only. It never reads or writes `localStorage`, IndexedDB, OPFS, or real folder inputs.
- The service worker caches the demo shell and sample module, so `/demo` reloads offline after the first visit.
