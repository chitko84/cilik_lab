# CilikLab — Superhero Coding Adventures + Operator Activity Log

## Included in this complete source ZIP

- **Daily Coding Challenge** expanded from 150 to **300** problems. Existing problems `daily-001` through `daily-150` are unchanged. New problems use stable IDs `daily-151` through `daily-300` and have original kid-friendly superhero/comic stories, mission descriptions, hints, reference solutions and expected output.
- New questions are grouped into **10 original fictional worlds**, each containing 15 missions. The Daily Coding page has a horizontally scrollable world selector linking directly to each world's problems.
- Final difficulty mix: **100 Starter / 100 Explorer / 100 Challenger**. The 150 new questions contribute 55 / 40 / 55 respectively.
- All 150 new questions have reference solutions verified in **Python (CilikLab's bounded beginner teaching subset), C teaching subset, and Java teaching subset**. The checker validates exact printed output. These are educational interpreters, not full Python, C or Java runtimes.
- The new 150 Python missions use `src/pages/daily/dailyHeroRunner.ts`, an isolated indentation-aware, bounded teaching runner. **Existing Python lessons, Coding Workspace and original Daily Challenge runner are not modified.** New challenges are authored in English; existing translations of the original 150 remain intact.
- **Operator Activity Log** now contains **100 dated fictional past events** across Students, Teachers, Classes, Schedules, Content, Support and Moderation, with searchable activity, category/date filters and 15-item pagination. Operator edits continue to appear at the top, and browser demo records from earlier ZIP versions are migrated rather than overwritten.
- The Activity Log page does not repeat "Sample data only". The existing overall Operator identity still reads **Demo** to avoid presenting fictional history as real audit evidence.
- Existing operator analytics (10 charts, 32 students, 14 teachers), demo role switch, RoboLab's 40 missions unlocked for judges, Comics and Heyzine links, lessons, meetings, and grouped Student/Teacher sidebars remain present.

## Key files

- `src/pages/daily/dailyHeroBank.ts` — 150 new problems
- `src/pages/daily/dailyHeroReferences.ts` — C/Java reference solutions for automated testing; not imported by the website
- `src/pages/daily/dailyHeroRunner.ts` — safe new Daily Challenge Python subset
- `src/pages/daily/dailyBank.ts` — appends the 150 new IDs, preserving original IDs
- `src/pages/daily/DailyCodingSolver.tsx`, `dailySolver.css` — superhero world selector + language handling
- `src/pages/operator/operatorActivityHistory.ts` — 100 fictional historic events
- `src/pages/operator/OperatorDemoView.tsx` — Activity Log filters, pagination and data migration
- `scripts/hero-operator-smoke.cjs` — 450 reference runs, difficulty mix, world IDs and activity checks

## Run locally (Windows PowerShell / VS Code Terminal)

```
npm install
npm run dev
```

Open the local URL shown by Vite, typically `http://localhost:3000`.

Use the top-bar **Operator View**, then **Activity Log**, to see the history. Go to **Student View → Daily Coding Challenge** to browse the superhero chapters.

## Tests

```
npm run test:hero
npm run test:v32
npm run test:operator
npm run test:operator:analytics
npm run test:robolab
npm run test:arcade
npm run test:l10n
npm run build
```

The relevant smoke tests and TS/TSX syntax checks passed in the authoring environment. A full Vite browser build and browser gameplay checks were **not** possible there because frontend dependencies were not fully installed. Run `npm install` and `npm run build` in a connected development environment.

## Demo data notice

Operator Activity Log records, students, teachers, classes and other operator records are all fictional and kept in browser storage. The Activity Log removes repetitive per-page sample messaging, but **does not represent a real authenticated administrative audit system**.
