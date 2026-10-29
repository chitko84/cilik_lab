const fs=require('fs');
const path=require('path');
const ts=require('typescript');
const root=path.join(__dirname,'..');
function read(file){return fs.readFileSync(path.join(root,file),'utf8')}
function check(value,message){if(!value)throw new Error(message)}
const local=read('src/pages/meetings/LiveClassroom.tsx');
const hosted=read('src/pages/meetings/HostedClassroom.tsx');
const voices=read('src/pages/meetings/MeetingDemoVoices.tsx');
const messaging=read('src/pages/community/DirectMessages.tsx');
const community=read('src/pages/community/CommunityView.tsx');
const dashboard=read('src/pages/student/StudentDashboard.tsx');
const teacher=read('src/pages/teacher/TeacherDashboard.tsx');
const screen=read('src/hooks/useClassroomScreenShare.ts');
check(local.includes('MeetingDemoVoices')&&hosted.includes('MeetingDemoVoices'),'Both meeting modes must offer labeled demo voices');
check(voices.includes('speechSynthesis.speak')||voices.includes('synth.speak(speech)'),'Voice must actually speak');
check(voices.includes('not a real participant')&&voices.includes('Demo audio'),'Demo audio must not claim to be a remote participant');
check(local.includes('practice-')&&local.includes('Try my devices')&&local.includes('solo practice room'),'Student should have a clearly labeled local practice room');
for(const source of [local,hosted]){
 check(source.includes('getUserMedia'),'Both live rooms must request user camera and mic');
 check(source.includes('startScreenShare')&&source.includes('stopScreenShare'),'Both live rooms must support start/stop presenting');
 check(source.includes('getVideoTracks()')&&source.includes('getAudioTracks()'),'Camera and mic toggles required');
 check(source.includes('meeting-chat'),'Existing live chat must remain');
}
check(screen.includes('getDisplayMedia')&&screen.includes('replaceTrack'),'Presenting must use real browser screen picker and WebRTC track replacement');
check(messaging.includes('localStorage.setItem(STORAGE')&&messaging.includes("new BroadcastChannel('ciliklab-direct-conversations')"),'Conversation persistence and tab synchronization missing');
check(messaging.includes('same browser')&&messaging.includes('not private'),'Messages must be identified as local demo, not secure or cross-device');
check(community.includes('CommunityFeed')&&community.includes('DirectMessages')&&community.includes('Class Community'),'Old community and new DM must coexist');
check(dashboard.includes('My Live Room')&&dashboard.includes("setActiveTab('live_classroom')"),'Student Live Room entry must navigate correctly');
check(teacher.includes('v34-teacher-connect')&&teacher.includes("setActiveTab('community')"),'Teacher must be able to open conversation');
const files=[];function recurse(dir){for(const ent of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())recurse(f);else if(/\.tsx?$/.test(f))files.push(f)}}
recurse('src');
let tsErrors=[];
for(const file of files){const code=read(file);const result=ts.transpileModule(code,{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,strict:true}});
 for(const diagnostic of result.diagnostics||[]){if(diagnostic.category===ts.DiagnosticCategory.Error)tsErrors.push(`${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')}`)}
}
check(!tsErrors.length,`TypeScript syntax errors: ${tsErrors.join('; ')}`);
console.log(`PASS v34: both live rooms, dual-role demo speech, real media controls and screen sharing, one-to-one local conversations, existing community preserved, both dashboard shortcuts; ${files.length} TS/TSX sources syntactically valid.`);
