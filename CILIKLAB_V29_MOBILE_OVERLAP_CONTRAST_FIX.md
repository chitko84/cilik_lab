# CilikLab v29 — Mobile, Photo Overlap and Text Contrast Repairs

## Built from
`CilikLab_V28_Arcade_Runtime_Error_FIXED.zip` (the version that corrected the missing `localizedGameTitle` import). This package contains the entire project, not just a stylesheet.

## What was causing the unwanted overlaps

Previous design layers sized the `PhotoSlideshow` `<div>` at `width: 100%` even inside horizontal `display: flex` feature banners. The banner text and button were competing for the same row. In the ComicCode banner, a second library photograph was intentionally placed as an absolutely positioned, rotated card partly covering the first photo and nearby content. Landing photo cards also inherited conflicting mobile grid-row rules from several releases.

## Repairs applied

- **Explore Classes and Teacher Dashboard**: fixed-size framed slideshows on desktop, with clearly separated text and actions; photographs become full-width top-of-card media on phones. Slideshow controls and autoplay functionality are untouched.
- **Student dashboard**: the learning photo slideshow and quiz-photo teaser now stack vertically on mobile, instead of competing with headings or buttons for width.
- **ComicCode**: two library photographs render in separate side-by-side cells, rather than one image rotating over the other or blocking the caption. On narrow mobile screens, the caption follows below both images.
- **Landing page**: photo tiles are isolated and cropped within their own card bounds, with a single-column layout at narrow widths. No shared grid-row overlaps. The existing buttons and links remain unchanged.
- **Welcome banners**: strengthened the photography overlay and text contrast, protected action cards and teacher controls from long labels, and kept photography behind (not over) interactive elements.
- **Student Progress / Quiz / Arcade / coding workspace**: safer image and text sizing, scrollable code content, more robust compact layouts and long-text wrapping.
- **Mobile chrome**: improved top bar spacing, 5-tab mobile navigation height (including device safe area), active-tab contrast, and small translated labels. Right-to-left support and reduced-motion preferences retained.

## Files changed from v28

- `src/main.tsx`: one additional final stylesheet import.
- `package.json`: one additional optional layout regression test script.

## Files added

- `src/website-v29-mobile-overlap-fix.css`: tightly scoped styling fixes; no logic or game state changes.
- `scripts/site-v29-mobile-layout-smoke.cjs`: style-integration and preservation guards.
- `CILIKLAB_V29_MOBILE_OVERLAP_CONTRAST_FIX.md`: these notes.

## Preserved without modification

All 14 games and 90 levels, the 80-question knowledge quiz, the Ciko library and speech logic, all 8 language selections and their existing partial localization, lesson content, comics, four photo slideshows (including pause/resume logic), achievements, progress persistence, teacher workflows, all original assets, and the previously applied Arcade runtime error fix.

## Tests run and limitations

- Existing `npm run test:all`: passed.
- Existing `npm run test:site:v27`: passed.
- New `npm run test:site:v29`: passed.
- New CSS parsed with PostCSS; 67 source TS/TSX files transpile without syntax errors.
- ZIP archive tested and extracted cleanly.
- **Full Vite production build not verified in this environment**: project node_modules / Vite are not installed.
- **Live responsive browser QA not verified**: the available browser is blocked from navigating to local or hosted pages. This update is based on source-level layout analysis and static regression tests. Check widths 320, 375, 390, 640, 768, 1024 and desktop in the browser before judging pixel-perfect readiness.

## Start locally

```powershell
npm install
npm run test:all
npm run test:site:v29
npm run build
npm run dev
```

In Chrome DevTools, turn on device emulation and check Landing, Student Dashboard, Teacher Dashboard, Explore Classes, Lessons, ComicCode, Knowledge Quiz and Arcade at 320px, 375px, 390px and 768px wide. Ensure that real photos load or switch to their existing local illustrations gracefully when offline.
