import React, {useEffect, useState} from 'react';
import {SpaceInvaders} from './addons/SpaceInvaders';
import {AdventureMap,Achievements,ArcadeInsights,WORLDS} from './addons/AdventureExtras';
import type {ArcadeGame} from './addons/AdventureExtras';
import {MazeCreator} from './addons/MazeCreator';
import {SPACE_LEVELS} from './addons/spaceEngine';
import {PixelPainter,TreasureSorter,LoopGarden} from './addons/NewArcadeGames';
import {MelodyMachine,BridgeBuilder} from './addons/BonusArcadeGames';
import {RobotRescue} from './addons/RobotRescue';
import {CikoStoryQuest,CikoPetLab,CikoLearningCoach} from './addons/CreativeLearning';
import {QuestBoard} from './addons/QuestBoard';
import {SparkCircuit} from './addons/SparkCircuit';
import {ArcadeHome} from './addons/ArcadeHome';
import {SportsArena} from './addons/SportsArena';
import {ChallengeLab} from './addons/ChallengeLab';
import {useApp} from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Check,CheckCircle2,ChevronLeft,ChevronRight,Code2,GripVertical,Lightbulb,Play,RotateCcw,Sparkles,Star,Terminal,Trophy,Volume2,VolumeX,Pause,Eye,Keyboard,Map as MapIcon} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';
import {useLearningExtras} from '../../hooks/useLearningExtras';
import {compileMazeCommands,CommandError} from '../../services/arcadeCommandRunner';
import {advanceMaze,mazeScore,simulateMazeCode} from '../../services/arcadeRules';
import type {MazeFrame} from '../../services/arcadeRules';
import {DETECTIVE_CASES,ESCAPE_LEVELS,LOGIC_LEVELS,MAZE_LEVELS,parseMaze,shortestPath} from './arcadeData';
import type {Direction,MazeLevel,LocalText,Point} from './arcadeData';

type Mode='home'|'maze'|'detective'|'logic'|'escape'|'space'|'pixel'|'sort'|'garden'|'melody'|'bridge'|'rescue'|'story'|'pet'|'circuit'|'coach'|'quests'|'world'|'creator'|'achievements'|'insights'|'cipher'|'fossil';
const copy=(ms:string,en:string,lang:string)=>lang==='ms'?ms:en;
const t=(value:LocalText,lang:string)=>value[lang==='ms'?'ms':'en'];
const cheer=()=>{try{confetti({particleCount:75,spread:65,origin:{y:.7},disableForReducedMotion:true});}catch{/* animations optional */}};
const panel='bg-white rounded-[26px] border border-slate-200 shadow-sm';
const primary='inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-extrabold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed';
const secondary='inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40';
const gameArt:Record<string,string>={maze:'/arcade/code-maze.svg',escape:'/arcade/code-escape.svg',detective:'/arcade/bug-detective.svg',logic:'/arcade/logic-builder.svg',space:'/arcade/space-invaders.svg'};

function MissionCard({emoji,title,items,tone='indigo'}:{emoji:string;title:string;items:string[];tone?:'indigo'|'amber'|'emerald'|'violet'}){
 const theme={indigo:'from-indigo-100 to-sky-50 border-indigo-200 text-indigo-900',amber:'from-amber-100 to-orange-50 border-amber-200 text-amber-900',emerald:'from-emerald-100 to-teal-50 border-emerald-200 text-emerald-900',violet:'from-violet-100 to-fuchsia-50 border-violet-200 text-violet-900'}[tone];
 const content=<ul className="mt-2 space-y-1.5 text-sm font-medium">{items.map((item,i)=><li key={i} className="flex gap-2"><span aria-hidden="true" className="mt-0.5">✦</span><span>{item}</span></li>)}</ul>;
 return <><div className={`hidden md:block arcade-mission rounded-[24px] p-4 sm:p-5 bg-gradient-to-br ${theme}`}><div className="flex items-start gap-3"><div className="w-14 h-14 rounded-2xl bg-white/80 border border-white/80 flex items-center justify-center text-3xl shrink-0">{emoji}</div><div><div className="font-black text-sm uppercase tracking-wide">{title}</div>{content}</div></div></div><details className={`md:hidden rounded-2xl border bg-gradient-to-br ${theme} arcade-mission-mobile`}><summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer font-extrabold text-sm"><span>{emoji} {title}</span><span aria-hidden="true">⌄</span></summary><div className="px-4 pb-4">{content}</div></details></>;
}
function CharacterBubble({emoji,name,text}:{emoji:string;name:string;text:string}){
 return <div className="arcade-speech rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border border-sky-200 flex items-center justify-center text-2xl shrink-0">{emoji}</div><div><div className="text-xs uppercase tracking-wider font-black text-indigo-600">{name}</div><p className="text-sm text-slate-700 font-medium mt-1">{text}</p></div></div></div>;
}

