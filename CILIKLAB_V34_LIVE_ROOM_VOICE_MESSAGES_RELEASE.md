# CilikLab v34 — Student Live Room, Meeting Demo Voices, Conversations

This is an additive release based directly on the v33 source. No game, quiz, localization, learning progress, room signaling, Telegram API, or video engine was removed.

## What's new

1. **My Live Room** is now an easy-to-find student dashboard card and sidebar/Quick Find destination. The existing `live_classroom` route remains unchanged. A **Try my devices** button opens a clearly marked solo practice room with live local webcam/microphone and browser screen/tab/window sharing. The actual video controls are inherited from the existing WebRTC meeting component. Students can still open a teacher invitation and join the existing local-tab or hosted invitation-only room.
2. **Demo voices on both sides**: The teacher and student Live Classroom interfaces, plus the hosted meeting room after invitation verification, each include two on-demand, labeled example phrases. Play and Stop use the browser's actual `SpeechSynthesis` engine. This audio is **local simulation**, never claimed to be the other participant speaking and never transmitted across WebRTC. English and Malay example dialogue is included; device TTS voice installation and browser speech availability vary.
3. **Teacher–student conversations**: The existing **Class Community** page now contains a Conversations tab and the original Community feed as separate tabs. Teachers may select a student from the existing roster, and students may contact the defined teacher. Messages are stored in browser `localStorage` and synchronized between tabs with `storage` events and `BroadcastChannel`. They are **not centrally stored or remotely synchronized**; they should not be presented as production-private messaging. The existing live meeting room chat remains available through the established meeting signaling, which supports remote participants when the hosted backend is configured.
4. **Both dashboards**: A student-facing Live Room card and Message teacher shortcut; a teacher-facing Meet & Message card. Clearer mobile wrapping and accessible labels/controls in the new components.

## Known limitations and safety

- Live calls between different devices continue to require `server/telegram-meetings.mjs`, appropriate meeting tokens, HTTPS, browser permissions and sometimes TURN service. The unchanged Telegram bot needs its token, configuration and a linked student/guardian account.
- Same-browser practice is **solo**; the video and audio previews are local and conversation practice is not delivered to a teacher.
- Demo voice uses speech synthesis; spoken samples do not demonstrate remote WebRTC audio delivery. Language-specific voice availability depends on the OS and browser.
- The new one-to-one Conversation tab is **a local prototype**. It does **not** guarantee encryption, safeguarding, authenticated cross-device sync, or a shared school database. Before real deployment with children, add account authentication, permission checks, message moderation/reporting, guardian consent as applicable, database storage, and suitable safeguarding/retention policies.
- Actual browser device tests, cross-device calls and live Telegram delivery require deployment and credentials and were not completed in this environment.

## Files changed or added

### Added
- `src/pages/meetings/MeetingDemoVoices.tsx`
- `src/pages/meetings/classroom-v34.css`
- `src/pages/community/DirectMessages.tsx`
- `src/pages/community/directMessages.css`
- `scripts/v34-live-messaging-smoke.cjs`
- this release report

### Updated
- `src/pages/meetings/LiveClassroom.tsx` — practice-room access, demo voices, reliable toggle feedback
- `src/pages/meetings/HostedClassroom.tsx` — demo voices and reliable media-toggle feedback
- `src/pages/community/CommunityView.tsx` — Conversations tab and original Community tab
- `src/pages/student/StudentDashboard.tsx` — My Live Room and Message teacher shortcuts
- `src/pages/teacher/TeacherDashboard.tsx` — teacher Meet & Message shortcut
- `src/components/layout/Sidebar.tsx` — clearer student My Live Room label
- `src/components/layout/QuickNavigator.tsx` — clearer student My Live Room search entry
- `package.json` — new `test:v34` script and inclusion in `test:all`

## How to test locally

```powershell
npm install
npm run test:all
npm run test:v34
npm run build
npm run dev
```

1. Enter **Student View → My Live Room**. Click **Try my devices**, grant browser permissions, toggle camera and mic, and select **Share screen / slides**. Verify the browser-owned screen picker, local preview and **Stop presenting**. Click **Leave**.
2. Click **Listen** under the student and teacher demo phrases; verify audible speech if supported, captions and Stop. Switch to **Teacher View → Live Classroom** and repeat.
3. Enter **Class Community → Conversations**. Send a message as a student, open another tab using the same origin, switch to Teacher View, select the student and confirm the text. Reply and check the student tab. The messages persist on that device only. Verify **Class Community** retains posts, comments and peer code reviews.
4. Configure and start the existing meeting server and link the Telegram bot account to test authenticated cross-device joining and real WebRTC room chat. Test on two different machines with HTTPS and a TURN server if required.
5. Check the new cards and controls at 320px, 375px, 768px and desktop widths. Screen permission flows require live browser testing; source checks cannot simulate device APIs.

## Verification report

- `npm run test:all`: passed including original v33 suites and v34 static integration suite.
- TypeScript/TSX syntax: checked with TypeScript transpile diagnostics (not full typecheck), 82 source files.
- New stylesheets parsed using PostCSS.
- Vite production build: not verified because project dependencies, including Vite, are unavailable in this container.
- End-to-end browser video/audio + Telegram: not verified; must be done on compatible browser devices.
