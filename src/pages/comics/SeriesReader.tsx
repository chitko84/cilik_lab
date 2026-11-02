import React from 'react';
import {ArrowRight, BookOpen, ChevronLeft, Globe2, Languages, Sparkles} from 'lucide-react';
import {COMIC_SERIES, getSeriesFlipbook, type SeriesBook} from '../../data/comicSeries';
import {useLanguage} from '../../context/LanguageContext';

export type ComicEdition = 'en' | 'ms';
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
  const malay=language==='ms';
  return <section className="comic-series-library" aria-label="CilikLab ten-book comic series">
    <div className="comic-series-header">
      <div><span className="comic-series-eyebrow"><Sparkles size={16}/> COMICCODE · CIKOLAB ADVENTURES</span>
        <h2>{malay?'10 buku, 10 pengembaraan pengaturcaraan':'10 books. 10 coding adventures.'}</h2>
        <p>{malay?'Buku 1–4 dan 10 sudah tersedia dalam Bahasa Inggeris dan Bahasa Melayu. Buku 5–9 akan datang!':'Books 1–4 and 10 are available in English and Bahasa Melayu. Books 5–9 are coming soon!'}</p>
      </div>
      <span className="comic-series-count">{malay?'5 buku tersedia · 5 akan datang':'5 available · 5 coming soon'}</span>
    </div>
    <div className="comic-series-grid">
      {COMIC_SERIES.map((book,i)=>{
        const english=getSeriesFlipbook(book.id,'en');
        const bahasa=getSeriesFlipbook(book.id,'ms');
        const published=!!(english||bahasa);
        const editionButton=(edition:ComicEdition,url:string|null)=>url?
          <a key={edition} href={comicEditionHref(book.id,edition)} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();openEdition(book.id,edition)}}}
            className={edition==='en'?'comic-series-primary':'comic-series-secondary'}
            aria-label={`${edition==='en'?'Read English':'Baca Bahasa Melayu'}: ${book.title}`}>
            {edition==='en'?<BookOpen size={17}/>:<Globe2 size={17}/>}
            {edition==='en'?(malay?'Baca English':'Read English'):'Bahasa Melayu'} <ArrowRight size={15}/>
          </a>:
          <button key={edition} type="button" disabled className="comic-series-secondary comic-series-unavailable"
            aria-label={`${edition==='en'?'English':'Bahasa Melayu'} ${book.title}: coming soon`}>
            {edition==='en'?<BookOpen size={17}/>:<Globe2 size={17}/>}
            {edition==='en'?'English':'Bahasa Melayu'} <span className="comic-series-soon">{malay?'Akan datang':'Coming soon'}</span>
          </button>;
        return <article key={book.id} className="comic-series-card">
          <div className="comic-series-cover"><ComicSeriesArtwork book={book}/><span className="comic-series-cover__number">BOOK {String(i+1).padStart(2,'0')}</span><span className={`comic-series-cover__read ${published?'comic-series-status-live':'comic-series-status-soon'}`}>{published?(malay?'Tersedia':'Available'):(malay?'Akan datang':'Coming soon')}</span></div>
          <div className="comic-series-card__body"><span className="comic-series-topic">{book.topic.split(':')[0]}</span><h3>{book.title}</h3><p>{book.description}</p>
            <span className="comic-series-meta"><BookOpen size={15}/>{published?(malay?'Flipbook lengkap · 2 bahasa':'Complete flipbook · 2 languages'):(malay?'Edisi Bahasa Inggeris & Melayu akan datang':'English & Malay editions coming soon')}</span>
            <div className="comic-series-card__actions">{editionButton('en',english)}{editionButton('ms',bahasa)}</div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}

/** A Heyzine embed never receives a false "completed" event: cross-origin readers
 * cannot provide reliable per-page progress. The external-link fallback is always available.
 */
export function ComicSeriesReader({book,edition,onBack,onEditionChange}:{book:SeriesBook;edition:ComicEdition;onBack:()=>void;onEditionChange:(edition:ComicEdition)=>void}) {
  const {language}=useLanguage();
  const malay=language==='ms';
  const bookUrl=getSeriesFlipbook(book.id,edition);
  const altEdition:ComicEdition=edition==='en'?'ms':'en';
  const altUrl=getSeriesFlipbook(book.id,altEdition);
  return <div className="comic-series-reader">
    <button type="button" className="comic-series-back" onClick={onBack}><ChevronLeft size={18}/>{malay?'Kembali ke perpustakaan':'Back to Comic Library'}</button>
    <div className="comic-series-reader__top">
      <span className="comic-series-eyebrow">COMICCODE / {edition==='en'?'ENGLISH EDITION':'EDISI BAHASA MELAYU'}</span>
      <h1>{book.title}</h1><p>{book.objective}</p>
      <div className="comic-series-edition-tabs" role="group" aria-label="Comic book language">
        <button type="button" onClick={()=>onEditionChange('en')} aria-pressed={edition==='en'} className={edition==='en'?'active':''}>English {getSeriesFlipbook(book.id,'en')?'':'· Coming soon'}</button>
        <button type="button" onClick={()=>onEditionChange('ms')} aria-pressed={edition==='ms'} className={edition==='ms'?'active':''}>Bahasa Melayu {getSeriesFlipbook(book.id,'ms')?'':'· Coming soon'}</button>
      </div>
    </div>
    {bookUrl?
      <div className="comic-series-embed-card">
        <div className="comic-series-embed-header">
          <span><BookOpen size={17}/>{edition==='en'?'Read the full English comic':'Baca komik lengkap Bahasa Melayu'}</span>
          <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="comic-series-embed-link">{malay?'Buka di Heyzine':'Open on Heyzine'} <ArrowRight size={16}/></a>
        </div>
        <iframe key={`${book.id}-${edition}`} title={`${book.title} — ${edition==='en'?'English':'Bahasa Melayu'} flipbook`} className="comic-series-iframe"
          src={bookUrl} loading="eager" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        <p className="comic-series-embed-help">{malay?'Jika pembaca tidak dipaparkan, gunakan pautan “Buka di Heyzine” di atas.':'If the embedded reader does not load, use the Open on Heyzine link above.'}</p>
      </div>:
      <div className="comic-series-coming" role="status"><div className="comic-series-coming__icon"><Languages size={34}/></div>
        <h2>{malay?'Edisi ini akan datang':'This edition is coming soon'}</h2>
        <p>{malay?'Kami sedang menyediakan buku lengkap ini. Tiada flipbook diterbitkan untuk edisi yang dipilih buat masa ini.':'The complete flipbook for this edition has not been published yet. Check back for the release.'}</p>
        {altUrl&&<button type="button" className="comic-series-primary" onClick={()=>onEditionChange(altEdition)}><BookOpen size={17}/>{malay?'Baca edisi tersedia':'Read the available edition'} <ArrowRight size={16}/></button>}
      </div>}
  </div>;
}
