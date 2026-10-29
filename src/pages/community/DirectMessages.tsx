import React,{useEffect,useMemo,useState} from 'react';
import {ArrowRight, CheckCheck, LockKeyhole, MessageCircle, Send, UserRound} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {CURRENT_STUDENT,CURRENT_TEACHER} from '../../data/initialData';
import './directMessages.css';

type DirectMessage={id:string;from:string;to:string;text:string;at:string};
const STORAGE='ciliklab_direct_conversations_v34';
export function loadDirectMessages():DirectMessage[]{
 try {const raw=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(raw)?raw.filter((m:DirectMessage)=>typeof m?.id==='string'&&typeof m.from==='string'&&typeof m.to==='string'&&typeof m.text==='string'&&typeof m.at==='string'):[]}
 catch{return []}
}
export function DirectMessages(){
 const {role,currentUser,otherStudents,setActiveTab}=useApp();
 const peers=useMemo(()=>role==='student'?[{id:CURRENT_TEACHER.id,name:CURRENT_TEACHER.name,role:'Teacher'}]:[
  {id:CURRENT_STUDENT.id,name:CURRENT_STUDENT.name,role:'Student'},
  ...otherStudents.filter(s=>s.id!==CURRENT_STUDENT.id).map(s=>({id:s.id,name:s.name,role:'Student'}))
 ],[role,otherStudents]);
 const [target,setTarget]=useState(peers[0]?.id||'');
 const [all,setAll]=useState(loadDirectMessages);
 const [draft,setDraft]=useState('');
 const [notice,setNotice]=useState('');
 useEffect(()=>{if(!peers.some(p=>p.id===target))setTarget(peers[0]?.id||'')},[peers,target]);
 useEffect(()=>{
  const sync=()=>setAll(loadDirectMessages());
  const onStorage=(event:StorageEvent)=>{if(event.key===STORAGE)sync()};
  window.addEventListener('storage',onStorage);
  const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('ciliklab-direct-conversations'):null;
  if(channel)channel.onmessage=sync;
  return()=>{window.removeEventListener('storage',onStorage);channel?.close()};
 },[]);
 const selected=peers.find(p=>p.id===target);
 const messages=all.filter(m=>(m.from===currentUser.id&&m.to===target)||(m.from===target&&m.to===currentUser.id)).sort((a,b)=>a.at.localeCompare(b.at));
 const send=(event:React.FormEvent)=>{
  event.preventDefault();const text=draft.trim();
  if(!target||!text)return;
  if(text.length>500){setNotice('Please keep messages under 500 characters.');return}
  const item:DirectMessage={id:`dm-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,from:currentUser.id,to:target,text,at:new Date().toISOString()};
  const next=[...loadDirectMessages(),item].slice(-500);
  try{localStorage.setItem(STORAGE,JSON.stringify(next));setAll(next);setDraft('');setNotice('Saved in this browser. Open a second tab and switch roles to see the reply.');if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('ciliklab-direct-conversations');channel.postMessage({updated:true});channel.close()}}
  catch{setNotice('Unable to save the message on this device. Check browser storage permissions.')}
 };
 return <section className="v34-direct" aria-label="Teacher and student messages">
  <div className="v34-direct-top"><div><span className="v34-eyebrow">CONNECTED LEARNING</span><h2>Teacher–student conversations</h2><p>Ask for guidance or check in after a lesson. Messages stay in your browser for this prototype.</p></div><span className="v34-demo-chip"><LockKeyhole size={15}/> Local demo</span></div>
  <div className="v34-direct-shell">
   <aside className="v34-direct-people" aria-label="Conversation contacts"><h3>Conversations</h3>{peers.map(peer=>{
    const count=all.filter(m=>[m.from,m.to].includes(currentUser.id)&&[m.from,m.to].includes(peer.id)).length;
    return <button type="button" className={target===peer.id?'selected':''} onClick={()=>setTarget(peer.id)} key={peer.id}><span className="v34-avatar"><UserRound size={19}/></span><span><b>{peer.name}</b><small>{peer.role} · {count?`${count} messages`:'New conversation'}</small></span><ArrowRight size={15}/></button>
   })}</aside>
   <div className="v34-direct-chat"><header><span className="v34-avatar"><MessageCircle size={20}/></span><div><strong>{selected?.name||'Select a contact'}</strong><small>Conversations demo · same browser only</small></div></header>
    <div className="v34-direct-history" role="log" aria-live="polite" aria-label="Conversation history">
     {!messages.length&&<div className="v34-direct-empty"><MessageCircle size={28}/><b>Start with a friendly hello</b><span>Ask a question, discuss code or arrange a learning check-in.</span></div>}
     {messages.map(msg=><div className={`v34-bubble ${msg.from===currentUser.id?'own':'theirs'}`} key={msg.id}><p>{msg.text}</p><small>{msg.from===currentUser.id?'You':selected?.name} · {new Date(msg.at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}{msg.from===currentUser.id&&<CheckCheck size={12}/>}</small></div>)}
    </div>
    <form className="v34-direct-compose" onSubmit={send}><input aria-label="Write a message" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a kind, helpful message…" maxLength={500} disabled={!target}/><button type="submit" disabled={!draft.trim()||!target}><Send size={17}/><span>Send</span></button></form>
   </div>
  </div>
  <div className="v34-direct-foot" role="status"><span>{notice||'This demo syncs between tabs in the same browser. It is not private, encrypted, or shared across devices.'}</span><button type="button" onClick={()=>setActiveTab('live_classroom')}>Open Live Classroom <ArrowRight size={15}/></button></div>
  <p className="v34-direct-warning">For real school use, replace browser-local messages with authenticated server storage, access controls, safeguarding and retention policies. Existing live-room chat continues to work through the meeting's own signaling channel.</p>
 </section>
}
