import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,ChevronDown,MessageCircle,RotateCcw,Search,Send,ShieldCheck,Sparkles,Square,Volume2,VolumeX,X} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';
import {useApp} from '../../context/AppContext';
import {CIKO_ANSWERS,CIKO_CATEGORIES,findCikoAnswer,normalizeQuestion} from './cikoKnowledge';
import type {CikoAnswer,Category} from './cikoKnowledge';
import {localeInfo} from '../../locales/registry';
import {localizedCiko} from './cikoLocalized';
import {localizeCikoUi,CIKO_TOPIC_NAMES} from './cikoUiLocale';
import './cikoPremium.css';

const startingAnswers:Record<string,string>={welcome:'hello-1',variables:'python-4',loops:'loops-1',conditions:'choices-1',debug:'debug-1',maze:'maze-1',space:'space-1',success:'learning-5'};
type HistoryItem={id:string;asked:string;answer:string;match:boolean};
const INTRO=CIKO_ANSWERS[0];
export function CikoAssistant(){
 const {language,locale}=useLanguage();const {setActiveTab}=useApp();
 const tx=(ms:string,en:string,l:string)=>localizeCikoUi(en,locale)||(l==='ms'?ms:en);
 const availableAnswers=useMemo(()=>locale==='en'||locale==='ms'?CIKO_ANSWERS:CIKO_ANSWERS.filter(e=>!!localizedCiko(e,locale)),[locale]);
 const getQuestion=(entry:CikoAnswer)=>localizedCiko(entry,locale)?.question||entry.question[language];
 const getAnswer=(entry:CikoAnswer)=>localizedCiko(entry,locale)?.answer||entry.answer[language];
 const localizedCategory=(category:Category)=>{const idx=CIKO_CATEGORIES.findIndex(e=>e.id===category);return locale==='en'||locale==='ms'?CIKO_CATEGORIES[idx].label[language]:CIKO_TOPIC_NAMES[locale][idx];};
 const [selected,setSelected]=useState<CikoAnswer>(()=>{
   try{const key=sessionStorage.getItem('ciliklab_ciko_topic');return CIKO_ANSWERS.find(a=>a.id===startingAnswers[key||'welcome'])||INTRO}catch{return INTRO}
 });
 const effectiveSelected=availableAnswers.some(e=>e.id===selected.id)?selected:(availableAnswers[0]||INTRO);
 const [category,setCategory]=useState<Category|'all'>('all');
 const [search,setSearch]=useState('');const [draft,setDraft]=useState('');
 const [history,setHistory]=useState<HistoryItem[]>([]);
 const [fallback,setFallback]=useState(false);
 const [listSize,setListSize]=useState(12);
 const [muted,setMuted]=useState(false);const [autoSpeak,setAutoSpeak]=useState(true);
 const [supported,setSupported]=useState(false);const [speaking,setSpeaking]=useState(false);
 const [voiceNote,setVoiceNote]=useState('');const [voiceReady,setVoiceReady]=useState(false);
 const activeSpeech=useRef<SpeechSynthesisUtterance|null>(null);const speechToken=useRef(0);
 const [guideOpen,setGuideOpen]=useState(false);
 const currentAnswer=fallback?tx('Saya belum ada jawapan yang tepat untuk soalan ini. Cuba pilih salah satu soalan dalam pustaka di bawah, atau tanya guru kamu.','I do not have a prepared answer to that question yet. Choose a question from the library below, or ask your teacher.',language):getAnswer(effectiveSelected);
 const cancel=useCallback(()=>{
   speechToken.current+=1;activeSpeech.current=null;
   if(typeof window!=='undefined'&&'speechSynthesis' in window){window.speechSynthesis.cancel()}
   setSpeaking(false);
 },[]);
 const speak=useCallback((text:string,lang:'ms'|'en')=>{
   if(muted){setVoiceNote(tx('Buka suara untuk mendengar Ciko.','Unmute to hear Ciko.',lang));return}
   if(typeof window==='undefined'||!('speechSynthesis' in window)){setVoiceNote(tx('Suara tidak disokong oleh pelayar ini. Kamu masih boleh membaca jawapan.','Speech is not supported in this browser. You can still read the answer.',lang));return}
   cancel();const synth=window.speechSynthesis;
   const voices=synth.getVoices();const preferred=locale==='en'?'en-US':localeInfo(locale).code;
   const base=preferred.split('-')[0].toLowerCase();
   const voice=voices.find(v=>v.lang.toLowerCase()===preferred.toLowerCase())||voices.find(v=>v.lang.toLowerCase()===base)||voices.find(v=>v.lang.toLowerCase().startsWith(base+'-'));
   if(!voice){setVoiceNote(tx('Suara bahasa ini belum tersedia. Jawapan teks tetap boleh dibaca.','No compatible voice is installed for this language. You can still read the translated answer.',lang));return;}
   const utterance=new SpeechSynthesisUtterance(text);utterance.lang=voice.lang;utterance.rate=.9;utterance.pitch=1.07;
   utterance.voice=voice;
   activeSpeech.current=utterance;const token=++speechToken.current;
   utterance.onstart=()=>{if(speechToken.current===token)setSpeaking(true)};
   utterance.onend=()=>{if(speechToken.current===token){setSpeaking(false);activeSpeech.current=null;}};
   utterance.onerror=e=>{if(speechToken.current===token){setSpeaking(false);activeSpeech.current=null;if(e.error!=='canceled'&&e.error!=='interrupted')setVoiceNote(tx('Suara tidak dapat dimainkan. Semak pilihan suara peranti dan cuba lagi.','Speech could not play. Check your device voices and try again.',lang))}};
   setVoiceNote('');
   try{synth.speak(utterance)}catch{setSpeaking(false);setVoiceNote(tx('Tidak dapat memainkan suara pada pelayar ini.','Voice playback is not available in this browser.',lang))}
 },[muted,cancel,locale]);
 useEffect(()=>{
   const hasSpeech=typeof window!=='undefined'&&'speechSynthesis' in window;
   setSupported(hasSpeech);
   if(!hasSpeech)return;
   const synth=window.speechSynthesis;
   const refresh=()=>{const requested=locale==='en'?'en-US':localeInfo(locale).code;const base=requested.split('-')[0].toLowerCase();setVoiceReady(synth.getVoices().some(v=>v.lang.toLowerCase()===requested.toLowerCase()||v.lang.toLowerCase()===base||v.lang.toLowerCase().startsWith(base+'-')))};
   refresh();synth.addEventListener?.('voiceschanged',refresh);
   return()=>{synth.removeEventListener?.('voiceschanged',refresh);synth.cancel();speechToken.current+=1};
 },[locale]);
 useEffect(()=>{cancel();setVoiceNote('');setSearch('');setCategory('all');setFallback(false)},[locale,cancel]);
 useEffect(()=>{
   const onTopic=(ev:Event)=>{
     const topic=(ev as CustomEvent<{topic?:string}>).detail?.topic;
     if(topic&&startingAnswers[topic]){
       const found=CIKO_ANSWERS.find(e=>e.id===startingAnswers[topic]);
       if(found&&localizedCiko(found,locale)){setSelected(found);setFallback(false);setCategory(found.category);setListSize(12)}
     }
   };
   window.addEventListener('ciliklab-ciko',onTopic);return()=>window.removeEventListener('ciliklab-ciko',onTopic);
 },[locale]);
 const choose=useCallback((entry:CikoAnswer,spokenByAuto=autoSpeak)=>{
   cancel();setSelected(entry);setFallback(false);setCategory(entry.category);setVoiceNote('');setGuideOpen(false);
   setHistory(old=>[{id:entry.id,asked:getQuestion(entry),answer:getAnswer(entry),match:true},...old].slice(0,8));
   if(spokenByAuto&&voiceReady) speak(`${getQuestion(entry)}. ${getAnswer(entry)}`,language);
 },[autoSpeak,cancel,speak,language,locale,voiceReady]);
 const submit=(ev:React.FormEvent)=>{
   ev.preventDefault();const question=draft.trim();if(!question)return;
   const match=locale==='en'||locale==='ms'?findCikoAnswer(question,language):(availableAnswers.find(e=>normalizeQuestion(getQuestion(e))===normalizeQuestion(question))||null);
   cancel();setDraft('');setVoiceNote('');
   if(match){setSelected(match);setCategory(match.category);setFallback(false);setHistory(old=>[{id:match.id,asked:question,answer:getAnswer(match),match:true},...old].slice(0,8));if(autoSpeak&&voiceReady)speak(`${getQuestion(match)}. ${getAnswer(match)}`,language)}
   else {setFallback(true);setHistory(old=>[{id:'unknown',asked:question,answer:tx('Tiada jawapan yang telah disediakan.','No prepared answer available.',language),match:false},...old].slice(0,8));}
 };
 const filtered=useMemo(()=>{
   const q=normalizeQuestion(search);return availableAnswers.filter(item=>(category==='all'||item.category===category)&&(!q||normalizeQuestion(getQuestion(item)+' '+getAnswer(item)).includes(q)));
 },[search,category,locale,availableAnswers]);
 const suggestions=useMemo(()=>availableAnswers.filter(a=>a.category===effectiveSelected.category&&a.id!==effectiveSelected.id).slice(0,4),[effectiveSelected,availableAnswers]);
 const categories=CIKO_CATEGORIES.filter(cat=>availableAnswers.some(entry=>entry.category===cat.id));
 const selectCategory=(value:Category|'all')=>{setCategory(value);setListSize(12)};
 const heading=tx('Tanya Ciko apa-apa tentang kod!','Ask Ciko about coding!',language);
 const note=tx('Jawapan daripada pustaka dwibahasa yang disediakan — bukan sembang AI terbuka.','Answers come from a curated bilingual library — not an open-ended AI chat.',language);
 return <div className="ciko-premium max-w-6xl mx-auto pb-28 lg:pb-12 space-y-5">
   <header className="ciko-welcome-hero"><div className="ciko-hero-photo" aria-hidden="true"><img src="/visuals/ciko-explorer.webp" alt=""/></div>
     <div className="ciko-hero-copy"><span className="ciko-eyebrow"><Sparkles size={14}/>{tx('PEMBANTU BELAJAR CILIKLAB','YOUR CILIKLAB LEARNING BUDDY',language)}</span>
       <h1>{heading}</h1><p>{tx('Mari belajar Python, baiki ralat, dan selesaikan misi. Tanya soalan, baca jawapan, atau dengar suara Ciko.','Explore Python, fix bugs, and solve missions. Ask a question, read an answer, or hear Ciko speak.',language)}</p>
       <div className="ciko-hero-pills"><span><BookOpen size={15}/>{availableAnswers.length} {tx('soalan','questions',language)}</span><span><MessageCircle size={15}/>{categories.length} {tx('topik','topics',language)}</span><span><Volume2 size={15}/>{localeInfo(locale).code}</span></div>
     </div><div className="ciko-hero-orbit" aria-hidden="true">✦</div>
   </header>
   <div className="ciko-return-row"><button type="button" onClick={()=>{cancel();setActiveTab('cilik_arcade')}} className="ciko-back-button"><ArrowLeft size={17}/>{tx('Kembali ke Arcade','Back to Arcade',language)}</button><button type="button" onClick={()=>setGuideOpen(v=>!v)} aria-expanded={guideOpen} className="ciko-guide-toggle"><ShieldCheck size={16}/>{tx('Cara Ciko membantu','How Ciko works',language)}<ChevronDown size={16}/></button></div>
   {guideOpen&&<div className="ciko-guide" role="note">{note} {tx('Ciko tidak meminta maklumat peribadi dan tidak menjalankan kod yang ditaip. Gunakan butang Dengar untuk suara sebenar jika pelayar menyokongnya.','Ciko does not need personal information and does not execute typed code. Use Listen for audible speech when the browser supports it.',language)}</div>}
   <div className="ciko-main-grid"><section className="ciko-character-card" aria-label={tx('Ciko, rakan belajar','Ciko, your learning buddy',language)}><div className="ciko-robot-sky"><div className="ciko-cloud cloud-one"/><div className="ciko-cloud cloud-two"/><span className="ciko-sparkle star-one">✦</span><span className="ciko-sparkle star-two">✶</span>
     <div className="ciko-3d-stage" aria-label="Animated Ciko mascot"><div className={`ciko-robot ${speaking?'ciko-robot-speaking':''}`}><div className="ciko-antenna"/><div className="ciko-robot-head"><div className="ciko-eye"/><div className="ciko-eye"/><div className={`ciko-mouth ${speaking?'ciko-mouth-talk':''}`}/></div><div className="ciko-robot-body"><div className="ciko-heart">✦</div></div><div className="ciko-robot-arms"><span/><span/></div></div><div className="ciko-shadow"/></div>
     </div><div className="ciko-mascot-status" aria-live="polite"><span className={`ciko-status-dot ${speaking?'active':''}`}/>{speaking?tx('Ciko sedang bercakap…','Ciko is speaking…',language):tx('Ciko sedia membantu!','Ciko is ready to help!',language)}</div>
     <div className="ciko-helper-card"><span>💡</span><div><strong>{tx('Cuba soalan kecil dahulu','Start with a little question',language)}</strong><p>{tx('Contohnya: Apa itu gelung?','For example: What is a loop?',language)}</p></div></div>
   </section>
   <section className="ciko-conversation-card"><div className="ciko-conversation-title"><span><MessageCircle size={18}/>{tx('Perbualan dengan Ciko','Chat with Ciko',language)}</span><span className="ciko-language-chip">{localeInfo(locale).name}</span></div>
     <form onSubmit={submit} className="ciko-question-form"><label htmlFor="ciko-question">{tx('Apa yang kamu ingin tahu?','What would you like to know?',language)}</label><div className="ciko-question-line"><input id="ciko-question" maxLength={180} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={tx('Contoh: Kenapa kod saya tidak berfungsi?','For example: Why does my code not work?',language)}/><button type="submit" disabled={!draft.trim()} aria-label={tx('Tanya Ciko','Ask Ciko',language)}><Send size={19}/></button></div></form>
     <div className="ciko-bubble-panel"><div className="ciko-answer-heading"><span className="ciko-face-icon">🤖</span><div><strong>{fallback?tx('Jom cuba soalan lain','Let us try another question',language):getQuestion(effectiveSelected)}</strong><small>{tx('Ciko menjawab','Ciko replies',language)}</small></div></div><p className="ciko-answer-text" aria-live="polite">{currentAnswer}</p></div>
     <div className="ciko-voice-bar"><button type="button" className="ciko-play-button" onClick={()=>speak(currentAnswer,language)} disabled={!supported||!voiceReady||speaking||muted}><Volume2 size={18}/>{tx('Dengar jawapan','Listen to answer',language)}</button><button type="button" onClick={()=>speak(currentAnswer,language)} disabled={!supported||!voiceReady||muted} className="ciko-voice-button"><RotateCcw size={17}/>{tx('Ulang','Replay',language)}</button><button type="button" onClick={cancel} disabled={!speaking} className="ciko-voice-button"><Square size={15}/>{tx('Henti','Stop',language)}</button><button type="button" aria-pressed={muted} onClick={()=>{setMuted(v=>!v);cancel();setVoiceNote('')}} className="ciko-voice-button">{muted?<VolumeX size={17}/>:<Volume2 size={17}/>} {muted?tx('Buka','Unmute',language):tx('Senyap','Mute',language)}</button></div>
     <label className="ciko-auto-voice"><input type="checkbox" checked={autoSpeak} onChange={e=>{setAutoSpeak(e.target.checked);if(!e.target.checked)cancel()}}/>{tx('Bacakan jawapan secara automatik apabila saya pilih soalan','Speak answers automatically when I choose a question',language)}</label>
     {voiceNote&&<p className="ciko-voice-note" role="status">{voiceNote}</p>}
     {!supported&&<p className="ciko-voice-note">{tx('Pelayar ini tidak menyediakan suara. Jawapan teks masih boleh digunakan.','This browser does not support speech. Text answers are still available.',language)}</p>}
     {supported&&!voiceReady&&<p className="ciko-muted-note">{tx('Tiada suara sesuai untuk bahasa ini pada peranti anda. Sari kata tetap tersedia.','No compatible voice is installed for this language. Read the subtitles instead.',language)}</p>}
     <div className="ciko-followups"><div className="ciko-subheading">{tx('Cuba soalan seterusnya','You could also ask',language)}</div><div className="ciko-followup-row">{suggestions.map(entry=><button type="button" key={entry.id} onClick={()=>choose(entry)}>{getQuestion(entry)} <ArrowRight size={13}/></button>)}</div></div>
   </section></div>
   <section className="ciko-library" aria-label={tx('Pustaka soalan Ciko','Ciko question library',language)}><div className="ciko-library-head"><div><span className="ciko-eyebrow dark"><BookOpen size={15}/>{tx('BELAJAR BERSAMA CIKO','EXPLORE WITH CIKO',language)}</span><h2>{tx('Pustaka soalan','Question library',language)}</h2><p>{locale==='ms'||locale==='en'?tx('Pilih topik kegemaran kamu. Setiap soalan ada jawapan dalam Bahasa Melayu dan English.','Pick a topic you enjoy. Every question has a Malay and English answer.',language):tx('Sebahagian soalan Ciko telah diterjemahkan. Pustaka penuh tersedia dalam Bahasa Melayu dan English.','This language currently has a translated starter collection. The full question library is available in Malay and English.',language)}</p></div><div className="ciko-library-count">{filtered.length} {tx('soalan','questions',language)}</div></div>
   <div className="ciko-topic-tabs" role="group" aria-label={tx('Pilih topik','Choose topic',language)}><button type="button" aria-pressed={category==='all'} onClick={()=>selectCategory('all')} className={category==='all'?'active':''}>✨ {tx('Semua','All',language)}</button>{categories.map(cat=><button type="button" key={cat.id} aria-pressed={category===cat.id} onClick={()=>selectCategory(cat.id)} className={category===cat.id?'active':''}>{cat.icon} {localizedCategory(cat.id)}</button>)}</div>
   <div className="ciko-library-search"><Search size={18}/><input value={search} onChange={e=>{setSearch(e.target.value);setListSize(12)}} placeholder={tx('Cari soalan, contohnya gelung, ralat, bintang…','Find questions, for example loops, errors, stars…',language)} aria-label={tx('Cari soalan','Find questions',language)}/>{search&&<button type="button" aria-label={tx('Kosongkan carian','Clear search',language)} onClick={()=>setSearch('')}><X size={18}/></button>}</div>
   {filtered.length?<div className="ciko-question-grid">{filtered.slice(0,listSize).map(entry=><button key={entry.id} type="button" onClick={()=>{choose(entry);window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}} className={`ciko-question-card ${effectiveSelected.id===entry.id&&!fallback?'selected':''}`}><span className="ciko-card-icon">{categories.find(c=>c.id===entry.category)?.icon}</span><span className="ciko-card-content"><strong>{getQuestion(entry)}</strong><small>{localizedCategory(entry.category)}</small></span><ArrowRight size={17}/></button>)}</div>:<div className="ciko-no-results">{tx('Tiada soalan sepadan. Cuba kata kunci lain.','No matching questions. Try another keyword.',language)}</div>}
   {filtered.length>listSize&&<button type="button" onClick={()=>setListSize(v=>v+12)} className="ciko-more-button">{tx('Lihat lebih banyak soalan','Show more questions',language)} <ChevronDown size={17}/></button>}
   </section>
   {history.length>0&&<section className="ciko-recent"><div className="ciko-subheading">{tx('Soalan yang baru kamu pilih','Recently asked questions',language)}</div><div className="ciko-recent-list">{history.slice(0,5).map((item,i)=><button key={`${item.id}-${i}`} type="button" disabled={!item.match} onClick={()=>{const answer=CIKO_ANSWERS.find(a=>a.id===item.id);if(answer)choose(answer)}}><span>{item.match?'💬':'💭'}</span>{item.asked}<ArrowRight size={14}/></button>)}</div></section>}
   <p className="ciko-disclaimer"><ShieldCheck size={16}/>{note}</p>
 </div>;
}
