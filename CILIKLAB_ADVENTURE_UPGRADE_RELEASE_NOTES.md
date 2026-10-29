# CilikLab — Adventure Upgrade Release Notes

This archive upgrades the existing CilikLab Phase 2 Premium Mobile Arcade project. It does not overwrite original student data, lessons, teacher workflows or the 28 original challenges.

## Added
- Fifth Arcade game: Space Invaders / Galaxy Defender with six missions, playable manual movement/shooting and a safe Python-style command interpreter supporting move_left(), move_right(), shoot() and simple for/range loops.
- Illustrated five-world Arcade landing page and Adventure World Map; per-level navigation and Continue Adventure based on saved completion.
- Maze Creator (7x7/9x9 grids, wall/path/start/door/star tools, undo/redo, maze validation, play testing, name/save/load/delete in local browser storage).
- Bilingual Ciko talking assistant screen with original lightweight **CSS 3D-styled** animated robot, scripted Malay/English explanations, Web Speech API playback, replay, stop, mute, visible subtitles and unavailable-voice feedback.
- Nine achievement badges driven by gameplay completion or saved mazes, and an Arcade Insights page with recorded scores, attempts, hints, code errors and progress.
- New original Galaxy Defender SVG cover art and original vector sprites for spaceship and aliens.
- Space Invaders score tracking using the same best-score store as the existing Arcade; official cumulative XP awarded only for new bests.
- Student mobile navigation now has Home / Learn / Play / Ciko / Me; desktop sidebar Ciko navigation also added.
- Existing student and teacher Arcade completion summaries include the new space levels.
- New command-engine and integration smoke tests.

## Enhanced
- Restricted code command execution for Space Invaders with 120-step limit and no arbitrary JS/Python evaluation.
- Code-to-Escape has an execution-line indicator and speed selector.
- Bug Detective gives a short conceptual hint on an incorrect answer.
- The Student Progress view distinguishes illustrative legacy class charts from actual saved Arcade statistics.

## Validation performed
- Existing `node scripts/arcade-smoke.cjs`: 4 original games, 28 challenges, all 12 maze maps and scoring checks passed.
- New `npm run test:arcade:expanded`: six Space Invaders missions solvable; safe command parsing, loops, scoring and Arcade navigation checks passed.
- All 44 TS/TSX files passed TypeScript syntax parsing in this build environment.
- ZIP archive integrity verified.

## Still needs local/browser verification
- Full npm installation, production build and responsive browser tests could not run in the authoring environment (npm dependencies not cached or reliably available).
- Actual audible Malay speech requires an installed Malay TTS voice and compatible browser; app reports when a matching voice is unavailable. The mascot is lightweight CSS 3D-styled, **not a downloadable 3D mesh model or an AI API**.
- Voice is started on user interaction to comply with browser autoplay restrictions.
- Progress and custom mazes persist per browser/device via the existing localStorage approach. There is no shared, cross-device teacher analytics backend.
- The three comic book resource links remain absent until supplied. Existing reader content is retained.
- Full accessibility and mobile interaction checks should be performed on a physical phone before competition presentation.

## Running on Windows
1. Extract the ZIP, open the `ciliklab-main` folder in VS Code or PowerShell.
2. `npm install`
3. `npm run test:arcade`
4. `npm run test:arcade:expanded`
5. `npm run build`
6. `npm run dev`
7. Visit http://localhost:3000 and open the Student space > Play / Cilik Arcade.
8. Test a Space Invaders level, Maze Creator, World Map, Achievements, Ciko voice in BM and EN, and student/teacher legacy workflows.

## Data safety
Original app storage and keys are preserved. Extras use `ciliklab_extras_progress_v1`, with optional fields `events` and `customMazes`; existing saved `scores`, `completed` and `comicPages` are retained. We recommend backing up browser storage before major upgrades.

### Contextual tutoring
Game screens include an "Ask Ciko" action, with the relevant prewritten topic selected. Returning to Play reopens the previously selected game and level (the unfinished in-level run may reset).
