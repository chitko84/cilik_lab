# CilikLab v24 — Real Photography & Premium Presentation

This release only refines imagery and styling. All original features, games, levels, scoring, Ciko replies, localization, navigation, class enrolment, progress data, and persistence remain as they were in v23.

## Nine new Pexels photographs

All source pages were located and identified as free-use images under the Pexels License. The website retrieves compressed photos from the Pexels image CDN at runtime. Since this build environment cannot download remote image files, the new photographs are **not bundled** inside the ZIP. Existing local illustrations remain as `onError` fallbacks. Internet access is necessary to see the photographic versions.

| Library key | Photographer | Photo source page | Main usage |
|---|---|---|---|
| `groupInstruction` | Gustavo Fring | https://www.pexels.com/photo/lesson-in-it-classroom-5621952/ | Landing hero, educators, teacher dashboard, class discovery |
| `childrenITClass` | Gustavo Fring | https://www.pexels.com/photo/children-taking-it-classes-looking-at-a-computer-screen-5621936/ | Landing cards, student slideshow, basic class cards |
| `modernComputerClass` | Ron Lach | https://www.pexels.com/photo/students-using-computers-in-their-class-10638075/ | Landing hero, student dashboard, teacher slideshow, class cards |
| `focusedLab` | Ron Lach | https://www.pexels.com/photo/students-sitting-in-the-classroom-10638070/ | Landing photo strip and class discovery slideshow |
| `groupComputerActivity` | Ron Lach | https://www.pexels.com/photo/students-using-computers-10638065/ | Landing learning benefits, student slideshow |
| `educatorLaptop` | Pavel Danilyuk | https://www.pexels.com/photo/a-teacher-using-a-laptop-on-her-desk-8423123/ | Teacher slideshow |
| `homeStudy` | Boris Hamer | https://www.pexels.com/photo/young-child-engaged-in-online-learning-at-home-29545234/ | Landing hero and photo strip, student/comics tile and lessons |
| `computerLearners` | Gustavo Fring | https://www.pexels.com/photo/children-studying-on-computer-at-school-5621938/ | Landing cards and Python section, teacher slideshow |
| `labPortrait` | Ron Lach | https://www.pexels.com/photo/students-using-computers-10638082/ | Class discovery slideshow |

Previous Pexels assets and credits remain in the project under earlier release-note files. Current catalog: 23 photo URL entries in `src/components/visual/RealPhoto.tsx`.

## Image usage license

Pexels terms: https://www.pexels.com/license/ . Pexels photos are permitted for personal and commercial website use without required attribution; crediting creators is appreciated. Do not imply that the photographed people or photographers endorse CilikLab, and check the license again if you redistribute the stock images separately. All photos depict illustrative learning situations, not actual CilikLab pupils or staff.

## Visual changes

- More authentic classroom, computer-lab, collaboration, and home-learning photography across **existing** landing, student, teacher, class-discovery and lesson pages.
- A cleaner, editorial style: deliberate photo crops, readable overlays, subtle contrast/saturation, consistent border radii, and balanced grid spacing.
- Standard class discovery covers now use photography for introductory and problem-solving topics; programming/game categories retain the original game illustration covers.
- Existing slideshows retain previous/next, dot navigation, pause and autoplay behaviors; only their photo sources and framing changed.
- Responsive photo crops and heights on desktop, tablet, and small phones, plus keyboard focus, RTL adjustments, and reduced-motion safeguards.
- Compressed Pexels image URLs use existing `srcSet`, `sizes`, `loading`, and local fallbacks. A CDN `preconnect` was added to `index.html`.

## Preservation details

No game engine, scenario data, Ciko dialogue or voice code, authentication, router, learning analytics logic or student/teacher workflows were modified. The only existing application files touched are:

1. `src/components/visual/RealPhoto.tsx` — expanded photo catalog only.
2. `src/pages/LandingPage.tsx` — photo choices only.
3. `src/pages/student/StudentDashboard.tsx` — photo choices only.
4. `src/pages/teacher/TeacherDashboard.tsx` — photo choices only.
5. `src/pages/student/ExploreClasses.tsx` — photo choices and purely visual cover selection only.
6. `src/pages/student/LessonsView.tsx` — photo choice only.
7. `src/main.tsx` — v24 stylesheet import.
8. `index.html` — Pexels CDN preconnect.
9. `package.json` and the two older photo tests — updated test coverage.

Added: `src/website-v24-photography.css`, `scripts/site-v24-photography-smoke.cjs`, this document.

## Verification

- `npm run test:all` — passed (existing tests, 13 games / 82 challenges, Ciko, localization, and slideshow controls).
- `npm run test:site:v24` — passed (all nine photos wired, 23 URL entries, image fallbacks, mobile/RTL/reduced-motion styling).
- `npm run test:site:v23` — passed.
- TypeScript parser — 62 TS/TSX files parsed with no syntax errors.
- New stylesheet — parsed with `tinycss2`, zero syntax errors.
- `npm run build` — **not available here**: `vite: not found` because dependencies are not installed. Run `npm install` then `npm run build` on your computer.
- Runtime CDN image loads, mobile appearance and browser interaction — **not browser-verified here**. The fallback illustration will appear if Pexels is blocked or offline.

## Windows setup

```powershell
npm install
npm run test:all
npm run test:site:v24
npm run build
npm run dev
```
