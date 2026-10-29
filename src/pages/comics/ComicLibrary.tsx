import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ExternalLink, LibraryBig, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLearningExtras } from '../../hooks/useLearningExtras';
import { COMICS, COMIC_FLIPBOOK_LINKS, type ComicBook, type ComicId, type ComicPage } from '../../data/comicBooks';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {COMIC_SERIES, COMIC_SERIES_IDS} from '../../data/comicSeries';
import {ComicSeriesCards, ComicSeriesReader, comicEditionHref, type ComicEdition} from './SeriesReader';

function Scene({page,index}:{page:ComicPage;index:number}) {
  const scene=page.scene;
  return <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-amber-50 border border-white/70" aria-hidden="true">
    <div className="absolute -left-10 -bottom-20 h-44 w-44 rounded-full bg-sky-300/50"/><div className="absolute right-0 -top-12 h-40 w-40 rounded-full bg-amber-200/80"/>
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-emerald-200/65"/>
    {scene==='door'&&<div className="absolute bottom-10 right-[15%] w-20 h-32 sm:w-28 sm:h-44 bg-indigo-700 rounded-t-[55px] border-[8px] border-indigo-300 shadow-xl"><span className="absolute right-3 top-1/2 h-3 w-3 rounded-full bg-amber-300"/></div>}
    {scene==='path'&&<div className="absolute bottom-12 right-[15%] text-4xl sm:text-6xl tracking-widest">⭐ ⭐ ⭐</div>}
    {(scene==='box'||scene==='market')&&<div className="absolute bottom-9 right-[12%] text-7xl sm:text-8xl drop-shadow-lg">📦</div>}
    {scene==='success'&&<div className="absolute top-8 right-10 text-6xl sm:text-7xl">🏆</div>}
    {scene==='robot'&&<div className="absolute bottom-8 right-[12%] text-7xl sm:text-8xl drop-shadow-xl">🤖</div>}
    <div className="absolute bottom-8 left-[13%] text-7xl sm:text-8xl drop-shadow-xl">🧑‍💻</div>
    <div className="absolute top-5 left-5 px-3 py-1 bg-white/85 rounded-full text-slate-600 text-xs font-extrabold">{String(index+1).padStart(2,'0')}</div>
    <div className="absolute bottom-4 left-5 text-xs font-bold text-slate-800 bg-white/90 px-3 py-1 rounded-full">CilikLab Stories</div>
  </div>;
}
function ComicBookReader({book,onBack}:{book:ComicBook;onBack:()=>void}) {
  const {language} = useLanguage();const {progress,award,saveComicPage}=useLearningExtras();
  const [page,setPage]=useState(()=>Math.min(progress.comicPages[book.id]||0,book.pages.length-1));
  const [touchStart,setTouchStart]=useState<number|null>(null);
  const current=book.pages[page][language]; const done=progress.completed.includes(`comic-${book.id}`);
  function turn(next:number) {
    if(next<0||next>=book.pages.length)return;
    setPage(next);saveComicPage(book.id,next);
    if(next===book.pages.length-1) award(`comic-${book.id}`,0);
  }
  const external=COMIC_FLIPBOOK_LINKS[book.id];
  return <div className="space-y-5 max-w-3xl mx-auto">
    <button onClick={onBack} className="flex gap-1 items-center text-sm font-bold text-slate-600 hover:text-sky-700"><ChevronLeft size={18}/>{language==='ms'?'Semua komik':'All comics'}</button>
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`bg-gradient-to-r ${book.color} text-white p-5 sm:p-7`}><div className="text-xs font-bold uppercase tracking-widest mb-1">ComicCode · {book.subtitle}</div><h1 className="font-extrabold text-xl sm:text-2xl">{language==='ms'?book.title:book.titleEn}</h1></div>
      <div className="p-4 sm:p-7 space-y-4">
        <div className="flex justify-between text-xs text-slate-500 font-bold"><span>{language==='ms'?'Halaman':'Page'} {page+1} / {book.pages.length}</span>{done&&<span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={15}/>{language==='ms'?'Dibaca':'Read'}</span>}</div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-sky-500 transition-all duration-300" style={{width:`${(page+1)/book.pages.length*100}%`}}/></div>
        <div key={`${book.id}-${page}`} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={e=>{if(touchStart===null)return;const diff=e.changedTouches[0].clientX-touchStart;if(Math.abs(diff)>65) turn(page+(diff<0?1:-1));setTouchStart(null)}} className="cilik-comic-page rounded-2xl bg-[#fdfbf6] border border-amber-100 p-4 sm:p-5 shadow-inner space-y-4 min-h-[460px]" aria-live="polite">
          <Scene page={book.pages[page]} index={page}/>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{current.title}</h2>
          <p className="text-sm sm:text-base leading-7 text-slate-700">{current.narration}</p>
          <div className="rounded-2xl bg-white border-2 border-slate-800 p-4 text-slate-900 font-bold text-base relative"><span className="absolute -top-3 left-4 bg-white px-2 text-xs text-slate-500">Ali / Ciko</span>“{current.speech}”</div>
          {current.tip&&<pre className="rounded-xl bg-slate-950 text-emerald-300 p-4 overflow-x-auto text-sm"><code>{current.tip}</code></pre>}
        </div>
        <div className="flex justify-between items-center gap-3"><button onClick={()=>turn(page-1)} disabled={page===0} className="flex gap-1 items-center px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm disabled:opacity-35"><ArrowLeft size={17}/>{language==='ms'?'Sebelum':'Back'}</button><button onClick={()=>page===book.pages.length-1?onBack():turn(page+1)} className="flex gap-1 items-center px-5 py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700">{page===book.pages.length-1?(language==='ms'?'Selesai':'Finish'):(language==='ms'?'Seterusnya':'Next')}<ArrowRight size={17}/></button></div>
        {external&&<a href={external} target="_blank" rel="noopener noreferrer" className="text-sky-700 text-xs font-bold flex gap-2 items-center"><ExternalLink size={15}/>{language==='ms'?'Buka flipbook penuh':'Open full flipbook'}</a>}
      </div>
    </div>
  </div>;
}
export function ComicLibrary({initialBook}:{initialBook?:ComicId|null}) {
  const {language} = useLanguage(); const {progress} = useLearningExtras();
  const [selected,setSelected]=useState<ComicId|null>(initialBook||null);
  const getSeriesFromQuery=()=>{const query=new URLSearchParams(window.location.search);const id=query.get('comicBook');return id&&COMIC_SERIES_IDS.has(id)?id:null};
  const [selectedSeries,setSelectedSeries]=useState<string|null>(getSeriesFromQuery);
  const [edition,setEdition]=useState<ComicEdition>(()=>new URLSearchParams(window.location.search).get('comicLang')==='ms'?'ms':'en');
  useEffect(()=>{
    const onPop=()=>{setSelectedSeries(getSeriesFromQuery());setEdition(new URLSearchParams(window.location.search).get('comicLang')==='ms'?'ms':'en')};
    window.addEventListener('popstate',onPop);
    return()=>window.removeEventListener('popstate',onPop);
  },[]);
  const openEdition=(id:string,lang:ComicEdition)=>{window.history.pushState({},'',comicEditionHref(id,lang));setSelected(null);setSelectedSeries(id);setEdition(lang)};
  const backToLibrary=()=>{const url=new URL(window.location.href);url.searchParams.delete('comicBook');url.searchParams.delete('comicLang');window.history.pushState({},'',url.pathname+url.search+url.hash);setSelectedSeries(null)};
  useEffect(()=>{if(initialBook)setSelected(initialBook)},[initialBook]);
  const book=COMICS.find(c=>c.id===selected);
  const seriesBook=COMIC_SERIES.find(c=>c.id===selectedSeries);
  if(seriesBook) return <ComicSeriesReader key={seriesBook.id} book={seriesBook} edition={edition} onBack={backToLibrary} onEditionChange={lang=>openEdition(seriesBook.id,lang)}/>;
  if(book) return <ComicBookReader key={book.id} book={book} onBack={()=>setSelected(null)}/>;
  return <div className="space-y-6 max-w-6xl mx-auto">
    <div><div className="flex gap-2 items-center text-sky-700 text-xs uppercase tracking-widest font-bold mb-1"><LibraryBig size={17}/>ComicCode</div><h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{language==='ms'?'Perpustakaan Komik':'Comic Library'}</h1><p className="text-sm text-slate-500 mt-1">{language==='ms'?'Baca cerita ringkas, kenali Python, kemudian cuba sendiri.':'Read a short story, discover Python, and try it yourself.'}</p></div>
    <div className="premium-learning-ribbon premium-comics-ribbon v26-reading-ribbon"><RealPhoto photo="libraryReaders" alt="Children enjoying books together in a school library" fallback="/visuals/ciko-explorer.webp"/><RealPhoto photo="libraryMentor" className="v27-library-photo" alt="Teacher and child discovering a book together in the library" fallback="/visuals/coding-friends.webp"/><div><span>{language==='ms'?'CERITA PENUH WARNA':'STORIES THAT SPARK IDEAS'}</span><h2>{language==='ms'?'Baca, bayangkan, dan cuba kodnya!':'Read it. Imagine it. Code it.'}</h2><p>{language==='ms'?'Kisah ringkas Python bersama Ciko dan rakan-rakan.':'Explore friendly Python stories with Ciko and friends.'}</p></div></div>
    <ComicSeriesCards openEdition={openEdition}/>
    <section aria-label="Classic CilikLab stories" className="comic-series-classics"><h2>{language==='ms'?'Koleksi Komik Klasik':'Classic Comic Stories'}</h2><p>{language==='ms'?'Tiga komik asal CilikLab masih tersedia seperti biasa.':'The three original CilikLab comics remain available as before.'}</p>
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{COMICS.map((comic,i)=>{const completed=progress.completed.includes(`comic-${comic.id}`);return <button key={comic.id} onClick={()=>setSelected(comic.id)} className="bg-white overflow-hidden rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group">
      <div className={`h-52 bg-gradient-to-br ${comic.color} flex items-center justify-center relative premium-comic-cover`}><img className="premium-comic-cover-art" src={['/arcade/treasure-sorter.svg','/visuals/ciko-explorer.webp','/arcade/code-escape.svg'][i]} alt="" loading="lazy"/><span className="text-5xl select-none group-hover:scale-110 transition-transform drop-shadow-xl premium-comic-cover-icon">{['📦','🤖','🚪'][i]}</span><div className="absolute top-4 left-4 text-xs font-bold rounded-full bg-white/20 text-white px-3 py-1">{comic.topic}</div></div>
      <div className="p-5 space-y-2"><h2 className="font-extrabold text-slate-900 text-lg">{language==='ms'?comic.title:comic.titleEn}</h2><div className="text-sm text-slate-500">{comic.subtitle} · {comic.pages.length} {language==='ms'?'halaman':'pages'}</div><div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-sky-700"><span className="flex items-center gap-2"><BookOpen size={17}/>{language==='ms'?'Baca komik':'Read comic'}</span>{completed&&<CheckCircle2 size={18} className="text-emerald-600"/>}<ArrowRight size={17}/></div></div>
    </button>})}</div></section>
    <div className="bg-sky-50 rounded-2xl border border-sky-100 p-4 flex items-start gap-3 text-sm text-sky-900"><Sparkles className="shrink-0"/>{language==='ms'?'Petua: Kamu boleh leret ke kiri atau kanan untuk menukar halaman pada telefon.':'Tip: Swipe left or right on your phone to turn the pages.'}</div>
  </div>;
}
