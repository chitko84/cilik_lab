import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Globe2, Languages, Sparkles} from 'lucide-react';
import {COMIC_SERIES, type SeriesBook} from '../../data/comicSeries';
import {useLearningExtras} from '../../hooks/useLearningExtras';
import {useLanguage} from '../../context/LanguageContext';

export type ComicEdition = 'en' | 'ms';
const editionSuffix=(book:SeriesBook)=>`series-en-${book.id}`;
export function comicEditionHref(id:string,edition:ComicEdition):string {
  const url=new URL(window.location.href);
  url.searchParams.set('comicBook',id);
  url.searchParams.set('comicLang',edition);
  url.searchParams.delete('meeting');
  url.searchParams.delete('invite');
  return url.pathname+url.search+url.hash;
}

const artSymbols:Record<string,string>={
  '01-lost-loop':'🍎','02-variable-treasure':'🗝️','03-if-else-jungle':'🌿',
  '04-bug-monster':'🔎','05-function-factory':'⚙️','06-space-station':'🪐',
  '07-python-castle':'🏰','08-robot-delivery':'📦','09-maze-conditions':'🧩',
  '10-code-team-heroes':'🏅'
};
const bookThemes:Record<string,[string,string]>={
  '01-lost-loop':['#ddf0d6','#fae6ae'],'02-variable-treasure':['#f6e9c9','#dae8e2'],
  '03-if-else-jungle':['#c9e7d0','#f3dbaa'],'04-bug-monster':['#e9dafa','#fee3c6'],
  '05-function-factory':['#dce9e4','#f8e0a7'],'06-space-station':['#cfdbf5','#e4d3f2'],
  '07-python-castle':['#eed9f3','#f4dec4'],'08-robot-delivery':['#fce2c9','#cff0e6'],
  '09-maze-conditions':['#d2ebd5','#e6daf4'],'10-code-team-heroes':['#d2eeed','#f6dcc7']
};

export function ComicSeriesArtwork({book,large=false}:{book:SeriesBook;large?:boolean}) {
  const [a,b]=bookThemes[book.id] || ['#dcf1e6','#f9e6c9'];
  return <div className={`comic-series-art ${large?'comic-series-art--large':''}`} style={{background:`linear-gradient(143deg, ${a}, ${b})`}} aria-label={`Illustrated preview for ${book.title}`} role="img">
    <div className="comic-series-art__sun" />
    <div className="comic-series-art__hill comic-series-art__hill--one" />
    <div className="comic-series-art__hill comic-series-art__hill--two" />
    <span aria-hidden="true" className="comic-series-art__symbol">{artSymbols[book.id] || '📖'}</span>
    <img src="/arcade/ciko-sprite.svg" alt="" className="comic-series-art__ciko" loading="lazy" />
  </div>;
}

export function ComicSeriesCards({openEdition}:{openEdition:(id:string,edition:ComicEdition)=>void}) {
  const {language}=useLanguage();
  const {progress}=useLearningExtras();
  return <section className="comic-series-library" aria-label="CilikLab ten-book comic series">
    <div className="comic-series-header">
      <div><span className="comic-series-eyebrow"><Sparkles size={16}/> THE CIKOLAB CODE ADVENTURES</span><h2>{language==='ms'?'10 cerita, 10 pengembaraan kod':'10 stories. 10 coding adventures.'}</h2><p>{language==='ms'?'Buku flip Bahasa Inggeris boleh dibaca sekarang. Edisi Bahasa Melayu sedang disediakan.':'Read the English flipbooks now. Bahasa Melayu editions are being prepared.'}</p></div>
      <span className="comic-series-count">10 books · 80 English pages</span>
    </div>
    <div className="comic-series-grid">
      {COMIC_SERIES.map((book,i)=>{const completed=progress.completed.includes(`comic-${editionSuffix(book)}`);return <article key={book.id} className="comic-series-card">
        <div className="comic-series-cover"><ComicSeriesArtwork book={book}/><span className="comic-series-cover__number">BOOK {String(i+1).padStart(2,'0')}</span>{completed&&<span className="comic-series-cover__read"><CheckCircle2 size={15}/> Read</span>}</div>
        <div className="comic-series-card__body"><span className="comic-series-topic">{book.topic.split(':')[0]}</span><h3>{book.title}</h3><p>{book.description}</p><span className="comic-series-meta"><BookOpen size={15}/> 8 pages · Coding story</span>
          <div className="comic-series-card__actions">
            <a href={comicEditionHref(book.id,'en')} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();openEdition(book.id,'en')}}} className="comic-series-primary"><BookOpen size={17}/> Read English <ArrowRight size={16}/></a>
            <a href={comicEditionHref(book.id,'ms')} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();openEdition(book.id,'ms')}}} className="comic-series-secondary" aria-label={`Bahasa Melayu flipbook for ${book.title} — coming soon`}><Globe2 size={17}/> Bahasa Melayu <span className="comic-series-soon">Soon</span></a>
          </div>
        </div>
      </article>})}
    </div>
  </section>;
}

