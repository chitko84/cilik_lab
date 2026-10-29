import React, {useCallback,useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,Pause,Play} from 'lucide-react';
import {RealPhoto} from './RealPhoto';
import {useLanguage} from '../../context/LanguageContext';
import type {PhotoKey} from './RealPhoto';
import './PhotoSlideshow.css';

export type PhotoSlide = {photo:PhotoKey;alt:string;fallback:string;caption?:string};

type Props = {
  slides:readonly PhotoSlide[];
  label:string;
  className?:string;
  variant?:'hero'|'inline'|'compact';
  autoPlayMs?:number;
};

/** Progressive-enhancement carousel: only photographic presentation changes.
 * There are no changed app routes, gameplay state, or form handlers.
 * Manual controls are always available, even when automatic motion is disabled.
 */
export function PhotoSlideshow({slides,label,className='',variant='inline',autoPlayMs=6500}:Props){
  const {language}=useLanguage();
  const isMalay=language==='ms';
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [visible,setVisible]=useState(true);
  const [reduced,setReduced]=useState(false);
  const [interacting,setInteracting]=useState(false);
  const rootRef=useRef<HTMLDivElement>(null);
  const count=slides.length;

  const move=useCallback((delta:number)=>{
    if(count<2)return;
    setIndex(prev=>(prev+delta+count)%count);
  },[count]);

  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);
    update();
    media.addEventListener?.('change',update);
    return()=>media.removeEventListener?.('change',update);
  },[]);

  useEffect(()=>{
    if(!('IntersectionObserver' in window))return;
    const node=rootRef.current;
    if(!node)return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.12});
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);

  useEffect(()=>{
    if(count<2||paused||reduced||interacting||!visible)return;
    const interval=window.setInterval(()=>{
      if(document.visibilityState==='visible')move(1);
    },Math.max(4000,autoPlayMs));
    return()=>window.clearInterval(interval);
  },[count,paused,reduced,interacting,visible,autoPlayMs,move]);

  if(!count)return null;
  return <div ref={rootRef}
    className={`cilik-slideshow cilik-slide-${variant} ${className}`}
    role="region" aria-roledescription="carousel" aria-label={label}
    onMouseEnter={()=>setInteracting(true)} onMouseLeave={()=>setInteracting(false)}
    onFocusCapture={()=>setInteracting(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setInteracting(false);}}
    onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}else if(e.key==='ArrowRight'){e.preventDefault();move(1);}}}>
    <div className="sr-only" aria-live={interacting?'polite':'off'} aria-atomic="true">{slides[index]?.alt}</div>
    <div className="cilik-slide-photos" aria-hidden="true">
      {slides.map((slide,i)=><div className={`cilik-slide-image ${i===index?'is-current':''}`} key={`${slide.photo}-${i}`}>
        <RealPhoto photo={slide.photo} alt="" fallback={slide.fallback} loading={i===0&&variant==='hero'?'eager':'lazy'}/>
      </div>)}
    </div>
    {variant==='hero'&&slides[index]?.caption&&<div className="cilik-slide-caption" aria-live="off">{slides[index].caption}</div>}
    {count>1&&<div className="cilik-slide-controls" aria-label={label}>
      <button type="button" className="cilik-slide-arrow" onClick={()=>move(-1)} aria-label={isMalay?'Foto sebelumnya':'Previous photograph'} title={isMalay?'Foto sebelumnya':'Previous photograph'}><ChevronLeft size={variant==='compact'?15:17}/></button>
      <div className="cilik-slide-dots" aria-label={isMalay?'Pilih foto':'Choose photograph'}>
        {slides.map((slide,i)=><button type="button" key={`${slide.photo}-dot`} onClick={()=>setIndex(i)} aria-label={isMalay?`Papar foto ${i+1} daripada ${count}`:`Show photograph ${i+1} of ${count}`} aria-current={i===index?'true':undefined} className={`cilik-slide-dot ${i===index?'on':''}`}/>)}
      </div>
      <button type="button" className="cilik-slide-arrow" onClick={()=>move(1)} aria-label={isMalay?'Foto seterusnya':'Next photograph'} title={isMalay?'Foto seterusnya':'Next photograph'}><ChevronRight size={variant==='compact'?15:17}/></button>
      <button type="button" className="cilik-slide-toggle" onClick={()=>setPaused(p=>!p)} aria-label={paused?(isMalay?'Sambung tayangan':'Resume slideshow'):(isMalay?'Jeda tayangan':'Pause slideshow')} title={paused?(isMalay?'Sambung tayangan':'Resume slideshow'):(isMalay?'Jeda tayangan':'Pause slideshow')} disabled={reduced}>
        {paused||reduced?<Play size={variant==='compact'?13:15}/>:<Pause size={variant==='compact'?13:15}/>}</button>
    </div>}
  </div>;
}
