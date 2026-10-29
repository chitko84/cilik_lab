import {translatePair,localizedCircuitLevel} from '../../../locales/contentTranslations';
import React,{useEffect,useState} from 'react';
import {ArrowLeft,ChevronRight,CheckCircle2,Lightbulb,RotateCcw,Star,Zap} from 'lucide-react';
import confetti from 'canvas-confetti';
import {useLanguage} from '../../../context/LanguageContext';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import {CIRCUIT_LEVELS,rotateTile,circuitWon,poweredCells,circuitScore} from './sparkCircuitEngine';
import type {Tile} from './sparkCircuitEngine';
import './sparkCircuit.css';
const tr=translatePair;
const tileName=(kind:string,locale:import('../../../locales/registry').UILocale)=>kind==='straight'?tr('Wayar lurus','Straight wire',locale):kind==='corner'?tr('Wayar bengkok','Corner wire',locale):tr('Terminal','Terminal',locale);
export function SparkCircuit({onBack,initialLevel=0}:{onBack:()=>void;initialLevel?:number}){
 const {language,locale}=useLanguage();const {progress,recordBest,logEvent,total}=useLearningExtras();
 const [index,setIndex]=useState(Math.max(0,Math.min(CIRCUIT_LEVELS.length-1,initialLevel)));
 const level=CIRCUIT_LEVELS[index];const [tiles,setTiles]=useState<Tile[]>(()=>level.initial.map(t=>({...t})));
 const [moves,setMoves]=useState(0),[hints,setHints]=useState(0),[showHint,setShowHint]=useState(false),[notice,setNotice]=useState('');
 const power=poweredCells(level,tiles),won=circuitWon(level,tiles);
 const changeLevel=(i:number)=>{setIndex(i);setTiles(CIRCUIT_LEVELS[i].initial.map(t=>({...t})));setMoves(0);setHints(0);setShowHint(false);setNotice('');};
 const reset=()=>changeLevel(index);
 const turn=(id:string)=>{if(won)return; const updated=rotateTile(tiles,id);if(updated===tiles)return;setTiles(updated);setMoves(v=>v+1);logEvent('attempt',level.id);if(circuitWon(level,updated)){const score=circuitScore(level,moves+1,hints);recordBest(level.id,score);logEvent('win',level.id);try{confetti({particleCount:65,spread:55,origin:{y:.7},disableForReducedMotion:true});}catch{}setNotice(tr('Hebat! Mentol menyala!','Amazing! You lit the bulb!',locale));}else setNotice('');};
 const clue=()=>{setShowHint(v=>!v);if(!showHint){setHints(v=>v+1);logEvent('hint',level.id);}};
 useEffect(()=>{setTiles(CIRCUIT_LEVELS[index].initial.map(t=>({...t})));},[]);
 const cells=new Map<string,Tile>(tiles.map(t=>[`${t.x},${t.y}`,t] as const));
 return <div className="spark-root">
   <div className="spark-top"><button onClick={onBack} className="spark-back"><ArrowLeft size={18}/>{tr('Semua permainan','All games',locale)}</button><span className="spark-total"><Star size={17} fill="currentColor"/> {total} XP</span></div>
   <div className="spark-hero"><div><span className="spark-kicker">CILIK ARCADE · STEM DISCOVERY</span><h1>⚡ Spark Circuit</h1><p>{tr('Putarkan wayar, sambungkan tenaga dan hidupkan mentol!','Turn the wires, connect the power and light up the bulb!',locale)}</p></div><img src="/arcade/spark-circuit.svg" alt=""/></div>
   <div className="spark-levels" aria-label={tr('Pilih tahap','Choose level',locale)}>{CIRCUIT_LEVELS.map((l,i)=><button key={l.id} onClick={()=>changeLevel(i)} aria-current={i===index?'step':undefined} className={`${i===index?'selected':''} ${progress.completed.includes(l.id)?'finished':''}`}>{progress.completed.includes(l.id)&&i!==index?'✓':i+1}</button>)}</div>
   <div className="spark-columns"><section className="spark-card spark-stage"><div className="spark-sectionhead"><span><Zap size={17}/>{tr('MISI LITAR','CIRCUIT MISSION',locale)} {index+1}/{CIRCUIT_LEVELS.length}</span><h2>{localizedCircuitLevel(level.id,'title',level.title.ms,level.title.en,locale)}</h2></div>
   <div className="spark-board" style={{gridTemplateColumns:`repeat(${level.size},minmax(0,1fr))`}} aria-label={tr('Papan litar interaktif','Interactive circuit board',locale)}>
     {Array.from({length:level.size*level.size},(_,n)=>{const x=n%level.size,y=Math.floor(n/level.size),t=cells.get(`${x},${y}`);if(!t)return <div key={n} className="spark-empty" aria-hidden="true"/>;
     const live=power.has(`${x},${y}`),isSource=n===level.route[0].y*level.size+level.route[0].x,isGoal=n===level.route[level.route.length-1].y*level.size+level.route[level.route.length-1].x;
     return <button key={t.id} className={`spark-tile ${live?'powered':''} ${t.fixed?'fixed':''}`} disabled={t.fixed||won} onClick={()=>turn(t.id)} aria-label={`${tileName(t.kind,locale)}, ${tr('baris','row',locale)} ${y+1}, ${tr('lajur','column',locale)} ${x+1}${t.fixed?`, ${tr('tetap','fixed',locale)}`:`, ${tr('putar','rotate',locale)}`}`}>
       <svg viewBox="0 0 100 100" aria-hidden="true"><g transform={`rotate(${t.rotation*90} 50 50)`} stroke="currentColor" strokeWidth="17" strokeLinecap="round" fill="none">
       {t.kind==='straight'?<path d="M50 1 V99"/>:t.kind==='corner'?<path d="M50 1 V50 H99"/>:<path d="M50 50 V1"/>}
       </g><circle cx="50" cy="50" r="9" fill="currentColor"/></svg>
       {isSource&&<span className="spark-symbol">🔋</span>}{isGoal&&<span className="spark-symbol">{won?'💡':'🔅'}</span>}
     </button>})}
   </div>
   <div className="spark-instruction"><span>🔋 {tr('Bateri','Battery',locale)}</span><span>↻ {tr('Tekan untuk putar','Tap to rotate',locale)}</span><span>💡 {tr('Mentol','Bulb',locale)}</span></div>
   <div className="spark-progress"><span>{tr('Sambungan bertenaga','Powered connections',locale)}: {power.size}/{level.initial.length}</span><div><i style={{width:`${power.size/level.initial.length*100}%`}}/></div></div>
   </section><aside className="spark-card spark-side"><div className="spark-side-icon">💡</div><h2>{tr('Sambungkan semuanya!','Connect the circuit! ',locale)}</h2><p>{tr('Ketuk wayar untuk memutarnya. Wayar perlu bersambung dari bateri sehingga mentol.','Tap a wire to rotate it. Make a connected route from the battery to the bulb.',locale)}</p>
   <div className="spark-stats"><div><small>{tr('Putaran','Rotations',locale)}</small><strong>{moves}</strong></div><div><small>{tr('Rekod terbaik','Best score',locale)}</small><strong>{progress.scores[level.id]||0} XP</strong></div></div>
   <div className="spark-actions"><button onClick={clue}><Lightbulb size={17}/>{tr('Petunjuk','Hint',locale)}</button><button onClick={reset}><RotateCcw size={17}/>{tr('Mula semula','Restart',locale)}</button></div>
   {showHint&&<div className="spark-hint">{localizedCircuitLevel(level.id,'tip',level.tip.ms,level.tip.en,locale)}</div>}
   <p role="status" aria-live="polite" className="spark-feedback">{notice||tr('Cuba setiap wayar sehingga mentol menyala.','Try each wire until the bulb lights up.',locale)}</p>
   {won&&<div className="spark-win"><CheckCircle2 size={24}/><div><strong>{tr('Tahniah! Litar siap!','Fantastic! Circuit complete!',locale)}</strong><small>{tr('Skor tahap','Level score',locale)}: {circuitScore(level,moves,hints)} XP</small></div><button onClick={()=>changeLevel(index<CIRCUIT_LEVELS.length-1?index+1:0)}>{index<CIRCUIT_LEVELS.length-1?tr('Tahap seterusnya','Next level',locale):tr('Main dari awal','Play again',locale)}<ChevronRight size={16}/></button></div>}
   </aside></div>
 </div>;
}
