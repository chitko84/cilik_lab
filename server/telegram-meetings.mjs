/**
 * CilikLab Telegram + cross-device classroom prototype server.
 * Node 20+ only, no third-party packages. Start alongside Vite, or serve dist.
 * Secrets stay in server environment. Child accounts require guardian-approved opt-in.
 * NOT a production auth, data residency, consent or child-safety solution.
 */
import http from 'node:http';
import {readFileSync,writeFileSync,existsSync,mkdirSync,statSync,createReadStream} from 'node:fs';
import {join,resolve,extname} from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
// Node 22+ can load a private .env; process environment variables still take precedence.
if(existsSync(join(ROOT,'.env'))&&typeof process.loadEnvFile==='function')process.loadEnvFile(join(ROOT,'.env'));
const PORT=Number(process.env.CILIKLAB_API_PORT||8787);
const TOKEN=process.env.TELEGRAM_BOT_TOKEN||'';
const BOTNAME=(process.env.TELEGRAM_BOT_USERNAME||'').replace(/^@/,'');
const TEACHER_KEY=process.env.CILIKLAB_TEACHER_KEY||'';
const PUBLIC_URL=(process.env.CILIKLAB_PUBLIC_URL||'http://localhost:3000').replace(/\/$/,'');
const DATAFILE=resolve(process.env.CILIKLAB_MEETING_DATA||join(ROOT,'server','.meetings-private.json'));
const SECRET=()=>randomBytes(24).toString('hex');
const readDb=()=>{try{const d=JSON.parse(readFileSync(DATAFILE,'utf8'));return {meetings:d.meetings||{},links:d.links||{},chats:d.chats||{},offset:d.offset||0}}catch{return {meetings:{},links:{},chats:{},offset:0}}};
let db=readDb();
const persist=()=>{mkdirSync(resolve(DATAFILE,'..'),{recursive:true});writeFileSync(DATAFILE,JSON.stringify(db,null,2),{mode:0o600})};
const equal=(a,b)=>{if(!a||!b)return false;const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y)};
const teacherAuth=req=>Boolean(TEACHER_KEY&&equal(req.headers['x-teacher-key'],TEACHER_KEY));
const json=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj))};
const body=async req=>{let text='';for await(const chunk of req){text+=chunk;if(text.length>16000)throw Error('Request is too large')}return JSON.parse(text||'{}')};
const api=async(method,data)=>{if(!TOKEN)throw Error('Bot token has not been configured');const resp=await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(13000)});const result=await resp.json();if(!result.ok)throw Error(result.description||'Telegram request rejected');return result.result};
let botName=BOTNAME;
async function botPoll(){if(!TOKEN)return;try{const me=await api('getMe',{});botName=botName||me.username||'';await api('deleteWebhook',{drop_pending_updates:false})}catch(err){console.warn('Telegram bot setup:',err.message)}
 while(TOKEN){try{const resp=await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offset:db.offset+1,timeout:22,allowed_updates:['message']}),signal:AbortSignal.timeout(28000)});const data=await resp.json();if(!data.ok)throw Error(data.description||'getUpdates failed');for(const upd of data.result||[]){db.offset=upd.update_id;const msg=upd.message;if(msg?.chat?.type==='private'&&typeof msg.text==='string'){const match=msg.text.match(/^\/start(?:@\w+)?\s+link_([a-f\d]{48})\s*$/);if(match){const link=db.links[match[1]];if(link&&link.expires>Date.now()){db.chats[link.studentId]=String(msg.chat.id);delete db.links[match[1]];try{await api('sendMessage',{chat_id:msg.chat.id,text:'CilikLab classroom notifications are connected. You can now receive meeting invitations. Please use this account only with parent/guardian permission.'})}catch{}}else{try{await api('sendMessage',{chat_id:msg.chat.id,text:'This connection link expired. Ask your teacher for a new invitation.'})}catch{}}}}persist()}}catch(err){console.warn('Telegram polling:',err.message);await new Promise(r=>setTimeout(r,5000))}}
}
const matchMeet=(path)=>path.match(/^\/api\/meetings\/([a-f\d]{32})(?:\/(signals))?$/);
function authRoom(meeting,token){if(equal(meeting.teacherToken,token))return 'teacher';if(equal(meeting.studentToken,token))return 'student';return null}
function messagePublic(meeting){return {id:meeting.id,title:meeting.title,when:meeting.when,className:meeting.className,studentName:meeting.studentName}}
async function handleApi(req,res,url){try{
 if(url.pathname==='/api/telegram/status'&&req.method==='GET')return json(res,200,{configured:!!TOKEN&&!!TEACHER_KEY,botUsername:botName||null,linkedCount:Object.keys(db.chats).length});
 if(url.pathname==='/api/telegram/link'&&req.method==='POST'){
  if(!teacherAuth(req))return json(res,401,{error:'Teacher integration key required'});
  if(!TOKEN||!botName)return json(res,503,{error:'Telegram bot not configured or username not found'});
  const data=await body(req);if(!/^[\w-]{3,90}$/.test(data.studentId||''))return json(res,400,{error:'Invalid student ID'});
  const linkToken=SECRET();db.links[linkToken]={studentId:data.studentId,expires:Date.now()+15*60*1000};persist();
  return json(res,200,{url:`https://t.me/${botName}?start=link_${linkToken}`,expiresMinutes:15});
 }
 if(url.pathname==='/api/meetings'&&req.method==='POST'){
  if(!teacherAuth(req))return json(res,401,{error:'Teacher integration key required'});
  const data=await body(req);if(!/^[\w-]{3,90}$/.test(data.studentId||'')||!String(data.when||'').trim()||!String(data.title||'').trim())return json(res,400,{error:'Student, title and date/time required'});
  const id=randomBytes(16).toString('hex'),teacherToken=SECRET(),studentToken=SECRET();const meeting={id,teacherToken,studentToken,studentId:data.studentId,studentName:String(data.studentName||'Student').slice(0,80),className:String(data.className||'Class').slice(0,100),title:String(data.title).slice(0,110),when:String(data.when).slice(0,45),created:Date.now(),signals:[],nextId:0};db.meetings[id]=meeting;persist();
  let telegramSent=false,telegramError='';const chatId=db.chats[data.studentId];
  if(chatId&&TOKEN){try{await api('sendMessage',{chat_id:chatId,text:`CilikLab · Your teacher invited you to a coding meeting.\n${meeting.title}\n${meeting.className}\n${meeting.when}\nTap Join Classroom below.`,reply_markup:{inline_keyboard:[[{text:'Join CilikLab Live Classroom',url:`${PUBLIC_URL}/?meeting=${id}&invite=${studentToken}`}]]}});telegramSent=true}catch(err){telegramError=err.message}}
  else telegramError=chatId?'Bot token missing':'Student Telegram not linked';
  return json(res,201,{...messagePublic(meeting),teacherToken,telegramSent,telegramError,teacherJoinUrl:`${PUBLIC_URL}/?meeting=${id}&invite=${teacherToken}`});
 }
 const match=matchMeet(url.pathname);if(match){const m=db.meetings[match[1]];if(!m)return json(res,404,{error:'Meeting not found'});const token=String(req.headers['x-meeting-token']||url.searchParams.get('invite')||'');const role=authRoom(m,token);if(!role)return json(res,403,{error:'Invalid meeting invitation'});
  if(!match[2]&&req.method==='GET')return json(res,200,{...messagePublic(m),role});
  if(match[2]==='signals'){
   if(req.method==='GET'){const after=Math.max(0,Number(url.searchParams.get('after')||0)||0);return json(res,200,{signals:m.signals.filter(s=>s.id>after&&s.sender!==role).slice(-70)});}
   if(req.method==='POST'){const input=await body(req);if(!['join','offer','answer','candidate','chat','leave'].includes(input.type))return json(res,400,{error:'Unsupported signal'});
    if(JSON.stringify(input.payload||'').length>12000)return json(res,413,{error:'Signal too large'});
    const signal={id:++m.nextId,sender:role,type:input.type,payload:input.payload||null,message:input.type==='chat'?String(input.message||'').trim().slice(0,750):undefined};
    // Do not permit unbounded memory/file growth.
    m.signals.push(signal);if(m.signals.length>180)m.signals=m.signals.slice(-180);persist();return json(res,201,{id:signal.id})}
  }
 }
 return json(res,404,{error:'Unknown API route'});
 }catch(err){return json(res,500,{error:err.message||'Server error'})}}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
 if(url.pathname.startsWith('/api/'))return handleApi(req,res,url);
 const dist=join(ROOT,'dist');if(!existsSync(dist))return json(res,404,{error:'Build the Vite frontend or open http://localhost:3000 for development'});
 const requested=resolve(dist,`.${decodeURIComponent(url.pathname)}`);const dest=requested.startsWith(dist)&&existsSync(requested)&&statSync(requested).isFile()?requested:join(dist,'index.html');
 res.writeHead(200,{'Content-Type':mime[extname(dest)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});createReadStream(dest).pipe(res);
});
server.listen(PORT,()=>{console.log(`CilikLab API running at http://localhost:${PORT}`);console.log('Telegram delivery:',TOKEN&&TEACHER_KEY?'configured':'not configured (local meeting prototype remains usable)');if(TOKEN)botPoll()});
