const assert = require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
const root=path.resolve(__dirname,'..');
const app=(await import(path.join(root,'api/entry.js'))).default;
const conf={ TELEGRAM_BOT_TOKEN:'private-test-token', TELEGRAM_BOT_USERNAME:'ciliklab_testbot', TELEGRAM_WEBHOOK_SECRET:'private-test-hook', CILIKLAB_TEACHER_KEY:'private-test-teacher', CILIKLAB_PUBLIC_URL:'https://example.vercel.app', UPSTASH_REDIS_REST_URL:'https://fake-redis.invalid', UPSTASH_REDIS_REST_TOKEN:'private-redis-token' };
Object.assign(process.env,conf);
const db=new Map();const received=[];
const reply=(status,body)=>({ok:status>=200&&status<300,status,async json(){return body}});
const redis=(cmd)=>{const [name,k,...args]=cmd;const key=String(k||'');let e=db.get(key);if(e&&e.expires&&Date.now()>e.expires){db.delete(key);e=null};const value=e?.value??null;switch(String(name).toUpperCase()){
case 'GET':return value;
case 'GETDEL':db.delete(key);return value;
case 'SET':db.set(key,{value:args[0],expires:args[1]==='EX'?Date.now()+Number(args[2])*1000:null});return 'OK';
case 'INCR':{const v=Number(value||0)+1;db.set(key,{value:String(v)});return v;}
case 'RPUSH':{const arr=Array.isArray(value)?value:[];arr.push(args[0]);db.set(key,{value:arr});return arr.length;}
case 'LRANGE':return (value||[]).slice(Number(args[0])<0?Number(args[0]):0,Number(args[1])===-1?undefined:Number(args[1])+1);
case 'LTRIM':{const arr=(value||[]).slice(Number(args[0]));db.set(key,{value:arr});return 'OK';}
case 'EXPIRE':return 1;
default:throw new Error('Unknown Redis command '+name)
}};
global.fetch=async(url,init)=>{
if(url===conf.UPSTASH_REDIS_REST_URL)return reply(200,{result:redis(JSON.parse(init.body))});
if(url.startsWith('https://api.telegram.org/bot')){received.push({url:url.replace(conf.TELEGRAM_BOT_TOKEN,'[REDACTED]'),data:JSON.parse(init.body)});return reply(200,{ok:true,result:true});}
throw Error('Unexpected fetch '+url)
};
const call=async(route,method='GET',{data={},headers={},query={}}={})=>{
const result={statusCode:200,headers:{},value:null};
const req={method,headers,query:{route,...query},body:data};
const res={setHeader(n,v){result.headers[n]=v;return this},status(n){result.statusCode=n;return this},json(v){result.value=v;return this}};
await app(req,res);return result;
};
let r=await call('telegram-status');assert.equal(r.value.configured,true);
r=await call('telegram-link','POST',{data:{studentId:'student123'}});assert.equal(r.statusCode,401);
r=await call('telegram-link','POST',{headers:{'x-teacher-key':conf.CILIKLAB_TEACHER_KEY},data:{studentId:'student123'}});assert.equal(r.statusCode,200);const link=r.value.url;assert.match(link,/^https:\/\/t.me\/ciliklab_testbot\?start=link_[a-f0-9]{48}$/);
assert.ok(received.find(x=>x.url.endsWith('/setWebhook')),'Teacher linking registers webhook automatically');
const oneTime=link.split('_').pop();
r=await call('telegram-webhook','POST',{data:{message:{chat:{type:'private',id:12345},text:'/start link_'+oneTime}}});assert.equal(r.statusCode,403);
r=await call('telegram-webhook','POST',{headers:{'x-telegram-bot-api-secret-token':conf.TELEGRAM_WEBHOOK_SECRET},data:{message:{chat:{type:'private',id:12345},text:'/start link_'+oneTime}}});assert.equal(r.statusCode,200);
r=await call('meetings','POST',{headers:{'x-teacher-key':conf.CILIKLAB_TEACHER_KEY},data:{studentId:'student123',studentName:'Student',className:'Code Club',title:'Check-in',when:'2026-11-01T16:00'}});assert.equal(r.statusCode,201);assert.equal(r.value.telegramSent,true);
const id=r.value.id;const teacherToken=r.value.teacherToken;const meeting=r.value.teacherJoinUrl;assert.match(meeting,/example.vercel.app/);
r=await call('meeting','GET',{query:{id}});assert.equal(r.statusCode,403);
r=await call('meeting','GET',{query:{id,invite:teacherToken}});assert.equal(r.statusCode,200);assert.equal(r.value.role,'teacher');
r=await call('signals','POST',{query:{id,invite:teacherToken},data:{type:'chat',message:'Hello'}});assert.equal(r.statusCode,201);
const mkey='ciliklab:v36:meetings:'+id;
const studentToken=JSON.parse(db.get(mkey).value).studentToken;
r=await call('signals','GET',{query:{id,invite:studentToken,after:0}});assert.equal(r.value.signals.length,1);assert.equal(r.value.signals[0].message,'Hello');
r=await call('signals','GET',{query:{id,invite:teacherToken,after:0}});assert.equal(r.value.signals.length,0);
r=await call('signals','POST',{query:{id,invite:studentToken},data:{type:'danger'}});assert.equal(r.statusCode,400);
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));assert.ok(vercel.rewrites.find(x=>x.source==='/api/telegram/webhook'));
assert.ok(!fs.readFileSync(path.join(root,'src/pages/meetings/LiveClassroom.tsx'),'utf8').includes(conf.TELEGRAM_BOT_TOKEN));
console.log('PASS v36: Vercel API, Telegram webhook auth, one-time linking, meeting permissions, notification, signaling, and source safety');
})().catch(err=>{console.error(err);process.exitCode=1});
