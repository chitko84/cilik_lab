import React from 'react';
import {Languages} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';
import {LOCALES} from '../../locales/registry';

/** Preserves the original locations, styling system and settings persistence. */
export function LanguageSwitch({compact=false,className=''}:{compact?:boolean;className?:string}) {
 const {locale,setLanguage,t}=useLanguage();
 return <label className={`language-switch inline-flex items-center gap-2 min-w-0 bg-white border border-slate-200 rounded-full px-2.5 py-1.5 ${className}`}>
  {!compact&&<Languages className="w-4 h-4 shrink-0 text-teal-700" aria-hidden="true"/>}
  <span className="sr-only">{t('chooseLanguage')}</span>
  <select value={locale} onChange={event=>setLanguage(event.target.value as typeof locale)} aria-label={t('chooseLanguage')}
    className={`language-choice min-w-0 max-w-[110px] sm:max-w-[180px] bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md ${compact?'max-w-[105px]':'max-w-[220px]'}`}>
    {LOCALES.map(l=><option key={l.id} value={l.id}>{l.name}{l.status==='partial'?' · Beta':''}</option>)}
  </select>
 </label>;
}
