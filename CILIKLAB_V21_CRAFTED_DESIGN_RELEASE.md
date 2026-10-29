# CilikLab v21 — Crafted Natural Premium Design (Design-Only Release)

This release continues the existing CilikLab v20 application. All 13 games, 82 playable challenges, Learning Coach, Ciko's 120-answer library, 8 language options, 4 photo slideshows, the lesson and comic workflows, and all saved-progress keys have been preserved. No new app route, game, or back-end feature is introduced.

## Design audit and changes

1. **Site-wide style coherence**: a final layered stylesheet, `src/website-v21-crafted.css`, establishes warm paper backgrounds, natural forest-green accents, consistent borders, restrained shadows, and deliberate typography. The existing feature CSS remains in place; this file loads last as a visual override.
2. **Landing page composition**: clearer typography, more deliberate hero photography crop, softer hero decoration, cleaner calls to action, and a less crowded visual hierarchy.
3. **Three existing learning-benefit cards**: converted into photo-led editorial cards with natural classroom and educator images, maintained titles/descriptions, and locally bundled illustrated fallbacks.
4. **Student and teacher dashboards**: strengthened foreground contrast over photos, cleaned up activity tiles, banners, and quick-action card presentation.
5. **Existing game and learning spaces**: consistent surfaces and accents surrounding Cilik Arcade, Story Quest, Pet Lab, and Ciko. All game artwork, functional controls, coding editors, engines, and saved identifiers remain unchanged.
6. **Interaction quality**: subtler hover states, visible keyboard focus, mobile typography and card density, light animation, reduced-motion support, and RTL-safe visual alignment without changing code direction.

## Free stock photography

The two new Pexels sources are:
- [Students using computers together](https://www.pexels.com/photo/children-using-a-computer-5621933/) — Gustavo Fring.
- [Teacher guiding pupils on a laptop project](https://www.pexels.com/photo/woman-checking-two-schoolboys-project-on-a-laptop-7742820/) — Alena Darmel.

The existing 12 Pexels photos are preserved, giving 14 catalog entries. See prior `CILIKLAB_V17_PHOTO_SOURCES.md` for existing credits. Pexels's terms: https://www.pexels.com/license/ . Photos are used illustratively; they do not show actual CilikLab customers or imply endorsement. Photos load from Pexels at runtime. The network was not accessible in this development environment, so the actual images could not be bundled or live-verified; the existing `RealPhoto` component provides local illustration fallbacks.

## Files changed

- `src/main.tsx` (loads new stylesheet last)
- `src/website-v21-crafted.css` (new site-wide visual polish)
- `src/pages/LandingPage.tsx` (three photograph-led benefit cards; text and actions unchanged)
- `src/components/visual/RealPhoto.tsx` (two photo source keys; existing component behavior unchanged)
- `scripts/site-life-smoke.cjs` (source-count expectation: 14)
- `scripts/site-v21-design-smoke.cjs` (new static integration test)
- `package.json` (adds optional `test:site:design` command)
- This release note.

## Verification

- `npm run test:all`: PASS, including Arcade, Story Quest, Pet Lab, Learning Coach, Ciko, site, localization, and slide controls.
- `npm run test:site:design`: PASS.
- TS/TSX source syntax parse: 62 files, 0 errors.
- New stylesheet CSS parse: 149 rules, 0 parse errors (tinycss2).
- Comparison with v20 showed no changes to gameplay logic, progress storage, routes, lesson models, or Ciko's answer data.
- `npm run build` **not verified**: dependencies are not installed here (`vite: not found`). Please run `npm install` and `npm run build` on a machine with npm registry access.
- Live browser/mobile rendering and click testing remain unverified. Do not treat passing static tests as equivalent to a working production browser build.

## Test locally (Windows PowerShell)

```powershell
npm install
npm run test:all
npm run test:site:design
npm run build
npm run dev
```

Visit the landing page, switch between student and teacher roles, exercise the photo galleries and cards, open Story Quest and Pet Lab, and inspect browser layouts at 375px, 768px, and 1440px widths. Confirm external photographs appear when connected to the Internet and the fallback illustrations appear otherwise.