export function ComicSeriesReader({book,edition,onBack,onEditionChange}:{book:SeriesBook;edition:ComicEdition;onBack:()=>void;onEditionChange:(edition:ComicEdition)=>void}) {
  const {progress,saveComicPage,award}=useLearningExtras();
  const [page,setPage]=useState(()=>Math.min(Math.max(progress.comicPages[editionSuffix(book)]||0,0),book.pages.length-1));
  const [touchStart,setTouchStart]=useState<number|null>(null);
  const isEnglish=edition==='en';
  useEffect(()=>{setPage(Math.min(Math.max(progress.comicPages[editionSuffix(book)]||0,0),book.pages.length-1));},[book.id]);
  function turn(to:number) {
    if(to<0||to>=book.pages.length||!isEnglish)return;
    setPage(to);
    saveComicPage(editionSuffix(book),to);
    if(to===book.pages.length-1)award(`comic-${editionSuffix(book)}`,0);
  }
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if(!isEnglish || e.altKey||e.ctrlKey||e.metaKey) return;
      if(['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName))return;
      if(e.key==='ArrowRight'){e.preventDefault();turn(page+1)}
      if(e.key==='ArrowLeft'){e.preventDefault();turn(page-1)}
    };
    window.addEventListener('keydown',key);
    return ()=>window.removeEventListener('keydown',key);
  },[page,book.id,isEnglish]);
  return <div className="comic-series-reader">
    <button type="button" className="comic-series-back" onClick={onBack}><ChevronLeft size={18}/> All comics</button>
    <div className="comic-series-reader__top"><span className="comic-series-eyebrow">COMICCODE / {isEnglish?'ENGLISH EDITION':'BAHASA MELAYU EDITION'}</span><h1>{book.title}</h1><p>{book.objective}</p><div className="comic-series-edition-tabs" role="group" aria-label="Comic book language">
      <button onClick={()=>onEditionChange('en')} aria-pressed={isEnglish} className={isEnglish?'active':''}>English flipbook</button>
      <button onClick={()=>onEditionChange('ms')} aria-pressed={!isEnglish} className={!isEnglish?'active':''}>Bahasa Melayu · Soon</button>
    </div></div>
    {!isEnglish?<div className="comic-series-coming" role="status"><div className="comic-series-coming__icon"><Languages size={34}/></div><h2>Edisi Bahasa Melayu akan datang</h2><p>The Malay-language story and flipbook are not published yet. We are creating the English editions first. The Malay link is reserved for this book and will open here once its translation and artwork are ready.</p><button type="button" className="comic-series-primary" onClick={()=>onEditionChange('en')}><BookOpen size={17}/> Read the English edition <ArrowRight size={16}/></button></div>:
      <div className="comic-series-book" aria-label={`${book.title} English flipbook`}>
        <div className="comic-series-book__bar"><span><BookOpen size={16}/> ENGLISH · PAGE {page+1} OF {book.pages.length}</span><span>{Math.round((page+1)/book.pages.length*100)}% complete</span></div>
        <div className="comic-series-progress"><span style={{width:`${(page+1)/book.pages.length*100}%`}}/></div>
        <div key={`${book.id}-${page}`} className="comic-series-spread" aria-live="polite" onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={e=>{if(touchStart!==null){const diff=e.changedTouches[0].clientX-touchStart;if(Math.abs(diff)>65)turn(page+(diff<0?1:-1))}setTouchStart(null)}}>
          <div className="comic-series-spread__visual"><ComicSeriesArtwork book={book} large/><span className="comic-series-art-preview">Story illustration preview — final illustrated pages to follow</span></div>
          <div className="comic-series-spread__story"><span className="comic-series-page-index">CHAPTER {String(page+1).padStart(2,'0')} / 08</span><h2>{book.pages[page].narration}</h2><div className="comic-series-dialogue"><span>{book.pages[page].speaker}</span><p>“{book.pages[page].speech}”</p></div>
          {book.pages[page].code&&<div className="comic-series-code"><div>PYTHON EXAMPLE</div><pre dir="ltr"><code>{book.pages[page].code}</code></pre></div>}
          <div className="comic-series-concept"><Sparkles size={16}/><span>Learning focus: {book.topic}</span></div>
          </div>
        </div>
        <div className="comic-series-controls"><button type="button" disabled={page===0} onClick={()=>turn(page-1)}><ChevronLeft size={19}/> Previous page</button><div className="comic-series-dots" aria-label="Choose comic page">{book.pages.map((p,i)=><button type="button" aria-label={`Page ${i+1}`} aria-current={i===page?'page':undefined} key={p.index} className={i===page?'active':''} onClick={()=>turn(i)}/>)}</div><button type="button" disabled={page===book.pages.length-1} onClick={()=>turn(page+1)}>Next page <ChevronRight size={19}/></button></div>
        {page===book.pages.length-1&&<div className="comic-series-end"><CheckCircle2 size={20}/><span>Well done! You've reached the end of this coding story.</span><button type="button" onClick={()=>turn(0)}>Read again</button></div>}
      </div>}
    <p className="comic-series-reader__note">English text and code are complete story scripts. Illustrated page artwork is being produced separately; the preview art does not represent completed comic illustrations.</p>
  </div>;
}
