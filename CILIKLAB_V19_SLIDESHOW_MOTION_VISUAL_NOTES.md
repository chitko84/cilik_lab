# CilikLab v19 — Natural Motion and Photography Slideshows

## Scope
Visual presentation update only, based on v18. No new games, new routes, changed user data schemas, revised lesson rules, altered XP calculations, or modified Ciko knowledge or multilingual support.

## New photographic slideshows
- **Landing page:** Large, editorial photo slideshow inside the existing hero, with localized Malay/English captions.
- **Student dashboard:** Three-photo learning gallery in the existing learning-together banner.
- **Teacher dashboard:** Three-photo classroom gallery in the existing educator feature banner.
- **Explore Classes:** Three-photo gallery in the existing class discovery banner.

Each slideshow uses photographs already included in the existing v18 RealPhoto library, with local illustration fallbacks. Photo source pages and usage notes remain in `CILIKLAB_V17_PHOTO_SOURCES.md` and v18 documentation. Photos are loaded from Pexels online, not embedded in this ZIP. Images depict illustrative classroom situations rather than actual CilikLab users.

## Interaction and accessibility
- Previous and Next controls
- Selectable slide indicators
- Pause and Resume controls
- Left and Right arrow-key navigation when controls are focused
- Automatic playback pauses on pointer hover or keyboard focus
- Playback stops when the slideshow is outside the viewport or the browser tab is not visible
- Respects `prefers-reduced-motion`: autoplay and image motion disabled
- Screen-reader descriptions, Malay/English accessible control labels and visible focus outlines
- Small responsive slide controls for tablet and mobile

## Additional motion polish
- Calm, staggered content entrances on the landing page
- Gentle image pan only when animations are enabled
- More consistent interactive-card lift and shadow transitions
- Restrained banner fade-in and section interaction styles
- No animated interference with Arcade controls, coding editors or teacher forms

## Files changed versus v18
Modified:
- `src/pages/LandingPage.tsx`
- `src/pages/student/StudentDashboard.tsx`
- `src/pages/teacher/TeacherDashboard.tsx`
- `src/pages/student/ExploreClasses.tsx`
- `src/main.tsx`
- `package.json` (test script only)

Added:
- `src/components/visual/PhotoSlideshow.tsx`
- `src/components/visual/PhotoSlideshow.css`
- `src/website-v19-motion-slides.css`
- `scripts/site-v19-slides-smoke.cjs`
- `CILIKLAB_V19_SLIDESHOW_MOTION_VISUAL_NOTES.md`

## Verification performed
Passed:
- `npm run test:site:all`
- `npm run test:site:slides`
- `npm run test:l10n`
- `npm run test:arcade:all`
- 60 TypeScript/TSX files parsed with zero syntax errors
- Both new CSS files parsed without errors
- ZIP CRC and file preservation checked

Limits: This environment lacks cached Vite/React dependencies and npm installation from an external registry is not available. A full `npm run build`, audible browser checks, and actual click-through in Chrome could not be completed. Run the checks below on a Windows PC and test all slideshow controls at desktop and mobile widths.

## Windows check
```powershell
npm install
npm run test:site:all
npm run test:site:slides
npm run test:l10n
npm run test:arcade:all
npm run build
npm run dev
```

## Manual browser checklist
- Landing: Next, Previous, dots, Pause, Resume; verify text and original student/teacher links remain clickable.
- Student: learning-banner photo controls; check that the Explore Classes button still works.
- Teacher: classroom photo controls; check View Classes, Create Class and Support Queue.
- Explore Classes: photo controls while search, filters, enrollment and modal interactions work.
- Set OS/browser reduced motion and check that slides stop changing automatically.
- Use keyboard Tab, Left and Right arrows to navigate slides; check focus and screen-reader labels.
- Disable internet and verify the local illustration fallbacks.
