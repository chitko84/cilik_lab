# CilikLab v18 — Natural Premium Visual Polish

## Scope
A **visual-only upgrade** to CilikLab v17. All existing games (11), challenges (70), language settings, lessons, Ciko knowledge/voice behavior, comics, coding workspace, teacher functionality, progress, and navigation are preserved.

## Design improvements
- One restrained visual system: warm off-white backgrounds, pine/forest-green actions, subtle borders and shadows, comfortable typography and whitespace. The design deliberately avoids excessive gradients, futuristic neon, glass and floating icons.
- Cleaner typography, photo framing and image crop rules across the landing page, student/teacher dashboards, lesson discovery, classes, Python workspace and the Ciko panel.
- A large real classroom photograph inside the existing educator landing section, and a compact real coding-classroom photograph beside the **existing** functional Python sample.
- Enhanced real-photo storytelling on existing landing cards and student/teacher sections. Existing 11 game illustrations and 3 comics are retained rather than replaced with unrelated stock photos.
- Improved readability for student dashboard's **Up next** action card; stronger contrast over teacher/student photographic banners.
- Clear focus indicators, reduced-motion fallback, mobile-friendly card heights and RTL presentation safe-guards. Actual game movement/code direction is unchanged.
- Responsive image `srcSet`/`sizes` helps browsers choose smaller photos; photos remain lazy-loaded except the landing hero.

## Editorial photo sources added in v18

Photos are loaded on demand from Pexels. They **are not included as binaries**; all image components use existing locally bundled illustration fallbacks if a photo cannot load. These are stock-photo models, not actual CilikLab learners and not people endorsing CilikLab.

| Photo library key | Pexels photo page | Contributor | Context |
|---|---|---|---|
| `realComputerLab` | https://www.pexels.com/photo/teacher-assisting-student-in-computer-lab-classroom-32394664/ | Haidar Azmi | Student computer lab, teacher guidance |
| `classLaptop` | https://www.pexels.com/photo/students-busy-using-laptops-in-the-classroom-7742816/ | Alena Darmel | Classroom students using laptops |
| `teacherSupport` | https://www.pexels.com/photo/a-teacher-and-a-boy-in-front-of-a-computer-8199610/ | Yan Krukau | Individual support at a computer |
| `learningTogether` | https://www.pexels.com/photo/a-teacher-with-her-students-7742823/ | Alena Darmel | Teacher and students learning together |

The eight previously selected Pexels photos remain recorded in `CILIKLAB_V17_PHOTO_SOURCES.md`. Pexels license: https://www.pexels.com/license/ — free personal/commercial usage; attribution appreciated; do not imply stock subjects endorse the product.

## Code scope
- Updated photo presentation and optimized photo markup: `src/components/visual/RealPhoto.tsx`
- Updated photo choices and photo-only additions inside existing components: `src/pages/LandingPage.tsx`, `src/pages/student/StudentDashboard.tsx`, `src/pages/teacher/TeacherDashboard.tsx`, `src/pages/coding/CodingWorkspace.tsx`, `src/pages/student/ExploreClasses.tsx`
- Added design-only stylesheet `src/website-v18-natural.css`, loaded after existing styles by `src/main.tsx`.
- Updated the existing `test:site:life` checks for 12 photo sources and v18 stylesheet layering.
- No game engines, content sets, context/state hooks, storage keys, or routes changed.

## Run and test locally
```powershell
npm install
npm run test:site:all
npm run test:l10n
npm run test:arcade:all
npm run build
npm run dev
```

### Manual browser checks
Check desktop/mobile landscape and portrait for landing page, student/teacher dashboards, classes, lessons, comics, coding workspace, Ciko and Arcade. Test the student/teacher entry buttons, landing Python sample Run, class filters, language selector, RTL layout, all tabs and the game controls. Confirm real photos appear online and local fallback images appear when network access is disabled. Test keyboard navigation and reduced-motion.

**Known limitation:** Headless browser/Vite build are not verified in this generation environment because the project npm dependencies are not available. Passing syntax and smoke tests is not equivalent to confirming pixel-perfect browser visuals.
