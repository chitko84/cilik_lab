# CilikLab — Phase 1 Update

This is an additive update to the original CilikLab project. The existing class catalogue, coding workspace, Python execution service, 3-stage hints, visual code tracing, attempts, reflections, teacher management and community modules remain in place.

## Implemented

- **New public landing page** with CilikLab branding, clean modern layout, a real licensed Unsplash photograph (served from Unsplash), teacher/student entry buttons, a small introductory Python sampler, and improved mobile presentation.
- **Malay-first language provider**, with persistent Bahasa Melayu / English switch in the landing page, application header and Settings. Default language is Malay; selection survives refresh.
- **Translated core application navigation** for both student and teacher roles, key dashboard labels, and the four interactive beginner lessons (including Malay explanations, summaries and takeaways). Python code, user-generated content, course titles, teacher-authored text and advanced workspace tools are left as-is to avoid changing their meaning or saved data.
- **Mobile app-like bottom navigation** for students (Home, Learn, Code, Progress, Me) and teachers (Home, Classes, Students, Help, More), with access to all existing secondary sections through the mobile side menu.
- **Visual polish** for the application shell: refined backgrounds, cards, spacing, focus indicators, touch targets, reduced-motion support, simpler dashboard shortcuts for young learners, and a clearer responsive header.
- **CilikLab app assets**: derived favicon and launcher icons from the supplied logo, plus a web app manifest. This is not an offline PWA; it does not include a service worker.
- Replaced public-facing “demo” and “prototype” language with regular product language, while keeping the existing test accounts and reset function available.

## Deliberately not changed in Phase 1

- No changes to the existing Python runtime, exercise scoring, localStorage keys or teacher/student records.
- No changes to the 12 original classes or their saved content.
- **Games, comic flipbooks and Ciko voice assistant** are scheduled for Phases 2 and 3 respectively, and are not represented as completed in this archive.
- The full existing application is not yet translated: several older learning and teacher tools still have English-only labels; the Malay/English foundation and four introductory lessons are ready for expansion.

## Run

```bash
npm install
npm run dev
# Open http://localhost:3000
npm run lint
npm run build
```

The source includes the original `package.json`, lockfile and Vercel configuration. No new npm packages were added.

## Verification & limitations

- Syntax-check was performed over all TypeScript and TSX source files using the available TypeScript compiler's transpilation diagnostics; no parse errors were found.
- **A complete dependency-based Vite build and runtime browser test could not be run in this workspace** because npm registry requests failed with `EAI_AGAIN`. Please run `npm install`, `npm run lint` and `npm run build` in your local environment before deployment.
- The hero photograph is loaded from Unsplash at runtime and requires an internet connection. Photo credit: Vitaly Gariev (Unsplash), https://unsplash.com/photos/young-boy-learning-on-a-laptop-at-a-desk-5jeHKPNLdLY. Unsplash License: https://unsplash.com/license.
- The existing Python execution service includes browser-side dynamic evaluation of student code. It should be replaced or isolated securely before allowing untrusted public submissions from children. No safety claim is made for production deployment.
- LocalStorage is still per-browser. Teacher/student data is not synchronised across devices. A proper authenticated backend is required for multi-user production use.

## Recommended manual regression checks

1. Open landing page at 390px and 1440px; switch BM ↔ EN; try code sampler and student/teacher entry.
2. On a student account, test bottom navigation and the side menu; ensure all original screens remain reachable.
3. Open Lessons & Challenges; switch BM ↔ EN and test every slider and condition switch.
4. Open Coding Workspace; run an existing exercise, inspect hints, trace steps, save attempts and restore drafts.
5. Switch to teacher account; create/view classes, inspect student attempts, support requests and reports.
6. Refresh the browser; confirm language preference, classes and existing stored state persist.
7. Test 320px, 390px, 768px and 1440px widths. Check overlays, tab bar, code editor and dialogs.

## Phase 2 / Phase 3

- Phase 2: Three playable Cilik Arcade games (Code Maze, Bug Detective, Logic Builder) with basic scoring, and three comic-book cards and flipbook integration for URLs the project owner adds later.
- Phase 3: Animated Ciko 3D assistant with bilingual predefined tutoring text and **audible** Malay/English voice playback; integrate contextual guidance into lessons and coding workspace.
