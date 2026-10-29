import {translatePair} from '../../../locales/contentTranslations';
import React,{useEffect,useRef,useState} from 'react';
import confetti from 'canvas-confetti';
import {ArrowRight,ChevronLeft,Code2,Lightbulb,Play,RotateCcw,Star,Terminal,Music4,Construction,Volume2,VolumeX} from 'lucide-react';
import {useLanguage} from '../../../context/LanguageContext';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import {MELODY_LEVELS,NOTE_META,compileMelodyCode,melodyComplete,melodyMatches,melodyScore,BRIDGE_LEVELS,compileBridgeCode,initialBridgeFrame,advanceBridge,bridgeScore} from './bonusGamesEngine';
import type {NoteKey,MelodyPlay,BridgeCommand,BridgeFrame} from './bonusGamesEngine';
import './newGames.css';
const tr=translatePair;
const yay=()=>{try{confetti({particleCount:55,spread:60,origin:{y:.65},disableForReducedMotion:true});}catch{}};
const base='nova-button';
const action='nova-button nova-button-primary';
function GameShell({title,subtitle,icon,back,total,children,theme='mint'}:{title:string;subtitle:string;icon:string;back:()=>void;total:number;children:React.ReactNode;theme?:'mint'|'berry'|'sun'}){
 const {language,locale}=useLanguage();return <div className={`nova-game nova-${theme} premium-plus-root`}>
 <div className="nova-topline"><button className="nova-back" onClick={back}><ChevronLeft size={18}/>{tr('Semua permainan','All games',locale)}</button><div className="nova-xp"><Star size={16} fill="currentColor"/> {total.toLocaleString()} XP</div></div>
 <div className="nova-game-hero premium-plus-hero"><div className="nova-hero-bubble">{icon}</div><div><div className="nova-hero-kicker">CILIK ARCADE · {tr('MISI KOD','CODE QUEST',locale)}</div><h1>{title}</h1><p>{subtitle}</p></div><div className="nova-hero-spark">✦</div></div>{children}</div>;
}
function LevelPicker({count,selected,done,pick}:{count:number;selected:number;done:(i:number)=>boolean;pick:(i:number)=>void}){
 const {language,locale}=useLanguage();return <div className="nova-levelrail"><span>{tr('Pilih tahap','Select a level',locale)}</span><div className="nova-levelrail-scroll">{Array.from({length:count},(_,i)=><button key={i} onClick={()=>pick(i)} aria-current={selected===i?'step':undefined} className={`nova-level ${selected===i?'chosen':''} ${done(i)?'complete':''}`} aria-label={`${tr('Tahap','Level',locale)} ${i+1}`}>{done(i)&&selected!==i?'✓':i+1}</button>)}</div></div>;
}
function Victory({message,score,next,replay,hasNext}:{message:string;score:number;next:()=>void;replay:()=>void;hasNext:boolean}){
 const {language,locale}=useLanguage();return <div className="nova-win" role="status"><span className="nova-win-icon">🏆</span><div><strong>{message}</strong><p>{tr('Skor percubaan','Run score',locale)}: {score} XP · {tr('Rekod terbaik disimpan','Best score saved',locale)}</p></div><div className="nova-win-actions"><button className={action} onClick={next}>{hasNext?tr('Seterusnya','Next level',locale):tr('Main dari awal','Play from start',locale)} <ArrowRight size={17}/></button><button className={base} onClick={replay}><RotateCcw size={16}/></button></div></div>;
}

