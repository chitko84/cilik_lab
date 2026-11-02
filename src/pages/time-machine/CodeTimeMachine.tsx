import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Bot, Braces, Bug, Check, ChevronDown, CircleHelp, Clock3, Code2, Copy, FileCode2, History, Lightbulb, ListTree, Pause, Play, RotateCcw, Save, ShieldCheck, SkipBack, SkipForward, SlidersHorizontal, Sparkles, Square, Terminal, Volume2, VolumeX, WandSparkles, X} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {useLanguage} from '../../context/LanguageContext';
import {TIME_MACHINE_SAMPLES} from './samples';
import './codeTimeMachine.css';

type DataValue = string | number | boolean | null | {kind:string;items:unknown[];length:number};
type Frame = {name:string;line:number;locals:Record<string,DataValue>};
type Snapshot = {event:'line'|'return'|'exception';line:number;text:string;stack:Frame[];variables:Record<string,DataValue>;output:string;returned?:DataValue;exception?:{type:string;message:string}};
type TraceResult = {steps:Snapshot[];stdout:string;error:null|{type:string;message:string;line:number};limited:boolean};
const DRAFT_PREFIX = 'ciliklab_time_machine_draft_v1_';
const TRANSFER_KEY = 'ciliklab_time_machine_transfer_v1';
const starter = TIME_MACHINE_SAMPLES[0].code;
const txt = (english:string,malay:string,isMalay:boolean) => isMalay?malay:english;
const equal = (a:unknown,b:unknown) => JSON.stringify(a) === JSON.stringify(b);
function formatValue(value:DataValue | undefined):string {
  if (value === undefined) return '—';
  if (value === null) return 'None';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object' && 'items' in value) {
    const items=value.items.map(v=>typeof v==='string'?`"${v}"`:typeof v==='object'&&v!==null?JSON.stringify(v):String(v));
    const clipped=value.length>items.length?', …':'';
    return value.kind==='dict' ? `{${items.map(x=>x.replace(/^\[/,'').replace(/\]$/,'')).join(', ')}${clipped}}` : `[${items.join(', ')}${clipped}]`;
  }
  return String(value);
}
function summarize(step:Snapshot | null,previous:Snapshot | null,malay:boolean,lines:string[]):string {
  if (!step) return txt('Run your code and press Next to explore the recorded execution.','Jalankan kod dan tekan Seterusnya untuk meneroka langkah pelaksanaan.',malay);
  if (step.event==='exception'&&step.exception) return txt(`Python encountered ${step.exception.type} at line ${step.line}: ${step.exception.message}. Check this instruction and the variables above.`,`Python menemui ${step.exception.type} pada baris ${step.line}: ${step.exception.message}. Periksa arahan dan pemboleh ubah di atas.`,malay);
  const updates=Object.entries(step.variables).filter(([key,val])=>!previous || !equal(val,previous.variables[key])).slice(0,3);
  const changed=updates.map(([key,val])=>`${key} = ${formatValue(val)}`).join('; ');
  if(step.event==='return') return txt(`This function is returning ${formatValue(step.returned)}. The program will continue where the function was called.`,`Fungsi ini memulangkan ${formatValue(step.returned)}. Program diteruskan selepas panggilan fungsi.`,malay);
  const oldOutput=previous?.output||'';
  if(step.output.length>oldOutput.length && step.output.startsWith(oldOutput)) return txt(`A print instruction added ${JSON.stringify(step.output.slice(oldOutput.length))} to the console.`, `Arahan print menambah ${JSON.stringify(step.output.slice(oldOutput.length))} ke konsol.`,malay);
  if(previous && /^(if|elif|while)\s/.test(previous.text)) {
    const indent=(value:string)=>value.match(/^[ \t]*/)?.[0].replace(/\t/g,'    ').length||0;
    const entered=step.stack.length>=previous.stack.length && indent(lines[step.line-1]||'')>indent(lines[previous.line-1]||'');
    const outcome=entered?'True':'False';
    return txt(`The condition on line ${previous.line} was ${outcome}. Python ${entered?'entered the indented block':'skipped the indented block'} and continued on line ${step.line}.`,`Syarat pada baris ${previous.line} adalah ${outcome}. Python ${entered?'memasuki blok berinden':'melangkau blok berinden'} dan meneruskan pada baris ${step.line}.`,malay);
  }
  if(changed) return txt(`The memory has changed: ${changed}. This is the current state before the highlighted instruction runs.`,`Memori telah berubah: ${changed}. Ini ialah keadaan semasa sebelum arahan yang diserlahkan dijalankan.`,malay);
  if(/^\s*for\s|^\s*while\s/.test(step.text)) return txt(`This is a loop instruction. Watch the highlighted line repeat and follow the counter in Variable Memory.`,`Ini arahan gelung. Lihat baris diserlahkan berulang dan perhatikan pembilang dalam Memori Pemboleh Ubah.`,malay);
  if(/^\s*(if|elif|else)\b/.test(step.text)) return txt(`Python is making a decision. Press Next to see which instructions it visits.`,`Python sedang membuat keputusan. Tekan Seterusnya untuk melihat arahan yang dijalankan.`,malay);
  if(step.event==='line') return txt(`Python is about to execute line ${step.line}: ${step.text}. Press Next to see its effect.`,`Python akan melaksanakan baris ${step.line}: ${step.text}. Tekan Seterusnya untuk melihat kesannya.`,malay);
  return txt('Inspect the current state and step forward to see what happens.','Perhatikan keadaan semasa dan teruskan untuk melihat apa yang berlaku.',malay);
}

