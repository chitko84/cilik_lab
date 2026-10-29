# CilikLab v28 — Multilingual Localization Extension (Partial)

This release responds to the owner's complete-translation specification. **The original v27 project did not fully implement that specification, and v28 still does not.** The project is substantially larger than a starter locale: it contains 14 games / 90 challenges, an 80-question quiz, 120 prepared Ciko Q&As, comics, role-specific dashboards, and teacher/student workspaces. It would be inaccurate to advertise full translations before the missing content is actually authored and reviewed.

## Languages

- Default: Malay (`ms-MY`); existing English (`en`) retained.
- Added-language options retained: Bengali (`bn-BD`), Burmese (`my-MM`), Nigerian Pidgin (`pcm-NG`), Dari (`fa-AF`), Arabic (`ar`), Indonesian (`id-ID`).
- Language selection remains persistent; Arabic and Dari use RTL; coding syntax and visual grid coordinates remain LTR.

## New translation coverage in v28

| Resource | Bengali | Burmese | Pidgin | Dari | Arabic | Indonesian |
|---|---:|---:|---:|---:|---:|---:|
| Existing core UI keys (from v16) | 102 | 102 | 102 | 102 | 102 | 102 |
| New interface phrases and accessibility labels | 107 | 107 | 107 | 107 | 107 | 107 |
| Arcade game titles | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 |
| Arcade short descriptions | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 | 14/14 |
| Quiz topic names | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 |
| Spark Circuit level titles **and** hints | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 |
| Achievement names **and** descriptions | 18/18 | 18/18 | 18/18 | 18/18 | 18/18 | 18/18 |
| Ciko question/answer pairs (pre-existing) | 12/120 | 12/120 | 12/120 | 12/120 | 12/120 | 12/120 |
| Quiz question/option/explanation text | 0/80 | 0/80 | 0/80 | 0/80 | 0/80 | 0/80 |

The resource table measures **specific modules and dictionary entries only**, NOT whole-product language coverage. All 80 quiz questions currently have original English wording, including in Malay. The remaining 82 original game levels still include original Malay/English instructions, answers, narrative text, and feedback. Other untranslated sections include ComicCode dialogue, full story/pet narrative, Lesson descriptions, teacher/student tools, dynamic errors and many accessibility labels. Some Arcade screen-specific messages also fall back to English.

### How the upgrade works

- Reuses `src/context/LanguageContext.tsx` and `src/locales/registry.ts`; no competing i18n framework or new dependency.
- Adds `src/locales/contentTranslations.ts` for typed content dictionaries and per-locale lookup.
- Wires the existing `locale` directly into the shared `tr`/`tx` helpers in the Arcade and quiz screens. Older game data still uses the original `language` setting for unchanged game engines, so missing content retains the original wording; translated labels update without page reload.
- Integrates game title/description translations into the Arcade and Adventure Map, achievement translations into the badge page, quiz category translations into the Quiz, and all 8 Spark Circuit titles/hints into gameplay.
- Adds a localized note to the Quiz selection page explaining that its 80 questions have not yet been translated.
- Preserves original level IDs, executable commands, scene coordinates, challenges, all 80 questions, scoring, saved XP, Ciko speech behavior, progression and user data.
- Adds RTL layout protection for the circuit grid and long-script text wrapping.

### Voice status

Ciko uses the browser's installed speech-synthesis voices. Playback is gated on a matching language voice; otherwise readable subtitles remain available. **No live speech, pronunciation, voice availability, or browser RTL layout tests were conducted here**. The 12 pre-existing Ciko translated Q&A pairs per extra locale remain unchanged; 108 pairs per extra locale still need translation.

### Files changed

- Added: `src/locales/contentTranslations.ts`, `scripts/localization-v28-audit.cjs`, this release document.
- Modified: `src/locales/multilingual.css`; 10 existing Arcade add-on React files, Quiz page, and `package.json` test-script registration.
- Game engines, question bank, Ciko knowledge library, scores and localStorage keys are unchanged.

### Automated validation

```sh
npm run test:all
npm run test:l10n:v28
npm run test:site:v27
npm run build
```

Run `npm install` before these commands on a machine with registry access. The new v28 audit checks resource sizes, missing/empty entries, locale lookup, translations in each of the six additional locales, selected integration points, and RTL protections. **A passing static audit is not a substitute for native-speaker review, a production build, and browser interaction testing.**

### Required follow-up to satisfy the original comprehensive specification

Complete all level titles/instructions/hints, remaining 80 quiz questions/options/explanations for every requested language, full 120 Ciko conversations, comics/transcripts, all teacher/student screens, accessibility labels, errors, interpolation/plurals, mobile text-fit testing and voice checks. Obtain native-speaker review, including Dari and Nigerian Pidgin. Until then the six additional locale choices must remain **Partial/Beta**.