export function MelodyMachine({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}){
 const {language,locale}=useLanguage(); const {progress,recordBest,logEvent,total}=useLearningExtras();
 const [index,setIndex]=useState(Math.max(0,Math.min(5,initialLevel))), level=MELODY_LEVELS[index];
 const [mode,setMode]=useState<'tap'|'code'>('tap'); const [played,setPlayed]=useState<NoteKey[]>([]); const [errors,setErrors]=useState(0); const [notice,setNotice]=useState(''); const [hint,setHint]=useState(false);
 const [source,setSource]=useState('play(red)\nplay(blue)'); const [queue,setQueue]=useState<MelodyPlay[]>([]); const [running,setRunning]=useState(false); const [cursor,setCursor]=useState(0); const [speed,setSpeed]=useState(380);
 const [muted,setMuted]=useState(false); const audioRef=useRef<AudioContext|null>(null);
 const playSound=(note:NoteKey)=>{
  if(muted||typeof window==='undefined'||!('AudioContext' in window))return;
  try{
   const ctx=audioRef.current||(audioRef.current=new window.AudioContext());
   if(ctx.state==='suspended')void ctx.resume();
   const oscillator=ctx.createOscillator(),volume=ctx.createGain();
   const frequency={red:261.63,blue:329.63,green:392.0,yellow:523.25}[note];
   oscillator.type='sine';oscillator.frequency.value=frequency;
   volume.gain.setValueAtTime(0.0001,ctx.currentTime);
   volume.gain.exponentialRampToValueAtTime(0.15,ctx.currentTime+0.018);
   volume.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.22);
   oscillator.connect(volume);volume.connect(ctx.destination);
   oscillator.start(ctx.currentTime);oscillator.stop(ctx.currentTime+0.23);
  }catch{/* Browser audio may be unavailable; game stays playable. */}
 };
 useEffect(()=>()=>{if(audioRef.current)void audioRef.current.close().catch(()=>{});},[]);

 const won=melodyComplete(level,played); const score=melodyScore(level,played,errors,won);
 const reset=()=>{setPlayed([]);setErrors(0);setNotice('');setQueue([]);setCursor(0);setRunning(false);setHint(false)};
 const choose=(i:number)=>{setIndex(i); reset(); setSource('play(red)\nplay(blue)');};
 const pushNote=(note:NoteKey,fromCode=false)=>{
   if(won||(!fromCode&&running))return;
   const pos=played.length;
   logEvent('attempt',level.id);
   playSound(note);
   if(level.target[pos]!==note){
     setErrors(v=>v+1);
     setNotice(tr('Not ini belum tepat. Cuba not lain!','That note is not correct. Try a different one!',locale));
     if(fromCode)setRunning(false);
     return;
   }
   const next=[...played,note];
   setPlayed(next);
   if(melodyComplete(level,next)){
     recordBest(level.id,melodyScore(level,next,errors,true));
     logEvent('win',level.id);yay();setRunning(false);
     setNotice(tr('Melodi siap! Hebat!','Melody complete! Amazing!',locale));
   } else setNotice(tr('Bagus! Teruskan rentak itu.','Nice! Keep the rhythm going.',locale));
 };
 const run=()=>{
   try{
     const actions=compileMelodyCode(source);
     if(!actions.length)throw new Error('Add at least one play() command.');
     if(!muted&&typeof window!=='undefined'&&'AudioContext' in window){try{const ctx=audioRef.current||(audioRef.current=new window.AudioContext());void ctx.resume();}catch{}}
     reset();setMode('code');setQueue(actions);setRunning(true);
   }catch(e){
     const err=e as Error & {line?:number};
     setNotice(`${tr('Baris','Line',locale)} ${err.line||1}: ${err.message}`);
     logEvent('code_error',level.id);
   }
 };
 useEffect(()=>{
   if(!running)return;
   const timer=window.setTimeout(()=>{
     const item=queue[cursor];
     if(!item){
       setRunning(false);
       if(!melodyComplete(level,played))setNotice(tr('Kod selesai. Tambah not dan cuba semula.','Program finished. Add more notes and run again.',locale));
       return;
     }
     setCursor(v=>v+1);
     pushNote(item.note,true);
   },speed);
   return ()=>clearTimeout(timer);
 },[running,cursor,queue,played,level,speed]);
 return <GameShell title="Melody Machine" subtitle={tr('Bina rentak, padankan melodi dan belajar urutan kod yang menyeronokkan!','Build beats, match melodies and learn playful coding sequences!',locale)} icon="🎵" back={onBack} total={total} theme="sun">
 <LevelPicker count={MELODY_LEVELS.length} selected={index} done={i=>progress.completed.includes(MELODY_LEVELS[i].id)} pick={choose}/>
 <div className="nova-game-columns premium-play-columns"><div className="nova-panel premium-card"><div className="nova-panel-heading"><div><small>{tr('MISI MUZIK','MUSIC QUEST',locale)} {index+1}/6</small><h2>{level.name[language]}</h2><p>{level.topic[language]}</p></div><div className="nova-bubble">🎶</div></div>
 <div className="melody-target premium-song"><div className="melody-title">{tr('Melodi sasaran','Target melody',locale)}</div><div className="melody-strip">{level.target.map((note,i)=><span key={i} className="melody-pill" style={{background:NOTE_META[note].color}}>{NOTE_META[note].emoji}</span>)}</div></div>
 <div className="melody-target premium-song actual"><div className="melody-title">{tr('Rentak kamu','Your rhythm',locale)}</div><div className="melody-strip">{Array.from({length:level.target.length},(_,i)=>{const note=played[i]; return <span key={i} className={`melody-pill ${!note?'empty':''}`} style={{background:note?NOTE_META[note].color:'#edf2f7'}}>{note?NOTE_META[note].emoji:'•'}</span>;})}</div></div>
 <div className="nova-meter"><div className="nova-meter-head"><span>{melodyMatches(level,played)}/{level.target.length} {tr('padanan betul','correct matches',locale)}</span><strong>{Math.round((melodyMatches(level,played)/level.target.length)*100)}%</strong></div><div className="nova-meter-track"><div style={{width:`${melodyMatches(level,played)/level.target.length*100}%`}}/></div></div></div>
 <div className="nova-mini-stats"><div><small>{tr('Mata semasa','Current points',locale)}</small><strong>{score} XP</strong></div><div><small>{tr('Rekod terbaik','Best score',locale)}</small><strong>{progress.scores[level.id]||0} XP</strong></div></div>
 <div className="nova-panel premium-card"><div className="nova-tabbar"><button className={mode==='tap'?'on':''} onClick={()=>{setMode('tap');reset();}}><Music4 size={16}/>{tr('Ketuk Not','Tap Notes',locale)}</button><button className={mode==='code'?'on':''} onClick={()=>{setMode('code');reset();}}><Code2 size={16}/>{tr('Tulis Kod','Write Code',locale)}</button></div>
 {mode==='tap'?<><p className="nova-help">{tr('Ketuk not mengikut turutan pada melodi sasaran.','Tap the notes in the same order as the target melody.',locale)}</p><div className="melody-pad-grid">{(Object.keys(NOTE_META) as NoteKey[]).map(note=><button key={note} className="melody-pad" style={{background:NOTE_META[note].color}} onClick={()=>pushNote(note)} disabled={won||running}><span>{NOTE_META[note].emoji}</span><strong>{language==='ms'?NOTE_META[note].ms:NOTE_META[note].en}</strong></button>)}</div></>:<><p className="nova-help">{tr('Gunakan play(red), play(blue), play(green), play(yellow), atau gelung for.','Use play(red), play(blue), play(green), play(yellow), or a for loop.',locale)}</p><div className="nova-editor"><div className="nova-editor-top"><Terminal size={15}/> melody.py <span>{running?`${tr('Langkah','Step',locale)} ${cursor}`:''}</span></div><textarea value={source} disabled={running} onChange={e=>setSource(e.target.value)} spellCheck={false} aria-label="Melody program"/><div className="nova-editor-foot">{tr('Contoh: for i in range(2): lalu indent 4 ruang sebelum play(red)','Example: for i in range(2): then indent play(red) by 4 spaces',locale)}</div></div><div className="nova-commandbar"><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nplay(red)`.trim())}>+ play(red)</button><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nplay(blue)`.trim())}>+ play(blue)</button><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nplay(green)`.trim())}>+ play(green)</button><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nplay(yellow)`.trim())}>+ play(yellow)</button></div><div className="nova-exec"><button className={action} disabled={running||won} onClick={run}><Play size={17}/>{running?tr('Sedang main...','Playing...',locale):tr('Jalankan Kod','Run Code',locale)}</button><select value={speed} onChange={e=>setSpeed(+e.target.value)} aria-label="Playback speed"><option value={220}>{tr('Laju','Fast',locale)}</option><option value={380}>{tr('Biasa','Normal',locale)}</option><option value={650}>{tr('Perlahan','Slow',locale)}</option></select></div></>}
 <div className="nova-choices"><button className={base} onClick={()=>{setHint(v=>!v); if(!hint) logEvent('hint',level.id);}}><Lightbulb size={16}/>{tr('Petunjuk','Hint',locale)}</button><button className={base} onClick={reset}><RotateCcw size={16}/>{tr('Mula semula','Restart',locale)}</button><button className={base} onClick={()=>setMuted(v=>!v)} aria-pressed={muted}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>} {muted?tr('Hidupkan bunyi','Sound on',locale):tr('Bisukan','Mute',locale)}</button></div>{hint&&<div className="nova-tip">{level.tip[language]}</div>}<p className="nova-live" role="status" aria-live="polite">{notice||tr('Dengar rentak dan bina urutan yang sama.','Listen to the rhythm and build the same sequence.',locale)}</p>{won&&<Victory hasNext={index<5} score={score} message={tr('Rentak sempurna!','Perfect rhythm!',locale)} replay={reset} next={()=>choose(index<5?index+1:0)}/>}</div></div>
 </GameShell>;
}

