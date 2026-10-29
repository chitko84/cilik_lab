import React,{useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,ChevronRight,Lightbulb,RotateCcw,Star,Trophy,Volume2} from 'lucide-react';
import {useLanguage} from '../../../context/LanguageContext';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import {SPORTS,SPORT_LEVELS,sportEventText,evaluateSport} from './sportsEngine';
import type{SportId} from './sportsEngine';
import './sportsArena.css';
import {sportLocalized} from './sportsTranslations';
import {localizedGameTitle,translatePair} from '../../../locales/contentTranslations';
export function SportsArena({sport,initialLevel=0,onBack}:{sport:SportId;initialLevel?:number;onBack:()=>void}){
 const {language,locale}=useLanguage(),ms=language==='ms';
 const tr=sportLocalized(locale,sport);const {progress,recordBest,logEvent}=useLearningExtras();
 const levels=SPORT_LEVELS[sport],info=SPORTS[sport];
 const [index,setIndex]=useState(Math.max(0,Math.min(levels.length-1,initialLevel)));
 const [answers,setAnswers]=useState<string[]>([]);const [checked,setChecked]=useState(false);const [hints,setHints]=useState(0);
 const level=levels[index],result=evaluateSport(level,answers),won=checked&&result.passed;
 const lastMove=answers[answers.length-1]||'ready';
 const position=Math.min(77,11+answers.length*Math.min(12,66/Math.max(3,level.steps.length)));
 const moveNumber=answers.length;
 const gameTitle=localizedGameTitle(sport,ms?info.msTitle:info.title,locale);
 const selectLevel=(n:number)=>{setIndex(n);setAnswers([]);setChecked(false);setHints(0)};
 useEffect(()=>{setAnswers([]);setChecked(false);setHints(0)},[sport]);
 const select=(action:string)=>{setChecked(false);setAnswers(a=>a.length>=level.steps.length?a:[...a,action])};
 const check=()=>{setChecked(true);if(result.passed){const score=Math.max(30,level.reward-hints*8);recordBest(level.id,score);logEvent('win',level.id)}else logEvent('attempt',level.id)};
 const hint=()=>{if(answers.length>=level.steps.length)return;setHints(n=>n+1);logEvent('hint',level.id)};
 return <main className="sports-arena">
  <div className="sports-backline"><button onClick={onBack}><ArrowLeft size={17}/> {translatePair('Kembali ke Arcade','Back to Arcade',locale)}</button><span>{info.emoji} {gameTitle}</span></div>
  <header className="sports-hero"><div><span className="sports-eyebrow">CILIK SPORTS · {tr.ui(0)}</span><h1>{gameTitle}</h1><p>{tr.intro}</p><div className="sports-progress-summary"><Trophy size={17}/>{levels.filter(l=>progress.completed.includes(l.id)).length} / 12 {tr.ui(4)}</div></div><img src={info.art} alt=""/></header>
  <nav className="sports-levels" aria-label="Choose sports challenge">{levels.map((l,i)=><button key={l.id} type="button" onClick={()=>selectLevel(i)} className={`${i===index?'active':''} ${progress.completed.includes(l.id)?'done':''}`} aria-current={i===index?'step':undefined}><span>{progress.completed.includes(l.id)?'✓':i+1}</span><small>{tr.ui(i<4?6:i<8?7:8)}</small></button>)}</nav>
  <div className="sports-main-grid"><section className="sports-story-panel"><div className="sports-panel-title"><span>{tr.ui(0)} {index+1} / 12</span><strong>{ms?level.msTitle:`${tr.ui(0)} ${index+1}`} </strong></div><p>{tr.ui(1)}</p>
   <div className="sports-scenes"><h2>{tr.ui(3)}</h2>{level.steps.map((expected,i)=><div className={`sports-scene ${i===answers.length?'current':''} ${answers[i]===expected?'right':''} ${checked&&answers[i]!==expected?'wrong':''}`} key={i}><b>{String(i+1).padStart(2,'0')}</b><div><p>{tr.scene(expected,sportEventText(sport,expected))}</p><small>{answers[i]?`${SPORTS[sport].actions.find(a=>a.id===answers[i])?.emoji} ${tr.action(answers[i],SPORTS[sport].actions.find(a=>a.id===answers[i])?.label||'')}`:ms?'Pilih tindakan':'Choose an action'}</small></div>{answers[i]===expected&&<Check size={17}/>}</div>)}</div>
   <div className="sports-tip"><Lightbulb size={18}/><span>{tr.ui(18)}</span></div></section>
   <section className="sports-control-panel"><div className="sports-panel-title"><span>{tr.ui(12)}</span><strong>{tr.ui(2)}</strong></div><div className={`sports-playfield sports-playfield-${sport}`} aria-label="Animated sports action field">
    <div className="sports-field-lines"/>
    <div className="sports-stadium-goal" aria-hidden="true">{sport==='football'?'🥅':sport==='basketball'?'🏀':'🏁'}</div>
    <div className="sports-opponent sports-character" aria-label="Defender">🧑🏿‍🦱<span>🛡️</span></div>
    <div className="sports-teammate sports-character" aria-label="Teammate">👧🏻<span>⭐</span></div>
    <div className="sports-athlete sports-character" style={{left:`${position}%`}} aria-label="Your player"><span className="sports-athlete-face">{sport==='basketball'?'👦🏽':sport==='football'?'🧑🏻':'👧🏾'}</span><span className="sports-athlete-kit">{sport==='basketball'?'7':sport==='football'?'10':'1'}</span></div>
    <div key={`${sport}-${index}-${moveNumber}`} className={`sports-moving-ball sports-ball-${lastMove}`} style={{left:`${lastMove==='shoot'?88:lastMove==='pass'?64:position+8}%`}} aria-label="Moving ball">{sport==='basketball'?'🏀':sport==='football'?'⚽':'💨'}</div>
    {lastMove!=='ready'&&<div key={`action-${index}-${moveNumber}`} className="sports-action-announcement" role="status">{tr.action(lastMove,info.actions.find(a=>a.id===lastMove)?.label||lastMove)}</div>}
    {won&&<div className="sports-goal-burst" role="status">{sport==='football'?'GOAL!':sport==='basketball'?'SCORE!':'FINISH!'}</div>}
    <div className="sports-field-label">{answers.length} / {level.steps.length} {tr.ui(5)}</div>
   </div>
   <div className="sports-action-grid">{info.actions.map(action=><button key={action.id} disabled={answers.length>=level.steps.length||won} onClick={()=>select(action.id)}><span>{action.emoji}</span><strong>{tr.action(action.id,ms?action.ms:action.label)}</strong><small>{tr.scene(action.id,action.explanation)}</small></button>)}</div>
   {hints>0&&answers.length<level.steps.length&&<div className="sports-hint" role="status"><Lightbulb size={18}/>{translatePair('Petunjuk','Hint',locale)}: {tr.action(level.steps[answers.length],SPORTS[sport].actions.find(a=>a.id===level.steps[answers.length])?.label||'')}</div>}
   {checked&&<div role="status" className={`sports-result ${won?'success':'error'}`}>{won?`${tr.ui(9)} +${Math.max(30,level.reward-hints*8)} XP · `:`${result.correct}/${level.steps.length} ${tr.ui(10)}`}</div>}
   <div className="sports-actions"><button className="secondary" onClick={()=>{setAnswers(a=>a.slice(0,-1));setChecked(false)}} disabled={!answers.length}>↶ {tr.ui(13)}</button><button className="secondary" onClick={()=>{setAnswers([]);setChecked(false)}}><RotateCcw size={16}/> {tr.ui(14)}</button><button className="secondary" onClick={hint} disabled={answers.length>=level.steps.length}><Lightbulb size={16}/> {translatePair('Petunjuk','Hint',locale)}</button><button className="primary" onClick={check} disabled={answers.length!==level.steps.length}>{tr.ui(15)} <ChevronRight size={17}/></button></div>
   {won&&<button className="sports-next" onClick={()=>selectLevel((index+1)%levels.length)}>{index===levels.length-1?tr.ui(16):tr.ui(11)} <ArrowRight size={17}/></button>}
   <p className="sports-best"><Star size={15}/> {translatePair('Skor terbaik','Best score',locale)}: {progress.scores[level.id]||0} XP</p></section></div></main>;
}
