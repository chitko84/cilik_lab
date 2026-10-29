# CilikLab v32 — Hero Coding Studio & Two New Arcade Games

## Scope and preserved functionality

Additive upgrade to the v31 project. Existing 17 games (128 game challenges), the original 100 Daily Coding Solver problem IDs, all 80 quiz questions, lesson content, Ciko assistant, class scheduling, Telegram bot server, sign-in flows, achievements, and local progress storage are retained. No existing challenge IDs were renamed or removed.

## New Daily Coding Solver — 150 total problems

- **100 original** exercises (`daily-001` through `daily-100`) preserved.
- **50 new** exercises (`daily-101` through `daily-150`) in 5 stories, 10 problems each:
  - Gotham Gadget School (Batman references)
  - Armored Inventor Lab (Iron Man references)
  - Jurassic Discovery (fictional dinosaur-park adventures)
  - Kampung Hero Tales (Sang Kancil)
  - Bengal Wonder Academy (Meena)
- **Difficulty balance:** 45 Starter, 60 Explorer, 45 Challenger overall. Added batch: 15 Starter, 20 Explorer, 15 Challenger.
- Progressive teaching concepts: print, variables, arithmetic, sequences, multiplication, division, loops, conditionals, and combined operations.
- New HackerRank-style *inspired* UI: side-by-side problem description and Python-style editor, challenge bank/search/filter, difficulty progress bars, Run code, Submit solution, submission history, actual-output comparison, output-line assertions, mobile problem/code tabs, and accessible feedback.
- **Accuracy limitation:** this is still the existing **beginner Python teaching interpreter**, not a full Python runtime or HackerRank judge. The test-result panel checks each expected output line from a fixed problem. It does **not** provide independent hidden-input tests, arbitrary stdin, deployment-scale anti-cheat, or a globally ranked server. The UI calls this out honestly.
- Daily progress remains under `ciliklab_daily_solver_v1`; an additional `ciliklab_daily_submissions_v2` key stores submission history. Previously earned XP still counts; only best score for a problem is counted once, as in v31.

## Two new fully playable Arcade games — 24 levels

1. **Hero Cipher Academy (12 levels).** Children solve substitution-shift secret messages, control a live cipher dial or 1–7 shift buttons, get hints and instant preview/feedback, earn best scores, and select/replay any level. Messages become longer and shifts more varied.
2. **Dinosaur Pattern Park (12 levels).** Children identify progressively harder numerical sequences, from simple addition/subtraction to doubling, triangles, squares, consecutive products, recursive patterns and mixed increments. Each puzzle has four answer choices, explanatory hints, answer checking, best scores, and level navigation.

Both games are integrated into the original Arcade, Adventure Map, search and game-category filters. Original CilikLab score storage `ciliklab_extras_progress_v1` is reused. Custom local SVG game covers are bundled, with no online image dependency for the two new games.

**Totals:** 19 Arcade games / 152 Arcade challenges; 150 Daily Solver problems; 80 Quiz questions.

## Key implementation files

- `src/pages/daily/dailyExpandedBank.ts` — 50 new authored problems, preserved original IDs.
- `src/pages/daily/dailyBank.ts` — combines existing 100 and new 50.
- `src/pages/daily/DailyCodingSolver.tsx` — revised interactive coding workspace.
- `src/pages/daily/dailySolver.css` — modern editorial coding-platform styling.
- `src/pages/arcade/addons/ChallengeLabEngine.ts` — deterministic cipher/pattern puzzles and answer validators.
- `src/pages/arcade/addons/ChallengeLab.tsx`, `challengeLab.css` — complete playable game UI.
- `public/arcade/hero-cipher.svg`, `dinosaur-pattern.svg` — original cover artwork.
- `src/pages/arcade/ArcadeView.tsx`, `addons/AdventureExtras.tsx`, `addons/ArcadeHome.tsx` — additive game routing/catalog/filter changes.
- `scripts/v32-coding-games-smoke.cjs` — 150 solution runs, 24 new puzzle positive/negative checks, integration and TS/TSX syntax checks.
- `scripts/v30-feature-smoke.cjs` — updated its original exact-100 assertion for the new problem count without weakening execution tests.
- `package.json` — added `test:v32` to the existing full test script.

## Test and run instructions

```powershell
npm install
npm run test:all
npm run test:v32
npm run build
npm run dev
```

The existing v31 Telegram meeting server is still started separately with `npm run dev:meeting-api` when configured. The new solver and games do not need it.

## Validation and known limits

- Existing automated regression suite plus the new v32 test pass (including original Telegram backend API integration checks).
- 150/150 authored Python solutions ran in the teaching interpreter and produced the expected output.
- All 24 new puzzles passed positive and negative evaluator tests.
- TS/TSX **syntax** checked; CSS parsing and SVG XML checks run.
- **Not validated here:** full Vite production compilation, manual browser/mobile appearance, keyboard/screen reader QA, and live network services. The npm installation attempt failed to complete due unavailable dependencies/network in the working environment.
- New problem statements and two new game narratives are currently in English, with a few Malay UI labels. The existing partial multilingual system is preserved; do not claim full eight-language translations of new content.
- Hero references are used as educational stories, without licensed logos, protected artwork, or claims of brand affiliation.
