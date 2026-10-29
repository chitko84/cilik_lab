# CilikLab v33 — Localized Challenges, Animated Sports and Classroom Screen Sharing

## Baseline and preservation

This version extends CilikLab v32 without replacing its original 19 games, 152 Arcade levels, 150 Daily Coding Solver problems, 80-question quiz, Ciko, student/teacher routes, local XP/progress storage, or Telegram meeting server. IDs, Python expected outputs, algorithms, scoring, and existing storage keys are untouched. No database migration is required.

## Implemented

### 1. Full localized content for the 150 Daily Coding Solver problems

- Language selection immediately re-renders **every authored Daily Solver problem title, story, problem statement, hint and theme** across Malay, English, Bengali, Burmese, Nigerian Pidgin, Dari, Arabic, and Indonesian.
- Localized problem templates are deterministic, keyed by stable original problem IDs, and use the original numeric values and learning objectives. No runtime machine translation or remote translation API is involved.
- Relevant testing status, problem labels, explanation of the practice judge, submission-history heading, and sample-output UI also follow the selected language.
- **Python keywords, program output contracts, user code, scores, and saved submissions stay unchanged** when switching language. English strings that are required program output (such as `Ready`, `Mission ready!`, `Bigger`) intentionally stay in English because changing them would break existing tests.

### 2. Game tutorial localization and movement

- The three sports games have 36 levels whose story event descriptions, button actions, introductory instructions, and game controls are localized into all eight supported languages. All three use the exact original level and scoring engines.
- Football and basketball now display a moving lead player, teammate, defender, goal/hoop, and animated ball. Pressing Pass, Dribble, Shoot, etc. changes the visible on-field state. Track has movement and a finishing marker. Animation is purposefully simple and respects reduced-motion preferences.
- Hero Cipher Academy and Dinosaur Pattern Park have 24 translated level titles, hints, and instructions for all eight languages. The cipher text and number sequences are preserved.
- The newest five games have localized Arcade lobby titles and descriptions in the additional six languages.

### 3. Screen/tab/slide presentation during Live Classroom

- Added **Share screen / slides** and **Stop presenting** controls to both the server-hosted invitation-only room and the same-origin two-tab local room.
- Uses the real browser `navigator.mediaDevices.getDisplayMedia()` picker (explicit permission) to select a tab, window or screen. Slide decks can be presented by selecting their window or tab.
- Uses WebRTC `RTCRtpSender.replaceTrack()` to replace outgoing camera video with the display track **without ending the microphone connection or chat**. When sharing ends or the browser stops capture, the camera is restored when available.
- Handles missing display-capture support, permission denial, and unavailable camera/video senders with visible status messages. Sharing is never started automatically and screen video is not recorded by this prototype.
- Cross-device room access still requires the existing meeting backend, authenticated links, HTTPS, and reliable ICE/TURN infrastructure as appropriate. This release does **not** add TURN or a production-scale classroom backend.

## Coverage and limitations

| Module | v33 localization coverage |
|---|---|
| Daily Coding Solver | 150/150 problem titles, descriptions, instructions, hints, and themes across 8 languages (authored templates) |
| Football, basketball, track | 36/36 level scenario/action instructions in 8 languages |
| Hero Cipher, Dinosaur Pattern | 24/24 levels: title, instructions and hints in 8 languages |
| New-game Arcade lobby | Five new-game titles/descriptions in six extra languages; existing legacy translations retained |
| Other 14 Arcade games | **Not yet fully localized** in every level and all supported locales; previous beta translation behavior remains |
| Knowledge Quiz | Existing partial beta localization remains; 80 question bodies still need translation |
| Ciko voice | Existing voice/locale availability behavior unchanged. Full recorded voice coverage is **not verified**. |
| Teacher-authored data | Left in the language entered by the teacher; not automatically translated |

Translations have been source-integrity tested but **have not undergone native-speaker educational review**, particularly Nigerian Pidgin and Dari. This is still a beta multilingual prototype, not a certified fully translated platform.

## Tests actually run

- `npm run test:all`: **PASS** including original Arcade, creative learning, quiz, Ciko, localization, previous mobile/slides/game tests, Telegram server API tests and v33 checks.
- `npm run test:v33`: **PASS** for 1,200 Daily Solver outputs (150 problems x 8 languages), all eight-language sports tutorial resources, and 192 puzzle-level resources (24 x 8), plus screen-sharing source and movement checks.
- 80 TypeScript/TSX sources parsed by existing syntax tests. Modified CSS files parsed by PostCSS.
- All v32 original archive files preserved, as checked during packaging. ZIP CRC/integrity verified.

**Not verified here:** Full Vite build (`vite/client` types and React/Vite dependencies are not installed in this environment), real-browser screen sharing, camera/microphone hardware, cross-device WebRTC, Telegram delivery with live credentials, and actual phone/tablet UI layout. Test these on HTTPS or `localhost` before a hackathon demo. The v33 tests do **not** simulate real camera/screen access.

## Quick verification on your computer

```powershell
npm install
npm run test:all
npm run build
npm run dev
```

Try: select Burmese or Bengali → Daily Coding Solver → pick a challenge → verify translated problem instructions and run a correct/incorrect solution. Visit Sports Arcade → Football or Basketball → press a sequence of actions; the player and ball should move. Then open a CilikLab meeting on a desktop Chrome/Edge browser → **Share screen / slides** → select your PowerPoint or browser tab → **Stop presenting** to restore the camera.

For hosted Telegram/live-classroom video use the existing `npm run dev:meeting-api` setup, the `.env.example` file, and the v31 server instructions. Telegram and cross-device meetings still require live configuration.
