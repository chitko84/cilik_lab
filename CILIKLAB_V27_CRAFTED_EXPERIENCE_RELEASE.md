# CilikLab v27 — Crafted, natural, premium design

## Goal
Refine the **complete existing application** as a cohesive, warm, naturally photographed children's learning product without changing feature logic or gameplay. Starting baseline: CilikLab v26.

## What's changed
- Added a single last-loaded stylesheet `src/website-v27-crafted-experience.css` to bring the inherited styles into one coherent visual language: warm paper, forest green, gentle gold, restrained shadows, clear content hierarchy and consistent radius/focus states.
- Removed *decorative* blur globes from the public hero via CSS rather than altering any components or behavior.
- Refined the public landing hero, responsive destination card grid, the three-photo documentary strip, photographic benefit cards, the actual Python code sampler, and teacher invitation.
- Improved contrast and text legibility in existing student/teacher photo banners, navigation, dashboard metric tiles, quiz page, Arcade outer cards, Ciko-compatible surfaces, and ComicCode reading banner.
- Integrated seven new genuine Pexels photo sources into existing visible components across landing, student, teacher, classes and comics. All existing photos remain in the library.
- Added a noninteractive third documentary photo tile on the landing page, and a small secondary library photo on the existing comics banner; neither adds buttons, routes or state.
- Preserved the **four existing slideshow implementations and three slide frames per view**, as well as controls, autoplay and accessibility logic.
- Maintained reduced-motion support, visible keyboard focus, RTL banner treatment, touch-friendly input spacing and mobile editorial layouts.

## Existing functionality intentionally untouched
All 14 coding games/90 challenges, 80 quiz questions and score persistence, Ciko knowledge, speaking controls, eight language options (six still beta), authentication/role switching, student/teacher workflows, lesson content, saved Arcade scores, and all existing routes remain present. No gameplay engines, state logic, quiz question bank, assistant answers, or existing navigation handler bodies were altered.

## Source files touched
- `src/components/visual/RealPhoto.tsx`: append seven photo source constants only.
- `src/pages/LandingPage.tsx`: swap selected visual-only photo references, add one non-interactive photograph tile.
- `src/pages/student/StudentDashboard.tsx`: swap a dashboard promo photo and slideshow frame photograph.
- `src/pages/teacher/TeacherDashboard.tsx`: swap one slideshow-frame photograph.
- `src/pages/student/ExploreClasses.tsx`: swap one slideshow-frame photograph.
- `src/pages/comics/ComicLibrary.tsx`: add one decorative image to the existing banner.
- `src/main.tsx`: import v27 stylesheet last, and group static imports before the app mount (the same import evaluation order).
- `scripts/site-v26-design-smoke.cjs`: accept the **minimum** prior photo count rather than fixed v26 count.
- `package.json`: add the `test:site:v27` command.
- Added `scripts/site-v27-design-smoke.cjs`, this document and the photo credits.

## Validation and remaining limitations
- `npm run test:all` — confirms earlier Arcade, creative, Ciko, localization, slideshows, Quiz and Spark Circuit checks.
- `npm run test:site:v24`, `npm run test:site:v26`, `npm run test:site:v27` — photograph continuity and latest visual contract.
- Parsed all authored CSS and TS/TSX files to check syntax; archive integrity verified.
- Production Vite build and live click-through are **not claimed** to pass: project `node_modules` are not installed in this environment. Run `npm install`, `npm run build`, `npm run dev` and test at 390px, 768px and 1440px on your actual machine.
- New Pexels images are **online assets**, not bundled media; existing bundled illustrations remain as network-error fallbacks.

## Windows quick start
```powershell
npm install
npm run test:all
npm run test:site:v27
npm run build
npm run dev
```

**Important:** This is a visual-only release. No new functionality was invented or substituted for existing functionality.
