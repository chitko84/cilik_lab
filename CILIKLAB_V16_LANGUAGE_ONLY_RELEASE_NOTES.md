# CilikLab — v16 language-only update

## Scope and preservation
This release adds **localization infrastructure only** to the v15 project. All 11 games, 70 challenges, visual assets, premium website styling, saved progress keys, navigation routes, and student/teacher workflows remain in place. No new games, major visual redesign, or new services were added.

## Added
- A language dropdown at the existing top-bar, landing page, and settings placements with 8 options: Malay, English, Bengali, Burmese, Nigerian Pidgin, Dari, Arabic, Indonesian.
- Persistence under the existing `ciliklab_ui_language_v1` key and immediate React context updates.
- 110 translated **central interface message keys** across all eight options. Malay and English use their original translations; the other six have new resource translations. Other hardcoded text remains outside this count.
- `dir=rtl` for Arabic and Dari, while code editors, board tiles and movement grids remain left-to-right.
- A starter set of 12 genuine Ciko question-and-answer translations per new locale, with matching category labels and UI copy. Ciko's full original Malay/English 120-answer library is unchanged. Newly added languages show only their translated subset, so an untranslated question is never shown as translated.
- Ciko voice selects a matching installed browser voice. If no suitable voice exists, controls are disabled and subtitles remain readable; no unrelated default voice is silently substituted.
- Localization coverage report and smoke tests.

## Files changed or added
- `src/context/LanguageContext.tsx`
- `src/components/layout/LanguageSwitch.tsx`
- `src/main.tsx` (loads scoped language CSS)
- `src/pages/ciko/CikoAssistant.tsx`
- `src/locales/registry.ts`
- `src/locales/multilingual.css`
- `src/pages/ciko/cikoLocalized.ts`
- `src/pages/ciko/cikoUiLocale.ts`
- `scripts/localization-smoke.cjs`
- `scripts/localization-coverage.cjs`
- `package.json` (new optional test scripts)
- New release notes and coverage report

## Important remaining limitations
The overall project is **not yet fully translated** into the six new locales. The central UI key coverage is 110/110, but dozens of page-specific messages, all 11 game narratives, many lesson/teacher content strings, comics, and 108/120 Ciko answers per added language remain untranslated. The selector deliberately marks these languages **Beta**. Native-speaker review is required, particularly for educational terminology and Nigerian Pidgin. RTL and font rendering require real-browser tests. A full npm/Vite build could not be verified in this container because dependencies are not installed. This release does not claim complete localization.

## Test on Windows
```powershell
npm install
npm run test:l10n
npm run report:l10n
npm run test:ciko
npm run test:arcade:all
npm run test:site:all
npm run build
npm run dev
```
Test the language selector in Settings, Landing, and TopBar, reload to check persistence, switch Arabic and Dari to inspect RTL, open Ciko and test its 12 translated responses in the selected language, then switch back to Malay or English for all 120 answers. Confirm that speech playback is disabled and a readable message appears when no language voice is installed.