export function BridgeBuilder({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}){
 const {language,locale}=useLanguage(); const {progress,recordBest,logEvent,total}=useLearningExtras();
 const [index,setIndex]=useState(Math.max(0,Math.min(5,initialLevel))), level=BRIDGE_LEVELS[index];
 const [mode,setMode]=useState<'manual'|'code'>('manual'); const [frame,setFrame]=useState<BridgeFrame>(initialBridgeFrame()); const [hint,setHint]=useState(false); const [notice,setNotice]=useState(''); const [source,setSource]=useState(level.solution.slice(0,3).join('\n')); const [queue,setQueue]=useState<BridgeCommand[]>([]); const [cursor,setCursor]=useState(0); const [running,setRunning]=useState(false); const [speed,setSpeed]=useState(360);
 const won=frame.status==='win'; const score=bridgeScore(level,frame);
 const reset=()=>{setFrame(initialBridgeFrame()); setHint(false); setNotice(''); setQueue([]); setCursor(0); setRunning(false);};
 const choose=(i:number)=>{setIndex(i); setSource(BRIDGE_LEVELS[i].solution.slice(0,3).join('\n')); reset();};
 const step=(cmd:BridgeCommand)=>{ const next=advanceBridge(level,frame,cmd); setFrame(next); logEvent('attempt',level.id); if(next.status==='win'){ recordBest(level.id,bridgeScore(level,next)); logEvent('win',level.id); yay(); setRunning(false); setNotice(tr('Jambatan siap! Robot berjaya menyeberang.','Bridge complete! The robot crossed safely.',locale)); }
  else if(next.status==='splash'){ setRunning(false); setNotice(tr('Oh tidak! Robot jatuh ke dalam air.','Oh no! The robot splashed into the water.',locale)); }
  else if(next.status==='blocked'){ setNotice(tr('Tiada jurang di depan untuk dibina.','There is no gap ahead to build on.',locale)); }
  else if(next.status==='duplicate'){ setNotice(tr('Papan sudah ada di sini.','A plank is already there.',locale)); }
  else if(next.status==='edge'){ setNotice(tr('Robot sudah di hujung papan.','The robot is already at the edge.',locale)); }
  else setNotice(''); };
 const manual=(op:BridgeCommand['op'])=>{ if(!won&&!running) step({op,line:0}); };
 const run=()=>{ try{ const actions=compileBridgeCode(source); reset(); setMode('code'); setQueue(actions); setRunning(true);} catch(e){ const err=e as Error & {line?:number}; setNotice(`${tr('Baris','Line',locale)} ${err.line||1}: ${err.message}`); logEvent('code_error',level.id);} };
 useEffect(()=>{ if(!running) return; const timer=window.setTimeout(()=>{ const item=queue[cursor]; if(!item){ setRunning(false); if(frame.status!=='win') setNotice(tr('Kod selesai. Cuba tambah arahan supaya robot sampai ke bendera.','Program finished. Add more commands so the robot reaches the flag.',locale)); return;} setCursor(v=>v+1); step(item); },speed); return ()=>clearTimeout(timer); },[running,cursor,queue,frame,speed]);
 const plankSet=new Set(frame.planks);
 return <GameShell title="Bridge Builder" subtitle={tr('Rancang langkah, bina papan dan bantu robot menyeberangi sungai dengan selamat!','Plan the steps, build planks and help the robot cross the river safely!',locale)} icon="🌉" back={onBack} total={total} theme="mint">
 <LevelPicker count={BRIDGE_LEVELS.length} selected={index} done={i=>progress.completed.includes(BRIDGE_LEVELS[i].id)} pick={choose}/>
 <div className="nova-game-columns premium-play-columns"><div className="nova-panel premium-card"><div className="nova-panel-heading"><div><small>{tr('MISI JAMBATAN','BRIDGE QUEST',locale)} {index+1}/6</small><h2>{level.name[language]}</h2><p>{level.topic[language]}</p></div><div className="nova-bubble">🌉</div></div>
 <div className="bridge-stage"><div className="bridge-river">{Array.from({length:level.length},(_,i)=>{const gap=level.gaps.includes(i); const built=plankSet.has(i); const here=frame.position===i; const goal=i===level.length-1; return <div key={i} className={`bridge-tile ${gap?'gap':''} ${built?'built':''} ${goal?'goal':''}`}><div className="bridge-top">{goal?'🏁':here?'🤖':gap?(built?'🪵':'💧'):'🟫'}</div><small>{i+1}</small></div>;})}</div><div className="bridge-legend"><span>💧 {tr('Jurang air','Water gap',locale)}</span><span>🪵 {tr('Papan dibina','Built plank',locale)}</span><span>🏁 {tr('Bendera tamat','Finish flag',locale)}</span></div></div>
 <div className="nova-mini-stats"><div><small>{tr('Mata semasa','Current points',locale)}</small><strong>{score} XP</strong></div><div><small>{tr('Rekod terbaik','Best score',locale)}</small><strong>{progress.scores[level.id]||0} XP</strong></div></div><div className="nova-mini-stats"><div><small>{tr('Langkah','Steps',locale)}</small><strong>{frame.steps}</strong></div><div><small>{tr('Papan dibina','Planks built',locale)}</small><strong>{frame.planks.length}</strong></div></div></div>
 <div className="nova-panel premium-card"><div className="nova-tabbar"><button className={mode==='manual'?'on':''} onClick={()=>{setMode('manual'); reset();}}><Construction size={16}/>{tr('Main','Play',locale)}</button><button className={mode==='code'?'on':''} onClick={()=>{setMode('code'); reset();}}><Code2 size={16}/>{tr('Tulis Kod','Write Code',locale)}</button></div>
 {mode==='manual'?<><p className="nova-help">{tr('Bina papan jika ada jurang di depan, kemudian gerak ke kanan.','Build a plank if there is a gap ahead, then move right.',locale)}</p><div className="bridge-action-row"><button className={base} onClick={()=>manual('place')} disabled={won||running}>🪵 {tr('Bina Papan','Build Plank',locale)}</button><button className={base} onClick={()=>manual('move_left')} disabled={won||running}>⬅️ {tr('Kiri','Left',locale)}</button><button className={action} onClick={()=>manual('move_right')} disabled={won||running}>{tr('Kanan','Right',locale)} ➡️</button></div></>:<><p className="nova-help">{tr('Gunakan move_right(), move_left(), place(), atau gelung for.','Use move_right(), move_left(), place(), or a for loop.',locale)}</p><div className="nova-editor"><div className="nova-editor-top"><Terminal size={15}/> bridge.py <span>{running?`${tr('Langkah','Step',locale)} ${cursor}`:''}</span></div><textarea value={source} disabled={running} onChange={e=>setSource(e.target.value)} spellCheck={false} aria-label="Bridge program"/><div className="nova-editor-foot">{tr('Contoh: move_right() lalu place() sebelum jurang.','Example: move_right() then place() before a gap.',locale)}</div></div><div className="nova-commandbar"><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nmove_right()`.trim())}>+ move_right()</button><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nmove_left()`.trim())}>+ move_left()</button><button disabled={running} onClick={()=>setSource(v=>`${v.trim()}\nplace()`.trim())}>+ place()</button></div><div className="nova-exec"><button className={action} disabled={running||won} onClick={run}><Play size={17}/>{running?tr('Sedang bina...','Building...',locale):tr('Jalankan Kod','Run Code',locale)}</button><select value={speed} onChange={e=>setSpeed(+e.target.value)} aria-label="Playback speed"><option value={220}>{tr('Laju','Fast',locale)}</option><option value={360}>{tr('Biasa','Normal',locale)}</option><option value={620}>{tr('Perlahan','Slow',locale)}</option></select></div></>}
 <div className="nova-choices"><button className={base} onClick={()=>{setHint(v=>!v); if(!hint) logEvent('hint',level.id);}}><Lightbulb size={16}/>{tr('Petunjuk','Hint',locale)}</button><button className={base} onClick={reset}><RotateCcw size={16}/>{tr('Mula semula','Restart',locale)}</button></div>{hint&&<div className="nova-tip">{level.tip[language]}</div>}<p className="nova-live" role="status" aria-live="polite">{notice||tr('Bantu robot sampai ke bendera dengan selamat.','Help the robot reach the flag safely.',locale)}</p>{won&&<Victory hasNext={index<5} score={score} message={tr('Jambatan berjaya dibina!','The bridge is complete!',locale)} replay={reset} next={()=>choose(index<5?index+1:0)}/>}</div></div>
 </GameShell>;
}
