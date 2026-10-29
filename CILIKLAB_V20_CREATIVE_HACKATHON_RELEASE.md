# CilikLab v20 — Creative Learning Expansion

The v19 project remains the base. No existing games, comic lessons, teacher workflows, photos, photo slideshows, Ciko 120-answer library, persistence key, or language setting was removed.

## Added: Ciko Story Quest (Game 12, six chapters)

A playable branching-story game with a natural, original illustrated world.

- Six original chapter settings and two meaningfully different endings per chapter.
- Tap-choice or Python-style `choose("route")` and `if variable: ... else: ...` modes.
- **Restricted command parser**; code is deliberately interpreted as safe educational actions, not executed as Python or JavaScript.
- Wrong choices show a different ending and allow retry; appropriate choices earn a one-time level completion and persisted best XP.
- Audio narration in English/Malay via the browser speech-synthesis API, plus play/stop and subtitles.
- A locally saved chapter journal remembers which endings the child has discovered.
- Hint controls, level selection, replay, and responsive artwork.

## Added: Ciko Pet Lab (Game 13, six routines)

A playable sequencing/loop game with three illustrated customizable pet species (dog, cat, bunny), optional pet nickname, and six specific care missions.

- Manual action buttons for `feed`, `play`, `clean`, and `rest`.
- Python-style editor supports those four commands and single-body `for i in range(n):` loops.
- Commands animate through the care routine when Run is pressed, with visual sequence comparison and clear feedback.
- Reset, hints, chapter selection, score saving, audible instructions and success states.
- No real-time pet decline, payment hooks, streak penalties, or manipulative retention mechanics.
- Pet nickname and pet choice stored in a separate `ciliklab_pet_lab_profile_v1` localStorage key.

## Added: Ciko Learning Coach

A new Arcade shortcut and a student-dashboard entry to an evidence-grounded practice recommendation screen.

- Uses the existing Arcade completion, hints, and code-error events in `ciliklab_extras_progress_v1`.
- Ranks unfinished games, explains why they were recommended, and links to the first unfinished level.
- No fake skill mastery claims, grades, fabricated player data, external analytics, or remote API.
- Explains browser-local limitations and allows replay when the user completed all challenges.

## Integrations

- Game count: 13, challenge count: 82 (11 original games / 70 challenges retained, plus 12 new challenges).
- Existing Adventure Map, Arcade search/filter home, progress screen, and level navigation automatically show the new games.
- Two new achievement badges derived from actual completions: Story Creator and Kind Caregiver.
- Existing XP store `recordBest` prevents repeat level-completion XP farming.
- New locally bundled illustrated SVG assets: story cover, pet cover, coach backdrop, Ciko mascot, dog, cat, and bunny.
- Natural editorial colors, responsive cards, touch targets, keyboard focus, and reduced-motion styles.

## Files added

- `src/pages/arcade/addons/creativeLearningEngine.ts`
- `src/pages/arcade/addons/CreativeLearning.tsx`
- `src/pages/arcade/addons/creativeLearning.css`
- `scripts/creative-learning-smoke.cjs`
- `public/arcade/story-quest.svg`, `pet-lab.svg`, `coach-garden.svg`, `ciko-sprite.svg`, `pet-dog.svg`, `pet-cat.svg`, `pet-bunny.svg`

## Files edited

- `src/pages/arcade/ArcadeView.tsx`
- `src/pages/arcade/addons/AdventureExtras.tsx`
- `src/pages/arcade/addons/ArcadeHome.tsx`
- `src/pages/arcade/addons/ArcadeHome.css`
- `src/pages/student/StudentDashboard.tsx`
- `package.json`

## Tests performed

- `npm run test:all` (original Arcade, rescue, UI, Ciko, site, localization, photo slideshows, and new creative learning tests) passed.
- Full TypeScript/TSX **syntax parsing** passed; all new SVG images parsed as valid XML.
- Existing route and screen source files compared against v19 to verify preservation.

### Important verification limits

- The container does not have React/Vite packages installed, so **the Vite production build and actual browser interaction tests could not be completed here**. Run them on your computer.
- New Story Quest and Pet Lab content has English and Malay authored text. Other selected languages still use the existing application's beta fallback behavior; do not claim that the two new games are fully translated into all eight languages.
- Voice availability and pronunciation depend on the browser and installed speech voices.
- This is an interactive browser prototype with **local persistence**, not a hosted multiplayer or server-backed game.

## Windows quick start

```powershell
npm install
npm run test:all
npm run build
npm run dev
```

### Manual judge demo walkthrough

1. Open Student Dashboard. Click **View recommendations** to visit Ciko Learning Coach; observe real progress/recommended level.
2. Open Cilik Arcade; click **Ciko Story Quest**. Try the alternate path, reset, then choose the safe path. Open Code mode and edit `choose(...)`/`if` statements, run again, and check persisted XP/journal.
3. Open **Ciko Pet Lab**; choose a cat or bunny and rename it. Complete the first routine with tap buttons; then open level 4 and run `for i in range(2):` / `    play()` / `feed()` code. Watch step-by-step execution.
4. Open **My Achievements** and **My Progress**; complete three story chapters or pet routines to unlock their new badge.
5. Reopen a completed level: the total XP should reflect only improved best scores, not duplicate completions.
6. Open any original game, teacher dashboard, comic, Ciko assistant, language settings, or photo slideshow to verify the preserved v19 workflows.
7. On mobile width, verify text wrapping, bottom navigation, taps, focus rings, and all new cards.
