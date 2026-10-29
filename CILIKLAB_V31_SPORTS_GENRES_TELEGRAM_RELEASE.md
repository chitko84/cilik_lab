# CilikLab v31 — Explore Games, Three Sports Games, and Telegram Live Classroom

## New features

### A. Explore game categories (10 filter tiles)

A visually prominent Arcade section now groups the existing games and new sports by **Action, Simulation, Puzzle, Adventure, Racing, Role Playing, Strategy, Sports, Card, and Board**. The category cards are clickable, filter existing Arcade games, show counts, and can be reset. The existing filters, search, world map, achievements, XP and saved scores remain.

### B. Three new interactive sports games (36 levels total)

- **Football Playmaker**: 12 increasingly long coding-action sequences using pass, dribble, shoot, defend.
- **Hoop Heroes**: 12 levels with pass, dribble, shoot, block.
- **Track & Field Quest**: 12 levels with run, jump, duck, recover.

Each game has 12 individual levels. The first rounds have two or three steps; later rounds require up to ten ordered steps. Scenes include sports decisions, per-step input, hints, undo/reset, correctness checking, level selection, best scores, XP and saved progress. Completed levels do not repeatedly farm XP. Mobile layouts, keyboard-accessible buttons and original local SVG covers are included.

All 14 original games and their 92 challenges are unchanged. New total: **17 games / 128 game challenges**; the separate 100 Daily Coding Solver exercises and 80 general-knowledge quiz questions remain intact.

### C. Real Telegram meeting invitations — secure prototype server

The v30 browser-local meeting mode is preserved. This release adds the **optional** Telegram integration and hosted meeting service:

1. A teacher selects a class/student in **Teacher View > Live Classroom**.
2. The administrator starts the Node meeting API and configures a dedicated Telegram bot (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `CILIKLAB_TEACHER_KEY`, `CILIKLAB_PUBLIC_URL`).
3. The teacher enters the integration key in the teacher meeting panel (it is used for that request only, not stored in localStorage).
4. The teacher clicks **Connect selected student / guardian Telegram**, then shares the generated 15-minute bot deep link with the family. The student/guardian explicitly opens Telegram and presses **Start**. The backend links that Telegram chat to the selected student ID.
5. Once linked, **Schedule & send invitation** creates an invitation-only hosted room and calls Telegram `sendMessage` with an inline **Join CilikLab Live Classroom** button and meeting details.
6. Clicking the Telegram button opens the website at `/?meeting=<ID>&invite=<student token>`. The teacher uses **Open hosted room** in their teacher meeting list. Both can join WebRTC video/chat. A lightweight server handles offer/answer/ICE messages across devices using HTTP polling. Existing two-tab BroadcastChannel meetings also remain available.

Telegram bot token and chat mappings stay on the server. Hosted room IDs and distinct teacher/student invitation tokens are random; requests lacking the correct token are rejected. Telegram delivery reports success only if the Bot API confirms delivery. Missing bot config, an unlinked student, or a server error displays a **not delivered** status. Nothing silently claims a message was sent.

**Important safety and deployment limits:** This is a hackathon-grade *server-backed prototype*, not an audited children's live-learning service. It lacks school-account authentication/authorization, school/guardian consent management, end-to-end audit trails and content moderation, TURN relay, data deletion/retention policies, and production rate limiting. Children should connect Telegram only with guardian permission. Bot polling cannot run from a static-only hosting account; a persistent Node service or background worker is required. Rooms across restrictive networks may need TURN. Actual Telegram delivery and cross-device camera/microphone connection have NOT been verified with live accounts.

## Setup on Windows / Mac / Linux

1. Extract this ZIP, open `ciliklab-main` and run `npm install`.
2. Create a Telegram bot using `@BotFather` in Telegram. Copy its **private bot token** and bot username.
3. Copy `.env.example` to `.env`; fill `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, a strong random `CILIKLAB_TEACHER_KEY` and the public `CILIKLAB_PUBLIC_URL`. Never commit or display your secrets; `.env` is ignored by Git.
4. Start the API in one terminal: `npm run dev:meeting-api`.
5. Start the frontend in a second terminal: `npm run dev` (Vite proxies `/api` to the API server on port 8787).
6. Open `http://localhost:3000` for desktop local development. For a student to open Telegram on a phone and join a video meeting, you need a **public HTTPS domain** pointing at the Vite frontend/meeting API on the same origin; set `CILIKLAB_PUBLIC_URL` accordingly and restart the API.
7. For production: `npm run build`, then `npm run start:hosted`; this Node server serves `dist/` alongside the API. Put an HTTPS reverse proxy in front of it. Use dedicated private persistent server storage for the meeting records (`CILIKLAB_MEETING_DATA`).
8. In Teacher View > Live Classroom, enter the teacher key, select a student, connect their Telegram via the short link, and schedule a meeting. Read the on-screen delivery result. Join teacher and student from their respective invitations.

The `@BotFather` token is NEVER used in frontend code and is NEVER a `VITE_*` environment variable.

## Verification

- All original tests: `npm run test:all` — passed in source test environment.
- New v31 smoke test: 36/36 levels, correct and incorrect sequences, ten genres, route wiring, original assets, server authentication, offline API creation and cross-device signaling endpoints — passed.
- TSX/TS parsing: passed for all 73 source files (syntax only, not a Vite bundle).
- Full Vite build and actual browser/camera/Telegram delivery: NOT verified in this environment due to unavailable project dependency installation and missing configured bot.
- All original source files preserved; additional components, CSS, artwork, tests and backend are additive.

## Known language limitations

The new sports game UI and content are prepared in Malay and English, while other configured languages still rely on fallback text. Existing v28 localization was also incomplete for many educational modules. Do not describe the entire application as fully translated.
