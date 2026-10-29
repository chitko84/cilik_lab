# CilikLab — Premium Quality Pass 12

## Summary
This release improves the existing CilikLab Arcade with quality, usability, and regression fixes. It preserves all **11 games and 70 challenges**, all original level identifiers, the Arcade score storage key `ciliklab_extras_progress_v1`, the lessons, the comics, and the teacher-facing modules.

## Improvements
1. Redesigned Arcade welcome feature to surface the **next playable adventure** with existing original game art and a functional click-to-launch action rather than a busy decorative emoji cluster.
2. Improved mobile Arcade layout: one-column game cards on small phones, larger previews, cleaner text layout, clearer focus styling, and reduced-motion compatibility.
3. Fixed Bridge Builder's display of **unearned starting XP**. A newly opened level now shows 0 XP; actual construction and successful completion determine run score. Official cumulative XP still derives from saved level-best scores.
4. Corrected victory copy in Melody Machine, Bridge Builder, Pixel Painter, Treasure Sorter, and Loop Garden: it now identifies a **run score** rather than claiming the entire score was added again after replay.
5. Corrected final-level actions for Space Invaders, Robot Rescue, and five additional games: the button says **Play from start** when it wraps to the first level rather than misleadingly saying Next Level.
6. Hardened restored Arcade navigation: invalid/stale session data and out-of-range levels safely return to the lobby instead of crashing a game.
7. Added real progress-based Melody Maker and Bridge Engineer achievement badges; existing achievements remain unchanged.
8. Kept Maze Creator quest recognition from being lost when a user later deletes a custom maze, provided the creation event remains in the locally retained event log.
9. Updated Vite configuration for native loading by replacing the deprecated `__dirname` usage with `import.meta.dirname` (supported by the Node.js 24 version in use).
10. Made `npm run clean` cross-platform on Windows and Unix.
11. Added automated Arcade UI integrity checks: TS/TSX parsing; game routes; artwork; button action wiring; search and category handler presence; restored level bounds; replay scoring copy.

## Automated verification performed
- `npm run test:arcade` — PASS
- `npm run test:arcade:expanded` — PASS
- `npm run test:arcade:new` — PASS
- `npm run test:arcade:bonus` — PASS (includes bridge initial-score regression)
- `npm run test:arcade:rescue` — PASS
- `npm run test:arcade:ui` — PASS
- `npm run test:arcade:all` — PASS
- `npm run clean` — PASS

## Verification boundary
- Static checks confirm handler presence and syntax but **do not prove every browser click is working**.
- Full dependency installation and Vite production build were not available in the packaging environment.
- Audio output, animations, device-specific layout, native browser runtime interactions, and end-to-end navigation require actual browser checks.

## How to run on Windows
1. Open PowerShell inside the extracted `ciliklab-main` folder.
2. Run `npm install`.
3. Run `npm run test:arcade:all`.
4. Run `npm run build`.
5. Run `npm run dev`, then open the local address shown in the terminal.

## Manual click-test checklist
- On Arcade home: use every filter; search for `rescue`; reset search using Show all games; click the featured card; click Continue; open all five shortcuts (Quests, Map, Maze Creator, Achievements, Progress).
- Open all 11 game cards and verify Level 1 is playable.
- In games: run/restart, test hints, select other levels, complete a level, then use Next.
- On the *last* level of a game, verify the completion button says Play from start.
- Bridge Builder: level starts at 0 run XP; place a plank; complete a bridge; confirm best XP updates.
- Melody Machine: test tap play, Code Mode, wrong note retry, mute/unmute, and reset.
- Quest Board: verify unfinished quests navigate to correct destinations; create and save a maze, then revisit the quest.
- Check at narrow mobile width and with an actual phone if possible.
- Check Ciko's Bahasa Melayu / English speech playback on the demo device.
