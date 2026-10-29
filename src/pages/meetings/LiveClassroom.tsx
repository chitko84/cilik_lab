import React,{useEffect,useRef,useState} from 'react';
import {CalendarDays,Camera,CameraOff,CheckCircle2,Copy,MessageCircle,Mic,MicOff,PhoneOff,Plus,Send,Video,Users2,MonitorUp} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import './liveClassroom.css';
import {useClassroomScreenShare} from '../../hooks/useClassroomScreenShare';
import {HostedClassroom} from './HostedClassroom';
import {MeetingDemoVoices} from './MeetingDemoVoices';
export type Meeting={id:string;studentId:string;studentName:string;classId:string;className:string;title:string;when:string;createdAt:string;remoteId?:string;teacherToken?:string;telegramSent?:boolean};
export const MEETINGS_KEY='ciliklab_class_meetings_v1';
export function getMeetings():Meeting[]{try{const list=JSON.parse(localStorage.getItem(MEETINGS_KEY)||'[]');return Array.isArray(list)?list:[]}catch{return []}}
const canSignal=typeof BroadcastChannel!=='undefined';
type Signal={type:'join'|'leave'|'offer'|'answer'|'candidate'|'chat';room:string;sender:string;payload?:any;message?:string};
const clientId=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
export function LiveClassroom(){
 if(new URLSearchParams(window.location.search).has('meeting'))return <HostedClassroom/>;
 return <LocalClassroom/>;
}
function LocalClassroom(){
 const {role,classes,currentUser,otherStudents,attempts}=useApp();
 const [meetings,setMeetings]=useState(getMeetings);const [classId,setClassId]=useState(classes[0]?.id||'');
 const [studentId,setStudentId]=useState(()=>{try{return sessionStorage.getItem('ciliklab_meeting_target')||'usr_student_01'}catch{return 'usr_student_01'}});const [title,setTitle]=useState('Coding support session');const [when,setWhen]=useState('');
 const [room,setRoom]=useState<string|null>(null);const [camera,setCamera]=useState(true);const [microphone,setMicrophone]=useState(true);
 const [status,setStatus]=useState('Choose a meeting to join.');
 const [teacherKey,setTeacherKey]=useState('');const [telegramLink,setTelegramLink]=useState('');const [botStatus,setBotStatus]=useState('');const [messages,setMessages]=useState<{sender:string;text:string}[]>([]);const [draft,setDraft]=useState('');
 const [peerConnected,setPeerConnected]=useState(false);
 const isPractice=Boolean(room?.startsWith('practice-'));
 const idRef=useRef(clientId());const bcRef=useRef<BroadcastChannel|null>(null);const pcRef=useRef<RTCPeerConnection|null>(null);
 const streamRef=useRef<MediaStream|null>(null);
 const localRef=useRef<HTMLVideoElement>(null);const remoteRef=useRef<HTMLVideoElement>(null);const channelRef=useRef<RTCDataChannel|null>(null);const candidatesRef=useRef<RTCIceCandidateInit[]>([]);
 const {presenting,startScreenShare,stopScreenShare}=useClassroomScreenShare(pcRef,streamRef,localRef,setStatus);
 useEffect(()=>{fetch('/api/telegram/status').then(r=>r.json()).then(x=>setBotStatus(x.configured?`Telegram bot @${x.botUsername||'configured'} is available.`:'Telegram bot needs server configuration.')).catch(()=>setBotStatus('Telegram meeting server is offline — only same-browser meetings are available.'))},[]);
 const connectTelegram=async()=>{if(!teacherKey.trim()){setStatus('Enter the teacher integration key first.');return}try{const r=await fetch('/api/telegram/link',{method:'POST',headers:{'Content-Type':'application/json','x-teacher-key':teacherKey},body:JSON.stringify({studentId})});const data=await r.json();if(!r.ok)throw Error(data.error);setTelegramLink(data.url);setStatus('Open the Telegram connection link on the student/guardian phone and tap Start. It expires in 15 minutes.')}catch(e){setStatus(`Telegram link failed: ${(e as Error).message}`)}};
 const roster=[{id:'usr_student_01',name:'Sarah Ahmad'},...otherStudents.map(s=>({id:s.id,name:s.name}))];
 useEffect(()=>{const onStorage=(e:StorageEvent)=>{if(e.key===MEETINGS_KEY)setMeetings(getMeetings())};window.addEventListener('storage',onStorage);return()=>window.removeEventListener('storage',onStorage)},[]);
 const create=async()=>{if(!classId||!studentId||!when.trim())return;const student=roster.find(s=>s.id===studentId);const klass=classes.find(c=>c.id===classId);const entry:Meeting={id:`cl-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,studentId,studentName:student?.name||'Student',classId,className:klass?.title||'Class',title:title.trim()||'Coding support session',when,createdAt:new Date().toISOString()};
  if(teacherKey.trim()){try{const response=await fetch('/api/meetings',{method:'POST',headers:{'Content-Type':'application/json','x-teacher-key':teacherKey},body:JSON.stringify({studentId,studentName:entry.studentName,className:entry.className,title:entry.title,when})});const data=await response.json();if(!response.ok)throw Error(data.error);entry.remoteId=data.id;entry.teacherToken=data.teacherToken;entry.telegramSent=Boolean(data.telegramSent);setStatus(data.telegramSent?`Telegram invitation delivered to ${entry.studentName}. Open the hosted room below.`:`Hosted room created, but Telegram was NOT delivered: ${data.telegramError||'Student has not linked Telegram yet'}. Connect Telegram and schedule a fresh meeting.`)}catch(e){setStatus(`Telegram not sent: ${(e as Error).message}. Meeting saved locally for same-browser testing only.`)}}else setStatus(`Local invitation saved for ${entry.studentName}. Telegram has NOT been sent. Configure the bot and teacher key to enable delivery.`);
  const next=[entry,...getMeetings()];localStorage.setItem(MEETINGS_KEY,JSON.stringify(next));setMeetings(next)
 };
 const post=(signal:Omit<Signal,'sender'|'room'>)=>{if(room)bcRef.current?.postMessage({...signal,room,sender:idRef.current} as Signal)};
 const stop=()=>{void stopScreenShare();try{bcRef.current?.postMessage({type:'leave',room,sender:idRef.current})}catch{}bcRef.current?.close();bcRef.current=null;channelRef.current?.close();channelRef.current=null;pcRef.current?.close();pcRef.current=null;streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;if(localRef.current)localRef.current.srcObject=null;if(remoteRef.current)remoteRef.current.srcObject=null;setPeerConnected(false);setRoom(null);setMessages([]);setStatus('Call ended.')};
 useEffect(()=>()=>{bcRef.current?.close();pcRef.current?.close();streamRef.current?.getTracks().forEach(t=>t.stop())},[]);
 const start=async(meetingId:string)=>{
   if(!canSignal){setStatus('This browser does not support same-origin meeting signals.');return}
   // Close a previous room before starting another.
   void stopScreenShare();bcRef.current?.close();pcRef.current?.close();streamRef.current?.getTracks().forEach(t=>t.stop());
   setRoom(meetingId);setMessages([]);setPeerConnected(false);setStatus('Joining… Allow camera and microphone, or continue with text chat.');
   let stream:MediaStream|null=null;
   try{stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});streamRef.current=stream;if(localRef.current)localRef.current.srcObject=stream}
   catch{setStatus('Camera/microphone unavailable or denied. Chat still works. Use HTTPS or localhost for video.')}
   const bc=new BroadcastChannel(`ciliklab-call-${meetingId}`);bcRef.current=bc;
   if(typeof RTCPeerConnection!=='undefined'){
    const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});pcRef.current=pc;
    stream?.getTracks().forEach(track=>pc.addTrack(track,stream!));
    if(!stream?.getVideoTracks().length)pc.addTransceiver('video',{direction:'sendrecv'});
    pc.ontrack=e=>{if(remoteRef.current)remoteRef.current.srcObject=e.streams[0]};
    pc.onicecandidate=e=>{if(e.candidate)bc.postMessage({type:'candidate',room:meetingId,sender:idRef.current,payload:e.candidate.toJSON()} as Signal)};
    pc.onconnectionstatechange=()=>{setPeerConnected(pc.connectionState==='connected');if(pc.connectionState==='connected')setStatus('Connected — video and chat ready');if(pc.connectionState==='failed')setStatus('Video connection failed; local chat remains available.')};
    pc.ondatachannel=e=>{channelRef.current=e.channel};
   }
   candidatesRef.current=[];
   const flushCandidates=async(peer:RTCPeerConnection)=>{for(const candidate of candidatesRef.current.splice(0)){try{await peer.addIceCandidate(new RTCIceCandidate(candidate))}catch{}}};
   bc.onmessage=async(e:MessageEvent<Signal>)=>{
     const msg=e.data;if(!msg||msg.sender===idRef.current||msg.room!==meetingId)return;
     const peer=pcRef.current;
     try{
       if(msg.type==='join'){
         setStatus('Another participant joined your room.');
         if(role==='student'){bc.postMessage({type:'join',room:meetingId,sender:idRef.current} as Signal)}
         if(role==='teacher'&&peer&&peer.signalingState==='stable'){
           channelRef.current=peer.createDataChannel('chat');
           const offer=await peer.createOffer();await peer.setLocalDescription(offer);
           bc.postMessage({type:'offer',room:meetingId,sender:idRef.current,payload:peer.localDescription?.toJSON()} as Signal);
         }
       }
       if(msg.type==='offer'&&peer){await peer.setRemoteDescription(new RTCSessionDescription(msg.payload));await flushCandidates(peer);const answer=await peer.createAnswer();await peer.setLocalDescription(answer);bc.postMessage({type:'answer',room:meetingId,sender:idRef.current,payload:peer.localDescription?.toJSON()} as Signal)}
       if(msg.type==='answer'&&peer&&peer.signalingState==='have-local-offer'){await peer.setRemoteDescription(new RTCSessionDescription(msg.payload));await flushCandidates(peer)}
       if(msg.type==='candidate'&&peer){if(peer.remoteDescription)await peer.addIceCandidate(new RTCIceCandidate(msg.payload));else candidatesRef.current.push(msg.payload)}
       if(msg.type==='chat'&&msg.message)setMessages(v=>[...v,{sender:'Partner',text:msg.message!}]);
       if(msg.type==='leave'){setPeerConnected(false);setStatus('The other participant left the room.')}
     }catch{setStatus('Connection negotiation interrupted. Rejoin the room to retry.')}
   };
   bc.postMessage({type:'join',room:meetingId,sender:idRef.current} as Signal);
   // Teacher may join second: student already joined. Explicit hello to enable offer.
   window.setTimeout(()=>{if(bcRef.current===bc)bc.postMessage({type:'join',room:meetingId,sender:idRef.current} as Signal)},450);
 };
 useEffect(()=>{if(room&&localRef.current&&streamRef.current)localRef.current.srcObject=streamRef.current},[room]);
 const send=()=>{const text=draft.trim().slice(0,1000);if(!text||!room)return;if(!isPractice)post({type:'chat',message:text});setMessages(v=>[...v,{sender:'You',text}]);setDraft('')};
 const shown=role==='teacher'?meetings:meetings.filter(m=>m.studentId===currentUser.id);
 const wrongAttempts=attempts.filter(a=>a.status==='failed');
 return <div className="meeting-root space-y-5 pb-20"><header className="meeting-header"><div><span>CILIKLAB · CLASSROOM SUPPORT</span><h1>Live Classroom</h1><p>Schedule a one-to-one coding check-in, then join the room for video and chat.</p></div><div className="meeting-header-icon"><Video size={29}/></div></header>
  <section className="v34-meeting-welcome"><div><span className="v34-room-preview-label"><Video size={13}/> {role==='student'?'STUDENT LIVE ROOM':'TEACHER LIVE ROOM'}</span><h2>{role==='student'?'Your learning room is ready':'Teach, guide and connect'}</h2><p>{role==='student'?'Join a teacher invitation, test your camera and mic, or practise presenting your screen before a lesson.':'Schedule a lesson or practise the meeting controls before connecting with a student.'}</p></div><div className="v34-meeting-welcome-actions"><button type="button" className="secondary" onClick={()=>void start(`practice-${currentUser.id}`)} disabled={Boolean(room)}><Camera size={16}/> Try my devices</button><button type="button" onClick={()=>document.querySelector('#v34-meeting-invitations')?.scrollIntoView({behavior:'smooth',block:'start'})}><CalendarDays size={16}/> {role==='student'?'My invitations':'Scheduled rooms'}</button></div></section>
  <MeetingDemoVoices role={role}/>
  {role==='teacher'&&<section className="meeting-panel"><h2><Plus size={18}/> Schedule student meeting</h2><div className="meeting-form"><label>Class<select value={classId} onChange={e=>setClassId(e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label>Student<select value={studentId} onChange={e=>setStudentId(e.target.value)}>{roster.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>Meeting title<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Date & time<input type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)}/></label><button className="meeting-primary" disabled={!when||!classId} onClick={()=>void create()}><CalendarDays size={17}/> Schedule & send invitation</button></div><div className="meeting-telegram-setup"><h3>Telegram connection · Real bot API</h3><p>{botStatus}</p><label>Teacher integration key <input type="password" autoComplete="off" value={teacherKey} onChange={e=>setTeacherKey(e.target.value)} placeholder="Enter key from server administrator"/></label><button type="button" onClick={()=>void connectTelegram()}>Connect selected student / guardian Telegram</button>{telegramLink&&<div className="meeting-telegram-link"><a href={telegramLink} target="_blank" rel="noopener noreferrer">Open Telegram link</a><button onClick={()=>navigator.clipboard?.writeText(telegramLink)}><Copy size={16}/> Copy</button><small>Student or guardian must press Start in the bot before CilikLab can message them.</small></div>}</div><p className="meeting-disclaimer">Without a configured bot and a linked Telegram account, meetings are saved locally ONLY. When the server and teacher key are configured, a successful send is confirmed above. New hosted meetings use invitation-only links.</p></section>}
  <section className="meeting-panel" id="v34-meeting-invitations"><h2><CalendarDays size={19}/> {role==='teacher'?'Class meetings':'My teacher invitations'}</h2>{shown.length? <div className="meeting-list">{shown.map(m=><article key={m.id}><div><strong>{m.title}</strong><span>{m.className} · {m.studentName} · {new Date(m.when).toLocaleString()}</span></div><div className="meeting-entry-actions">{m.remoteId&&m.teacherToken&&role==='teacher'&&<button onClick={()=>{window.location.href=`/?meeting=${encodeURIComponent(m.remoteId!)}&invite=${encodeURIComponent(m.teacherToken!)}`}}>Open hosted room</button>}<button onClick={()=>start(m.id)} disabled={room===m.id}>{room===m.id?'In room':'Local room'}</button>{m.remoteId&&<small>{m.telegramSent?'Telegram sent':'Telegram not delivered'}</small>}</div></article>)}</div>:<p className="meeting-disclaimer">No invitations have been saved yet. {role==='teacher'?'Schedule a meeting above.':'Your teacher can schedule one from Teacher View.'}</p>}</section>
  {room&&<section className="meeting-panel"><div className="meeting-call-heading"><h2><span className="meeting-live-dot"/> {isPractice?'Device practice (demo)':'Live room'} <span className="meeting-room-id">{room.slice(0,20)}</span></h2><button className="meeting-end" onClick={stop}><PhoneOff size={16}/> Leave</button></div><p role="status" className="meeting-status">{status}{isPractice?' This is a solo practice room: no teacher or student is connected.':''}</p><div className="meeting-call-layout"><div className="meeting-videos"><div className="meeting-video"><video ref={remoteRef} autoPlay playsInline/><span><Users2 size={14}/> Other participant {peerConnected?'· connected':''}</span></div><div className="meeting-video"><video ref={localRef} autoPlay playsInline muted/><span><Camera size={14}/> You</span></div><div className="meeting-video-actions"><button type="button" aria-pressed={camera} onClick={()=>{const tracks=streamRef.current?.getVideoTracks()||[];if(!tracks.length){setStatus('No camera is active. Allow camera access and rejoin to enable video.');return;}tracks.forEach(t=>t.enabled=!camera);setCamera(v=>!v)}}>{camera?<Camera size={16}/>:<CameraOff size={16}/>} Camera</button><button type="button" aria-pressed={microphone} onClick={()=>{const tracks=streamRef.current?.getAudioTracks()||[];if(!tracks.length){setStatus('No microphone is active. Allow microphone access and rejoin to enable audio.');return;}tracks.forEach(t=>t.enabled=!microphone);setMicrophone(v=>!v)}}>{microphone?<Mic size={16}/>:<MicOff size={16}/>} Microphone</button><button type="button" className={presenting?'meeting-sharing-active':''} onClick={()=>void (presenting?stopScreenShare():startScreenShare())}><MonitorUp size={16}/>{presenting?'Stop presenting':'Share screen / slides'}</button></div></div><div className="meeting-chat"><h3><MessageCircle size={17}/> Room chat</h3><div className="meeting-messages" aria-live="polite">{messages.map((m,i)=><p key={i}><strong>{m.sender}</strong>{m.text}</p>)}{!messages.length&&<p className="meeting-empty">{isPractice?'Practice typing a message here. No one else receives it.':'Say hello to start the conversation.'}</p>}</div><form onSubmit={e=>{e.preventDefault();send()}}><input aria-label="Write meeting chat" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Type a friendly message…" maxLength={1000}/><button type="submit" aria-label="Send chat"><Send size={18}/></button></form></div></div></section>}
  {role==='teacher'&&<section className="meeting-panel"><h2>Performance-based support</h2><p className="meeting-disclaimer">There are {wrongAttempts.length} incorrect code submissions in this browser's stored classroom data. Open Student Performance to inspect each student's attempts before scheduling support.</p></section>}
  <p className="meeting-disclaimer">Demo voices are generated locally using your browser’s speech synthesis and never represent a connected participant. Device practice is a solo preview; messages typed there are not sent to anyone. Local rooms use WebRTC and same-origin tab signaling (BroadcastChannel). Demonstrate with Teacher View and Student View in two browser tabs on HTTPS/localhost. A real multi-device classroom requires authenticated server signaling, account synchronization and production TURN infrastructure. Choose Share screen / slides to present a window, tab, or slide deck. Sharing requires a compatible desktop browser and explicit permission. No public meeting links are generated.</p>
 </div>;
}
