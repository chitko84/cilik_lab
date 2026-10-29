# CilikLab v26 — Human-Centred Premium UI / Real Photography

## Scope
Design/presentation-only enhancement of the complete CilikLab v25 source. The project keeps **14 Arcade games, 90 game challenges, 80 quiz questions, Ciko's 120 bilingual prepared answers, the 8 language selections (six partial beta), student and teacher flows, local progress, navigation, and existing controls**. No new feature or game logic was introduced.

## Visual refinements
- A coherent editorial palette: off-white paper, natural forest green, soft borders and restrained shadows; reduced glossy or futuristic decoration.
- Landing hero with more deliberate type scale, whitespace, natural photo crops, simplified headline treatment and calmer action hover effects.
- Student/teacher welcome banners with readable green overlays on real photos at large and small viewport widths.
- Better photo cards, featured learning tiles, lesson and reading banners, quiz hero, Arcade lobby cards and progress-page visual treatment.
- Improved responsive spacing, text wrapping for long translations, focus indicators, reduced-motion behavior and RTL presentation.
- Original interactive CilikLab controls, slideshow timers, gameplay feedback and screen flows remain unchanged.

## New source-verified Pexels photography
All six photo pages were checked against Pexels web listings and tagged as free-to-use, with subjects selected to match the page. The source listing is verified but CDN downloads and on-device rendering could **not** be tested in this build environment.

| Photo key | Pexels source | Photographer | Intended subjects |
|---|---|---|---|
| `roboticsWorkshop` | https://www.pexels.com/photo/children-making-robots-7869085/ | Vanessa Loring | Workshop teamwork and robotics |
| `libraryReaders` | https://www.pexels.com/photo/students-reading-books-in-a-library-8926840/ | Thirdman | Children reading together |
| `learningPartners` | https://www.pexels.com/photo/a-two-girls-using-laptop-with-classmates-5212695/ | Max Fischer | Learning together on laptops |
| `interactiveClassroom` | https://www.pexels.com/photo/kids-in-a-classroom-7743256/ | Alena Darmel | Children in interactive lessons |
| `readingFocus` | https://www.pexels.com/photo/a-girl-reading-at-a-book-at-her-desk-in-a-classroom-8618017/ | Yan Krukau | Quiet individual reading and learning |
| `independentStudy` | https://www.pexels.com/photo/a-child-doing-his-homework-5303516/ | Tima Miroshnichenko | Individual study and progress |

License: https://www.pexels.com/license/ — the Pexels license permits free website use, with restrictions including not implying endorsement by pictured people. The photographs are illustrative stock images and are **not photographs of actual CilikLab students**.

The photo catalog now has 29 unique Pexels CDN URLs, compared with 23 in v25. The six new images appear across the existing landing-page hero/benefit cards, student and teacher dashboards, quiz page, comics library, lessons and progress area. Existing slide controls and interactions are not altered.

### Loading and offline fallback
All new photographs use the existing `RealPhoto` component's responsive `srcSet`, lazy/eager loading, asynchronous decoding, no-referrer policy and bundled local `.webp` fallback images. Photography is **fetched online**, not embedded in this ZIP, because the build runtime could not retrieve Pexels CDN images; the existing illustrations remain visible when photos fail. No paid services or image packages were added.

## Files modified
- `src/main.tsx`: import `website-v26-human-premium.css` last.
- `src/website-v26-human-premium.css`: new design-only CSS layer.
- `src/components/visual/RealPhoto.tsx`: six sourced photo registry entries.
- Existing visual/photo usage only: `src/pages/LandingPage.tsx`, `src/pages/student/StudentDashboard.tsx`, `src/pages/teacher/TeacherDashboard.tsx`, `src/pages/quiz/QuizPage.tsx`, `src/pages/comics/ComicLibrary.tsx`, `src/pages/student/StudentProgress.tsx`, `src/pages/student/LessonsView.tsx`.
- `scripts/site-v26-design-smoke.cjs` + `test:site:v26` script.
- Three older visual-test scripts updated to allow catalog growth or display-photo substitutions without reducing their original safety coverage.

## Validation
- `npm run test:all`: **PASS** (Arcade and creative-learning gameplay tests, 80-question quiz, Ciko, localization, slideshow, basic website integration).
- `npm run test:site:v26`: **PASS** (29 photo entries, all six newly sourced images used, CSS parsing, local fallbacks, RTL/reduced motion and existing routes).
- `npm run test:site:design`: **PASS**.
- `npm run test:site:v22`, `npm run test:site:v23` and `npm run test:site:v24`: **PASS**.
- PostCSS stylesheet parsing: **PASS**.
- Preservation comparison: all **175 baseline v25 files** are present. No game engine, lesson mechanics, quiz question bank, scoring, Ciko knowledge, account-state or route logic changed.
- `npm run build`: **NOT RUN SUCCESSFULLY** — `vite: not found` because dependencies are not installed. Full browser click testing, photo CDN loading, viewport QA and audible speech remain unverified here.

## Test on Windows
```powershell
npm install
npm run test:all
npm run test:site:v26
npm run build
npm run dev
```
Verify desktop (1440px) and mobile (390px): landing photos and buttons, both dashboards, quiz controls, comics reader, lesson navigation, RTL language switching, voice playback, images without network (fallback) and game completion/replay. Check images with browser DevTools for invalid URL or layout issues.
