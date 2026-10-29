# CilikLab — Arcade Premium + Mobile-App Visual Update

This package builds on `CilikLab_Phase_2_Arcade_Styled.zip`. The original student, teacher, lessons, coding, comics, and data-management modules remain present; this update focuses on the four existing Cilik Arcade games and their presentation.

## Upgrades

- **Premium illustrated Arcade cards:** Four bundled custom SVG artworks for Code Maze, Code-to-Escape, Bug Detective, and Logic Builder. No external image requests are required for these covers.
- **Mobile-first in-game layout:** Compact game header, persistent cumulative XP display, horizontal level picker, and game boards nearer the top of the screen.
- **Code Maze:** Dedicated mobile D-pad positioned above CilikLab's existing bottom navigation so children can move the robot while viewing the board. The desktop controls remain in the side panel. On completion, the next-level action is also displayed beneath the board on mobile.
- **Code-to-Escape:** Map / My Code tabs for smaller screens. Run Code automatically switches to the map to show robot movement; errors and success are shown in the map view. The map has a direct edit-code action. Desktop continues to show both the map and the editor side by side.
- **Bug Detective:** Custom thematic illustration and polished interactive answer options, while retaining all existing answers, checks, hints, scores, and cases.
- **Logic Builder:** Custom illustrated game header and improved movable command blocks. Desktop drag-and-drop and arrow-based mobile reorder controls remain.
- **Responsive gameplay styling:** Touch-friendly controls, distinct mission colors, improved visual hierarchy, reduced clutter, and respect for reduced-motion settings.
- **Scoring and progress:** The existing cumulative XP and per-level best-score persistence remain unchanged. The four games still contain 28 challenges in total.

## Run on Windows PowerShell

```powershell
npm install
npm run dev
```

Open http://localhost:3000 and use the Student role, then select Play / Cilik Arcade.

## Check gameplay

1. **Code Maze:** Move the robot using arrow keys (desktop) or the touch D-pad (phone). Collect stars, reach the exit, check XP and next level.
2. **Code-to-Escape:** Switch to My Code, enter movement commands, press Run Code. The phone switches to Map as the character moves; inspect result and try the next level.
3. **Bug Detective:** Select a wrong answer, then the correct answer; confirm feedback and scoring.
4. **Logic Builder:** Rearrange blocks with drag-and-drop or arrow controls, check the solution, and confirm progress is saved.
5. Switch Bahasa Melayu / English and test both desktop and mobile widths.
6. Navigate back to existing lessons, comics, progress, student dashboards, and teacher pages.

## Test status

- `npm run test:arcade`: PASS — four games, 28 challenges, 12 solvable maze maps, scoring, restricted movement command interpreter.
- TypeScript/TSX parsing with TypeScript compiler library: PASS (all source files parse without syntax errors).
- Artwork XML parsing: PASS (all four SVG assets parse).
- Full `npm install`, `npm run lint`, `npm run build`, and live browser QA: **not verified in this build environment** (npm registry was unavailable). Run these checks on Windows before presenting.

## Scope

Ciko's 3D voice/chat assistant remains scheduled for Phase 3. Do not interpret the current small game guidance bubbles as a completed voice assistant. The comic flipbook URLs are intentionally left for later.
