# CilikLab v37 — Homepage Project Introduction

This release is based directly on the user-supplied `CilikLab_V36_GitHub_Vercel_Telegram_Ready_No_Secrets(1).zip`.

## Objective

Explain what CilikLab is, who it serves, and how children learn, without changing any existing system logic or inventing new product capabilities.

## Implemented

- Added a compact **About CilikLab** section immediately after the existing homepage hero and before the existing Discover cards.
- Introduced CilikLab as a child-friendly programming learning platform built around coding games, guided lessons, real beginner Python practice, quizzes, and interactive comic stories.
- Added separate explanations for **young learners** and **teachers**.
- Added a small three-step learning journey: **Explore → Try → Improve**.
- Used an authentic classroom photo already available in the existing real-photo library, retaining its local illustration fallback. This is illustrative stock photography, not an image of actual CilikLab users.
- Kept image and text in separate grid areas: no absolute overlays or overlapping photo cards.
- Added responsive tablet/mobile layouts, proper text wrapping, RTL directional arrow handling, and reduced-motion support.
- Localized every new line of introduction copy into all eight available language options: Malay, English, Bengali, Burmese, Nigerian Pidgin, Dari, Arabic, and Indonesian. These translations have not been reviewed by native speakers.

## Existing features preserved

No changes to:
- student/teacher login flow, dashboards, navigation, or saved progress;
- 19 Arcade games, 152 Arcade levels, or the 150 Daily Coding Solver problems;
- quiz bank, Ciko voice system, lesson content, or multilingual game resources;
- existing 10 English and Malay-edition comic card links, three classic comics, and readers;
- Live Classroom, Telegram backend, Vercel API, or their configuration.

All 240 original v36 files were confirmed present and unchanged except for:
1. `src/pages/LandingPage.tsx` (one component import and one placement)
2. `src/main.tsx` (one CSS import)
3. `package.json` (one test command and registration)

New files:
- `src/pages/landing/ProjectIntroduction.tsx`
- `src/pages/landing/introCopy.ts`
- `src/website-v37-home-intro.css`
- `scripts/v37-homepage-intro-smoke.cjs`
- This release note.

## Validation

- `npm run test:all`: PASS — all original regression tests and new v37 integration checks.
- `npm run test:site:v37`: PASS — all eight locales, content, responsive rules, accessibility hooks, homepage placement, and preserved original entry routes.
- TypeScript/TSX syntax parse: PASS, 86 source files.
- CSS syntax parse: PASS, 36 stylesheets.
- Preservation comparison: PASS, 240 original v36 files present.
- `npm run build`: NOT RUN SUCCESSFULLY — `vite: not found` because local project dependencies are not installed in the execution environment.
- Real desktop/mobile browser rendering: NOT VERIFIED.

## Run locally

```powershell
cd ciliklab-main
npm install
npm run test:all
npm run build
npm run dev
```

Then open the local address reported by Vite (normally http://localhost:3000) and scroll below the landing-page hero. Test English, Malay, Arabic and Burmese at mobile and desktop widths. Verify that the photo loads or displays the bundled fallback, and that the original student/teacher buttons still work.

## Deployment

All original v36 GitHub, Vercel, Telegram, and meeting-server configuration files are retained unchanged. Configure tokens as *private server environment variables*, never in the frontend or Git repository. No new environment variables or dependencies are required by this release.
