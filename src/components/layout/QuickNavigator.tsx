import React, {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight, BookOpen, Bot, Code2, Compass, Gamepad2, GraduationCap, Home, LibraryBig, Search, Settings, Sparkles, TrendingUp, Users, X} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {useLanguage} from '../../context/LanguageContext';

const studentDestinations = [
  {id:'dashboard',ms:'Utama',en:'Dashboard',icon:Home,keywords:'home start'},
  {id:'cilik_arcade',ms:'Cilik Arcade',en:'Cilik Arcade',icon:Gamepad2,keywords:'play games robot rescue space'},
  {id:'daily_solver',ms:'Cabaran Kod Harian',en:'Daily Coding Solver',icon:Code2,keywords:'100 challenges coding hackerrank daily XP leaderboard'},
  {id:'live_classroom',ms:'Bilik Langsung',en:'My Live Room',icon:Users,keywords:'meeting teacher student camera microphone screen share video chat'},
  {id:'knowledge_quiz',ms:'Kuiz Pengetahuan',en:'Knowledge Quiz',icon:BookOpen,keywords:'general knowledge animals science space superheroes trivia'},
  {id:'lessons',ms:'Pelajaran',en:'Lessons',icon:BookOpen,keywords:'learn python'},
  {id:'coding_workspace',ms:'Makmal Kod',en:'Coding Workspace',icon:Code2,keywords:'run code programming'},
  {id:'comic_library',ms:'Komik Python',en:'Python Comics',icon:LibraryBig,keywords:'read stories'},
  {id:'explore_classes',ms:'Teroka Kelas',en:'Explore Classes',icon:Compass,keywords:'discover courses'},
  {id:'my_classes',ms:'Kelas Saya',en:'My Classes',icon:GraduationCap,keywords:'enrolled course'},
  {id:'ciko_assistant',ms:'Tanya Ciko',en:'Ask Ciko',icon:Bot,keywords:'voice help assistant'},
  {id:'student_progress',ms:'Kemajuan',en:'My Progress',icon:TrendingUp,keywords:'score xp learning'},
  {id:'settings',ms:'Tetapan',en:'Settings',icon:Settings,keywords:'preferences language'}
];
const teacherDestinations = [
  {id:'dashboard',ms:'Utama Guru',en:'Teacher Dashboard',icon:Home,keywords:'home'},
  {id:'teacher_classes',ms:'Kelas Guru',en:'My Classes',icon:GraduationCap,keywords:'courses'},
  {id:'create_class',ms:'Cipta Kelas',en:'Create Class',icon:BookOpen,keywords:'create new'},
  {id:'live_classroom',ms:'Kelas Langsung',en:'Live Classroom',icon:Users,keywords:'meetings video class scheduling'},
  {id:'student_performance',ms:'Prestasi Pelajar',en:'Student Performance',icon:TrendingUp,keywords:'analytics progress'},
  {id:'support_queue',ms:'Permintaan Bantuan',en:'Support Queue',icon:Users,keywords:'help requests'},
  {id:'guidance_library',ms:'Perpustakaan Panduan',en:'Guidance Library',icon:LibraryBig,keywords:'resources'},
  {id:'reports_analytics',ms:'Laporan',en:'Reports & Analytics',icon:TrendingUp,keywords:'report'},
  {id:'settings',ms:'Tetapan',en:'Settings',icon:Settings,keywords:'preferences'}
];

export function QuickNavigator(){
  const {setActiveTab,role}=useApp();
  const {language}=useLanguage();
  const [open,setOpen]=useState(false),[query,setQuery]=useState('');
  const inputRef=useRef<HTMLInputElement>(null);
  const destinations=role==='teacher'?teacherDestinations:studentDestinations;
  const results=useMemo(()=>destinations.filter(item=>(`${item.ms} ${item.en} ${item.keywords}`).toLowerCase().includes(query.trim().toLowerCase())),[destinations,query]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setOpen(prev=>!prev);}
      if(event.key==='Escape')setOpen(false);
    };
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[]);
  useEffect(()=>{if(open){setQuery('');inputRef.current?.focus();}},[open]);
  const go=(tab:string)=>{setActiveTab(tab);setOpen(false);};
  return <>
    <button type="button" className="premium-quick-trigger" onClick={()=>setOpen(true)} aria-label={language==='ms'?'Cari halaman':'Search pages'} title={language==='ms'?'Cari halaman (Ctrl+K)':'Search pages (Ctrl+K)'}><Search size={17}/><span className="hidden xl:inline">{language==='ms'?'Cari...':'Quick find...'}</span><kbd className="hidden xl:inline">Ctrl K</kbd></button>
    {open&&<div className="premium-quick-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
      <div className="premium-quick-dialog" role="dialog" aria-modal="true" aria-label={language==='ms'?'Navigasi pantas':'Quick navigation'}>
        <div className="premium-quick-search"><Search size={20}/><input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&results[0])go(results[0].id);}} placeholder={language==='ms'?'Cari permainan, kelas, pelajaran...':'Find games, classes, lessons...'} aria-label={language==='ms'?'Carian':'Search'}/><button aria-label="Close" onClick={()=>setOpen(false)}><X size={20}/></button></div>
        <div className="premium-quick-results">{results.length?results.map(item=><button key={item.id} className="premium-quick-item" onClick={()=>go(item.id)}><span><item.icon size={19}/></span><strong>{language==='ms'?item.ms:item.en}</strong><ArrowRight size={16}/></button>):<div className="premium-quick-empty"><Sparkles size={22}/>{language==='ms'?'Tiada halaman dijumpai.':'No matching pages found.'}</div>}</div>
        <div className="premium-quick-footer">{language==='ms'?'Pilih satu halaman untuk pergi terus.':'Choose any page to jump straight there.'}<span>ESC {language==='ms'?'untuk tutup':'to close'}</span></div>
      </div>
    </div>}
  </>;
}
