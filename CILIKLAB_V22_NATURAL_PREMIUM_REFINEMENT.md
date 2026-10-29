# CilikLab v22 — Natural Premium Design Refinement

## Scope
This release is strictly a visual design refinement of v21. It does not intentionally add or change games, challenges, routes, classroom actions, lesson data, Ciko responses, scores, language behavior or browser storage schemas.

## Visual updates
- Photo-led, editorial landing hero with clearer hierarchy and more natural framing.
- Asymmetrical large-feature photo grid; stacked responsive photo cards on small screens.
- Subtle, consistent forest/sage/cream palette with a restrained warm accent.
- Better photography crops, readability, card proportions and image hover interactions.
- Rebalanced student and teacher welcome banners and quick-action cards.
- Cohesive navigation rail and role controls, clearer focus states.
- Refined teaching/learning ribbons, class and comic cards.
- Consistent surfaces for Ciko, Arcade, Story Quest, Pet Lab, and Learning Coach.
- Mobile breakpoints at 1100px, 860px, 640px and 390px.
- RTL visual positioning and prefers-reduced-motion handling.

## Modified existing files
- `src/main.tsx` — imports the v22 style layer last.
- `package.json` — adds the v22 visual smoke-test script.

## Added files
- `src/website-v22-refined.css` — all design-only changes.
- `scripts/site-v22-visual-smoke.cjs` — smoke tests for visual integration and existing hooks.
- `CILIKLAB_V22_NATURAL_PREMIUM_REFINEMENT.md` — this release record.

## Preservation
Existing v21 application and game source files are untouched, including the logic for 13 games/82 challenges, navigation, Ciko's content and voice behavior, languages, comics, teacher/student workflows, and stored progress.

## Tests run
- `npm run test:all` — PASS (all Arcade, creative learning, Ciko, site, localization and slideshow smoke tests).
- `npm run test:site:design` — PASS (v21 compatibility test).
- `npm run test:site:v22` — PASS.
- TypeScript/TSX syntax parsing — PASS for 62 source files.
- New CSS parsed with tinycss2 — PASS.
- ZIP integrity — PASS.

## Not verified
- `npm run build` could not complete in this environment because Vite is not installed here (`vite: not found`).
- Runtime image requests to the Pexels CDN cannot be checked in this offline container; the existing RealPhoto local illustration fallbacks are retained.
- Browser visual/interaction verification across responsive widths is still required. Automated smoke tests do not prove every button or click works at runtime.
- The six beta locales have incomplete game/lesson translations inherited from the previous version; this visual-only update does not change their translation coverage.

## Run on Windows
```
npm install
npm run test:all
npm run test:site:design
npm run test:site:v22
npm run build
npm run dev
```

Manual review: check the landing page at 375px, 768px and 1440px; student/teacher banners; Arcade card filters and links; Ciko voice and question playback; right-to-left selector and text; Pexels photo fallbacks (offline); keyboard focus; and `prefers-reduced-motion`.
