# CilikLab — Expanded Cilik Arcade

This update builds **on top of CilikLab Phase 2**. Phase 3 (Ciko voice assistant) is not included.

## What changed

- **Cilik Arcade:** Four accessible game cards, each with a progress bar, best-score tracking, and clear play actions; 28 challenges in total.
- **Code Maze:** Six distinct mazes with walls, moving character, collectible stars, an exit door, hint buttons, restart, keyboard and on-screen arrow controls, next-level navigation, animations, and point scoring.
- **Code-to-Escape (NEW):** Six code-driven mazes. Learners enter simple Python-style `move_up()`, `move_down()`, `move_left()`, `move_right()` commands and `for i in range(N):` loops. Pressing **Run code** animates the robot along its programmed path. Wrong turns stop at walls, and the error message refers to the source line. Mobile-friendly command buttons, example routes, hints, restart, next-level progression and points are included.
- **Bug Detective:** Eight varied Python-error scenarios with localized explanations, progressive questions, hints, point scoring and completion tracking.
- **Logic Builder:** Eight reorderable coding challenges; supports drag/drop and arrow-button control, solution validation, hints, points, and level selection.
- **Shared scoring:** Points are earned for stars and successful completion, while incorrect attempts can reduce the challenge bonus. Each level records its **best score**, and a cumulative XP total is preserved under the existing `ciliklab_extras_progress_v1` localStorage key. Repeatedly replaying the same level does not infinitely inflate the saved total.
- **Integration:** Student home now correctly advertises four games, and student/teacher progress counts include Code-to-Escape. Language support on the updated Arcade content remains Bahasa Melayu and English.

## Scoring behavior

| Activity | Scoring |
| --- | --- |
| Maze / Code-to-Escape | +25 points per collected star; +100 for opening the door; up to +40 efficiency bonus for fewer steps |
| Bug Detective | Up to 100 points for a correct answer; lower if wrong attempts occurred |
| Logic Builder | Up to 120 points for correctly ordered blocks; lower if incorrect checks occurred |

**Important:** Live level score updates as the child moves/collects stars. Saved cumulative XP updates when a level is successfully completed. One saved best score is maintained per level, and improving that best score increases cumulative XP. Game progress is stored on the current browser/device, as in Phase 2.

## Code-to-Escape interpreter boundaries

The Escape game runs a **restricted, deterministic command interpreter**, not unrestricted Python execution. It accepts movement calls, comments and `for ... in range(N):` loops with indentation. It explicitly rejects imports, general expressions, JavaScript, `while` loops and any unsupported code. A maximum of 100 movement steps per Run prevents runaway loops. The pre-existing Python coding workspace is unchanged.

## Children's interface rules

- The student starts with one choice: select a game, then a level.
- Each game presents a focused activity, large touch controls, one prominent main action, optional hints, and immediate success/failure feedback.
- The UI does not label the experiences as demos. Functionality is scoped honestly in the technical documentation.
- All Phase 1, Phase 2, student, teacher and ComicCode features remain in the source; new content is additive.

## Local verification

1. Run `npm install` and `npm run dev` from `ciliklab-main`.
2. Run `npm run test:arcade` for the automated game-data, pathfinding, interpreter and scoring checks.
3. Open **Student → Play → Cilik Arcade**.
4. In **Code Maze**, collect a star and reach the door; confirm level XP, next-level button and saved progress.
5. In **Code-to-Escape**, type `for i in range(4):` followed by four-space-indented `move_right()` for Level 1; press **Run code** and observe the robot reach the door. Retry with an unsafe command such as `import os` and verify that it is rejected.
6. In **Bug Detective**, solve the cases, checking answers, hints and XP.
7. In **Logic Builder**, reorder blocks on mobile and desktop, checking both successful and unsuccessful submissions.
8. Refresh the browser and confirm that best scores and completed-level indicators remain.
9. Switch between **Bahasa Melayu** and **English** and recheck all game instructions.
10. Verify the existing lessons, coding workspace, comics, student and teacher screens remain accessible.

## Verification limits

- Local source files were successfully parsed as TypeScript / TSX.
- Automated Node-based checks passed for all 28 level definitions, 12 mazes, sample command runs, invalid-command rejection and scoring.
- A complete `npm install`, Vite build and interactive browser session were **not** completed in this environment because package downloads are unavailable / timing out. Please run the checks above on Windows before a presentation.
