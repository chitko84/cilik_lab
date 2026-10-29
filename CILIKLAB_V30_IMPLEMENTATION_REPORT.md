# CilikLab v30 — Working Prototype Integration & UI Repair

Based on the Arcade-runtime-fixed v28 -> mobile-fixed v29 project, October 29, 2026.

## Implemented in this release

1. **Landing-page and slide-control repairs.** Removed decorative photo sticker and detached overlapping floating hero cards; learning benefits now sit beneath the photo. Removed the visible 'Learning photos: Pexels; illustrations created for CilikLab' footer line (photo attributions remain in the repository). Slide controls reset to predictable, small arrows/dots/play-pause with mobile sizing and accessible labels preserved.
2. **Student recommendation card.** Uses a 3-column responsive grid with sensible text sizing and full-width mobile CTA; no narrow vertical wrapping.
3. **Coding Workspace.** The existing editor now retains a dark surface, dark gutter, readable syntax-text color and focus styles. The existing beginner Python runner now reports invalid/unsupported statements instead of silently treating them as success. It checks unmatched quotes, parentheses, block colon omissions, undefined variables, basic safety guards, and uses exact expected-output comparisons rather than substring acceptance. The runner supports a documented beginner subset, NOT full CPython. **Don't deploy as an untrusted-code execution service without a server-side secure sandbox and a full interpreter.**
4. **Daily Coding Solver** is a new student route, sidebar link, dashboard entry and Quick Find entry. Contains 100 themed tasks (10 child-friendly story worlds x 10 programming skills), including starter, explorer and challenger difficulties. Search, filters, daily featured challenge, code editor, Run Tests, expected/actual comparison, hints, next challenge, persisted attempts and once-per-problem XP work in a browser. Every authored solution has been executed against the beginner runner and produces the correct exact output. Some templates recur with different numerical values/stories, but all 100 problems have distinct identifiers and titles. XP/leaderboard are **local to this device**, not a global multi-user leaderboard. Tests use exact output on specified sample inputs; they are NOT hidden multi-input competitive judge tests.
5. **Teacher/student Live Classroom prototype.** A shared route allows a teacher to schedule a student invitation (class, student, date/time, title) and a student to find the invitation; it stores meetings in localStorage and updates other same-origin tabs via storage events. Joining establishes a WebRTC peer video call with camera/microphone controls, BroadcastChannel signaling and room text chat across two same-origin browser tabs. ICE candidate buffering is included. Permissions and secure context (HTTPS or localhost) required. **This is a local multi-tab prototype, not cross-device production scheduling.** No cross-device signaling backend, authentication, TURN relay, Telegram notifications or storage synchronization were added. No real-time call was verified in browser here.
6. **Teacher performance** can filter recorded student attempts by class and see failed/incorrect submissions. There is a button to open Live Classroom and preselect the student. The current application cannot truly synchronize accounts across devices; attempts are existing local classroom records.
7. **Progress charts.** Student progress includes actual Daily Solver counts/XP and an optional self-reported country field. Teacher analytics includes Daily Solver summary, recorded errors and an 'Users by country' chart using the self-reported country of the current local profile. No invented global-country stats; when country data is missing, it displays an empty-state explanation. Replaced randomly generated score chart values with pass rates calculated from recorded attempts.
8. **Ciko.** Enhanced the existing CSS dimensional robot (more shading/lighting) and retained talking lip-sync effects. When auto speech is enabled, available Ciko questions plus answers are read aloud in the selected locale, *only if* a matching voice is installed. Auto-speak now defaults on. Play/replay/mute/stop and subtitles are preserved. No audio voice is synthesized in this package.
9. **Space Invaders.** Redesigned level cards into an accessible responsive grid with names and completion states. Preserves levels 1-6 and adds two advanced playable levels 7-8. Existing scoring and gameplay engines unchanged other than adding level data. Total: **14 games, 92 game challenges** (90 original + 2), plus 100 Daily Solver tasks and 80 quiz questions.
10. **Mobile and accessibility.** Improved breakpoints for sidebar content, recommendation card, editor, daily coding, slideshow controls and meeting room. Retained reduced-motion support and original illustrations/photo fallback behavior.

## Not implemented / not verified

- More levels across **every** one of the 14 original games: only Space Invaders received two advanced levels; 100 separately playable Daily Solver tasks were added instead. Existing game-level counts elsewhere are intact.
- A globally shared, ranked kids leaderboard requires accounts and a real backend. The displayed Daily Solver leaderboard is the local child's progress only.
- Users-by-country is based exclusively on local, optional self-report. It is not an actual cross-device user population measurement.
- Multilingual Ciko TTS still depends on installed browser/OS voices. The current non-English/Malay language content library remains partial (12 localized Ciko Q&As per additional language, not all 120). Do not claim seven fully translated 120-answer voice libraries.
- Ciko's avatar is a **CSS 3D-styled animated character**, not a new Blender/WebGL 3D model.
- The coding editor executes a limited learning interpreter, not all real Python 3 constructs. For arbitrary Python code, use isolated Pyodide/remote container infrastructure and stronger testing.
- Real cross-device video meetings/chat/invitations require authenticated backend and dedicated signaling/TURN support. Local prototype must not be described as production-ready remote classroom/video system.
- No new real-life photos were necessary: all existing 36 online Pexels photo sources, source credits and offline fallback assets are preserved.
- Full Vite production build not performed: `vite: not found`. An `npm install` attempt timed out. Real mobile/browser/video/audio QA is unverified.

## Quality checks performed

- `npm run test:all`: PASS (old regression tests and new v30 smoke test).
- `npm run test:v30`: PASS (100/100 coding solution runs, unsafe syntax checks, routes, 8 Space levels, localized voice/UI wiring, JSX/TS syntax for all 70 TS/TSX files).
- CSS parsing: 28/28 PASS.
- SVG XML parsing: 19/19 PASS.
- Original v29 files: 189/189 preserved; no original file deleted.
- ZIP verification: Python `zipfile.testzip()` and extraction check (performed at packaging time).
- Build and real browser tests: NOT VERIFIED.

## Run locally

Inside the `ciliklab-main` project directory:

```powershell
npm install
npm run test:all
npm run build
npm run dev
```

### Browser demonstration

1. Enter Student View -> Daily Coding Solver -> choose one of the 100 tasks -> enter code -> Run tests -> inspect correct and incorrect output and XP persistence.
2. Visit Coding Workspace -> type `pront("Hello")` or remove a closing parenthesis -> Run Code -> verify SyntaxError, then fix syntax and retry.
3. Visit Space Invaders -> use the new 8-level selector, verify levels 7-8.
4. Visit My Progress -> optionally select a country -> switch to Teacher View -> Reports & Learning Analytics -> confirm country result is based only on local self-report.
5. Open Teacher View in **tab A**, schedule a meeting for Sarah in Live Classroom and join. Open the same app with Student View in **tab B**, navigate to Live Classroom, join. Grant camera/microphone permissions and test video and room chat. This demo works only within same-origin browser tabs; there is no multi-device synchronization.
6. Visit Ciko -> change language -> select an available translated Q&A -> test question + answer speech if the corresponding system voice is available. If voice is missing, verify readable subtitles and explicit voice-unavailable notice.
7. Visually review at 360px, 390px, 768px, 1024px and desktop widths, especially hero, recommendation, Arcade levels, Daily Solver and coding editor.

**Preserve all existing data:** This package keeps prior localStorage keys for existing systems; new prototype data uses distinct `ciliklab_daily_solver_v1`, `ciliklab_class_meetings_v1` and `ciliklab_self_country_v1` keys.
