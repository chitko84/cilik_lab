/**
 * CilikLab Vercel Function: Telegram webhook and hosted classroom API.
 * Uses Upstash Redis REST for persistence. Never expose credentials via VITE_*.
 * This is a hackathon prototype: production child safety and identities need work.
 */
import { randomBytes, timingSafeEqual } from 'node:crypto';

const rand = (n = 24) => randomBytes(n).toString('hex');
const eq = (a, b) => {
  if (!a || !b) return false;
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};
const settings = () => ({
  token: process.env.TELEGRAM_BOT_TOKEN || '',
  bot: (process.env.TELEGRAM_BOT_USERNAME || '').replace(/^@/, ''),
  teacher: process.env.CILIKLAB_TEACHER_KEY || '',
  url: (process.env.CILIKLAB_PUBLIC_URL || '').replace(/\/$/, ''),
  hook: process.env.TELEGRAM_WEBHOOK_SECRET || '',
  redisUrl: (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, ''),
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || ''
});
const key = (...parts) => ['ciliklab:v36', ...parts].join(':');
const DAY = 86400;
async function redis(config, ...cmd) {
  if (!config.redisUrl || !config.redisToken) throw new Error('Persistent meeting storage is not configured');
  const response = await fetch(config.redisUrl, {
    method: 'POST', headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd), signal: AbortSignal.timeout(7000)
  });
  if (!response.ok) throw new Error('Persistent storage request failed');
  const body = await response.json();
  if (body.error) throw new Error('Persistent storage command failed');
  return body.result;
}
const readJson = async (c, k) => { const v = await redis(c, 'GET', k); return v ? JSON.parse(v) : null; };
const saveJson = (c, k, v, seconds) => redis(c, 'SET', k, JSON.stringify(v), 'EX', seconds);
async function telegram(config, method, payload) {
  if (!config.token) throw new Error('Telegram token is not configured');
  const response = await fetch(`https://api.telegram.org/bot${config.token}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(12000)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error('Telegram rejected the request');
  return data.result;
}
const json = (res, status, payload) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(payload);
};
const inputBody = req => {
  const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (JSON.stringify(data).length > 16000) throw new Error('Request too large');
  return data;
};
const isStudentId = id => /^[\w-]{3,90}$/.test(id || '');
const isMeetingId = id => /^[a-f0-9]{32}$/.test(id || '');
const allowedSignal = new Set(['join', 'offer', 'answer', 'candidate', 'chat', 'leave']);
const member = (m, token) => eq(m.teacherToken, token) ? 'teacher' : eq(m.studentToken, token) ? 'student' : null;
const meetingPublic = m => ({ id: m.id, title: m.title, when: m.when, className: m.className, studentName: m.studentName });
const privateRoom = (req, m) => String(req.headers['x-meeting-token'] || req.query.invite || '');

export async function handle(req, res) {
  const c = settings();
  const route = String(req.query.route || '');
  const method = req.method;
  try {
    if (route === 'telegram-status' && method === 'GET') {
      return json(res, 200, { configured: Boolean(c.token && c.bot && c.teacher && c.hook && c.redisUrl && c.redisToken), botUsername: c.bot || null });
    }
    if (route === 'telegram-webhook' && method === 'POST') {
      if (!c.hook || !eq(req.headers['x-telegram-bot-api-secret-token'], c.hook)) return json(res, 403, { error: 'Forbidden' });
      const message = inputBody(req).message;
      const match = message?.chat?.type === 'private' && typeof message?.text === 'string'
        ? message.text.match(/^\/start(?:@\w+)?\s+link_([a-f0-9]{48})\s*$/) : null;
      if (match) {
        const raw = await redis(c, 'GETDEL', key('links', match[1]));
        const link = raw ? JSON.parse(raw) : null;
        if (link?.studentId && link.expires > Date.now()) {
          await redis(c, 'SET', key('chats', link.studentId), String(message.chat.id), 'EX', 30 * DAY);
          await telegram(c, 'sendMessage', { chat_id: message.chat.id, text: 'CilikLab classroom notifications connected. Please use this only with parent or guardian permission.' });
        } else {
          await telegram(c, 'sendMessage', { chat_id: message.chat.id, text: 'Your classroom connection link expired. Ask your teacher for a new link.' });
        }
      }
      return json(res, 200, { ok: true });
    }
    if (route === 'telegram-link' && method === 'POST') {
      if (!eq(req.headers['x-teacher-key'], c.teacher)) return json(res, 401, { error: 'Teacher integration key required' });
      if (!c.token || !c.bot || !c.hook || !c.url.startsWith('https://')) return json(res, 503, { error: 'Telegram bot, webhook secret and HTTPS URL must be configured' });
      const body = inputBody(req);
      if (!isStudentId(body.studentId)) return json(res, 400, { error: 'Invalid student ID' });
      // On the first teacher-authorized link, set the Telegram webhook automatically.
      // Never expose the bot token or webhook secret to the browser.
      await telegram(c, 'setWebhook', { url: `${c.url}/api/telegram/webhook`, secret_token: c.hook, allowed_updates: ['message'], drop_pending_updates: false });
      const token = rand();
      await saveJson(c, key('links', token), { studentId: body.studentId, expires: Date.now() + 15 * 60000 }, 900);
      return json(res, 200, { url: `https://t.me/${c.bot}?start=link_${token}`, expiresMinutes: 15 });
    }
    if (route === 'meetings' && method === 'POST') {
      if (!eq(req.headers['x-teacher-key'], c.teacher)) return json(res, 401, { error: 'Teacher integration key required' });
      const b = inputBody(req);
      if (!isStudentId(b.studentId) || !String(b.when || '').trim() || !String(b.title || '').trim()) return json(res, 400, { error: 'Student, title and date/time required' });
      if (!c.url.startsWith('https://')) return json(res, 503, { error: 'Public HTTPS URL is required' });
      const id = rand(16); const teacherToken = rand(); const studentToken = rand();
      const m = { id, teacherToken, studentToken, studentId: b.studentId, studentName: String(b.studentName || 'Student').slice(0, 80), className: String(b.className || 'Class').slice(0, 100), title: String(b.title).slice(0, 110), when: String(b.when).slice(0, 45) };
      await saveJson(c, key('meetings', id), m, 7 * DAY);
      let telegramSent = false; let telegramError = '';
      const chatId = await redis(c, 'GET', key('chats', b.studentId));
      if (chatId && c.token) {
        try {
          await telegram(c, 'sendMessage', {
            chat_id: chatId,
            text: `CilikLab · Your teacher invited you to a coding meeting.\n${m.title}\n${m.className}\n${m.when}\nTap Join Classroom below.`,
            reply_markup: { inline_keyboard: [[{ text: 'Join CilikLab Live Classroom', url: `${c.url}/?meeting=${id}&invite=${studentToken}` }]] }
          });
          telegramSent = true;
        } catch { telegramError = 'Telegram delivery failed'; }
      } else telegramError = chatId ? 'Bot token missing' : 'Student Telegram not linked';
      return json(res, 201, { ...meetingPublic(m), teacherToken, telegramSent, telegramError, teacherJoinUrl: `${c.url}/?meeting=${id}&invite=${teacherToken}` });
    }
    if (route === 'meeting' || route === 'signals') {
      const id = String(req.query.id || '');
      if (!isMeetingId(id)) return json(res, 400, { error: 'Invalid meeting ID' });
      const m = await readJson(c, key('meetings', id));
      if (!m) return json(res, 404, { error: 'Meeting not found or expired' });
      const role = member(m, privateRoom(req, m));
      if (!role) return json(res, 403, { error: 'Invalid meeting invitation' });
      if (route === 'meeting' && method === 'GET') return json(res, 200, { ...meetingPublic(m), role });
      if (route === 'signals' && method === 'POST') {
        const b = inputBody(req);
        if (!allowedSignal.has(b.type)) return json(res, 400, { error: 'Unsupported signal' });
        if (JSON.stringify(b.payload || '').length > 12000) return json(res, 413, { error: 'Signal too large' });
        const count = await redis(c, 'INCR', key('signalnum', id));
        const signal = { id: count, sender: role, type: b.type, payload: b.payload || null, message: b.type === 'chat' ? String(b.message || '').trim().slice(0, 750) : undefined };
        await redis(c, 'RPUSH', key('signals', id), JSON.stringify(signal));
        await redis(c, 'LTRIM', key('signals', id), -180, -1);
        await redis(c, 'EXPIRE', key('signals', id), 7 * DAY);
        await redis(c, 'EXPIRE', key('signalnum', id), 7 * DAY);
        return json(res, 201, { id: count });
      }
      if (route === 'signals' && method === 'GET') {
        const after = Math.max(0, Number(req.query.after || 0) || 0);
        const raw = await redis(c, 'LRANGE', key('signals', id), 0, -1);
        const events = (raw || []).map(s => JSON.parse(s)).filter(s => s.id > after && s.sender !== role).sort((a, b) => a.id - b.id).slice(-70);
        return json(res, 200, { signals: events });
      }
    }
    return json(res, 404, { error: 'Unknown API route' });
  } catch (e) {
    console.error('CilikLab meeting API error:', e?.message || 'Unknown error');
    return json(res, 500, { error: 'The meeting service could not complete this request.' });
  }
}

export default handle;
