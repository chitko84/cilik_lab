const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const vm=require('node:vm');const {spawn}=require('node:child_process');
const root=path.join(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('src/pages/arcade/addons/sportsEngine.ts');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const compiled={exports:{}};vm.runInNewContext(js,{module:compiled,exports:compiled.exports,require}, {timeout:2000});const {SPORT_LEVELS,SPORTS,evaluateSport,sportEventText}=compiled.exports;
let total=0;
for(const sport of ['football','basketball','track']){
 const levels=SPORT_LEVELS[sport];assert.equal(levels.length,12);let previous=0;
 for(let i=0;i<12;i++){
  const l=levels[i];total++;assert.equal(l.id,`sport-${sport}-${i+1}`);assert.ok(l.steps.length>=previous,`${l.id} must not get shorter`);previous=l.steps.length;
  assert.ok(evaluateSport(l,l.steps).passed,`${l.id} answer must pass`);
  const incorrect=l.steps.map((s,j)=>j===0?SPORTS[sport].actions.find(a=>a.id!==s).id:s);assert.ok(!evaluateSport(l,incorrect).passed,`${l.id} wrong answer must fail`);
  assert.ok(!evaluateSport(l,l.steps.slice(0,-1)).passed,`${l.id} missing step must fail`);
  for(const step of l.steps){assert.ok(SPORTS[sport].actions.some(a=>a.id===step));assert.ok(sportEventText(sport,step).length>14)}
 }
 assert.ok(levels[11].steps.length>levels[0].steps.length);
}
assert.equal(total,36);
const hub=read('src/pages/arcade/addons/ArcadeHome.tsx');
for(const category of ['Action','Simulation','Puzzle','Adventure','Racing','Role Playing','Strategy','Sports','Card','Board'])assert.ok(hub.includes(category),`genre ${category}`);
for(const f of ['football','basketball','track']){assert.ok(read('src/pages/arcade/addons/AdventureExtras.tsx').includes(`id:'${f}'`));assert.ok(read('src/pages/arcade/ArcadeView.tsx').includes('SportsArena'));assert.ok(fs.existsSync(path.join(root,'public/arcade',SPORTS[f].art.split('/').pop())))}
const view=read('src/pages/meetings/LiveClassroom.tsx');assert.ok(view.includes("'/api/telegram/link'"));assert.ok(view.includes("'/api/meetings'"));assert.ok(view.includes('HostedClassroom'));
const remote=read('src/pages/meetings/HostedClassroom.tsx');assert.ok(remote.includes('RTCPeerConnection'));assert.ok(remote.includes('/signals'));assert.ok(remote.includes('getUserMedia'));
const server=read('server/telegram-meetings.mjs');for(const s of ['getUpdates','sendMessage','TELEGRAM_BOT_TOKEN','TELEGRAM_TEACHER','CILIKLAB_TEACHER_KEY','telegramSent','x-meeting-token'])if(s!=='TELEGRAM_TEACHER')assert.ok(server.includes(s));
const files=[];function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(/\.tsx?$/.test(ent.name))files.push(p)}}walk(path.join(root,'src'));
for(const f of files){const result=ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}});assert.equal(result.diagnostics.filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,`TS syntax ${f}`)}
async function apiTest(){
 const port=19876;const child=spawn(process.execPath,['server/telegram-meetings.mjs'],{cwd:root,env:{...process.env,CILIKLAB_API_PORT:String(port),CILIKLAB_TEACHER_KEY:'integration-test-key',TELEGRAM_BOT_TOKEN:'',CILIKLAB_MEETING_DATA:path.join('/tmp',`ciliklab-v31-api-test-${process.pid}.json`)},stdio:'ignore'});
 const base=`http://127.0.0.1:${port}`;let ready=false;
 try{
  for(let i=0;i<30;i++){try{const r=await fetch(base+'/api/telegram/status');if(r.ok){ready=true;break}}catch{}await new Promise(resolve=>setTimeout(resolve,100))}
  assert.ok(ready,'API must listen');
  let r=await fetch(base+'/api/meetings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:'usr_student_01',title:'Class call',when:'2026-10-30T10:00'})});assert.equal(r.status,401,'API requires teacher key');
  r=await fetch(base+'/api/telegram/link',{method:'POST',headers:{'Content-Type':'application/json','x-teacher-key':'integration-test-key'},body:'{"studentId":"usr_student_01"}'});assert.equal(r.status,503,'Bot setup must be reported honestly');
  r=await fetch(base+'/api/meetings',{method:'POST',headers:{'Content-Type':'application/json','x-teacher-key':'integration-test-key'},body:JSON.stringify({studentId:'usr_student_01',studentName:'Learner',title:'Class call',className:'Intro Coding',when:'2026-10-30T10:00'})});assert.equal(r.status,201);
  const meeting=await r.json();assert.equal(meeting.telegramSent,false);assert.ok(meeting.telegramError);assert.ok(meeting.teacherToken);assert.ok(!meeting.studentToken,'student token must not be returned in teacher response');
  r=await fetch(base+`/api/meetings/${meeting.id}`);assert.equal(r.status,403);
  r=await fetch(base+`/api/meetings/${meeting.id}`,{headers:{'x-meeting-token':meeting.teacherToken}});assert.equal(r.status,200);const metadata=await r.json();assert.equal(metadata.role,'teacher');assert.equal(metadata.studentName,'Learner');
  r=await fetch(base+`/api/meetings/${meeting.id}/signals`,{method:'POST',headers:{'Content-Type':'application/json','x-meeting-token':meeting.teacherToken},body:JSON.stringify({type:'chat',message:'Hello from teacher'})});assert.equal(r.status,201);
  r=await fetch(base+`/api/meetings/${meeting.id}/signals`,{headers:{'x-meeting-token':meeting.teacherToken}});const seen=await r.json();assert.equal(seen.signals.length,0,'server should not echo own messages');
  console.log(`PASS: ${total} sports levels, 10 genres, TS syntax (${files.length} sources), Telegram server auth, links, room and signal checks.`);
 }finally{child.kill('SIGTERM');try{fs.unlinkSync(path.join('/tmp',`ciliklab-v31-api-test-${process.pid}.json`))}catch{}}
}
apiTest().catch(e=>{console.error(e);process.exitCode=1});