export function CodeTimeMachine() {
  const {currentUser,setActiveTab}=useApp();
  const {language}=useLanguage();
  const ms=language==='ms';
  const worker=useRef<Worker|null>(null);
  const watchdog=useRef<ReturnType<typeof setTimeout>|null>(null);
  const requestId=useRef(0);
  const scrollRef=useRef<HTMLDivElement|null>(null);
  const gutterRef=useRef<HTMLDivElement|null>(null);
  const [code,setCode]=useState(()=>{
    try {const transfer=sessionStorage.getItem(TRANSFER_KEY); if(transfer){sessionStorage.removeItem(TRANSFER_KEY);return transfer;}
      return localStorage.getItem(DRAFT_PREFIX+currentUser.id)||starter;} catch {return starter;}
  });
  const [trace,setTrace]=useState<TraceResult|null>(null);
  const [tracedSource,setTracedSource]=useState('');
  const [previousTrace,setPreviousTrace]=useState<TraceResult|null>(null);
  const [position,setPosition]=useState(-1);
  const [working,setWorking]=useState(false);
  const [status,setStatus]=useState('');
  const [playing,setPlaying]=useState(false);
  const [speed,setSpeed]=useState(1);
  const [breakpoints,setBreakpoints]=useState<number[]>([]);
  const [topic,setTopic]=useState('All');
  const [query,setQuery]=useState('');
  const [selectedExample,setSelectedExample]=useState('memory');
  const [activePanel,setActivePanel]=useState<'memory'|'stack'|'compare'>('memory');
  const [question,setQuestion]=useState('');
  const [reply,setReply]=useState('');
  const [isMuted,setIsMuted]=useState(false);
  const [showExamples,setShowExamples]=useState(false);
  const [changedAfterRun,setChangedAfterRun]=useState(false);
  const isDirty=changedAfterRun;
  const steps=trace?.steps||[];
  const current=position>=0 ? steps[position]||null:null;
  const before=position>0?steps[position-1]:null;
  const max=steps.length-1;
  const lines=code.split('\n');
  const traceLines=(trace?tracedSource:code).split('\n');
  const note=useMemo(()=>summarize(current,before,ms,traceLines),[current,before,ms,trace,tracedSource]);
  const topics=useMemo(()=>['All',...new Set(TIME_MACHINE_SAMPLES.map(s=>s.topic))],[]);
  const examples=useMemo(()=>TIME_MACHINE_SAMPLES.filter(s=>(topic==='All'||s.topic===topic) && (`${s.title} ${s.ms} ${s.topic}`.toLowerCase().includes(query.toLowerCase()))),[topic,query]);
  const variableChanges=useMemo(()=>current ? Object.entries(current.variables).map(([name,value])=>({name,value,old:before?.variables[name],changed:!before||!equal(value,before.variables[name])})):[],[current,before]);
  useEffect(()=>{try{localStorage.setItem(DRAFT_PREFIX+currentUser.id,code);}catch{}},[code,currentUser.id]);
  useEffect(()=>()=>{worker.current?.terminate();if(watchdog.current)clearTimeout(watchdog.current);if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();},[]);
  useEffect(()=>{if(current&&scrollRef.current){const target=scrollRef.current.querySelector(`[data-line="${current.line}"]`);target?.scrollIntoView({block:'nearest',behavior:'smooth'});}},[position]);
  const stop=useCallback(()=>{requestId.current+=1;worker.current?.terminate();worker.current=null;if(watchdog.current)clearTimeout(watchdog.current);watchdog.current=null;setWorking(false);setPlaying(false);setStatus(txt('Execution stopped. Your previous trace is still available.','Pelaksanaan dihentikan. Jejak terdahulu masih tersedia.',ms));},[ms]);
  const run=useCallback(()=>{
    if(!code.trim()){setStatus(txt('Write some Python code first.','Tulis kod Python dahulu.',ms));return;}
    setPlaying(false);setWorking(true);setStatus(txt('Preparing Python execution…','Menyediakan pelaksanaan Python…',ms));setReply('');
    const id=++requestId.current;
    if(!worker.current) worker.current=new Worker(`${import.meta.env.BASE_URL}time-machine/python-worker.js`);
    const thisWorker=worker.current;
    if(watchdog.current)clearTimeout(watchdog.current);
    const timeOut=(msWait:number)=>{if(watchdog.current)clearTimeout(watchdog.current);watchdog.current=setTimeout(()=>{
      if(id!==requestId.current)return;
      thisWorker.terminate();if(worker.current===thisWorker)worker.current=null;
      setWorking(false);setStatus(txt('Python took too long. The worker was stopped safely. Check your loop or internet connection.','Python mengambil masa terlalu lama. Pekerja dihentikan dengan selamat. Semak gelung atau internet anda.',ms));
    },msWait);};
    timeOut(50000);
    thisWorker.onmessage=(event:MessageEvent<{type:string;id?:number;message?:string;data?:TraceResult}>)=>{
      const msg=event.data;if(id!==requestId.current)return;
      if(msg.type==='status') {setStatus(msg.message||'');if(msg.message?.includes('ready')) timeOut(9500);return;}
      if(watchdog.current)clearTimeout(watchdog.current);watchdog.current=null;
      if(msg.type==='error'){setWorking(false);setStatus(`${txt('Unable to start Python:','Tidak dapat memulakan Python:',ms)} ${msg.message} ${txt('An internet connection is required for the first runtime load.','Sambungan internet diperlukan untuk pemuatan pertama.',ms)}`);return;}
      if(msg.type==='result'&&msg.data){setPreviousTrace(trace);setTracedSource(code);setTrace(msg.data);setPosition(msg.data.steps.length?0:-1);setChangedAfterRun(false);setWorking(false);setStatus(msg.data.error?`${msg.data.error.type}: ${msg.data.error.message}`:txt(`Recorded ${msg.data.steps.length} real Python execution events.`,`Merakam ${msg.data.steps.length} peristiwa pelaksanaan Python sebenar.`,ms));}
    };
    thisWorker.onerror=(event)=>{if(id!==requestId.current)return;thisWorker.terminate();worker.current=null;setWorking(false);setStatus(`Python worker: ${event.message}`);if(watchdog.current)clearTimeout(watchdog.current);};
    thisWorker.postMessage({type:'run',id,code});
  },[code,ms,trace]);
  const jump=(next:number)=>{setPlaying(false);setPosition(Math.max(-1,Math.min(max,next)));setReply('');};
  useEffect(()=>{
    if(!playing || !trace)return;
    const timer=window.setInterval(()=>setPosition(prev=>{
      const next=prev+1;
      if(next>max){setPlaying(false);return max;}
      if(breakpoints.includes(steps[next].line)){setPlaying(false);}
      return next;
    }),Math.round(850/speed));
    return ()=>window.clearInterval(timer);
  },[playing,max,speed,breakpoints,trace,steps]);
  const speak=()=>{
    if(isMuted){return;}
    if(!('speechSynthesis' in window)){setReply(txt('Speech is not supported by this browser.','Suara tidak disokong oleh pelayar ini.',ms));return;}
    window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(reply||note);
    utter.lang=ms?'ms-MY':'en-US';utter.rate=.85;
    window.speechSynthesis.speak(utter);
  };
  const respond=()=>{
    if(!question.trim())return;
    const q=question.toLowerCase();let response=note;
    if(!current)response=txt('First run your code. Then select a recorded step and I can explain what actually happened.','Jalankan kod dahulu. Kemudian pilih langkah yang dirakam dan saya boleh menerangkan apa yang berlaku.',ms);
    else if(/output|print|papar|hasil/.test(q))response=txt(`The console has printed: ${current.output||'(nothing yet)'}. Output is captured from actual Python print() calls.`,`Konsol telah memaparkan: ${current.output||'(belum ada)'}. Output dirakam daripada panggilan print() Python sebenar.`,ms);
    else if(/variable|value|memori|nilai|pemboleh/.test(q))response=txt(`At this moment, ${Object.entries(current.variables).map(([k,v])=>`${k} = ${formatValue(v)}`).join('; ')||'no variables have been created'}.`,`Pada langkah ini, ${Object.entries(current.variables).map(([k,v])=>`${k} = ${formatValue(v)}`).join('; ')||'tiada pemboleh ubah lagi'}.`,ms);
    else if(/error|bug|ralat|salah|mistake/.test(q))response=trace?.error?txt(`Python reports ${trace.error.type} on line ${trace.error.line}: ${trace.error.message}. Try reading the line and comparing names and values.`,`Python melaporkan ${trace.error.type} pada baris ${trace.error.line}: ${trace.error.message}. Periksa baris serta nama dan nilai pemboleh ubah.`,ms):txt('This run has no uncaught errors. If the result is surprising, compare each step and watch where variables change.','Tiada ralat tidak dikendalikan dalam pelaksanaan ini. Jika keputusan mengejutkan, bandingkan setiap langkah dan perubahan pemboleh ubah.',ms);
    else if(/loop|repeat|ulang|gelung/.test(q)) response=txt(`Loops can visit the same source line many times. The timeline contains ${steps.filter(s=>s.line===current.line).length} events at line ${current.line}; watch the counter change each time.`,`Gelung boleh melaksanakan baris sama berulang kali. Garis masa mengandungi ${steps.filter(s=>s.line===current.line).length} peristiwa pada baris ${current.line}; lihat pembilang berubah.`,ms);
    else if(/function|stack|fungsi|panggil/.test(q))response=txt(`The current call stack is ${current.stack.map(s=>s.name).join(' → ')||'empty'}. Each frame has its own local variables.`,`Timbunan panggilan semasa ialah ${current.stack.map(s=>s.name).join(' → ')||'kosong'}. Setiap bingkai mempunyai pemboleh ubah setempatnya.`,ms);
    setReply(response);setQuestion('');
  };
  const chooseSample=(sample:typeof TIME_MACHINE_SAMPLES[number])=>{setCode(sample.code);setSelectedExample(sample.id);setTrace(null);setPosition(-1);setPlaying(false);setStatus('');setReply('');setShowExamples(false);setChangedAfterRun(false);};
  return <div className="ctm-page" data-feature="ciko-time-machine">
    <header className="ctm-hero">
      <div className="ctm-hero-copy"><div className="ctm-eyebrow"><Clock3 size={14}/>{txt('CODE EXPLORER · REAL PYTHON TRACING','PENEROKA KOD · JEJAK PYTHON SEBENAR',ms)}</div>
        <h1><span>Ciko</span> Code Time Machine</h1>
        <p>{txt('See inside your Python program. Rewind execution, explore changing variables, discover how loops work, and get help from Ciko.','Lihat ke dalam program Python. Undurkan pelaksanaan, teroka perubahan pemboleh ubah, fahami gelung dan dapatkan bantuan Ciko.',ms)}</p>
        <div className="ctm-hero-tags"><span><Check size={13}/>{txt('Python 3 · learning subset','Python 3 · subset pembelajaran',ms)}</span><span><History size={13}/>{txt('Rewind & replay','Undur & ulang',ms)}</span><span><Bot size={13}/>{txt('English & Malay','Inggeris & Melayu',ms)}</span></div>
      </div><div className="ctm-hero-art" aria-hidden="true"><div className="ctm-hero-orbit"><span>01</span><Clock3 size={64}/><span>02</span></div><div className="ctm-hero-terminal"><span>score = 0</span><span>score += 2</span><span>score → 2</span></div></div>
    </header>
    <div className="ctm-top-actions"><button onClick={()=>setShowExamples(v=>!v)} className="ctm-button ctm-subtle"><BookOpen size={17}/>{txt('Example Library','Pustaka Contoh',ms)} <span>{TIME_MACHINE_SAMPLES.length}</span><ChevronDown size={14}/></button><button onClick={()=>{try{navigator.clipboard.writeText(code)}catch{}}} className="ctm-button ctm-subtle"><Copy size={16}/>{txt('Copy code','Salin kod',ms)}</button><button onClick={()=>setActiveTab('coding_workspace')} className="ctm-button ctm-subtle"><ArrowLeft size={16}/>{txt('Coding Workspace','Ruang Kerja Kod',ms)}</button></div>
    {showExamples&&<section className="ctm-examples"><div className="ctm-example-head"><h2>{txt('Explore with Ciko','Teroka bersama Ciko',ms)}</h2><div><input aria-label="Search Python examples" value={query} onChange={e=>setQuery(e.target.value)} placeholder={txt('Search concepts…','Cari konsep…',ms)}/><select value={topic} onChange={e=>setTopic(e.target.value)} aria-label="Filter examples by topic">{topics.map(t=><option key={t}>{t}</option>)}</select></div></div><div className="ctm-example-grid">{examples.map(sample=><button key={sample.id} onClick={()=>chooseSample(sample)} className={selectedExample===sample.id?'chosen':''}><span>{sample.level}</span><strong>{ms?sample.ms:sample.title}</strong><small>{sample.topic}</small><ArrowRight size={15}/></button>)}</div></section>}
    <div className="ctm-workspace">
      <section className="ctm-editor-panel"><div className="ctm-panel-title"><div><FileCode2 size={17}/><strong>your_program.py</strong><small>Python 3 · UTF-8</small></div><span>{code.length}/10,000</span></div><div className="ctm-editor-wrap"><div ref={gutterRef} className="ctm-edit-numbers" aria-hidden="true">{lines.map((_,i)=><div key={i}>{i+1}</div>)}</div><textarea spellCheck={false} aria-label="Python editor" onScroll={e=>{if(gutterRef.current)gutterRef.current.scrollTop=e.currentTarget.scrollTop}} value={code} onChange={e=>{setCode(e.target.value);setChangedAfterRun(true);setPlaying(false);}} onKeyDown={e=>{if(e.key==='Tab'){e.preventDefault();const ta=e.currentTarget,start=ta.selectionStart;setCode(old=>old.slice(0,start)+'    '+old.slice(ta.selectionEnd));requestAnimationFrame(()=>{ta.selectionStart=start+4;ta.selectionEnd=start+4;});}if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run();}}} /></div>
        <div className="ctm-editor-toolbar"><button className="ctm-button ctm-primary" disabled={working} onClick={run}><Play size={17}/>{working?txt('Running Python…','Menjalankan Python…',ms):txt('Record Execution','Rakam Pelaksanaan',ms)}</button><button onClick={stop} disabled={!working} className="ctm-button ctm-subtle"><Square size={15}/>{txt('Stop','Henti',ms)}</button><button onClick={()=>{setCode(starter);setTrace(null);setPosition(-1);setPlaying(false);setStatus('');setChangedAfterRun(false)}} className="ctm-icon-button" title={txt('Reset editor','Set semula editor',ms)} aria-label="Reset editor"><RotateCcw size={17}/></button></div>
        <div className="ctm-status" aria-live="polite"><span className={working?'ctm-pulse':''}/>{status||txt('Tip: Ctrl+Enter records execution. Your draft is saved on this device.','Petua: Ctrl+Enter merakam pelaksanaan. Draf disimpan pada peranti ini.',ms)}</div>
        <div className="ctm-console"><div><Terminal size={16}/><strong>{txt('Python Output','Output Python',ms)}</strong>{trace?.error&&<span className="ctm-error-chip">{trace.error.type} · line {trace.error.line}</span>}</div><pre>{current?.output ?? (trace && position===-1?'':trace?.stdout||txt('Output will appear here after execution.','Output akan dipaparkan selepas pelaksanaan.',ms))}</pre>{trace?.error&&<p className="ctm-error-message"><Bug size={16}/>{trace.error.message}</p>}</div>
      </section>
      <section className="ctm-timeline-panel"><div className="ctm-panel-title"><div><History size={18}/><strong>{txt('Execution Time Machine','Mesin Masa Pelaksanaan',ms)}</strong></div><small>{steps.length?`${Math.max(0,position+1)} / ${steps.length}`:txt('Not recorded','Belum dirakam',ms)}</small></div>
        <div className="ctm-timeline-body">
          <div className="ctm-progress"><span>{txt('START','MULA',ms)}</span><span>{txt('FINISH','TAMAT',ms)}</span></div>
          <input aria-label="Execution timeline" type="range" min={-1} max={Math.max(-1,max)} value={position} disabled={!steps.length||working} onChange={e=>jump(Number(e.target.value))} style={{'--progress':`${max>=0?(position+1)/(max+1)*100:0}%`} as React.CSSProperties}/>
          <div className="ctm-timeline-controls"><button aria-label="Go to first step" title="First" disabled={!steps.length} onClick={()=>jump(-1)}><SkipBack size={18}/></button><button aria-label="Previous step" disabled={position<0} onClick={()=>jump(position-1)}><ArrowLeft size={19}/></button><button aria-label="Play or pause trace" disabled={!steps.length} className="ctm-play" onClick={()=>{if(position===max)setPosition(-1);setPlaying(v=>!v);}}>{playing?<Pause size={19}/>:<Play size={19}/>}</button><button aria-label="Next step" disabled={!steps.length||position>=max} onClick={()=>jump(position+1)}><ArrowRight size={19}/></button><button aria-label="Last step" disabled={!steps.length} onClick={()=>jump(max)}><SkipForward size={18}/></button><select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></div>
          {isDirty&&<div className="ctm-stale"><Lightbulb size={15}/>{txt('Code edited since the last run. Record again to update the timeline.','Kod telah diubah selepas pelaksanaan terakhir. Rakam semula untuk kemas kini garis masa.',ms)}</div>}
          <div className="ctm-current-event"><small>{current?`${current.event.toUpperCase()} · LINE ${current.line}`:txt('BEFORE EXECUTION','SEBELUM PELAKSANAAN',ms)}</small><strong>{current?.text||txt('Press Record Execution, then step into your code.','Tekan Rakam Pelaksanaan, kemudian ikuti kod anda.',ms)}</strong>{current?.exception&&<span>{current.exception.type}: {current.exception.message}</span>}</div>
          <div className="ctm-trace-lines" ref={scrollRef} aria-label="Recorded code lines">
            {traceLines.map((line,i)=>{const number=i+1,active=current?.line===number||(!steps.length&&trace?.error?.line===number),breakpoint=breakpoints.includes(number);return <div key={number} className={`${active?'active':''} ${breakpoint?'breakpoint':''}`} data-line={number}><button className="ctm-break-button" title={breakpoint?'Remove playback stop':'Stop playback at this line'} aria-label={`Toggle playback stop on line ${number}`} onClick={()=>setBreakpoints(old=>breakpoint?old.filter(v=>v!==number):[...old,number])}>{breakpoint?'●':'○'}</button><span className="ctm-line-no">{number}</span><code>{line||' '}</code>{active&&<ArrowLeft size={15}/>}</div>})}
          </div><p className="ctm-break-tip"><CircleHelp size={13}/>{txt('Click ○ to pause playback on a line. Red dots mark playback stops.','Klik ○ untuk jeda ulangan pada baris. Titik merah menandakan hentian.',ms)}</p>
        </div>
      </section>
      <section className="ctm-inspector"><div className="ctm-inspector-tabs"><button className={activePanel==='memory'?'selected':''} onClick={()=>setActivePanel('memory')}><Braces size={16}/>{txt('Memory','Memori',ms)}</button><button className={activePanel==='stack'?'selected':''} onClick={()=>setActivePanel('stack')}><ListTree size={16}/>{txt('Call Stack','Timbunan',ms)}</button><button className={activePanel==='compare'?'selected':''} onClick={()=>setActivePanel('compare')}><SlidersHorizontal size={16}/>{txt('Compare','Banding',ms)}</button></div>
        {activePanel==='memory'?<div className="ctm-inspector-body"><h3>{txt('Variable Memory','Memori Pemboleh Ubah',ms)}</h3><p>{txt('Values captured from the Python interpreter. Bright cards changed at this step.','Nilai dirakam daripada penterjemah Python. Kad terang menunjukkan perubahan.',ms)}</p><div className="ctm-variable-list">{variableChanges.length?variableChanges.map(v=><div key={v.name} className={v.changed?'changed':''}><div><code>{v.name}</code>{v.changed&&<span>{txt('Changed','Berubah',ms)}</span>}</div><strong>{formatValue(v.value)}</strong>{v.changed&&v.old!==undefined&&<small>{formatValue(v.old)} → {formatValue(v.value)}</small>}</div>):<p className="ctm-empty">{txt('Run the code and select a step to see variables.','Jalankan kod dan pilih langkah untuk melihat pemboleh ubah.',ms)}</p>}</div></div>
        :activePanel==='stack'?<div className="ctm-inspector-body"><h3>{txt('Function Call Stack','Timbunan Panggilan Fungsi',ms)}</h3><p>{txt('See which functions are running and their own local variables.','Lihat fungsi yang sedang berjalan dan pemboleh ubah setempat.',ms)}</p>{current?.stack.length?current.stack.map((frame,i)=><div className="ctm-frame" key={i}><strong>{i+1}. {frame.name}() <small>line {frame.line}</small></strong>{Object.entries(frame.locals).filter(([k])=>k!=='__builtins__').slice(0,12).map(([k,v])=><p key={k}><code>{k}</code> = {formatValue(v)}</p>)}</div>):<p className="ctm-empty">{txt('No active function frames at this step.','Tiada fungsi aktif pada langkah ini.',ms)}</p>}</div>
        :<div className="ctm-inspector-body"><h3>{txt('Previous vs Current Run','Pelaksanaan Lama & Baharu',ms)}</h3><p>{txt('Record the program twice to compare their output and number of steps.','Rakam program dua kali untuk membandingkan output dan bilangan langkah.',ms)}</p>{previousTrace&&trace?<div className="ctm-compare"><div><strong>{txt('Previous','Terdahulu',ms)}</strong><small>{previousTrace.steps.length} steps</small><pre>{previousTrace.stdout||'(no output)'}</pre></div><div><strong>{txt('Current','Semasa',ms)}</strong><small>{trace.steps.length} steps</small><pre>{trace.stdout||'(no output)'}</pre></div></div>:<p className="ctm-empty">{txt('Run your code, make a change, and record again to compare.','Jalankan kod, buat perubahan dan rakam semula untuk membandingkan.',ms)}</p>}</div>}
      </section>
    </div>
    <section className="ctm-ciko-card"><div className="ctm-ciko-top"><div className="ctm-ciko-icon"><Bot size={23}/></div><div><span>CIKO · {txt('YOUR DEBUGGING BUDDY','RAKAN NYAHPEPIJAT ANDA',ms)}</span><h2>{txt('Let’s understand this step together','Mari fahami langkah ini bersama',ms)}</h2></div><div className="ctm-ciko-actions"><button aria-label="Speak explanation" onClick={speak}><Volume2 size={18}/></button><button aria-label={isMuted?'Unmute':'Mute'} onClick={()=>{setIsMuted(v=>!v);window.speechSynthesis?.cancel();}}>{isMuted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button></div></div><p className="ctm-explanation" aria-live="polite">{reply||note}</p><div className="ctm-questions"><label htmlFor="ctm-ask">{txt('Ask Ciko about the selected step','Tanya Ciko tentang langkah terpilih',ms)}</label><div><input id="ctm-ask" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')respond();}} placeholder={txt('Why did my variable change?','Mengapa pemboleh ubah saya berubah?',ms)}/><button onClick={respond} disabled={!question.trim()}><WandSparkles size={16}/>{txt('Explain','Terangkan',ms)}</button></div><div className="ctm-prompt-pills">{[{en:'What changed?',ms:'Apa yang berubah?'},{en:'Explain the loop',ms:'Terangkan gelung'},{en:'Why this error?',ms:'Mengapa ralat ini?'},{en:'What is the output?',ms:'Apakah outputnya?'}].map(item=><button key={item.en} onClick={()=>{setQuestion(ms?item.ms:item.en);}}>{ms?item.ms:item.en}</button>)}</div><small>{txt('Explanations use the recorded Python state and built-in bilingual guidance; they are not an open-ended AI chat.','Penjelasan menggunakan keadaan Python yang dirakam dan panduan dwibahasa; bukan sembang AI terbuka.',ms)}</small></div></section>
    <footer className="ctm-footer"><ShieldCheck size={15}/>{txt('Python runs in a separate browser worker with step, time and output limits. Initial Python download requires internet; no account or API key required.','Python berjalan dalam pekerja pelayar berasingan dengan had langkah, masa dan output. Muat turun pertama memerlukan internet; tiada akaun atau kunci API diperlukan.',ms)}</footer>
  </div>;
}
