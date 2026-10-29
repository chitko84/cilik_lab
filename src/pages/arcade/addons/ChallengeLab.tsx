import React,{useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronRight,Lightbulb,RotateCcw,Star,Trophy} from 'lucide-react';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import {useLanguage} from '../../../context/LanguageContext';
import {CIPHER_LEVELS,PATTERN_LEVELS,checkCipher,checkPattern,decryptMessage,encryptMessage} from './ChallengeLabEngine';
import './challengeLab.css';
import {challengeLevelText,challengeText} from './challengeTranslations';
import {localizedGameTitle} from '../../../locales/contentTranslations';
export function ChallengeLab({mode,onBack,initialLevel=0}:{mode:'cipher'|'fossil';onBack:()=>void;initialLevel?:number}){
 const {language,locale}=useLanguage();const ms=locale==='ms';const ct=(index:number)=>challengeText(locale,index);const {progress,recordBest,logEvent}=useLearningExtras();
 const cipher=mode==='cipher';const levels=cipher?CIPHER_LEVELS:PATTERN_LEVELS;
 const [index,setIndex]=useState(Math.max(0,Math.min(levels.length-1,initialLevel)));
 const [shift,setShift]=useState(0);const [guess,setGuess]=useState<number|null>(null);const [checked,setChecked]=useState(false);const [hints,setHints]=useState(0);
 const level=levels[index];const currentCipher=cipher?CIPHER_LEVELS[index]:null;const currentPattern=!cipher?PATTERN_LEVELS[index]:null;
 const passed=checked&&(currentCipher?checkCipher(currentCipher,shift):currentPattern?checkPattern(currentPattern,guess??NaN):false);
 const title=localizedGameTitle(mode,cipher?'Hero Cipher Academy':'Dinosaur Pattern Park',locale);
 const translatedLevel=challengeLevelText(locale,mode,index,{title:level.title,hint:level.hint});
 const select=(n:number)=>{setIndex(n);setShift(0);setGuess(null);setChecked(false);setHints(0)};
 const check=()=>{setChecked(true);const correct=currentCipher?checkCipher(currentCipher,shift):currentPattern?checkPattern(currentPattern,guess??NaN):false;
 if(correct){recordBest(level.id,Math.max(20,level.xp-hints*10));logEvent('win',level.id)}else logEvent('attempt',level.id)};
 return <main className={`cl32-lab cl32-${mode}`}>
 <button className="cl32-back" onClick={onBack}><ArrowLeft size={17}/>{ct(0)}</button>
 <header className="cl32-hero"><div><span>{cipher?'🔐':'🦕'} {ct(cipher?1:2)}</span><h1>{title}</h1><p>{ct(cipher?3:4)}</p><small><Trophy size={15}/> {levels.filter(l=>progress.completed.includes(l.id)).length} / {levels.length} {ct(5)}</small></div><div className="cl32-emblem" aria-hidden="true">{cipher?'🦸':'🦕'}</div></header>
 <nav className="cl32-levels" aria-label="Select challenge level">{levels.map((l,i)=><button key={l.id} aria-current={index===i?'step':undefined} className={`${index===i?'active':''} ${progress.completed.includes(l.id)?'done':''}`} onClick={()=>select(i)}><b>{progress.completed.includes(l.id)?'✓':i+1}</b><small>{i<4?'1–4':i<8?'5–8':'9–12'}</small></button>)}</nav>
 <div className="cl32-workspace"><section className="cl32-mission"><span className="cl32-kicker">{ct(6)} {index+1} / {levels.length}</span><h2>{translatedLevel.title}</h2><p>{ct(cipher?7:8)}</p>
 {currentCipher?<><div className="cl32-clue"><small>{ct(9)}</small><strong>{encryptMessage(currentCipher.word,currentCipher.shift)}</strong></div><p>{ct(10)}</p></>:<><div className="cl32-sequence">{currentPattern?.sequence.map((x,i)=><span key={i}>{x}</span>)}<span className="cl32-missing">?</span></div><p>{ct(11)}</p></>}
 <div className="cl32-mission-stats"><span><Star size={15}/> {level.xp} XP available</span><span>{ct(24)}: {progress.scores[level.id]||0} XP</span></div></section>
 <section className="cl32-play"><h3>{ct(cipher?12:13)}</h3>{currentCipher?<><div className="cl32-preview"><small>{ct(14)}</small><strong aria-live="polite">{shift?decryptMessage(encryptMessage(currentCipher.word,currentCipher.shift),shift):'— — —'}</strong></div><label className="cl32-shift-label" htmlFor="cl32-shift">{ct(15)}: <b>{shift||ct(16)}</b></label><input id="cl32-shift" className="cl32-slider" type="range" min="0" max="7" step="1" value={shift} onChange={e=>{setShift(Number(e.target.value));setChecked(false)}}/><div className="cl32-shift-buttons">{Array.from({length:7},(_,i)=><button key={i} className={shift===i+1?'active':''} onClick={()=>{setShift(i+1);setChecked(false)}}>{i+1}</button>)}</div></>:<div className="cl32-choices">{currentPattern?.choices.map(choice=><button key={choice} className={guess===choice?'active':''} aria-pressed={guess===choice} onClick={()=>{setGuess(choice);setChecked(false)}}>{choice}</button>)}</div>}
 <div className="cl32-actions"><button onClick={()=>setHints(h=>h+1)}><Lightbulb size={16}/> {ct(17)}</button><button onClick={()=>{setShift(0);setGuess(null);setChecked(false);setHints(0)}}><RotateCcw size={16}/> {ct(18)}</button><button className="cl32-submit" disabled={cipher?!shift:guess===null} onClick={check}>{ct(19)} <ChevronRight size={16}/></button></div>
 {hints>0&&<div className="cl32-hint" role="status"><Lightbulb size={17}/>{translatedLevel.hint}</div>}
 {checked&&<div role="status" className={`cl32-result ${passed?'success':'error'}`}>{passed?<><CheckCircle2 size={19}/> {ct(20)}</>:<>{ct(21)}</>}</div>}
 {passed&&<button className="cl32-next" onClick={()=>select((index+1)%levels.length)}>{ct(index===levels.length-1?22:23)} <ArrowRight size={17}/></button>}
 </section></div></main>;
}