function Top({title,sub,onBack,score,tag}:{title:string;sub:string;onBack:()=>void;score:number;tag?:string}){
 const {language}=useLanguage();const {setActiveTab}=useApp();
 const askCiko=()=>{try{sessionStorage.setItem('ciliklab_ciko_topic',title==='Bug Detective'?'debug':title==='Code Maze'||title==='Code-to-Escape'?'maze':'loops')}catch{}setActiveTab('ciko_assistant');};
 return <header className="arcade-top space-y-3"><button onClick={askCiko} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-extrabold text-teal-800 inline-flex items-center gap-1 min-h-10">🤖 {copy('Tanya Ciko','Ask Ciko',language)}</button>
  <div className="arcade-topbar flex items-center justify-between gap-3">
   <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-700 hover:text-indigo-900 min-h-10"><ChevronLeft size={19}/>{copy('Semua permainan','All games',language)}</button>
   <div className="arcade-xp-tag flex items-center gap-1.5 font-black text-amber-800 tabular-nums"><Star size={16} fill="currentColor"/>{score} XP</div>
  </div>
  <div className="arcade-game-hero relative overflow-hidden rounded-[26px] px-4 py-4 sm:px-7 sm:py-7 bg-gradient-to-r from-[#3637a7] via-indigo-700 to-sky-600 text-white arcade-hero-glow">
   <div className="arcade-hero-orbit arcade-hero-orbit-one"/><div className="arcade-hero-orbit arcade-hero-orbit-two"/>
   <div className="relative z-10 flex justify-between items-center gap-4"><div className="min-w-0"><span className="arcade-eyebrow">{tag||'Cilik Arcade'}</span><h1 className="arcade-game-title text-[24px] sm:text-3xl font-black mt-1 leading-tight tracking-tight">{title}</h1><p className="arcade-game-desc max-w-xl text-indigo-100 text-sm mt-1.5 leading-6">{sub}</p></div>
   <div className="hidden lg:flex arcade-total-trophy shrink-0 flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/15 px-6 py-4"><Trophy size={28} className="text-yellow-200"/><strong className="text-2xl tabular-nums">{score} XP</strong><small>{copy('Jumlah mata','Total points',language)}</small></div>
   </div>
  </div>
 </header>;
}
function LevelStrip({count,index,completed,onChoose}:{count:number;index:number;completed:(i:number)=>boolean;onChoose:(i:number)=>void}){
 const {language}=useLanguage();
 return <div className="arcade-level-wrap rounded-2xl bg-white/85 border border-slate-100 p-2 sm:p-3 flex items-center gap-3"><span className="hidden sm:block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap px-1">{copy('Pilih tahap','Choose level',language)}</span><div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 arcade-level-scroll" aria-label={copy('Pilih tahap','Choose level',language)}>{Array.from({length:count},(_,i)=>{const done=completed(i);return <button key={i} onClick={()=>onChoose(i)} aria-current={i===index?'step':undefined} aria-label={`${copy('Tahap','Level',language)} ${i+1}`} className={`arcade-level-chip shrink-0 w-[48px] h-[47px] rounded-xl border font-black text-sm flex items-center justify-center gap-1 transition-all ${i===index?'bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]':done?'bg-emerald-50 border-emerald-200 text-emerald-800':'bg-white border-slate-200 text-slate-600 hover:bg-indigo-50'}`}><span>{done&&i!==index?<Check size={17}/>:i+1}</span></button>})}</div></div>;
}
function MiniStats({stars,steps,score,best,lang}:{stars:string[];steps:number;score:number;best:number;lang:string}){
 const cards=[{v:`${stars.length} ★`,label:copy('Bintang','Stars',lang),tone:'from-amber-100 to-yellow-50 border-amber-200 text-amber-900'},{v:String(steps),label:copy('Langkah','Steps',lang),tone:'from-sky-100 to-cyan-50 border-sky-200 text-sky-900'},{v:String(score),label:copy('Mata sekarang','Current points',lang),tone:'from-violet-100 to-indigo-50 border-violet-200 text-violet-900'}];
 return <div className="grid grid-cols-3 gap-2 sm:gap-3">{cards.map((x,i)=><div key={i} className={`arcade-stat-card rounded-[22px] p-3.5 border bg-gradient-to-br ${x.tone}`}><div className="text-2xl font-black tabular-nums">{x.v}</div><div className="text-[11px] font-bold uppercase tracking-wide opacity-80">{x.label}</div></div>)}<div className="col-span-3 text-xs text-slate-500 text-center rounded-2xl bg-slate-50 border border-slate-100 p-2.5">{copy('Rekod terbaik tahap ini','Best score for this level',lang)}: <b className="text-indigo-700 tabular-nums">{best} XP</b></div></div>;
}
function MazeBoard({level,player,stars,theme='sky'}:{level:MazeLevel;player:Point;stars:string[];theme?:'sky'|'violet'}){
 const {language}=useLanguage(); const meta=parseMaze(level); const {width}=meta; const picked=new Set(stars);
 return <div className={`arcade-gameboard relative rounded-[28px] px-2 pt-3 pb-3 sm:p-6 bg-gradient-to-br ${theme==='sky'?'from-sky-100 via-blue-50 to-teal-100 border-sky-200':'from-violet-100 via-indigo-50 to-pink-100 border-violet-200'} border overflow-hidden`}>
  <div className="absolute inset-0 arcade-grid-bg opacity-30 pointer-events-none"/>
  <div className="absolute left-4 top-4 arcade-board-badge rounded-2xl px-3 py-2 text-xs font-black text-indigo-700">🤖 {theme==='sky'?'Ciko':'Coder'}</div>
  <div className="absolute right-4 top-4 arcade-board-badge rounded-2xl px-3 py-2 text-xs font-black text-amber-700">⭐ {stars.length}/{meta.stars.length}</div>
  <div className="arcade-map-grid relative mx-auto mt-11 w-full max-w-[520px] grid gap-[3px] sm:gap-[6px]" style={{gridTemplateColumns:`repeat(${width},minmax(0,1fr))`}} role="img" aria-label="Interactive maze with walls, stars, a robot and an exit door">{level.map.flatMap((row,y)=>[...row].map((tile,x)=>{const key=`${x},${y}`,isPlayer=player.x===x&&player.y===y,star=tile==='*'&&!picked.has(key),exit=tile==='D';return <div key={key} className={`aspect-square min-w-0 rounded-[9px] sm:rounded-2xl flex justify-center items-center relative transition-all duration-200 ${tile==='#'?'bg-gradient-to-b from-indigo-400 to-indigo-600 border-b-[3px] border-indigo-700/70 shadow-inner':exit?'bg-gradient-to-b from-emerald-200 to-emerald-300 border-2 border-emerald-500':'bg-white/95 border border-white shadow-sm'}`}>{exit&&!isPlayer&&<span className="text-[clamp(14px,2.6vw,28px)]" role="img" aria-label="Exit door">🚪</span>}{star&&!isPlayer&&<Star className="text-amber-500 w-[55%] h-[55%] drop-shadow-sm" fill="#fbbf24" aria-label="Collectible star"/>}{isPlayer&&<span className="arcade-avatar relative w-[78%] h-[78%] rounded-full bg-gradient-to-b from-sky-200 to-indigo-500 shadow-lg border-2 border-white flex items-center justify-center text-[clamp(13px,2.6vw,26px)]" role="img" aria-label="Robot player">🤖</span>}</div>}))}</div>
  <div className="relative flex flex-wrap justify-center gap-2 mt-3 text-[11px] sm:text-xs font-bold text-indigo-700"><span className="arcade-board-badge rounded-full px-3 py-1">⭐ {copy('Kumpul bintang','Collect stars',language)}</span><span className="arcade-board-badge rounded-full px-3 py-1">🚪 {copy('Cari pintu','Find the door',language)}</span><span className="hidden sm:inline-flex arcade-board-badge rounded-full px-3 py-1">⌨️ {copy('Gunakan logik','Use logic',language)}</span></div>
 </div>;
}
// useLanguage is a hook: keep it at component top-level, not in loops/branches.
function LevelOutcome({won,onNext,restart,hasNext,lang}:{won:boolean;onNext:()=>void;restart:()=>void;hasNext:boolean;lang:string}) {
 if(!won)return null;
 return <div role="status" className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3"><div className="flex gap-2 items-center font-extrabold text-emerald-800"><Trophy size={23}/>{copy('Tahniah! Pintu berjaya dibuka!','Amazing! You opened the door!',lang)}</div><div className="flex flex-wrap gap-2"><button className={primary} onClick={onNext}>{hasNext?copy('Tahap seterusnya','Next level',lang):copy('Main dari awal','Play from start',lang)} <ArrowRight size={16}/></button><button className={secondary} onClick={restart}><RotateCcw size={16}/>{copy('Main semula','Replay',lang)}</button></div></div>;
}
function DirectionPad({move,disabled=false,mobile=false,language}:{move:(direction:Direction)=>void;disabled?:boolean;mobile?:boolean;language:string}){
 const control=(direction:Direction,Icon:typeof ArrowUp,label:string)=> <button type="button" key={direction} onClick={()=>move(direction)} disabled={disabled} aria-label={`${copy('Gerak','Move',language)} ${label}`} className="arcade-direction-button arcade-control" ><Icon size={24} strokeWidth={3}/></button>;
 return <div className={`arcade-direction-pad ${mobile?'arcade-direction-pad-mobile':'arcade-direction-pad-desktop'}`} aria-label={copy('Kawalan robot','Robot controls',language)}>
  <span/>{control('up',ArrowUp,copy('atas','up',language))}<span/>
  {control('left',ArrowLeft,copy('kiri','left',language))}{control('down',ArrowDown,copy('bawah','down',language))}{control('right',ArrowRight,copy('kanan','right',language))}
 </div>;
}
function CodeMaze({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}) {
 const {language}=useLanguage(),{progress,recordBest,total,logEvent}=useLearningExtras();
 const [index,setIndex]=useState(initialLevel),level=MAZE_LEVELS[index],meta=parseMaze(level);
 const [player,setPlayer]=useState<Point>(meta.start),[stars,setStars]=useState<string[]>([]),[steps,setSteps]=useState(0),[won,setWon]=useState(false),[notice,setNotice]=useState(''),[showTip,setShowTip]=useState(false);
 const score=mazeScore(stars.length,steps,won);
 const reset=()=>{setPlayer(meta.start);setStars([]);setSteps(0);setWon(false);setNotice('');setShowTip(false)};
 const choose=(i:number)=>{setIndex(i);const next=parseMaze(MAZE_LEVELS[i]);setPlayer(next.start);setStars([]);setSteps(0);setWon(false);setNotice('');setShowTip(false)};
 const move=(dir:Direction)=>{if(won)return;const result=advanceMaze(level,player,stars,steps,dir);if(result.hitWall){setNotice(copy('Ups! Ada dinding. Cuba laluan lain.','Oops, a wall! Try another path.',language));return;}
   setPlayer(result.position);setStars(result.stars);setSteps(result.steps);
   if(result.won){setWon(true);recordBest(level.id,mazeScore(result.stars.length,result.steps,true));logEvent('win',level.id);setNotice(copy('Pintu terbuka! Hebat!','The door is open! Great job!',language));cheer();}
   else setNotice(result.stars.length>stars.length?copy('+25 XP! Bintang dikumpul!','+25 XP! Star collected!',language):'');
 };
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{const directions:Record<string,Direction>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
 if(directions[e.key]&&!['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)){e.preventDefault();move(directions[e.key]);}};
 window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);});
 return <div className="arcade-game-page max-w-6xl mx-auto space-y-4 sm:space-y-5"><Top title="Code Maze" sub={copy('Gerakkan Ciko, kumpul bintang dan cari pintu keluar.','Move Ciko, collect stars and find the exit door.',language)} onBack={onBack} score={total} tag={copy('Permainan gerakan','Movement adventure',language)}/>
 <LevelStrip count={MAZE_LEVELS.length} index={index} completed={i=>progress.completed.includes(MAZE_LEVELS[i].id)} onChoose={choose}/>
 <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-5"><div className="space-y-4"><MazeBoard level={level} player={player} stars={stars}/><div className="md:hidden"><LevelOutcome won={won} lang={language} hasNext={index<MAZE_LEVELS.length-1} onNext={()=>choose(index<MAZE_LEVELS.length-1?index+1:0)} restart={reset}/></div><CharacterBubble emoji="🤖" name="Ciko" text={copy('Mari bergerak satu petak demi satu petak. Kumpul semua bintang kalau boleh!',`Let's move one square at a time. Try collecting every star!`,language)}/></div>
 <section className={`${panel} p-4 sm:p-6 space-y-4 arcade-kid-card`}><div><div className="text-xs text-indigo-600 font-black uppercase">{copy('Tahap','Level',language)} {index+1}/{MAZE_LEVELS.length}</div><h2 className="font-extrabold text-lg text-slate-900">{t(level.name,language)}</h2><p className="text-sm text-slate-500">{t(level.topic,language)}</p></div>
 <MissionCard emoji="🗺️" title={copy('Misi kamu','Your mission',language)} items={[copy('Gerakkan robot ke pintu keluar.','Move the robot to the exit door.',language),copy('Kutip bintang untuk tambah skor.','Collect stars to increase your score.',language),copy('Gunakan langkah sesikit mungkin.','Use as few steps as possible.',language)]} tone="indigo"/>
 <MiniStats stars={stars} steps={steps} score={score} best={progress.scores[level.id]||0} lang={language}/>
 <div className="hidden md:flex flex-col items-center"><p className="text-xs font-semibold text-slate-500 mb-3">{copy('Tekan anak panah untuk bergerak','Tap arrows to move',language)}</p><DirectionPad move={move} disabled={won} language={language}/></div>
 <p aria-live="polite" className="text-center text-sm font-semibold text-indigo-700 min-h-5">{notice}</p>
 {!won&&<div className="flex flex-wrap justify-between gap-2"><button onClick={()=>setShowTip(v=>!v)} className={secondary}><Lightbulb size={16}/>{copy('Petunjuk','Hint',language)}</button><button onClick={reset} className={secondary}><RotateCcw size={16}/>{copy('Mula semula','Restart',language)}</button></div>}
 {showTip&&<div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3 text-sm">{t(level.tip,language)}</div>}
 <LevelOutcome won={won} lang={language} hasNext={index<MAZE_LEVELS.length-1} onNext={()=>choose(index<MAZE_LEVELS.length-1?index+1:0)} restart={reset}/></section></div><div className="arcade-mobile-pad-spacer md:hidden"/><div className="arcade-mobile-gamebar md:hidden"><div className="arcade-mobile-gamebar-label"><span>🤖 {copy('Gerak robot','Move robot',language)}</span><strong>⭐ {score} XP</strong></div><DirectionPad move={move} disabled={won} mobile language={language}/></div></div>;
}
function errorMessage(error:unknown,language:string) {
 if(!(error instanceof CommandError))return copy('Tidak dapat membaca kod.','Could not read the code.',language);
 const kinds:Record<string,LocalText>={
  unknown:{ms:'Gunakan hanya move_up(), move_down(), move_left(), move_right(), atau gelung for.',en:'Use only move_up(), move_down(), move_left(), move_right(), or a for loop.'},
  indent:{ms:'Semak jarak pada permulaan baris. Gunakan 4 ruang dalam gelung.',en:'Check the start of the line. Use 4 spaces inside a loop.'},
  range:{ms:'Bilangan ulang mestilah dari 1 hingga 20.',en:'Repeat count must be between 1 and 20.'},
  empty_loop:{ms:'Tulis arahan berinden di bawah gelung for.',en:'Write an indented command below the for loop.'},
  nested:{ms:'Gunakan tidak lebih dua gelung bersarang.',en:'Use no more than two nested loops.'},
  too_many_steps:{ms:'Terlalu banyak langkah. Cuba kod lebih pendek.',en:'Too many movement steps. Try a shorter program.'},
  too_many_lines:{ms:'Terlalu banyak baris kod.',en:'Too many lines of code.'},
  too_long:{ms:'Kod terlalu panjang.',en:'Your code is too long.'},
  empty:{ms:'Tulis satu arahan untuk bermula.',en:'Write a command to get started.'},
 };
 return `${copy('Baris','Line',language)} ${error.line}: ${t(kinds[error.kind]||kinds.unknown,language)}`;
}
function initialCode(i:number,language:string) {
 if(i===0)return `${copy('# Tolong robot cari pintu','# Help the robot find the door',language)}\nmove_right()\nmove_right()`;
 if(i===2)return `${copy('# Gunakan gelung untuk mengulang arahan','# Use a loop to repeat a command',language)}\nfor i in range(3):\n    move_right()`;
 return `${copy('# Cari pintu dengan kod Python ringkas','# Find the door with simple Python-style code',language)}\nmove_right()`;
}
function CodeEscape({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}) {
 const {language}=useLanguage(),{progress,recordBest,total,logEvent}=useLearningExtras();
 const [index,setIndex]=useState(initialLevel),level=ESCAPE_LEVELS[index],meta=parseMaze(level);
 const [mobileView,setMobileView]=useState<'map'|'code'>('map');
 const [source,setSource]=useState(()=>initialCode(initialLevel,language)),[frames,setFrames]=useState<MazeFrame[]|null>(null),[frameIndex,setFrameIndex]=useState(0),[running,setRunning]=useState(false),[feedback,setFeedback]=useState(''),[showTip,setShowTip]=useState(false),[showExample,setShowExample]=useState(false),[speed,setSpeed]=useState(300);
 const activeFrame=frames?.[frameIndex]||{position:meta.start,stars:[],steps:0,line:0,hitWall:false,won:false};
 const reset=()=>{setFrames(null);setFrameIndex(0);setRunning(false);setFeedback('');setShowTip(false);setShowExample(false)};
 const choose=(i:number)=>{setIndex(i);setSource(initialCode(i,language));setMobileView('map');reset()};
 useEffect(()=>{if(!running||!frames)return;
 if(frameIndex===frames.length-1){setRunning(false);const final=frames[frameIndex];if(final.won){recordBest(level.id,mazeScore(final.stars.length,final.steps,true));logEvent('win',level.id);setFeedback(copy('Hebat! Kod kamu berjaya membuka pintu!','Well done! Your code opened the door!',language));cheer();}
 else if(final.hitWall)setFeedback(`${copy('Robot terlanggar dinding pada baris','Robot hit a wall at line',language)} ${final.line}. ${copy('Cuba ubah arahan.','Try changing the command.',language)}`);
 else setFeedback(copy('Robot belum sampai ke pintu. Tambahkan arahan.','Robot has not reached the door. Add more commands.',language));return;}
 const timeout=window.setTimeout(()=>setFrameIndex(v=>v+1),speed);return()=>window.clearTimeout(timeout);
 },[running,frames,frameIndex,level.id,recordBest,language,speed,logEvent]);
 function run(){if(running)return;logEvent('attempt',level.id);setFeedback('');try{const commands=compileMazeCommands(source);const result=simulateMazeCode(level,commands);setFrames(result);setFrameIndex(0);setMobileView('map');setRunning(true);}catch(e){reset();setFeedback(errorMessage(e,language));}}
 const path=shortestPath(level,meta.start,meta.door)||[];
 const sample=path.map(dir=>`move_${dir}()`).join('\n');
 const score=mazeScore(activeFrame.stars.length,activeFrame.steps,activeFrame.won);
 return <div className="arcade-game-page max-w-6xl mx-auto space-y-4 sm:space-y-5"><Top title="Code-to-Escape" sub={copy('Tulis kod untuk menggerakkan robot dan membuka pintu!','Write code to move the robot and unlock the door!',language)} onBack={onBack} score={total} tag={copy('Pengembaraan menulis kod','Write-to-move challenge',language)}/>
 <LevelStrip count={ESCAPE_LEVELS.length} index={index} completed={i=>progress.completed.includes(ESCAPE_LEVELS[i].id)} onChoose={choose}/>
 <div className="arcade-escape-toggle lg:hidden" role="tablist" aria-label={copy('Paparan permainan','Game view',language)}><button role="tab" aria-selected={mobileView==='map'} onClick={()=>setMobileView('map')} className={mobileView==='map'?'selected':''}><MapIcon size={17}/>{copy('Peta','Map',language)}</button><button role="tab" aria-selected={mobileView==='code'} onClick={()=>setMobileView('code')} className={mobileView==='code'?'selected':''}><Keyboard size={17}/>{copy('Kod saya','My code',language)}</button></div>
 <div className="grid lg:grid-cols-2 gap-5"><div className={`space-y-4 ${mobileView==='code'?'hidden lg:block':''}`}><MazeBoard level={level} player={activeFrame.position} stars={activeFrame.stars} theme="violet"/>
  <div className="lg:hidden space-y-3"><label className="flex items-center gap-3 text-xs font-bold text-slate-600">{copy('Kelajuan robot','Robot speed',language)}<select disabled={running} value={speed} onChange={e=>setSpeed(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2 bg-white"><option value={170}>Fast</option><option value={300}>Normal</option><option value={550}>Slow</option></select></label><div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">{copy('Arahan sedang dijalankan','Executing line',language)}: {running?activeFrame.line||1:'—'}</div>
 <p role="status" aria-live="polite" className={`text-sm font-bold px-3 ${activeFrame.won?'text-emerald-700':'text-indigo-700'}`}>{running?`${copy('Robot sedang bergerak','Robot is moving',language)}...`:feedback}</p>
  <LevelOutcome won={!!activeFrame.won&&!running} lang={language} hasNext={index<ESCAPE_LEVELS.length-1} onNext={()=>choose(index<ESCAPE_LEVELS.length-1?index+1:0)} restart={reset}/>
  {!activeFrame.won&&<button className="arcade-map-edit" onClick={()=>setMobileView('code')}><Code2 size={18}/>{copy('Tulis atau ubah kod','Write or edit code',language)}<ArrowRight size={18}/></button>}</div><CharacterBubble emoji="🚪" name="Code Mission" text={copy('Tulis arahan untuk bantu robot mencari pintu. Kamu boleh guna arahan pergerakan atau gelung for.','Write commands to help the robot reach the door. You can use movement commands or a for loop.',language)}/>
  <div className={`${panel} p-4 space-y-3 arcade-kid-card`}><h2 className="text-sm font-extrabold text-slate-900">{copy('Panduan arahan','Movement guide',language)}</h2><div className="grid grid-cols-2 gap-2">{(['right','down','left','up'] as Direction[]).map(dir=><button key={dir} onClick={()=>{setSource(prev=>prev+'\n'+`move_${dir}()`);setFeedback('')}} disabled={running} className="arcade-command-chip rounded-xl p-3 font-mono text-xs text-indigo-800 font-bold hover:bg-indigo-100">move_{dir}()</button>)}</div><p className="text-xs text-slate-500">{copy('Tekan arahan untuk menambahkannya ke kod. Gelung: for i in range(3):','Tap a command to add it. Loops: for i in range(3):',language)}</p></div></div>
 <section className={`${panel} p-4 sm:p-6 space-y-4 arcade-kid-card ${mobileView==='map'?'hidden lg:block':''}`}><div><div className="font-black uppercase text-indigo-600 tracking-widest text-xs">{copy('Tahap','Level',language)} {index+1}/{ESCAPE_LEVELS.length}</div><h2 className="font-extrabold text-xl text-slate-900 mt-1">{t(level.name,language)}</h2><p className="text-slate-500 text-sm">{t(level.topic,language)}</p></div>
 <MissionCard emoji="⌨️" title={copy('Cabaran kod','Code challenge',language)} items={[copy('Tulis kod yang selamat dan ringkas.','Write code that is short and safe.',language),copy('Jalankan kod untuk animasi pergerakan robot.','Run the code to animate the robot.',language),copy('Buka pintu untuk dapat skor tinggi.','Open the door for a high score.',language)]} tone="violet"/>
 <MiniStats stars={activeFrame.stars} steps={activeFrame.steps} score={score} best={progress.scores[level.id]||0} lang={language}/>
 <div className="arcade-codepanel rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"><div className="flex items-center justify-between px-4 py-3 border-b border-slate-700"><span className="flex items-center gap-2 text-xs text-sky-200 font-bold"><Terminal size={15}/> main.py</span><span className="text-[11px] text-slate-400">Python-style commands</span></div><textarea value={source} disabled={running} onChange={e=>{setSource(e.target.value);setFeedback('')}} spellCheck={false} aria-label="Code editor for maze commands" className="w-full min-h-[205px] resize-y bg-slate-950 text-emerald-200 p-4 font-mono text-sm leading-7 outline-none focus:ring-2 focus:ring-sky-400" autoCapitalize="off" autoCorrect="off"/></div>
 <div className="flex flex-wrap gap-2"><button onClick={run} disabled={running} className={`${primary} flex-1`}><Play size={18} fill="currentColor"/>{running?copy('Robot sedang bergerak...','Robot is moving...',language):copy('Jalankan kod','Run code',language)}</button><button onClick={reset} className={secondary} aria-label={copy('Set semula animasi','Reset animation',language)}><RotateCcw size={17}/></button></div>
 <p role="status" aria-live="polite" className={`text-sm font-semibold min-h-6 ${activeFrame.won?'text-emerald-700':'text-rose-700'}`}>{feedback|| (running?`${copy('Sedang menjalankan baris','Running line',language)} ${activeFrame.line||1}...`:'')}</p>
 <div className="flex flex-wrap gap-2"><button onClick={()=>setShowTip(v=>!v)} className={secondary}><Lightbulb size={16}/>{copy('Petunjuk','Hint',language)}</button><button onClick={()=>setShowExample(v=>!v)} className={secondary}><Code2 size={16}/>{copy('Contoh penyelesaian','Example solution',language)}</button></div>
 {showTip&&<div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-900">{t(level.tip,language)}</div>}
 {showExample&&<div className="bg-slate-100 rounded-xl p-3 text-sm text-slate-700 space-y-2"><p className="font-bold">{copy('Satu jalan yang boleh dicuba:','One route you can try:',language)}</p><pre className="text-xs whitespace-pre-wrap break-all font-mono">{sample}</pre><button className="text-indigo-700 text-xs font-black underline" onClick={()=>{setSource(sample);reset()}}>{copy('Masukkan ke editor','Insert into editor',language)}</button></div>}
 <LevelOutcome won={!!activeFrame.won&&!running} lang={language} hasNext={index<ESCAPE_LEVELS.length-1} onNext={()=>choose(index<ESCAPE_LEVELS.length-1?index+1:0)} restart={reset}/>
 </section></div></div>;
}
function BugDetective({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}) {
 const {language}=useLanguage(),{progress,recordBest,total,logEvent}=useLearningExtras();
 const [index,setIndex]=useState(initialLevel),task=DETECTIVE_CASES[index];
 const [answer,setAnswer]=useState<number|null>(null),[mistakes,setMistakes]=useState(0),[hint,setHint]=useState(false);
 const correct=answer===task.answer;const won=progress.completed.filter(x=>DETECTIVE_CASES.some(y=>y.id===x)).length;
 const choose=(i:number)=>{setIndex(i);setAnswer(null);setMistakes(0);setHint(false)};
 function chooseAnswer(i:number){if(correct)return;setAnswer(i);if(i===task.answer){recordBest(task.id,Math.max(40,100-mistakes*20));logEvent('win',task.id);cheer();}else setMistakes(v=>v+1);}
 return <div className="arcade-game-page max-w-5xl mx-auto space-y-4 sm:space-y-5"><Top title="Bug Detective" sub={copy('Baca kod, cari masalah dan selesaikan kes!','Read the code, spot the problem and solve the case!',language)} onBack={onBack} score={total}/><LevelStrip count={DETECTIVE_CASES.length} index={index} completed={i=>progress.completed.includes(DETECTIVE_CASES[i].id)} onChoose={choose}/>
 <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-5"><section className={`${panel} p-5 sm:p-7 space-y-4 arcade-kid-card`}><div className="flex justify-between items-center"><span className="text-amber-700 font-black uppercase text-xs">{copy('Kes','Case',language)} {index+1}/{DETECTIVE_CASES.length}</span><span className="text-xs font-bold text-slate-500">🔍 {won}/{DETECTIVE_CASES.length}</span></div><div className="arcade-context-art rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-50 text-center"><img src={gameArt.detective} alt="" className="w-full h-[115px] sm:h-[170px] object-cover" loading="lazy"/><p className="px-4 pb-3 pt-2 text-sm font-bold text-amber-900">{copy('Misi: Siasat kod yang rosak','Mission: Investigate broken code',language)}</p></div><CharacterBubble emoji="🔎" name="Bug Detective" text={copy('Baca kod di bawah, fikirkan masalahnya, kemudian pilih jawapan yang paling betul.','Read the code below, think about the problem, then choose the best answer.',language)}/><div className="bg-slate-950 text-sky-200 rounded-2xl p-4 overflow-x-auto"><div className="text-[11px] text-slate-400 mb-3">broken_code.py</div>{task.code.split('\n').map((line,i)=><div key={i} className="font-mono text-xs sm:text-sm whitespace-pre leading-7"><span className="text-slate-500 inline-block w-7 select-none">{i+1}</span>{line}</div>)}</div><button onClick={()=>setHint(v=>!v)} className={secondary}><Lightbulb size={16}/>{copy('Petunjuk kecil','Small hint',language)}</button>{hint&&<p className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">{t(task.tip,language)}</p>}</section>
 <section className={`${panel} p-5 sm:p-7 space-y-4 arcade-kid-card`}><MissionCard emoji="🏅" title={copy('Cara dapat skor','How to score',language)} items={[copy('Pilih jawapan yang betul.','Choose the correct answer.',language),copy('Kurangkan percubaan salah untuk dapat lebih XP.','Make fewer mistakes to earn more XP.',language),copy('Teruskan ke kes seterusnya bila selesai.','Move to the next case when solved.',language)]} tone="amber"/><h2 className="text-lg font-extrabold text-slate-900">{t(task.question,language)}</h2><div className="space-y-3">{task.options.map((option,i)=><button key={i} disabled={correct} onClick={()=>chooseAnswer(i)} className={`arcade-choice w-full text-left flex items-center gap-3 rounded-2xl p-4 border text-sm font-bold transition-all ${answer===i?(correct?'border-emerald-400 bg-emerald-50 text-emerald-900':'border-rose-300 bg-rose-50 text-rose-900'):'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'}`}><span className="bg-white border border-slate-200 w-8 h-8 shrink-0 rounded-xl flex justify-center items-center">{String.fromCharCode(65+i)}</span>{t(option,language)}</button>)}</div>
 {answer!==null&&<div role="status" className={`rounded-2xl p-4 flex gap-2 items-start text-sm font-semibold ${correct?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-900'}`}>{correct?<CheckCircle2 size={20}/>:<Lightbulb size={20}/>}<div>{correct?`${copy('Kes selesai!','Case solved!',language)} +${Math.max(40,100-mistakes*20)} XP. ${t(task.reason,language)}`:`${copy('Belum tepat. Cuba lagi!','Not quite. Try again!',language)} ${t(task.tip,language)}`}</div></div>}
 <div className="flex justify-between items-center gap-2"><div className="text-xs text-slate-500">{copy('Rekod terbaik','Best score',language)}: <b>{progress.scores[task.id]||0} XP</b></div><button disabled={!correct} onClick={()=>choose(index<DETECTIVE_CASES.length-1?index+1:0)} className={primary}>{index===DETECTIVE_CASES.length-1?copy('Kes pertama','First case',language):copy('Kes seterusnya','Next case',language)}<ChevronRight size={17}/></button></div></section></div></div>;
}
function LogicBuilder({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}) {
 const {language}=useLanguage(),{progress,recordBest,total,logEvent}=useLearningExtras();
 const [index,setIndex]=useState(initialLevel),task=LOGIC_LEVELS[index];
 const [order,setOrder]=useState<number[]>(task.shuffled),[status,setStatus]=useState<'correct'|'wrong'|null>(null),[mistakes,setMistakes]=useState(0),[drag,setDrag]=useState<number|null>(null),[showHint,setShowHint]=useState(false);
 const change=(from:number,to:number)=>{if(from===to||from<0||to<0||to>=order.length)return;setOrder(prev=>{const arr=[...prev];const [item]=arr.splice(from,1);arr.splice(to,0,item);return arr});setStatus(null)};
 const choose=(i:number)=>{setIndex(i);setOrder(LOGIC_LEVELS[i].shuffled);setStatus(null);setMistakes(0);setShowHint(false)};
 const check=()=>{const ok=order.every((v,i)=>v===i);setStatus(ok?'correct':'wrong');if(ok){recordBest(task.id,Math.max(60,120-20*mistakes));logEvent('win',task.id);cheer();}else setMistakes(v=>v+1)};
 return <div className="arcade-game-page max-w-5xl mx-auto space-y-4 sm:space-y-5"><Top title="Logic Builder" sub={copy('Susun blok kod, bina logik dan kumpul mata!','Arrange code blocks, build logic and earn points!',language)} onBack={onBack} score={total}/><LevelStrip count={LOGIC_LEVELS.length} index={index} completed={i=>progress.completed.includes(LOGIC_LEVELS[i].id)} onChoose={choose}/>
 <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-5"><section className={`${panel} p-5 sm:p-6 space-y-4 arcade-kid-card`}><div className="arcade-context-art rounded-2xl overflow-hidden"><img src={gameArt.logic} alt="" className="w-full h-[112px] sm:h-[175px] object-cover" loading="lazy"/></div><div><div className="text-xs font-black uppercase text-violet-700">{copy('Teka-teki','Puzzle',language)} {index+1}/{LOGIC_LEVELS.length}</div><h2 className="text-lg font-extrabold text-slate-900 mt-2">{t(task.question,language)}</h2></div><MissionCard emoji="🧠" title={copy('Misi logik','Logic mission',language)} items={[copy('Susun langkah mengikut turutan yang betul.','Put the steps in the correct order.',language),copy('Seret blok atau guna anak panah.','Drag blocks or use the arrows.',language),copy('Semak jawapan untuk kumpul XP.','Check your answer to earn XP.',language)]} tone="emerald"/><button onClick={()=>setShowHint(v=>!v)} className={secondary}><Lightbulb size={16}/>{copy('Petunjuk','Hint',language)}</button>{showHint&&<p className="bg-amber-50 rounded-xl p-3 text-sm text-amber-900">{t(task.hint,language)}</p>}<p className="text-xs text-slate-500">{copy('Rekod terbaik','Best score',language)}: <b>{progress.scores[task.id]||0} XP</b></p></section>
 <section className={`${panel} p-4 sm:p-6 space-y-4 arcade-kid-card`}><div className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><GripVertical size={17} className="text-violet-500"/>{copy('Susunan kod kamu','Your code order',language)}</div>
 <div className="space-y-2">{order.map((lineIndex,i)=><div key={lineIndex} draggable onDragStart={()=>setDrag(i)} onDragEnd={()=>setDrag(null)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag!==null)change(drag,i);setDrag(null)}} className="arcade-choice bg-violet-50 border border-violet-200 rounded-xl flex gap-2 items-center p-3 sm:p-4"><span className="w-6 h-6 bg-white border rounded-lg flex justify-center items-center text-violet-600 font-bold text-xs shrink-0">{i+1}</span><code className="flex-1 text-xs sm:text-sm whitespace-pre-wrap break-words font-mono text-slate-800 min-w-0">{task.lines[lineIndex]}</code><div className="flex flex-col gap-1"><button onClick={()=>change(i,i-1)} disabled={i===0} aria-label="Move line up" className="bg-white rounded-lg p-1.5 border disabled:opacity-30"><ArrowUp size={16}/></button><button onClick={()=>change(i,i+1)} disabled={i===order.length-1} aria-label="Move line down" className="bg-white rounded-lg p-1.5 border disabled:opacity-30"><ArrowDown size={16}/></button></div></div>)}</div>
 {status&&<div role="status" className={`rounded-xl p-4 text-sm font-semibold ${status==='correct'?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-900'}`}>{status==='correct'?`${copy('Bagus!','Well done!',language)} +${Math.max(60,120-mistakes*20)} XP. ${t(task.reason,language)}`:copy('Cuba lagi! Periksa arahan yang perlu dijalankan dahulu.','Try again! Which instruction should run first?',language)}</div>}
 <div className="flex flex-wrap justify-between gap-2"><button className={secondary} onClick={()=>{setOrder(task.shuffled);setStatus(null)}}><RotateCcw size={16}/>{copy('Set semula','Reset',language)}</button><div className="flex flex-wrap gap-2"><button className={primary} onClick={check} disabled={status==='correct'}><Check size={17}/>{copy('Semak jawapan','Check answer',language)}</button>{status==='correct'&&<button className={primary} onClick={()=>choose(index<LOGIC_LEVELS.length-1?index+1:0)}>{copy('Seterusnya','Next',language)}<ArrowRight size={16}/></button>}</div></div></section></div></div>;
}
export function ArcadeView(){
 const {language}=useLanguage();const {setActiveTab}=useApp();const {progress,total}=useLearningExtras();
 const [launch,setLaunch]=useState<{mode:Mode;level:number}>(()=>{
   const fallback:{mode:Mode;level:number}={mode:'home',level:0};
   try{
     const saved=JSON.parse(sessionStorage.getItem('ciliklab_arcade_launch')||'null');
     if(!saved||typeof saved.mode!=='string'||!Number.isInteger(saved.level)||saved.level<0)return fallback;
     const world=WORLDS.find(w=>w.id===saved.mode);
     if(world&&saved.level<world.ids.length)return {mode:world.id as Mode,level:saved.level};
     if(['home','world','creator','achievements','insights','quests','coach'].includes(saved.mode))return {mode:saved.mode as Mode,level:0};
   }catch{}
   return fallback;
 });
 const enter=(mode:Mode,level=0)=>{const next={mode,level};try{sessionStorage.setItem('ciliklab_arcade_launch',JSON.stringify(next))}catch{}setLaunch(next)};
 const back=()=>enter('home');
 const nextGame=():{id:ArcadeGame;index:number}=>{
  for(const w of WORLDS){const i=w.ids.findIndex(id=>!progress.completed.includes(id));if(i>=0)return {id:w.id as ArcadeGame,index:i};}
  return {id:'maze',index:0};
 };
 const next=nextGame();
 if(launch.mode==='maze')return <CodeMaze key={`maze-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='escape')return <CodeEscape key={`escape-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='detective')return <BugDetective key={`detective-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='logic')return <LogicBuilder key={`logic-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='space')return <SpaceInvaders key={`space-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='pixel')return <PixelPainter key={`pixel-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='sort')return <TreasureSorter key={`sort-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='garden')return <LoopGarden key={`garden-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='melody')return <MelodyMachine key={`melody-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='bridge')return <BridgeBuilder key={`bridge-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='rescue')return <RobotRescue key={`rescue-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='story')return <CikoStoryQuest key={`story-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='circuit')return <SparkCircuit key={`circuit-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='pet')return <CikoPetLab key={`pet-${launch.level}`} initialLevel={launch.level} onBack={back}/>;
 if(['football','basketball','track'].includes(launch.mode))return <SportsArena key={`${launch.mode}-${launch.level}`} sport={launch.mode as 'football'|'basketball'|'track'} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='cipher'||launch.mode==='fossil')return <ChallengeLab key={`${launch.mode}-${launch.level}`} mode={launch.mode} initialLevel={launch.level} onBack={back}/>;
 if(launch.mode==='coach')return <CikoLearningCoach onBack={back} onGame={(game,index)=>enter(game,index)}/>;
 if(launch.mode==='quests')return <QuestBoard onBack={back} onGame={(game,index)=>enter(game,index)} onCreator={()=>enter('creator')} onWorld={()=>enter('world')}/>;
 if(launch.mode==='world')return <AdventureMap onBack={back} onGame={(game,index)=>enter(game,index)}/>;
 if(launch.mode==='creator')return <MazeCreator onBack={back}/>;
 if(launch.mode==='achievements')return <Achievements onBack={back}/>;
 if(launch.mode==='insights')return <ArcadeInsights onBack={back}/>;
 return <ArcadeHome onOpen={(mode,level=0)=>enter(mode as Mode,level)} onCiko={()=>setActiveTab('ciko_assistant')}/>;
}
