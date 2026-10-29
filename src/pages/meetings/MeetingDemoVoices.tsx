import React, {useEffect, useRef, useState} from 'react';
import {Headphones, Play, Square, Volume2} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';
import './classroom-v34.css';

/** Explicitly simulated speech for a judge demonstration. No audio is sent to another participant. */
export function MeetingDemoVoices({role}:{role:'teacher'|'student'}){
 const {language}=useLanguage();
 const [playing,setPlaying]=useState<'teacher'|'student'|null>(null);
 const [message,setMessage]=useState('');
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const isMalay=language==='ms';
 const phrases={
  teacher:isMalay?'Hai! Selamat datang ke kelas CilikLab. Tunjukkan kod kamu dan kita belajar bersama!':'Hello! Welcome to your CilikLab classroom. Show me your code and we can learn together!',
  student:isMalay?'Hai cikgu! Saya sedia. Boleh cikgu bantu saya menyemak kod ini?':'Hello teacher! I am ready. Could you help me check my code?'
 };
 const stop=()=>{
  if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
  utterance.current=null;setPlaying(null);
 };
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel()},[]);
 const play=(speaker:'teacher'|'student')=>{
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
   setMessage('This browser has no speech synthesis. Read the sample dialogue below instead.');return;
  }
  stop();
  const synth=window.speechSynthesis;
  const text=phrases[speaker];
  const speech=new SpeechSynthesisUtterance(text);
  const locale=isMalay?'ms-MY':'en-US';
  const voice=synth.getVoices().find(v=>v.lang.toLowerCase()===locale.toLowerCase())||synth.getVoices().find(v=>v.lang.toLowerCase().startsWith(isMalay?'ms':'en'));
  if(voice)speech.voice=voice;
  speech.lang=voice?.lang||locale;speech.rate=.88;speech.pitch=speaker==='student'?1.15:1;
  speech.onend=()=>{if(utterance.current===speech){setPlaying(null);utterance.current=null}};
  speech.onerror=()=>{if(utterance.current===speech){setPlaying(null);setMessage('Speech did not play on this device. The written demo is still available.')}};
  utterance.current=speech;setPlaying(speaker);
  setMessage(voice?'Playing a simulated voice sample on this device.':'Using browser default speech voice; this language voice may not be installed.');
  synth.speak(speech);
 };
 return <section className="v34-voice-demo" aria-label="Simulated meeting voice demonstration">
  <div className="v34-voice-heading"><span className="v34-voice-icon"><Headphones size={20}/></span><div><strong>Try the meeting voices</strong><small>Demo audio · played only on this device · not a real participant</small></div></div>
  <div className="v34-voice-phrases">
   {(['teacher','student'] as const).map(speaker=><div className="v34-voice-phrase" key={speaker}>
    <div><b>{speaker==='teacher'?'Teacher example':'Student example'}</b><p>{phrases[speaker]}</p></div>
    <button type="button" onClick={()=>play(speaker)} aria-label={`Play ${speaker} sample voice`}><Play size={15}/> {playing===speaker?'Replay':'Listen'}</button>
   </div>)}
  </div>
  <div className="v34-voice-footer"><span><Volume2 size={14}/> {message||`You are viewing the ${role} side. Both sides can play either sample.`}</span><button type="button" onClick={stop} disabled={!playing}><Square size={13}/> Stop voice</button></div>
 </section>;
}
