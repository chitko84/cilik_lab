# Ciko RoboLab 3D — Arcade integration

This release adds Ciko RoboLab 3D to the **existing CilikLab source project**. It is based on `CilikLab_DailyChallenge_C_Java_MeetingPortraits_Updated.zip`; it retains the Python/C/Java Daily Coding Challenge and the teacher/student meeting-camera fallback.

## Where to find it

Sign in as a student, open **Cilik Arcade**, and select **Ciko RoboLab 3D**. No new main-sidebar item is created. RoboLab also appears in Arcade game filters and the Adventure World Map. Use its own world picker for the 40 individual levels.

## Implemented

- Native WebGL 3D viewport (no new JavaScript dependencies), lighting shader, camera orbit, zoom, animated 3D robot, different eight-world color themes, floor tiles, walls, glowing objectives, props, packages, switches, gates, crystals, conveyors, charging platforms and hazards.
- Eight themed worlds, five unique seeded maze configurations per world, for 40 deterministic levels. All 40 have been verified solvable against the shipped reference Python-subset solutions.
- Robot simulation with position/orientation, collisions, energy, cargo pickup and delivery, switches and doors, collectables, conveyance, charging and sensors. Objectives are checked against robot state, not matched against fixed code strings.
- Restricted educational Python interpreter: line-aware errors, assignments, arithmetic, `if` / `else`, `for` / `while`, functions, sensors, `print`, and documented robot commands. Strict execution and loop bounds prevent infinite execution. This is *not full CPython*.
- Play / pause / step / stop via reset, speed adjustment, Python editor and execution console, guided hints and viewable reference solutions.
- Standalone Free Play with manual movement (W / A / D or arrow keys), obstacle course editor, robot pickup and delivery, and a Python editor.
- 3D game hub, level selection/unlocking, stars, XP, achievements, robot color customization, optional sound feedback, reduced rendering quality setting, mobile-responsive game controls.
- Separate `ciliklab_robolab_v1` browser progress store. Completed missions also record progress using the existing additive Arcade progress hook. No existing keys are rewritten.

## Tested here

`NODE_PATH=/opt/nvm/versions/node/v22.16.0/lib/node_modules node scripts/robolab-smoke.cjs` was used in the authoring environment because packages could not be installed. It passed all 40 complete reference mission executions, gate/collision tests, unsafe code restrictions, infinite-loop safety and Arcade integration assertions. Existing smoke tests also passed.

After installing dependencies locally, use:

```sh
npm install
npm run test:robolab
npm run test:arcade:all
npm run lint
npm run build
npm run dev
```

## Limitations and recommended next development phase

- New dependencies cannot be downloaded in the authoring environment. **A full Vite production build, live Chrome rendering, interaction screenshots and real mobile-device testing could not be completed here.** Run the commands above locally, then test WebGL in Chrome or Edge.
- The visual style is stylized, built with hand-authored procedural meshes and lighting; this release does not include a professionally animated 3D asset pack, skeletal animation, shadows, physics engine, cutscenes or orchestral soundtrack.
- The 40 layouts are deterministic generated mazes with increasingly long paths and objective types, *not 40 individually handcrafted cinematic levels*. Missions have real solutions, but several of the initially proposed advanced systems (multiple concurrently programmable robots, sophisticated moving NPCs, elevators and dynamic traffic controllers) are not implemented.
- The beginner Python interpreter intentionally does not support Python imports, class definitions, standard-library modules, file I/O, networking or arbitrary Python syntax.
- Saved progress lives in the current browser. It does not provide user-authenticated cross-device cloud sync.
- Free Play supports obstacle placement/removal; it is not a complete 3D level-construction tool.
- The app is not deployed by this archive. Keep deployment configuration and environment variables as they were.

## Files added

- `src/pages/arcade/robolab/{RoboLab.tsx,RoboLab.css,RoboScene.tsx,levels.ts,engine.ts,program.ts}`
- `public/arcade/ciko-robolab.svg`
- `scripts/robolab-smoke.cjs`

Minimal integration changes were made to `ArcadeView.tsx`, `addons/ArcadeHome.tsx`, `addons/AdventureExtras.tsx`, and the package test script. Existing games, lessons, and meetings are retained.

### About the Claude Code excerpt

The pasted Claude Code session described useful interpreter and level-design decisions, but its local six source files were not uploaded here. This release implements corresponding functionality independently; it is **not** a byte-for-byte merge of Claude's unavailable workspace.
