# Ciko Creator Studio — Implementation Notes

Ciko Creator Studio is a **new, real interactive game-building feature** inside CilikLab's existing **Arcade**. The existing Maze Creator remains unchanged; Creator Studio appears as a new, prominent Arcade feature card and quick-access item.

## What works

- **Describe-to-build:** enter a game idea to build a playable world using Ciko's **on-device, rule-based builder**. It recognizes space, superhero or dinosaur themes and optional speed, collection goal and lives. It also generates different tile layouts based on the prompt. No API keys or network access required.
- **Three playable game engines:** space dodge-and-collect (top-down), superhero platformer (horizontal movement, gravity and jumping), and dinosaur island rescue (maze exploration).
- **Editable world:** click or tap to paint 20×11 maps using walls/platforms, collectibles, hazards, start and finish positions, with tile-by-tile visual feedback.
- **Real Python-inspired teaching subset:** settings (player_speed, enemy_speed, goal_count, lives, time_limit, jump_power, gravity, coin_value), `def on_collect():`, `def on_hit():`, `score += N`, `health -= N`, `boost(N)`, `heal(N)`, `bonus(N)`, and simple numeric `if` conditions. These actions affect actual simulation state during gameplay. Unknown/unsafe Python syntax is rejected with actionable error messages. **This is not a full Python interpreter.**
- **Real gameplay:** keyboard controls, on-screen touch controls, animated hazards, collision, hit damage and invincibility, collectible pickups, exits, timers, win/loss, score and restart/pause.
- **Game persistence:** save and reopen up to 40 creations in local browser storage. Completed games display best scores when saved. A local **Ready to share** collection is available.
- **Portable sharing:** export a game as a JSON file; another device can import the file to play or edit it. Imported data is schema-validated and never evaluated as JavaScript.
- **Audio toggle:** synthesized sounds for collection, damage and winning (no copyrighted audio or downloads).
- **Mobile responsive:** interactive on-screen touch controller over the canvas on narrow screens; desktop keyboard controls and responsive editing panels.

## How to demonstrate to judges (2–3 minutes)

1. Open **Student View → Cilik Arcade → Ciko Creator Studio**.
2. Enter: **Create a dinosaur rescue game with 5 eggs and 4 lives**. Click **Build my game**.
3. Add a new collectible or wall by choosing a brush and tapping the scene.
4. Open **Edit Python**, change `player_speed = 4` to `player_speed = 7`, then change `score += 1` to `score += 3` under `def on_collect():`.
5. Click **Apply & Play**. Move using arrow keys or WASD; on mobile use the on-screen controls. Watch pickup and scoring react to your script.
6. Return to the editor and click **Save** (or **Add to gallery for sharing**).
7. Open **Creator Gallery**, edit/play the saved project, or export and import the JSON game file.

## Limitations / scope to know

- There is **no external generative AI model** powering prompt interpretation. The on-device builder uses deterministic keyword recognition and procedural layout changes. It cannot fulfill arbitrary descriptions outside the supported game themes. This is presented transparently in the UI.
- The current three creator games are **2D rendered Canvas experiences**, not an arbitrary 3D game creator. The pre-existing **Ciko RoboLab 3D** remains available separately.
- The **gallery is on-device**. Export/import works across devices, but there is **no server-hosted public sharing or moderation queue**. Do not represent a local game as published globally.
- This is a game-design tool, not an unrestricted user-code execution environment. The Python subset deliberately prevents imports, dynamic evaluation, loops or arbitrary filesystem/network operations.
- Browser storage can be cleared by the user. Export important game files regularly.

## Modified / added source files

- `src/pages/arcade/creatorstudio/creatorEngine.ts` — game data, maps, prompt interpretation, rules, physics, persistence, import validation.
- `src/pages/arcade/creatorstudio/CreatorStudio.tsx` — full playable UI, Canvas renderer, world painter, rules editor, controls, gallery, sharing.
- `src/pages/arcade/creatorstudio/CreatorStudio.css` — complete visual system and responsive layouts.
- `src/pages/arcade/ArcadeView.tsx` — Arcade integration, session navigation restoration.
- `src/pages/arcade/addons/ArcadeHome.tsx` and `ArcadeHome.css` — Studio featured card and shortcut.
- `scripts/creator-studio-smoke.mjs` — tests for real game wins, editing, parser, game state, saved game format, routing.
- `package.json` — `npm run test:creator` script.

## Validation and running

```bash
npm install
npm run test:creator
npm run build
npm run dev
```

Automated gameplay tests ran and passed for all three starter engines; existing Arcade, RoboLab, Comics, and mobile landing-page smoke tests were also run. The complete Vite build and full interactive browser rendering could **not** be verified in the authoring environment because not all dependencies were available. Run `npm install && npm run build` locally before deploying to Vercel; fix any build errors and test on a phone before a live demonstration.
