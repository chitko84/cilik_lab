# CilikLab v25 — Spark Circuit, Knowledge Quiz & Premium Learning UI

## Overview
This release builds directly on v24. All prior game, comic, learning, teacher, assistant, progress, photo slideshow and localization files are retained. New features are additive.

## New playable game: Spark Circuit
- Eight genuinely interactive levels, from a simple straight cable to larger circuit patterns.
- Tap a circuit tile to rotate it 90 degrees. A battery and bulb are fixed endpoints.
- A local graph-based connectivity engine checks wire ports and lights the bulb only when a continuous valid path is made.
- Active circuit segments glow green. Level selection, hints, restart, win messages, next-level navigation and best-score tracking all use working handlers.
- One new earned `Circuit Engineer` achievement: complete three circuit levels.
- New game is registered with Cilik Arcade, Adventure Map, and existing progress storage.
- STEM/logic puzzle representation, **not** a physically complete electrical engineering simulator.

## New dedicated Knowledge Quiz
- 80 human-authored multiple-choice general knowledge questions in eight 10-question categories.
- Categories: Animal Kingdom; Everyday Science; Space Explorers; Around the World; Superhero Fun; Nature Detectives; Computers & Code; Sports & Arts.
- Four distinct answers for each question. Answer positions vary deterministically by question to prevent all correct options sharing the same position.
- Correct/incorrect feedback plus specific explanatory learning note.
- Ten-question topic sessions or one full 80-question challenge.
- Completion scoring, percentage, best score saved in `ciliklab_quiz_scores_v1` localStorage, answer review, restart, and selection of another topic.
- Available from student sidebar, Quick Find, and student dashboard shortcut; does not alter earlier XP or game keys.
- The questions are currently **written in English**. Interface control text is English/Malay; other existing language options have a truthful fallback. No fictional completion of eight-language translations claimed.
- Superhero text references names/fictional facts for quiz purposes without bundling trademarked artwork or claiming affiliation.

## Visual and animation changes
- Modern, natural, photo-first quiz hero with Pexels photography already present in the application and locally bundled visual fallback.
- New original SVG illustrated cover for Spark Circuit.
- Responsive, touch-friendly puzzle and quiz layouts, warm green and cream palette, meaningful hover/entrance effects, screen-reader status feedback, keyboard-accessible buttons.
- Existing website uses restrained page entrances and card/image transitions, with prefers-reduced-motion support; no new animation dependencies.
- Reuses the pre-existing 23 Pexels photo URLs. Those photos are fetched at runtime; files in `/public/visuals` remain usable fallbacks.

## Factual and image-use references
- NASA: https://science.nasa.gov/solar-system/solar-system-facts/
- NASA Jupiter: https://science.nasa.gov/jupiter/jupiter-facts/
- NASA Moon: https://science.nasa.gov/moon/facts/
- DC Batman character page: https://www.dc.com/characters/batman
- Marvel Avengers comics team: https://www.marvel.com/teams-and-groups/avengers/in-comics
- Pexels License: https://www.pexels.com/license/
- Existing curated photo sources and credits: `CILIKLAB_V24_PHOTOGRAPHY_SOURCES.md` and earlier credits documents.

## Preservation and validation
- The original v24 tree contained 165 files. All 165 remain in the new tree.
- Nine prior files were changed only for navigation, UI integration, game registration, stylesheet imports or test script updates. New modules, assets, scripts and CSS are additive.
- `npm run test:all` and `npm run test:site:v25` pass.
- Eight game boards are checked unsolved at start and solvable by legal rotations.
- All 80 quiz questions have unique IDs, four different choices, one correct choice, and an explanation. Quiz score formula was tested.
- Project TypeScript/TSX source files pass syntax parsing; new styles pass CSS parsing; SVG is valid XML.
- Full Vite production build and actual browser interaction were **not** verified in this environment because npm dependencies could not be installed (npm registry unavailable/timeouts). Do not treat static tests as proof of live browser behavior.

## Windows setup & judge demo

Open PowerShell in the extracted `ciliklab-main` directory:

```powershell
npm install
npm run test:all
npm run test:site:v25
npm run build
npm run dev
```

Demo sequence:
1. Open the student dashboard and click the real-photo **Knowledge Quiz** shortcut.
2. Choose **Space Explorers**, answer ten questions, view answer explanations and final score, click **Review answers**, then **Try again**.
3. Open **Cilik Arcade**; find **Spark Circuit** through the Arcade's search or category filter.
4. Rotate wire pieces, watch green power segments, light the bulb and open the next level.
5. Revisit the Arcade hub to see completion and XP, then check **Achievements** for Circuit Engineer.
6. Check responsive layout in Chrome mobile emulation and confirm other existing lessons, Ciko, games and class features continue to operate.

## Browser checks still required
- Confirm `npm run build` succeeds on Windows with installed dependencies.
- Confirm new quiz, score persistence, all category navigation, review and retry work in Chrome.
- Play all eight Spark Circuit levels by clicking/tapping, including restarting and navigating between levels.
- Check phone-width layouts, RTL direction, real-photo loading and accessibility.
