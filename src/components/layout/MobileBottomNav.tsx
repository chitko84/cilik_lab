import React from 'react';
import { BookOpen, Code2, Home, Menu, TrendingUp, UserRound, Users, BookMarked, LifeBuoy, Gamepad2, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function MobileBottomNav({onMore}: {onMore:()=>void}) {
  const {role, activeTab, setActiveTab} = useApp();
  const {t} = useLanguage();
  const items = role === 'student' ? [
    {id:'dashboard',label:t('home'),icon:Home},
    {id:'explore_classes',label:t('learn'),icon:BookOpen},
    {id:'cilik_arcade',label:t('play'),icon:Gamepad2},
    {id:'ciko_assistant',label:'Ciko',icon:Bot},
    {id:'profile',label:t('me'),icon:UserRound},
  ] : [
    {id:'dashboard',label:t('home'),icon:Home},
    {id:'teacher_classes',label:t('myClasses'),icon:BookMarked},
    {id:'student_performance',label:t('learners'),icon:Users},
    {id:'support_queue',label:t('openHelp'),icon:LifeBuoy},
    {id:'more',label:t('more'),icon:Menu},
  ];
  const isLearn = ['lessons','my_classes','explore_classes','comic_library'].includes(activeTab);
  return (
    <nav aria-label={role === 'student'?'Student mobile navigation':'Teacher mobile navigation'}
      className="mobile-tabbar md:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 border-t border-slate-200 backdrop-blur-xl shadow-[0_-10px_32px_rgba(25,54,90,.09)]">
      <div className="max-w-lg mx-auto grid grid-cols-5 h-[65px] pb-[env(safe-area-inset-bottom)]">
        {items.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id || (isLearn && item.id==='explore_classes');
          return <button key={item.id} type="button" onClick={() => item.id==='more' ? onMore() : setActiveTab(item.id)}
            aria-current={active?'page':undefined}
            className={`flex flex-col gap-1 items-center justify-center min-w-0 transition-colors ${active?'text-sky-700':'text-slate-500'}`}>
            <span className={`flex items-center justify-center w-10 h-8 rounded-xl ${active?'bg-sky-100':'bg-transparent'}`}><Icon className="w-[19px] h-[19px]" strokeWidth={active?2.5:2}/></span>
            <span className="text-[10px] font-bold truncate max-w-full px-1">{item.label}</span>
          </button>;
        })}
      </div>
    </nav>
  );
}
