import {translatePair} from '../../../locales/contentTranslations';
import React,{useEffect,useMemo,useState} from 'react';
import confetti from 'canvas-confetti';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,ChevronLeft,Code2,Lightbulb,Play,RotateCcw,Star,Terminal,CheckCircle2} from 'lucide-react';
import {useLanguage} from '../../../context/LanguageContext';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import {compileMazeCommands,CommandError} from '../../../services/arcadeCommandRunner';
import type {ParsedMove} from '../../../services/arcadeCommandRunner';
import type {Direction} from '../arcadeData';
import {RESCUE_LEVELS,findRescueSolution,newRescueFrame,rescueMeta,rescueScore,stepRescue} from './robotRescueEngine';
import './robotRescue.css';
const tr=translatePair;
export function RobotRescue({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}){
 const {language,locale}=useLanguage(),{progress,recordBest,logEvent,total}=useLearningExtras();
 const [index,setIndex]=useState(Math.max(0,Math.min(5,initialLevel))),level=RESCUE_LEVELS[index];
 const [frame,setFrame]=useState(()=>newRescueFrame(RESCUE_LEVELS[Math.max(0,Math.min(5,initialLevel))]));
 const [mode,setMode]=useState<'manual'|'code'>('manual');const [source,setSource]=useState('move_right()\nmove_right()');
 const [queue,setQueue]=useState<ParsedMove[]>([]),[cursor,setCursor]=useState(0),[running,setRunning]=useState(false),[speed,setSpeed]=useState(320),[notice,setNotice]=useState(''),[hint,setHint]=useState(false);
 const meta=useMemo(()=>rescueMeta(level),[level]);const score=rescueScore(frame);
 const reset=()=>{setFrame(newRescueFrame(level));setCursor(0);setQueue([]);setRunning(false);setNotice('');setHint(false)};
 const choose=(i:number)=>{setIndex(i);setFrame(newRescueFrame(RESCUE_LEVELS[i]));setCursor(0);setQueue([]);setRunning(false);setNotice('');setHint(false);setSource('move_right()\nmove_right()');};
 const move=(dir:Direction,line=0)=>{
  if(frame.won)return;const next=stepRescue(level,frame,dir,line);
  if(next.hitWall){setNotice(tr('Ada dinding! Cari jalan lain.','A wall is blocking the path. Try another way!',locale));return;}
  setFrame(next);logEvent('attempt',level.id);
  if(next.rescued.length>frame.rescued.length)logEvent('star',level.id);
  if(next.won){recordBest(level.id,rescueScore(next));logEvent('win',level.id);setRunning(false);setNotice(tr('Semua haiwan selamat! Syabas!','Every pet is safe! Great job!',locale));try{confetti({particleCount:65,spread:60,origin:{y:.68},disableForReducedMotion:true})}catch{}}
  else if(next.position.x===meta.door.x&&next.position.y===meta.door.y&&next.rescued.length<meta.pets.length)setNotice(tr('Selamatkan semua haiwan sebelum pulang.','Rescue every pet before going home.',locale));
  else if(next.rescued.length>frame.rescued.length)setNotice(tr('+40 mata! Seekor haiwan telah diselamatkan.','+40 points! You rescued a pet.',locale));
  else setNotice('');
 };
 const run=()=>{
  try{
   const parsed=compileMazeCommands(source);
   setFrame(newRescueFrame(level));setNotice('');setQueue(parsed);setCursor(0);setRunning(true);
  }catch(e){const err=e as CommandError;setNotice(`${tr('Baris','Line',locale)} ${err.line||1}: ${tr('Semak arahan atau ruang kod anda.','Check the command or indentation.',locale)} (${err.kind||'invalid'}).`);logEvent('code_error',level.id)}
 };
 useEffect(()=>{
  if(!running)return;
  const timer=window.setTimeout(()=>{
   const item=queue[cursor];if(!item){setRunning(false);if(!frame.won)setNotice(tr('Kod selesai. Cuba tambah arahan untuk cari rumah.','Program finished. Add more commands to reach home.',locale));return;}
   setCursor(n=>n+1);move(item.direction,item.line);
  },speed);
  return ()=>clearTimeout(timer);
 },[running,queue,cursor,frame,speed,level]);
 const example=()=>{const path=findRescueSolution(level);if(path){setSource(path.map(dir=>`move_${dir}()`).join('\n'));setMode('code');reset();setNotice(tr('Contoh laluan telah dimasukkan. Tekan Jalankan Kod.','Example route inserted. Press Run Code.',locale));}};
 const instructions=tr('Selamatkan semua haiwan dan bawa robot ke rumah.','Rescue all the pets and bring the robot home.',locale);
 return <div className="rescue-root">
  <div className="rescue-top"><button onClick={onBack}><ChevronLeft size={18}/>{tr('Semua permainan','All games',locale)}</button><span><Star size={16} fill="currentColor"/>{total.toLocaleString()} XP</span></div>
  <header className="rescue-hero"><div><span className="rescue-kicker">CILIK ARCADE · {tr('MISI PENYELAMAT','RESCUE MISSION',locale)}</span><h1>Robot Rescue</h1><p>{tr('Bantu Ciko mencari sahabat kecil dan bawa mereka pulang!','Help Ciko find lost little friends and bring them home!',locale)}</p></div><span className="rescue-hero-mascot" aria-hidden="true">🤖🐶</span></header>
  <div className="rescue-levelrail" aria-label={tr('Pilih tahap','Choose level',locale)}><strong>{tr('Tahap','Level',locale)}</strong>{RESCUE_LEVELS.map((item,i)=><button key={item.id} className={`${i===index?'selected':''} ${progress.completed.includes(item.id)?'completed':''}`} onClick={()=>choose(i)} aria-current={i===index?'step':undefined}>{progress.completed.includes(item.id)&&i!==index?'✓':i+1}</button>)}</div>
  <div className="rescue-columns"><section className="rescue-panel"><div className="rescue-panel-intro"><div><span>{tr('MISI','MISSION',locale)} {index+1} / 6</span><h2>{level.name[language]}</h2><p>{instructions}</p></div><span>🐾</span></div>
   <div className="rescue-board"><div className="rescue-board-sky" aria-hidden="true"><span>☁️</span><span>🌤️</span><span>☁️</span></div><div className="rescue-grid" style={{gridTemplateColumns:`repeat(${meta.width},minmax(0,1fr))`}} role="img" aria-label={tr('Peta robot, haiwan, dinding dan rumah','Robot map with pets, walls, and home',locale)}>
   {level.map.flatMap((row,y)=>[...row].map((tile,x)=>{const player=frame.position.x===x&&frame.position.y===y;const saved=frame.rescued.includes(`${x},${y}`);return <div key={`${x}-${y}`} className={`rescue-cell ${tile==='#'?'wall':tile==='D'?'home':'path'} ${player?'player':''}`}>
    {player?<span className="rescue-robot" aria-label="Robot">🤖</span>:tile==='P'&&!saved?<span className="rescue-pet" aria-label="Lost pet">{(x+y)%2?'🐶':'🐱'}</span>:tile==='D'?<span aria-label="Home">🏠</span>:tile==='#'?<span aria-hidden="true">🌳</span>:''}
   </div>}))}</div><div className="rescue-board-foot"><span>🐾 {frame.rescued.length}/{meta.pets.length} {tr('diselamatkan','rescued',locale)}</span><span>⭐ {score} XP</span></div></div>
   {frame.won&&<div className="rescue-success" role="status"><CheckCircle2 size={23}/><div><strong>{tr('Misi berjaya!','Mission completed!',locale)}</strong><small>{tr('Semua sahabat telah pulang dengan selamat.','Every little friend made it home safely.',locale)}</small></div><button onClick={()=>choose(index<5?index+1:0)}>{index<5?tr('Seterusnya','Next',locale):tr('Main dari awal','Play from start',locale)} <ArrowRight size={16}/></button></div>}
  </section><section className="rescue-panel rescue-controls"><div className="rescue-panel-intro"><div><span>{tr('BELAJAR DENGAN BERMAIN','LEARN BY PLAYING',locale)}</span><h2>{tr('Kawal robot kamu','Control your robot',locale)}</h2><p>{level.topic[language]}</p></div></div>
   <div className="rescue-tabs"><button className={mode==='manual'?'active':''} onClick={()=>{setMode('manual');reset()}}>🎮 {tr('Main','Play',locale)}</button><button className={mode==='code'?'active':''} onClick={()=>{setMode('code');reset()}}><Code2 size={17}/>{tr('Tulis Kod','Write Code',locale)}</button></div>
   {mode==='manual'?<><p className="rescue-instruction">{tr('Gunakan butang anak panah untuk bergerak dan kutip semua haiwan.','Use the arrow buttons to move and collect all the lost pets.',locale)}</p><div className="rescue-dpad">{([null,'up',null,'left','down','right'] as (Direction|null)[]).map((d,i)=>d?<button key={i} disabled={frame.won||running} onClick={()=>move(d)} aria-label={d}>{d==='up'?<ArrowUp/>:d==='down'?<ArrowDown/>:d==='left'?<ArrowLeft/>:<ArrowRight/>}</button>:<span key={i}/>)}</div></>:
   <><p className="rescue-instruction">{tr('Tulis arahan dan tekan Jalankan Kod untuk lihat robot bergerak.','Write commands and press Run Code to watch the robot move.',locale)}</p><div className="rescue-editor"><div><Terminal size={16}/> rescue.py <span>{running?`${tr('Baris','Line',locale)} ${queue[Math.max(0,cursor-1)]?.line||1}`:''}</span></div><textarea value={source} onChange={e=>setSource(e.target.value)} disabled={running} spellCheck={false} aria-label="Rescue code editor"/></div><div className="rescue-command-buttons">{(['up','down','left','right'] as Direction[]).map(d=><button key={d} disabled={running} onClick={()=>setSource(s=>`${s.trim()}\nmove_${d}()`.trim())}>+ move_{d}()</button>)}</div><div className="rescue-code-actions"><button onClick={run} disabled={running||frame.won}><Play size={17}/>{running?tr('Sedang bergerak...','Moving...',locale):tr('Jalankan Kod','Run Code',locale)}</button><select value={speed} onChange={e=>setSpeed(Number(e.target.value))} aria-label="Movement speed"><option value={200}>{tr('Laju','Fast',locale)}</option><option value={320}>{tr('Biasa','Normal',locale)}</option><option value={550}>{tr('Perlahan','Slow',locale)}</option></select></div></>}
   <div className="rescue-mini-stats"><div><small>{tr('Langkah','Steps',locale)}</small><strong>{frame.steps}</strong></div><div><small>{tr('Rekod terbaik','Best score',locale)}</small><strong>{progress.scores[level.id]||0} XP</strong></div></div>
   <div className="rescue-utils"><button disabled={running} onClick={()=>{setHint(h=>!h);if(!hint)logEvent('hint',level.id)}}><Lightbulb size={17}/>{tr('Petunjuk','Hint',locale)}</button><button disabled={running} onClick={reset}><RotateCcw size={17}/>{tr('Mula semula','Restart',locale)}</button><button disabled={running} onClick={example}><Code2 size={17}/>{tr('Contoh kod','Example code',locale)}</button></div>
   {hint&&<div className="rescue-hint">{level.tip[language]}</div>}<p className="rescue-feedback" role="status" aria-live="polite">{notice||tr('Setiap haiwan yang diselamatkan menambah mata!','Each rescued pet increases your score!',locale)}</p>
  </section></div>
 </div>;
}
