# CilikLab — Phase 2 Release Notes

Built on the **Phase 1 Fixed** project. Existing student coding, lessons, class management, teacher features, state persistence, and build configuration remain in place.

## Added

### Cilik Arcade

Accessible from the student's sidebar, mobile **Play** tab, and student dashboard.

- **Code Maze**: a fully interactive 7×7 maze with keyboard arrow keys and on-screen movement controls. The robot has to reach the flag; three reachable stars are worth 15 points each; reaching the flag earns 100 points. A visible movement-command trail, wall collision handling, replay control and success feedback are included.
- **Bug Detective**: three real answer-checked Python debugging questions about a variable spelling typo, a missing `:` in a `for` loop, and `==` vs `=`. Correct responses earn 50 points each, with explanations and retry/next controls.
- **Logic Builder**: three reorderable coding-block puzzles for variables, loops, and conditions. Supports mouse drag/drop **and** up/down tap buttons for mobile. Correct order earns 60 points per puzzle, with clear response and reset controls.
- Scores are awarded only once per completed challenge and persisted to `localStorage` under `ciliklab_extras_progress_v1`, separately from existing CilikLab save data.
- All three games provide **Bahasa Melayu / English** instructions and feedback, with a single shared Phase 1 language setting.

### ComicCode

- Three short original, bilingual in-app illustrated stories, four pages each: **Ali dan Kotak Ajaib** (variables), **Robot Cilik dan Gelung Masa** (loops), and **Rahsia Pintu Pintar** (conditions).
- Interactive page reader, swipe-to-turn on mobile, back/next buttons, progress bar, code examples, reading completion and page-saving.
- Comic library is accessible from the student sidebar, dashboard and as a **Read Comic** button within the corresponding existing lessons.
- External flipbook URLs are intentionally **not invented**. When links become available, add valid URLs to `src/data/comicBooks.ts` inside `COMIC_FLIPBOOK_LINKS`. The reader will show an **Open full flipbook** link only when configured. Current in-app stories work without links.

### Integration

- Teacher dashboard shows a clearly labeled **this-device-only** game activity summary; there is no invented cross-device syncing.
- Student progress adds game completion count and points without replacing the existing score reports.
- Existing restore/reset action now also clears Phase 2 activity progress.
- On mobile the bottom navigation remains five items: Home, Learn, Play, Code, Me. It leaves Code accessible until Ciko takes the next phase's slot; coding remains available from Learn/sidebar.
- Success confetti uses the `canvas-confetti` dependency that was already present in Phase 1.

## Run locally (Windows PowerShell)

Unzip the archive, open a terminal within `ciliklab-main`, then:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The Phase 1 `esbuild` version fix is included. If you extracted over an older install, you may need to delete that folder's old `node_modules` and rerun `npm install`; don't use `--force` unless a new diagnostic warrants it.

## Manual test checklist

1. Open site and enter **student** space.
2. Click **Cilik Arcade** from desktop sidebar or **Play** on mobile.
3. In **Code Maze**, use on-screen arrows to navigate around walls, collect a star and reach the flag; verify +15 / +100 and replay.
4. In **Bug Detective**, pick an incorrect answer, see retry feedback, then pick the correct answer; proceed to the next question.
5. In **Logic Builder**, move blocks using buttons on a phone, validate the wrong and correct orders, and continue.
6. Change language **BM ⇄ EN** and verify game labels, feedback, and comic story text changes.
7. Open **ComicCode** from the dashboard, read pages using Next/Back or swipe, then return to the library.
8. In **Lessons**, select Variables, Loops, or Conditions and use **Read Comic**; confirm the matching story opens.
9. Reload browser and confirm Cilik Arcade scores and comic page progress remain saved.
10. Switch to teacher role; see the **on-this-device** game activity summary; confirm existing teacher screens still open.
11. Open existing Python workspace, submit a challenge, inspect hints, and open community and other existing screens.
12. On mobile, verify game controls and reader layout don't require horizontal scrolling.

## Scope / limitations

- This release contains one complete maze board, three bug questions, three logic puzzles, and four original story pages per comic. This is a deliberately bounded playable learning experience rather than an unlimited procedural game generator.
- The movement commands shown in Code Maze are game commands for learning sequencing, **not Python built-in functions**.
- Scores and reading progress are stored in **this browser's localStorage**, not synchronized between different students or devices. Teachers on other devices do not see these records yet.
- Existing mock/sample roster analytics from Phase 1 have not been converted into live school data.
- Ciko 3D voice assistant is **Phase 3**, not included here; it will be integrated after this phase is verified.
- Existing source code execution limitations identified during earlier review remain to be addressed before using the platform with real child accounts and untrusted code. The current browser execution engine must not be described as securely sandboxed.

## Validation performed in this environment

- TypeScript and TSX **syntax transpilation** checked for all 36 source files (zero parse errors).
- Maze layout checked for reachability to the goal and all three collectible stars.
- Relative import paths verified as present.
- ZIP integrity checked.

**Not verified here:** full npm dependency installation, full `npm run build`, live browser interactions, and cross-device testing. `npm install` timed out because the package registry was not reachable; offline npm then reported missing cached `@google/genai` metadata. Please run the manual checks above on your Windows machine and share any error output for corrections.
