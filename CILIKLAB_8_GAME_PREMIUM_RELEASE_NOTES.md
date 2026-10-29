# CilikLab — Premium Playground + 3 New Coding Games

This release updates the existing CilikLab project in place. All previously supplied student, teacher, lesson, comic, code execution, Ciko, Maze Creator, and Arcade modules remain in the source. It does **not** reset the localStorage progress keys or rename the original Arcade levels.

## New visual direction

The Play / Cilik Arcade lobby has a new original premium, kid-friendly theme:
- Calm mint and cream surfaces with dark-teal actions and warm accent colors
- A bright new adventure hero with Ciko and floating game motifs
- Clear **Continue Playing** and **Explore Map** actions
- Eight illustrated game cards with progress, level counts, and best-score XP
- More spacious responsive layouts and simplified tool shortcuts
- Three new custom, locally hosted SVG illustrations
- Updated teal styling for the original maze and coding screens, without changing their underlying game logic

The new theme is scoped mostly to Arcade; unrelated student and teacher screens retain their working layouts.

## Eight playable games — 52 levels

| Game | Levels | Core interaction |
|------|--------|------------------|
| Code Maze | 6 | Move robot, collect stars, reach door |
| Code-to-Escape | 6 | Write restricted Python-style movement commands |
| Bug Detective | 8 | Fix code mistakes and earn points |
| Logic Builder | 8 | Reorder command blocks |
| Space Invaders / Galaxy Defender | 6 | Move and shoot in manual/code mode |
| **Pixel Painter (NEW)** | **6** | Tap squares or run restricted `paint(x, y, color)` commands to draw matching pixel art |
| **Treasure Sorter (NEW)** | **6** | Place number/logic cards in the correct bin to practice if/else and comparisons |
| **Loop Garden (NEW)** | **6** | Plant flowers by moving manually or running `plant()`, `move_right()`, and simple `for` loops |

The new levels use unique persistent progress IDs (`pixel-*`, `sort-*`, `garden-*`). Score changes are recorded through the same existing per-level best-score store as the original Arcade: replaying does not duplicate rewards; a higher score improves the total by the difference only.

All three games have Malay and English text for level titles, objectives, hint panels and game controls. No paid assets or APIs are required.

## Integration
- Added three worlds to the Adventure World Map, now 8 worlds / 52 levels.
- Added Pixel Artist, Condition Expert, and Garden Guardian gameplay-based badges, making 12.
- Continued the teacher and student Arcade completion summaries using the new game prefixes.
- Preserved custom maze data, comic reading progress, older scores, original lesson IDs and original game IDs.
- Arcade analytics automatically include the additional worlds because they use shared progress state.

## Testing performed here
- `npm run test:arcade`: PASS — original four games, 28 challenges, 12 solvable mazes
- `npm run test:arcade:expanded`: PASS — six Space Invaders missions and safe command logic
- `npm run test:arcade:new`: PASS — 18 new levels, 3 game types, win paths, scoring formulas, rejection of arbitrary commands
- Parsed all 47 TS/TSX source files: no syntax errors
- All 8 Arcade SVG files: valid XML
- ZIP archive integrity and preservation of original file paths: verified

### Still to verify on your Windows machine

A complete Vite build, browser interactions, responsive layout on a real phone, and Ciko audible voice were not run in this environment because npm dependency installation is unavailable. These require local verification; do not represent this release as browser tested until you complete those checks.

## Running on Windows PowerShell

```powershell
npm install
npm run test:arcade:all
npm run build
npm run dev
```

Open `http://localhost:3000`, enter the student portal, select **Play**, and try each of the eight games.

### Suggested judge walkthrough
1. Show the new mint-green Arcade lobby and eight illustrated game cards.
2. Select Pixel Painter, paint a heart, and watch the score/progress change.
3. Open Treasure Sorter, classify a few numbers with if/else, and complete the level.
4. Open Loop Garden, use `plant()` and `move_right()` to grow flowers. Try the loop mission.
5. Demonstrate Space Invaders' code-controlled shooting, then Code-to-Escape.
6. Show the 8-world Adventure Map, earned badges and saved Arcade progress.
7. Demonstrate bilingual Ciko voice on a machine with supported browser voices.

## Files added
- `src/pages/arcade/addons/newGamesEngine.ts` — three deterministic, restricted engines + level content
- `src/pages/arcade/addons/NewArcadeGames.tsx` — three interactive game screens
- `src/pages/arcade/addons/newGames.css` — responsive visual system for new games
- `src/pages/arcade/addons/ArcadeHome.tsx` — new Arcade lobby
- `src/pages/arcade/addons/ArcadeHome.css` — new premium, calm theme
- `public/arcade/{pixel-painter,treasure-sorter,loop-garden}.svg` — original game covers
- `scripts/arcade-new-games-smoke.cjs` — game rules verification

## Files updated
- `src/pages/arcade/ArcadeView.tsx` — routing to new games and premium home
- `src/pages/arcade/addons/AdventureExtras.tsx` — 8 worlds, 52 levels, 3 new badges
- `src/pages/student/StudentProgress.tsx` — counts new Arcade challenges
- `src/pages/teacher/TeacherDashboard.tsx` — counts new Arcade challenges
- `src/index.css` — polish the styling of existing Arcade game screens
- `package.json` — `test:arcade:new`, `test:arcade:all`; pinned TypeScript 5.9.3 preserved

**No original modules were deleted.**
