# CilikLab v15 — Existing Visuals & Ciko Upgrade

## Scope
This upgrade is additive to v14. No games, routes, role management, learning content, comics, stored XP, or saved progress were intentionally removed or recreated. No new games or independent feature modules were added.

## Ciko improvements
- Expanded from 8 canned responses to 120 prepared question-and-answer pairs in Malay and English.
- 12 child-friendly topics: Ciko introduction, Python basics, data, loops, conditions, debugging, mazes, spaceship play, creative play, specific games, learning confidence, and digital safety.
- Search, topic selection, related questions, and a typed-question interface that matches supported prepared answers.
- Honest fallback for questions without reliable prepared answers (does not pretend to be a cloud AI chatbot).
- Rebuilt Ciko page with richer header art, floating robot scene, clear reply bubble, responsive layout, hover/focus feedback, and recent questions.
- Browser SpeechSynthesis handles each bilingual prepared response with voice selection (ms-MY/en-US where available), Play, Replay, Stop, Mute, and optional auto-speak on answer selection.
- Subtitles remain visible; missing voice/browser support is reported clearly. No microphone or network AI services required.
- Existing `ciliklab_ciko_topic` session state and `ciliklab-ciko` event behavior are kept for navigation from games.

## Website visual polish
- Soft focus colors, refined existing content cards and classroom photography treatment, stronger hover/focus states, and improved responsive presentation.
- Motion respects `prefers-reduced-motion`.
- Existing Unsplash CDN classroom images and local fallbacks from v14 remain unchanged; no new external image services were added.

## Files created
- `src/pages/ciko/cikoKnowledge.ts`
- `src/pages/ciko/cikoPremium.css`
- `src/website-v15-polish.css`
- `scripts/ciko-voice-library-smoke.cjs`

## Files modified
- `src/pages/ciko/CikoAssistant.tsx`
- `src/main.tsx`
- `package.json` (only new test scripts)

## Verification performed
- `npm run test:ciko` PASS (120 answer records, 12 topics, both languages, matching, fallback, speech UI and motion hooks)
- `npm run test:site` PASS
- `npm run test:site:life` PASS
- `npm run test:arcade:all` PASS (11 original games, 70 challenges retained)
- 56 TypeScript/TSX source files parsed with 0 syntax errors
- `npm run build`: NOT VERIFIED in the build container because Vite dependencies are not installed; install the project on Windows before building.
- Audible playback in individual browsers, choice of actual installed voices, and end-to-end click behavior need device/browser verification.

## Windows test instructions
From the `ciliklab-main` folder:

```powershell
npm install
npm run test:ciko
npm run test:site
npm run test:arcade:all
npm run build
npm run dev
```

Open the local URL from Vite (usually `http://localhost:3000`). Navigate to Ciko and verify:
1. Select a prepared question in Malay, press Listen, Replay, Stop and Mute.
2. Switch the site to English and verify translated text and English speech.
3. Type a supported question such as “What is a loop?” and check that Ciko picks the correct answer.
4. Type an unsupported question and verify the honest fallback.
5. Search questions, switch topics, show more questions, and tap related questions.
6. Turn on auto-speak; select a question; verify the speaking animation ends when voice ends or Stop is pressed.
7. Check 375px mobile view, tablet and desktop. Confirm navigation back to the Arcade and preservation of saved XP.
