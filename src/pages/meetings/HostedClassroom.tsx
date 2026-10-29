import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,Camera,CameraOff,Copy,Mic,MicOff,MessageCircle,PhoneOff,Send,ShieldCheck,Video,MonitorUp} from 'lucide-react';
import './liveClassroom.css';
import './hostedClassroom.css';
import {useClassroomScreenShare} from '../../hooks/useClassroomScreenShare';
import {MeetingDemoVoices} from './MeetingDemoVoices';
type MeetingInfo={id:string;title:string;when:string;studentName:string;className:string;role:'teacher'|'student'};
type Signal={id:number;type:string;sender:'teacher'|'student';payload?:any;message?:string};
const invite=()=>new URLSearchParams(window.location.search).get('invite')||'';
const meetingId=()=>new URLSearchParams(window.location.search).get('meeting')||'';
const path=()=>`/api/meetings/${encodeURIComponent(meetingId())}`;
async function callApi(endpoint:string,options?:RequestInit){const resp=await fetch(endpoint,{...options,headers:{'x-meeting-token':invite(),...(options?.headers||{})}});const result=await resp.json();if(!resp.ok)throw Error(result.error||'Meeting server unavailable');return result}
export function HostedClassroom(){
 const [info,setInfo]=useState<MeetingInfo|null>(null),[error,setError]=useState(''),[status,setStatus]=useState('Checking your invitation…');
 const [joined,setJoined]=useState(false),[videoEnabled,setVideoEnabled]=useState(true),[micEnabled,setMicEnabled]=useState(true);
 const [messages,setMessages]=useState<{name:string;text:string}[]>([]),[draft,setDraft]=useState('');
 const pc=useRef<RTCPeerConnection|null>(null),stream=useRef<MediaStream|null>(null),remoteStream=useRef<MediaStream|null>(null),localVideo=useRef<HTMLVideoElement>(null),remoteVideo=useRef<HTMLVideoElement>(null);
 const after=useRef(0),queued=useRef<RTCIceCandidateInit[]>([]),timer=useRef<ReturnType<typeof setInterval>|null>(null),currentRole=useRef<'teacher'|'student'>('student');
 const alive=useRef(false),sendingOffer=useRef(false);
 const {presenting,startScreenShare,stopScreenShare}=useClassroomScreenShare(pc,stream,localVideo,setStatus);
 const signal=async(type:string,payload?:any,message?:string)=>{try{await callApi(`${path()}/signals`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,payload,message})})}catch(e){setStatus(`Connection issue: ${(e as Error).message}`)}};
 useEffect(()=>{let active=true;callApi(path()).then(data=>{if(active){setInfo(data);currentRole.current=data.role;setStatus('Invitation verified. Join when you are ready.')}}).catch(e=>{if(active){setError(e.message);setStatus('Unable to open invitation.')}});return()=>{active=false}},[]);
 useEffect(()=>{if(localVideo.current&&stream.current)localVideo.current.srcObject=stream.current;if(remoteVideo.current&&remoteStream.current)remoteVideo.current.srcObject=remoteStream.current},[joined]);
 const release=()=>{void stopScreenShare();alive.current=false;if(timer.current)clearInterval(timer.current);timer.current=null;pc.current?.close();pc.current=null;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;remoteStream.current=null;queued.current=[];if(localVideo.current)localVideo.current.srcObject=null;if(remoteVideo.current)remoteVideo.current.srcObject=null};
 useEffect(()=>()=>release(),[]);
 const flush=async(peer:RTCPeerConnection)=>{for(const cand of queued.current.splice(0)){try{await peer.addIceCandidate(new RTCIceCandidate(cand))}catch{}}};
 const process=async(s:Signal)=>{if(s.sender===currentRole.current)return;const peer=pc.current;
  if(s.type==='join'){setStatus('Other participant is in the room. Connecting…');if(currentRole.current==='student'){await signal('join');return}if(peer&&peer.signalingState==='stable'&&!sendingOffer.current){sendingOffer.current=true;try{const offer=await peer.createOffer();await peer.setLocalDescription(offer);await signal('offer',peer.localDescription?.toJSON())}finally{sendingOffer.current=false}}}
  else if(s.type==='offer'&&peer){if(peer.signalingState!=='stable')return;await peer.setRemoteDescription(new RTCSessionDescription(s.payload));await flush(peer);const answer=await peer.createAnswer();await peer.setLocalDescription(answer);await signal('answer',peer.localDescription?.toJSON())}
  else if(s.type==='answer'&&peer&&peer.signalingState==='have-local-offer'){await peer.setRemoteDescription(new RTCSessionDescription(s.payload));await flush(peer)}
  else if(s.type==='candidate'&&peer&&s.payload){if(peer.remoteDescription){try{await peer.addIceCandidate(new RTCIceCandidate(s.payload))}catch{}}else queued.current.push(s.payload)}
  else if(s.type==='chat'&&s.message)setMessages(prev=>[...prev,{name:s.sender==='teacher'?'Teacher':'Student',text:s.message!}]);
  else if(s.type==='leave')setStatus('The other participant left. You may rejoin the meeting.');
 };
 const poll=async()=>{if(!alive.current)return;try{const response=await callApi(`${path()}/signals?after=${after.current}`);for(const s of (response.signals||[]) as Signal[]){after.current=Math.max(after.current,s.id);await process(s)}}catch(e){setStatus(`Connection interrupted: ${(e as Error).message}`)}};
 const start=async()=>{if(joined||!info)return;if(typeof RTCPeerConnection==='undefined'){setStatus('WebRTC is not supported in this browser');return}
  try{const peer=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});pc.current=peer;
   peer.onicecandidate=e=>{if(e.candidate)void signal('candidate',e.candidate.toJSON())};peer.onconnectionstatechange=()=>{if(peer.connectionState==='connected')setStatus('Video call connected.');if(peer.connectionState==='failed')setStatus('Video connection failed. A TURN server may be needed on this network.')};peer.ontrack=e=>{remoteStream.current=e.streams[0];if(remoteVideo.current)remoteVideo.current.srcObject=e.streams[0]};
   try{const media=await navigator.mediaDevices.getUserMedia({audio:true,video:true});stream.current=media;media.getTracks().forEach(t=>peer.addTrack(t,media));setStatus('Camera ready. Looking for the other participant…')}catch{peer.addTransceiver('video',{direction:'sendrecv'});setStatus('Camera unavailable or permission denied. You can still share a screen or use chat.')}setJoined(true);alive.current=true;
   // Start at zero to see pre-existing join messages in a session.
   await poll();timer.current=setInterval(()=>void poll(),1100);await signal('join');
  }catch(e){setStatus(`Could not start room: ${(e as Error).message}`);release()}};
 const leave=async()=>{await signal('leave');release();setJoined(false);setStatus('You left the meeting.')};
 const chat=async(e:React.FormEvent)=>{e.preventDefault();const text=draft.trim().slice(0,750);if(!text||!joined)return;setDraft('');setMessages(v=>[...v,{name:'You',text}]);await signal('chat',null,text)};
 const goBack=()=>{window.location.href=window.location.origin+window.location.pathname};
 return <div className="hosted-room"><button onClick={goBack} className="hosted-back"><ArrowLeft size={17}/> Back to CilikLab</button>
  <header className="meeting-header"><div><span><ShieldCheck size={15} style={{display:'inline'}}/> INVITATION-ONLY CLASSROOM</span><h1>{info?.title||'Live Classroom'}</h1><p>{info?`${info.className} · ${info.studentName} · ${new Date(info.when).toLocaleString()}`:'Verifying your meeting…'}</p></div><Video size={35}/></header>
  {error&&<div className="hosted-error" role="alert">{error}. Ask the teacher to send a fresh invitation. The meeting server must be online.</div>}
  {!joined&&info&&<div className="hosted-welcome"><h2>Ready to join?</h2><p>You're entering as <strong>{info.role}</strong>. Please ask a parent or guardian before connecting a child's camera.</p><button className="meeting-primary" onClick={start}><Video size={18}/> Join live room</button></div>}
  <p className="hosted-status" role="status">{status}</p>
  {info&&<MeetingDemoVoices role={info.role}/>}
  {joined&&<div className="meeting-call-layout hosted-layout"><section className="meeting-videos"><div className="meeting-video"><video ref={remoteVideo} autoPlay playsInline/><span>Other participant</span></div><div className="meeting-video"><video ref={localVideo} autoPlay playsInline muted/><span>You</span></div><div className="meeting-video-actions"><button type="button" aria-pressed={videoEnabled} onClick={()=>{const tracks=stream.current?.getVideoTracks()||[];if(!tracks.length){setStatus('Camera not available. Rejoin with camera permission.');return}const next=!videoEnabled;tracks.forEach(t=>t.enabled=next);setVideoEnabled(next)}}>{videoEnabled?<Camera size={16}/>:<CameraOff size={16}/>} Camera</button><button type="button" aria-pressed={micEnabled} onClick={()=>{const tracks=stream.current?.getAudioTracks()||[];if(!tracks.length){setStatus('Microphone not available. Rejoin with microphone permission.');return}const next=!micEnabled;tracks.forEach(t=>t.enabled=next);setMicEnabled(next)}}>{micEnabled?<Mic size={16}/>:<MicOff size={16}/>} Microphone</button><button type="button" className={presenting?'meeting-sharing-active':''} onClick={()=>void (presenting?stopScreenShare():startScreenShare())}><MonitorUp size={16}/>{presenting?'Stop presenting':'Share screen / slides'}</button><button onClick={()=>void leave()}><PhoneOff size={16}/> Leave</button></div></section><section className="meeting-chat"><h3><MessageCircle size={17}/> Room chat</h3><div className="meeting-messages" aria-live="polite">{messages.map((m,i)=><p key={i}><strong>{m.name}</strong>{m.text}</p>)}{!messages.length&&<p className="meeting-empty">Send a friendly hello!</p>}</div><form onSubmit={chat}><input value={draft} onChange={e=>setDraft(e.target.value)} aria-label="Chat message" placeholder="Type a message…" maxLength={750}/><button type="submit"><Send size={17}/></button></form></section></div>}
  <p className="meeting-disclaimer">The CilikLab meeting service uses short-lived invitation tokens and WebRTC video with server-mediated signaling. Camera and screen sharing require HTTPS or localhost. Screen/tab presentation uses your browser's permission picker; select your slideshow window or browser tab. Some networks require a TURN relay, which is not included. The prototype does not record video, and a production deployment still needs authenticated accounts, child-safety controls and server-side access policies.</p>
 </div>
}
