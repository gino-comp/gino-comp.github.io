# Project QA

## Completed checks

- Project JSON parses successfully.
- TypeScript / TSX files have no parser-level syntax errors in the available environment.
- All local `@/` imports resolve to files inside `src/`.
- All intended locale routes exist.
- No fabricated `contact@ridm.tech` address remains.
- Unsupported draft team claims (CERN / AMD / SniperSim) are not present.
- Mobile system-flow uses a dedicated stacked layout instead of shrinking the desktop SVG.
- Korean and English dictionaries are separated in `src/lib/i18n.ts`.
- Sitemap, robots, localized metadata, canonical / alternate language metadata and JSON-LD are included.
- Reduced-motion and keyboard focus states are included.

## Environment limitation

A full `npm install` / `next build` could not be completed in the artifact environment because access to the npm registry timed out twice. The project therefore received static source QA here, while the included GitHub Actions workflow performs `npm install`, `npm run typecheck`, and `npm run build` in GitHub after push.

Recommended first command after cloning:

```bash
npm install
npm run typecheck
npm run build
```
