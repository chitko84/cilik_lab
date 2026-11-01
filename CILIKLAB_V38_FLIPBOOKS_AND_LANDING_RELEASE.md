# CilikLab V38 — Published Flipbooks and Landing Page

## Changes

- Added exact user-supplied published Heyzine URLs for Books 1–3 in English and Bahasa Melayu (six links total).
- Comic Library buttons for published editions open a dedicated CilikLab reading view containing the real Heyzine flipbook iframe and an "Open on Heyzine" fallback link.
- Books 4–10 explicitly show **Coming soon** for both editions, with disabled, non-misleading buttons.
- The original internal 8-page story scripts remain in the data for archival/reference purposes; they are no longer presented as completed published editions.
- Existing comic cover artwork, illustration files and styling are preserved. No new covers were generated or replaced.
- Added public landing-page sections for learning steps, published flipbooks, Daily Coding Challenge (Python/C/Java), Arcade and Ciko RoboLab, and FAQs. Includes bilingual English/Malay copy and responsive presentation.
- Existing games, coding lessons, RoboLab, meeting interface, and Daily Coding Challenge code remain unchanged.

## Comic editions

| Book | English | Bahasa Melayu |
|---|---|---|
| 1. Ciko and the Lost Loop | https://heyzine.com/flip-book/cc10d9ca9b.html | https://heyzine.com/flip-book/37d18a2e91.html |
| 2. The Variable Treasure Hunt | https://heyzine.com/flip-book/48dcc3748c.html | https://heyzine.com/flip-book/82e68cb1ab.html |
| 3. If-Else in the Jungle | https://heyzine.com/flip-book/19b888f86a.html | https://heyzine.com/flip-book/eceb5e4395.html |

Books 4–10: English and Malay editions coming soon; no URLs have been fabricated.

## Files changed/added

- `src/data/comicSeries.ts` — publication metadata and URL lookup
- `src/pages/comics/SeriesReader.tsx` — edition cards, statuses and Heyzine reading experience
- `src/pages/comics/ComicLibrary.tsx` — updated catalog introduction and reading guidance
- `src/pages/LandingPage.tsx` — added landing sections and page navigation
- `src/pages/landing/MoreAboutCilikLab.tsx` — four informative, responsive homepage sections
- `src/website-v38-comics-home.css` — styling for embedded reader and new landing sections
- `src/main.tsx` — load V38 CSS
- `scripts/v35-comics-bilingual-smoke.cjs` — update assertions for published editions
- `scripts/v38-landing-comics-smoke.cjs` — new landing/comics regression
- `package.json` — test entry

## Testing (source-level)

Passed:

- `node scripts/v35-comics-bilingual-smoke.cjs`
- `node scripts/v38-landing-comics-smoke.cjs`
- `node scripts/robolab-smoke.cjs` (all 40 reference missions)
- `node scripts/arcade-smoke.cjs`
- `node scripts/arcade-ui-quality-smoke.cjs`
- `node scripts/localization-smoke.cjs`
- `node scripts/v34-live-messaging-smoke.cjs`
- `node scripts/v36-vercel-api-smoke.cjs`
- `node scripts/v37-homepage-intro-smoke.cjs`

The broad `npm run test:all` does not fully pass: its older `scripts/v33-localized-content-and-share-smoke.cjs` expects an obsolete Daily Challenge source expression (`translatedProblem.story`), while the **original, unmodified** Daily Challenge source now uses `languageProblem.story`. This failure predates V38 and is outside the scope of the requested changes. There is no full Vite build or browser E2E verification because project dependencies are not installed in this environment.

## Local verification

```sh
npm install
npm run test:v35
npm run test:site:v38
npm run test:robolab
npm run build
npm run dev
```

The Heyzine embed requires an internet connection. If a browser or embedded-content policy prevents it from loading, use the external Heyzine button shown with every published edition.
