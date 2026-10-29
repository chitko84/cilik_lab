# CilikLab v28 — Arcade Runtime Crash Fix

## Symptom

Opening the Arcade showed a white screen and the React console error:

```
Uncaught ReferenceError: localizedGameTitle is not defined
at ArcadeHome.tsx:17:90
```

## Root cause

`src/pages/arcade/addons/ArcadeHome.tsx` uses both `localizedGameTitle(...)` and `localizedGameDescription(...)` after the v28 localization extension. They are exported by `src/locales/contentTranslations.ts`, but that component imported only `translatePair`. The code transpiled without the missing variables being caught by the previous syntax-only smoke tests. The browser then crashed when rendering the Arcade.

## Actual fix

Updated the Arcade Home import to:

```tsx
import {translatePair,localizedGameTitle,localizedGameDescription} from '../../../locales/contentTranslations';
```

Both helpers are the original functions; no new translation subsystem or game mechanics were introduced.

## Regression prevention

- Added an AST-level check in `scripts/localization-v28-audit.cjs` asserting that both localization helpers and `translatePair` are explicitly imported into Arcade Home, present as real exports, and callable.
- Updated `npm run test:all` to execute `npm run test:l10n:v28` in addition to the existing suites.

## Validated

- `npm run test:all` — existing Arcade, Creative Learning, Quiz, Ciko, localization, slideshow tests and new Arcade import regression pass.
- TypeScript name-resolution sanity check found no TS2304 undefined-name diagnostics, but dependency type declarations were unavailable.
- ZIP archive validated with `zipfile.testzip()` and extracted into a temporary folder for inspection.

## Not verified in this environment

- Full Vite production build and live browser rendering: `node_modules` is not included, and Vite dependencies are unavailable. Run `npm install`, `npm run build`, and `npm run dev` locally to verify.

## Preservation

Only `ArcadeHome.tsx`, `localization-v28-audit.cjs`, and `package.json` changed from the original v28 ZIP, plus this release note. No saved progress IDs, gameplay, content, CSS or routing changed.
