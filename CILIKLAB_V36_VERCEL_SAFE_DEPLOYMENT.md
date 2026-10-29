# CilikLab v36 — Safe GitHub + Vercel Deployment Package

This package leaves the existing CilikLab v35 games, comic readers, Ciko, teacher/student pages, and local demo intact. It **adds a Vercel serverless Telegram + Live Classroom API** using Telegram webhooks and Upstash Redis REST. No real credentials are included. Local `npm run dev:meeting-api` still uses the original Node server for local demonstrations; the Vercel API uses `api/entry.js` instead.

## Why the change is necessary
The previous Node server used `getUpdates` polling and a local writable JSON database, unsuitable for a static-only Vercel deployment. The new Function uses the same frontend API routes, Telegram webhooks, and Redis for state that survives invocations. Its room-signaling endpoints use HTTP polling for WebRTC, so no persistent WebSocket process is required.

## Quick deployment
1. Unzip the project, open the inner `ciliklab-main` folder. Do **not** commit `.env` or any bot keys. Ensure `.gitignore` remains present.
2. Create an Upstash Redis database (Upstash marketplace integration in Vercel is a convenient way). Obtain `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Use the standard **write-capable** token, never a read-only token. Set both in Vercel project environment variables, not source code.
3. In Vercel Project > Settings > Environment Variables, configure:
   - `TELEGRAM_BOT_TOKEN`: the private token from @BotFather
   - `TELEGRAM_BOT_USERNAME`: public bot username, **without** @
   - `TELEGRAM_WEBHOOK_SECRET`: a separate random string containing letters, digits, underscore, or hyphen
   - `CILIKLAB_TEACHER_KEY`: a **different** strong secret the teacher enters when creating meetings
   - `CILIKLAB_PUBLIC_URL`: exact deployed site URL such as `https://your-site.vercel.app`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: Redis secrets
4. Push this inner project directory to a **private** GitHub repository (make sure `package.json` is at the repository root). Import it into Vercel with Framework=Vite, build=`npm run build`, output=`dist`. Deploy. **Redeploy if environment variables were added after initial deployment.**
5. **No separate Telegram webhook command is normally needed**: the first teacher-authorized **Connect student / guardian Telegram** request automatically registers the webhook through the server-side API. If you prefer manual setup, optional `node scripts/configure-telegram-webhook.mjs` is included. The script reads a private local `.env` (do not commit).
6. Visit `https://your-site.vercel.app/api/telegram/status`; it should report `configured: true`. Then in Teacher > Live Classroom, enter the **teacher key** (not the bot token), select a student, create their 15-minute Telegram linking URL and ask the parent/guardian to tap Start. Schedule a new meeting. Confirm `telegramSent: true`. Test the invite on a separate browser/device with HTTPS camera/mic permissions.
7. Do not place the teacher key or Telegram bot token in a public screenshot, card, PDF, demo slide, frontend `VITE_*` variable, or repository. **The bot username and invitation button are safe to show; the credential is not.** If a token is exposed, revoke it with BotFather and redeploy with a new secret.

## Verification and operational caveats
- The new API preserves the existing routes `/api/telegram/status`, `/api/telegram/link`, `/api/meetings`, `/api/meetings/:id` and `/api/meetings/:id/signals`. It adds `/api/telegram/webhook`.
- Telegram webhook requests must carry the expected `X-Telegram-Bot-Api-Secret-Token` header; teacher-only routes require `x-teacher-key`. Meeting signaling requires the exact room invitation token.
- Linking codes expire in 15 minutes, meetings/signals in 7 days, and chat mappings in 30 days. Use consenting guardian accounts for child demos; delete/revoke demo data afterward. Upstash must be connected and writable.
- This is a **hackathon prototype**, not a production school messaging service. It is not yet equipped with a comprehensive student identity system, guardian consent records, moderated chat, retention policies, rate limiting, or a TURN relay. Across restrictive mobile networks, screen sharing/video may need a TURN server. The community conversations feature is still local-browser only.
- No actual Vercel deployment, Telegram webhook call, or remote video call was performed in this build because there are no deployment credentials or external hosting access here. Full browser/build testing requires the app dependencies and a real hosted deployment.

## Local commands
```
npm install
npm run test:all
npm run test:vercel
npm run build
npm run dev
```
For the original local Node API: `npm run dev:meeting-api` in another terminal. For Vercel Function integration locally, use `vercel dev` with your **private local** environment; don't expose credentials to frontend.

References: https://vercel.com/docs/frameworks/frontend/vite ; https://core.telegram.org/bots/api ; https://upstash.com/docs/redis/features/restapi .
