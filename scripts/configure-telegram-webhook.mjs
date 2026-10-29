/** One-time post-deployment setup. Run locally with env values loaded; do NOT commit .env. */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
if (typeof process.loadEnvFile === 'function' && existsSync(resolve('.env'))) process.loadEnvFile(resolve('.env'));
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const url = (process.env.CILIKLAB_PUBLIC_URL || '').replace(/\/$/, '');
if (!token || !secret || !url.startsWith('https://')) {
  console.error('Missing TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, or public HTTPS CILIKLAB_PUBLIC_URL');
  process.exitCode = 1;
} else {
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ url: `${url}/api/telegram/webhook`, secret_token: secret, allowed_updates: ['message'], drop_pending_updates: false }),
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    console.error('Telegram webhook registration failed:', result.description || `HTTP ${response.status}`);
    process.exitCode = 1;
  } else console.log('Telegram webhook registered successfully for', url, '(secret not displayed)');
}
