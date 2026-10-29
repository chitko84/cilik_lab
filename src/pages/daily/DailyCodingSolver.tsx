import React,{useEffect,useMemo,useState} from 'react';
import {BookOpen,Check,CheckCircle2,ChevronRight,Code2,Flame,Lightbulb,Play,Search,Star,Terminal,Trophy,ListChecks,Send,Clock3,RotateCcw,ChevronDown} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {executePythonCode} from '../../services/pythonRunner';
import {DAILY_PROBLEMS,DAILY_KEY,dailyChallengeId,dailyStreak,readDailyRecords,totalDailyPoints} from './dailyBank';
import type {DailyRecord} from './dailyBank';
import {useLanguage} from '../../context/LanguageContext';
import './dailySolver.css';
import {dailyLocalized,dailyText,dailyExtra} from './dailyLocalization';
const SUBMISSION_KEY='ciliklab_daily_submissions_v2';
type Submission={id:string;time:string;passed:boolean;score:number;source:string;actual:string};
const loadSubmissions=():Submission[]=>{try{const v=JSON.parse(localStorage.getItem(SUBMISSION_KEY)||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x.id==='string').slice(0,200):[]}catch{return []}};
export function DailyCodingSolver(){
 const {currentUser}=useApp();const {locale}=useLanguage();
 const dl=(index:number)=>dailyText(locale,index);
 const de=(index:number)=>dailyExtra(locale,index);
 const [records,setRecords]=useState<Record<string,DailyRecord>>(readDailyRecords);
 const [selected,setSelected]=useState(dailyChallengeId());
 const [query,setQuery]=useState('');const [world,setWorld]=useState('All');const [tier,setTier]=useState('All');
 const [code,setCode]=useState(()=>DAILY_PROBLEMS.find(p=>p.id===dailyChallengeId())?.starter||'');
 const [result,setResult]=useState<{passed:boolean;actual:string;error?:string}|null>(null);
 const [hint,setHint]=useState(false);const [showLibrary,setShowLibrary]=useState(true);
 const [pane,setPane]=useState<'problem'|'submissions'>('problem');
 const [terminalTab,setTerminalTab]=useState<'tests'|'output'>('tests');
 const [submissions,setSubmissions]=useState<Submission[]>(loadSubmissions);
 const [mobilePanel,setMobilePanel]=useState<'mission'|'code'>('mission');
 const problem=DAILY_PROBLEMS.find(p=>p.id===selected)||DAILY_PROBLEMS[0];
 const translatedProblem=dailyLocalized(problem,locale);
 const points=totalDailyPoints(records),solved=Object.values(records).filter(r=>r.score>0).length;
 const worlds=useMemo(()=>['All',...new Set(DAILY_PROBLEMS.map(p=>p.world))],[]);
 const filtered=useMemo(()=>DAILY_PROBLEMS.filter(p=>(world==='All'||p.world===world)&&(tier==='All'||p.difficulty===tier)&&(`${dailyLocalized(p,locale).title} ${dailyLocalized(p,locale).instructions} ${p.skill} ${p.title}`).toLowerCase().includes(query.trim().toLowerCase())),[query,world,tier,locale]);
 const pick=(id:string)=>{const p=DAILY_PROBLEMS.find(p=>p.id===id);if(!p)return;setSelected(id);setCode(records[id]?.code||p.starter);setHint(false);setResult(null);setPane('problem');setTerminalTab('tests');setMobilePanel('mission');setShowLibrary(false)};
 useEffect(()=>{try{localStorage.setItem(DAILY_KEY,JSON.stringify(records))}catch{}},[records]);
 useEffect(()=>{try{localStorage.setItem(SUBMISSION_KEY,JSON.stringify(submissions))}catch{}},[submissions]);
 const evaluate=(submit=false)=>{
  const execution=executePythonCode(code);
  const actual=execution.success?execution.stdout.replace(/\r\n/g,'\n').trimEnd():execution.stdout;
  const passed=execution.success&&actual===problem.expected.trimEnd();
  setResult({passed,actual,error:execution.error?.friendlyExplanation});setTerminalTab('tests');
  const old=records[problem.id];const stamp=new Date().toISOString();
  const earned=passed?problem.points:(old?.score||0);
  setRecords(prev=>({...prev,[problem.id]:{id:problem.id,score:Math.max(prev[problem.id]?.score||0,earned),attempts:(prev[problem.id]?.attempts||0)+1,lastAttempt:stamp,lastSolved:passed?(prev[problem.id]?.lastSolved||stamp):(prev[problem.id]?.lastSolved||''),code}}));
  if(submit)setSubmissions(prev=>[{id:problem.id,time:stamp,passed,score:passed?problem.points:0,source:code,actual},...prev].slice(0,200));
 };
 const expectedLines=problem.expected.trimEnd().split('\n');const actualLines=(result?.actual||'').trimEnd().split('\n');
 const mySubmissions=submissions.filter(s=>s.id===problem.id);
 const scoreTiers=['Starter','Explorer','Challenger'].map(level=>({level,total:DAILY_PROBLEMS.filter(p=>p.difficulty===level).length,done:DAILY_PROBLEMS.filter(p=>p.difficulty===level&&records[p.id]?.score>0).length}));
 return <div className="daily-root daily-v32 space-y-5 pb-20">
  <header className="daily-hero"><div><span className="daily-eyebrow">CILIKLAB · PYTHON</span><h1>{dl(8)}</h1><p>{DAILY_PROBLEMS.length} {de(0)}</p></div><div className="daily-stat-set"><span><Trophy size={19}/><strong>{points}</strong> XP</span><span><CheckCircle2 size={19}/><strong>{solved}/{DAILY_PROBLEMS.length}</strong></span><span><Flame size={19}/><strong>{dailyStreak(records)}</strong> days</span></div></header>
  <div className="daily-cards"><button onClick={()=>pick(dailyChallengeId())}><Star size={20}/><span><strong>{dl(6)}</strong><small>{(DAILY_PROBLEMS.find(p=>p.id===dailyChallengeId())?dailyLocalized(DAILY_PROBLEMS.find(p=>p.id===dailyChallengeId())!,locale).title:'')}</small></span><ChevronRight size={18}/></button><button onClick={()=>setShowLibrary(v=>!v)} aria-expanded={showLibrary}><BookOpen size={20}/><span><strong>{dl(7)}</strong><small>Browse {DAILY_PROBLEMS.length} coding problems</small></span>{showLibrary?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</button><div className="daily-ranking"><Trophy size={20}/><span><strong>Personal leaderboard</strong><small>{currentUser.name}: {points} earned XP · Stored on this device</small></span></div></div>
  <div className="daily-tier-progress" aria-label="Progress by difficulty">{scoreTiers.map(t=><div key={t.level}><span><b>{t.level}</b><small>{t.done}/{t.total} solved</small></span><div><i style={{width:`${t.done/t.total*100}%`}}/></div></div>)}</div>
  {showLibrary&&<section className="daily-library"><div className="daily-library-head"><h2><BookOpen size={19}/> {dl(18)}</h2><span>{filtered.length} problems</span></div><div className="daily-filter"><label><Search size={16}/><input placeholder={dl(17)} aria-label={dl(17)} value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="Choose theme" value={world} onChange={e=>setWorld(e.target.value)}>{worlds.map(w=><option key={w} value={w}>{w==='All'?dl(18):dailyLocalized(DAILY_PROBLEMS.find(p=>p.world===w)!,locale).world}</option>)}</select><select aria-label="Choose difficulty" value={tier} onChange={e=>setTier(e.target.value)}>{['All','Starter','Explorer','Challenger'].map(w=><option key={w}>{w}</option>)}</select></div><div className="daily-list">{filtered.map(p=><button key={p.id} onClick={()=>pick(p.id)} className={p.id===selected?'selected':''}><span className="daily-number">{p.id.slice(-3)}</span><span><strong>{dailyLocalized(p,locale).title}</strong><small>{p.difficulty} · {p.skill} · {p.points} XP</small></span>{records[p.id]?.score?<CheckCircle2 size={18} color="#138564"/>:<ChevronRight size={17}/>}</button>)}{!filtered.length&&<p className="daily-no-results">No matching challenges. Try another topic or difficulty.</p>}</div></section>}
  <div className="daily-workspace-head"><div><strong><Code2 size={18}/> Challenge #{problem.id.slice(-3)}</strong><span className="daily-difficulty" data-tier={problem.difficulty}>{problem.difficulty}</span><span>{translatedProblem.world}</span></div><span>{records[problem.id]?.score?`✓ ${dl(10)}`:`○ ${dl(9)}`}</span></div>
  <div className="daily-mobile-switch" role="group" aria-label="Workspace panel"><button className={mobilePanel==='mission'?'active':''} onClick={()=>setMobilePanel('mission')}>{dl(0)}</button><button className={mobilePanel==='code'?'active':''} onClick={()=>setMobilePanel('code')}>{dl(11)}</button></div>
  <div className="daily-playground">
   <section className={`daily-problem ${mobilePanel==='code'?'daily-mobile-hidden':''}`}><div className="daily-tabs" role="tablist" aria-label="Problem information"><button role="tab" aria-selected={pane==='problem'} className={pane==='problem'?'active':''} onClick={()=>setPane('problem')}><BookOpen size={15}/> {dl(0)}</button><button role="tab" aria-selected={pane==='submissions'} className={pane==='submissions'?'active':''} onClick={()=>setPane('submissions')}><Clock3 size={15}/> {dl(1)} ({mySubmissions.length})</button></div>
   {pane==='problem'?<div className="daily-problem-body"><div className="daily-heading"><span className="daily-tag">{problem.skill}</span><strong>{problem.points} XP</strong></div><h2>{translatedProblem.title}</h2><p>{translatedProblem.story}</p><div className="daily-task"><h3>{dl(2)}</h3><p dir={locale==='ar'||locale==='fa'?'rtl':'auto'}>{translatedProblem.instructions}</p></div><h3>{dl(3)}</h3><pre>{problem.expected}</pre><p className="daily-fact">{de(1)}</p><button className="daily-hint-button" onClick={()=>setHint(v=>!v)}><Lightbulb size={16}/>{dl(hint?5:4)}</button>{hint&&<div className="daily-hint" dir={locale==='ar'||locale==='fa'?'rtl':'auto'}>{translatedProblem.hint}</div>}</div>
   :<div className="daily-submissions"><h3>{de(7)}</h3>{mySubmissions.length?mySubmissions.map((s,i)=><div key={`${s.time}-${i}`} className="daily-submission"><span className={s.passed?'daily-pass':'daily-fail'}>{s.passed?'Accepted':'Wrong answer'}</span><small>{new Date(s.time).toLocaleString()} · {s.score} XP</small><button onClick={()=>{setCode(s.source);setMobilePanel('code');setResult(null)}}>Load code</button></div>):<p>{de(6)}</p>}</div>}</section>
   <section className={`daily-editor-panel ${mobilePanel==='mission'?'daily-mobile-hidden':''}`}><div className="daily-editor-top"><span><Code2 size={16}/> solution.py</span><small>Python 3 · teaching subset</small></div><div className="daily-editor-area"><div className="daily-gutter" aria-hidden="true">{Array.from({length:Math.max(12,code.split('\n').length)},(_,i)=><div key={i}>{i+1}</div>)}</div><textarea spellCheck={false} autoCorrect="off" autoCapitalize="off" aria-label="Daily coding editor" value={code} onChange={e=>{setCode(e.target.value);setResult(null)}} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();evaluate(false)}}}/></div><div className="daily-toolbar"><button onClick={()=>{setCode(problem.starter);setResult(null)}}><RotateCcw size={14}/> Reset</button><div><button className="daily-run" onClick={()=>evaluate(false)}><Play size={16}/> {dl(12)}</button><button className="daily-submit" onClick={()=>evaluate(true)}><Send size={16}/> {dl(13)}</button></div></div><div className="daily-results" aria-live="polite"><div className="daily-console-tabs" role="tablist" aria-label="Output panels"><button role="tab" aria-selected={terminalTab==='tests'} className={terminalTab==='tests'?'active':''} onClick={()=>setTerminalTab('tests')}><ListChecks size={16}/> {dl(15)}</button><button role="tab" aria-selected={terminalTab==='output'} className={terminalTab==='output'?'active':''} onClick={()=>setTerminalTab('output')}><Terminal size={16}/> {dl(14)}</button></div>{result? <>{result.error&&<p className="daily-runtime-error">{result.error}</p>}{terminalTab==='tests'?<><span className={result.passed?'daily-pass':'daily-fail'}>{result.passed?`✓ ${de(4)}`:`✕ ${de(5)}`}</span><div className="daily-test-list">{expectedLines.map((line,i)=><div key={i} className={result.error||actualLines[i]!==line?'failed':'passed'}><span>{!result.error&&actualLines[i]===line?<Check size={15}/>:<span>×</span>}</span><div><b>Output line {i+1}</b><small>Expected: {line||'(empty)'}</small></div></div>)}</div><p className="daily-test-clarification">These are exact-output line checks, not independent hidden-input test cases.</p></>:<div className="daily-compare"><div><strong>{de(8)}</strong><pre>{problem.expected}</pre></div><div><strong>{de(9)}</strong><pre>{result.actual||'(no output)'}</pre></div></div>}{result.passed&&<button className="daily-next" onClick={()=>pick(DAILY_PROBLEMS[(DAILY_PROBLEMS.indexOf(problem)+1)%DAILY_PROBLEMS.length].id)}>{dl(16)} <ChevronRight size={16}/></button>}</>:<p className="daily-empty-output">{de(3)}</p>}</div></section></div>
  <p className="daily-footnote">{de(2)}</p>
 </div>;
}
