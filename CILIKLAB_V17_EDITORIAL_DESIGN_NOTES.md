# CilikLab v17 — Editorial Design Upgrade

## Scope

**Visual-only enhancement of the existing multilingual v16 project.** No additional pages, games, commands, database entities, scores, workflows, or routes. User progress is preserved.

## Design improvements

- Soft off-white, warm pale-green and charcoal palette replaces heavily glowing gradients.
- Clear, readable headlines with more consistent typography and spacing.
- Editorial hero with stronger real-photography treatment and restrained floating UI chips.
- Improved 3-column discovery photography gallery and candid student-learning story images.
- Updated student and teacher dashboards with calmer photographic heroes and improved contrast.
- Refined photo sections in Explore Classes, Lessons, and Coding Workspace.
- Simpler navigation selection, coherent cards, and reduced shadow/rounded corner intensity.
- Arcade and Ciko visually aligned with the new brand while preserving all functionality.
- Lightweight scroll reveals and hover transitions, reduced-motion support, mobile layouts, and visible keyboard focus.
- Eight free Pexels photo references and local fallback images, with source documentation.

## Changed files

- `src/components/visual/RealPhoto.tsx` — editorial photo library and fallbacks.
- `src/pages/LandingPage.tsx` — updated photo selection and footer credit, existing buttons remain unchanged.
- `src/pages/student/StudentDashboard.tsx` — existing image selection only.
- `src/pages/student/LessonsView.tsx` — existing image selection only.
- `src/pages/teacher/TeacherDashboard.tsx` — existing image selection only.
- `src/pages/coding/CodingWorkspace.tsx` — existing image selection only.
- `src/main.tsx` — imports the new theme last.
- `src/website-editorial-v17.css` — new visual theme.
- `scripts/site-life-smoke.cjs` — validates eight Pexels photo sources rather than old five Unsplash ones.
- Photo credits and release notes.

## Validation

Run `npm run test:site:all`, `npm run test:l10n`, `npm run test:arcade:all`, `npm run build`, and `npm run dev` in a folder with dependencies installed. Browser QA remains required for image delivery, desktop/mobile appearance, and actual button navigation. No behavioral changes were intentionally made.
