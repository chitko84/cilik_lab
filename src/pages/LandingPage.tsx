import React, { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Code2, GraduationCap, Heart, Lightbulb, Play, ShieldCheck, Sparkles, Users, WandSparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitch } from '../components/layout/LanguageSwitch';
import {RealPhoto} from '../components/visual/RealPhoto';
import {PhotoSlideshow} from '../components/visual/PhotoSlideshow';
import {ProjectIntroduction} from './landing/ProjectIntroduction';

const adventureArt = '/visuals/hero-adventure.webp';

export const LandingPage: React.FC = () => {
  const {loginAs} = useApp();
  const {language,t} = useLanguage();
  const [code,setCode] = useState('name = "Ali"\nprint("Hello, " + name + "!")');
  const [output,setOutput] = useState('Hello, Ali!');
  const [running,setRunning] = useState(false);
  const runSampler = () => {
    setRunning(true);
    // This lightweight landing-page sampler intentionally accepts only the introductory example.
    const matched = code.match(/name\s*=\s*["']([^"']+)["']/);
    if (code.includes('print(')) setOutput(`Hello, ${matched?.[1] || 'Coder'}!`);
    else setOutput(language === 'ms' ? 'Tiada output. Cuba arahan print().' : 'No output. Try using print().');
    setTimeout(()=>setRunning(false),180);
  };
  return <div className="landing-v2 premium-landing min-h-screen bg-[#f8faff] text-slate-900 selection:bg-sky-200/60">
    <header className="sticky z-30 top-0 bg-white/90 backdrop-blur-xl border-b border-[#e4eaf5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[74px] flex justify-between items-center gap-3">
        <a className="shrink-0" href="#top" aria-label="CilikLab home"><img src="/assets/aistudio/CilikLab_Logo_Transparent_d0d42c03.png" alt="CilikLab" className="h-10 sm:h-12 max-w-[172px] sm:max-w-[190px] object-contain" /></a>
        <nav className="hidden lg:flex items-center gap-9 text-sm text-slate-600 font-semibold" aria-label="Site navigation">
          <a href="#explore" className="hover:text-sky-700">{t('discover')}</a>
          <a href="#python" className="hover:text-sky-700">Python</a>
          <a href="#educators" className="hover:text-sky-700">{t('teacherAccess')}</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitch compact className="shrink-0" />
          <button onClick={()=>loginAs('teacher')} className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100"><Users className="w-4 h-4" />{t('teacherAccess')}</button>
          <button onClick={()=>loginAs('student')} className="rounded-full bg-[#143866] text-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold hover:bg-[#0b2850] shadow-[0_6px_20px_rgba(20,56,102,.14)]">{t('startLearning')} <ArrowRight className="inline-block w-4 h-4 ml-1" /></button>
        </div>
      </div>
    </header>

    <main id="top">
      <section className="relative overflow-hidden max-w-[1440px] mx-auto px-5 sm:px-9 xl:px-16 pt-12 sm:pt-20 pb-16 lg:pb-24">
        <div className="absolute top-5 right-[-180px] w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[-250px] bottom-0 w-[600px] h-[500px] bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f8f5] text-[#087a73] px-4 py-2 text-xs font-extrabold border border-[#c7eee8]"><Sparkles className="w-4 h-4" /> {t('heroTag')}</span>
            <h1 className="text-[clamp(2.8rem,5vw,5.7rem)] leading-[1.08] tracking-[-.065em] font-extrabold max-w-[670px]">
              {t('heroTitleA')} <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1287d7] via-[#14b8a6] to-[#0e8b77]">{t('heroTitleB')}</span>
            </h1>
            <p className="max-w-[565px] text-base sm:text-lg text-slate-600 leading-[1.8]">{t('heroDesc')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={()=>loginAs('student')} className="inline-flex items-center gap-2 px-6 py-4 bg-[#143866] hover:bg-[#0c2a50] text-white font-extrabold rounded-2xl shadow-lg shadow-blue-900/10 text-sm sm:text-base">{t('enterStudent')} <ArrowRight className="w-4 h-4" /></button>
              <button onClick={()=>loginAs('teacher')} className="inline-flex items-center gap-2 px-5 py-4 bg-white hover:bg-slate-50 text-[#143866] border border-[#dbe5f1] font-bold rounded-2xl text-sm sm:text-base"><GraduationCap className="w-4 h-4" />{t('enterTeacher')}</button>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500"><ShieldCheck className="w-4 h-4 text-teal-600" /> {t('note')}</div>
          </div>
          <div className="relative min-h-[360px] sm:min-h-[465px]">
            <div className="relative h-[365px] sm:h-[480px] rounded-[35px] sm:rounded-[48px] overflow-hidden shadow-[0_25px_65px_rgba(23,58,102,.15)] bg-gradient-to-br from-[#bddfef] to-[#cbeedf]">
              <PhotoSlideshow variant="hero" className="premium-hero-photo-show" label={language==='ms'?'Galeri pembelajaran CilikLab':'CilikLab learning gallery'} autoPlayMs={7500} slides={[
                {photo:'readingCircle',alt:'Teacher reading with engaged young students in a lively classroom',fallback:adventureArt,caption:language==='ms'?'Belajar dengan rasa ingin tahu':'Learning starts with curiosity'},
                {photo:'modernComputerClass',alt:'Children learning together at computer stations',fallback:'/visuals/coding-friends.webp',caption:language==='ms'?'Idea tumbuh bersama':'Ideas grow together'},
                {photo:'roboticsPartners',alt:'Two children planning a robotics project together at a laptop',fallback:'/visuals/hero-adventure.webp',caption:language==='ms'?'Cipta sesuatu yang hebat':'Create something wonderful'}
              ]}/>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#092f54]/45 via-transparent to-transparent" />

            </div>
            <div className="v30-hero-benefits" aria-label="Learning benefits">
              <span className="v30-benefit-chip"><Code2 className="w-4 h-4 text-emerald-700"/> Python · {t('benefitCode')}</span>
              <span className="v30-benefit-chip"><CheckCircle2 className="w-4 h-4 text-emerald-600" />{t('benefitLearn')}</span>
            </div>
          </div>
        </div>
      </section>

      <ProjectIntroduction />

      <section className="premium-landing-discover max-w-7xl mx-auto px-5 sm:px-9 pb-12 sm:pb-20" aria-label={language==='ms'?'Terokai CilikLab':'Explore CilikLab'}>
        <div className="premium-landing-discover-head"><div><span>{language==='ms'?'BELAJAR • MAIN • CIPTA':'LEARN • PLAY • CREATE'}</span><h2>{language==='ms'?'Sesuatu yang menarik menanti di setiap sudut.':'A little wonder in every corner.'}</h2></div><p>{language==='ms'?'Pilih cara kegemaran kamu untuk bermula.':'Choose how you want to start learning.'}</p></div>
        <div className="premium-landing-image-grid">
          <button onClick={()=>loginAs('student')} className="premium-landing-photo-card"><RealPhoto photo="childrenITClass" alt="Children working with computers during a classroom activity" fallback="/arcade/robot-rescue.svg" /><span><small>GAME ADVENTURES</small><strong>{language==='ms'?'Main dan kumpul bintang':'Play, explore, earn stars'}</strong><em>{language==='ms'?'Masuk ke Arcade':'Open the Arcade'} <ArrowRight size={17}/></em></span></button>
          <button onClick={()=>loginAs('student')} className="premium-landing-photo-card"><RealPhoto photo="studyFriends" alt="Two students learning together with a tablet and textbook" fallback="/visuals/coding-friends.webp"/><span><small>YOUR LEARNING BUDDY</small><strong>{language==='ms'?'Belajar bersama Ciko':'Learn with Ciko'}</strong><em>{language==='ms'?'Mula belajar':'Start learning'} <ArrowRight size={17}/></em></span></button>
          <button onClick={()=>loginAs('teacher')} className="premium-landing-photo-card"><RealPhoto photo="groupInstruction" alt="Teacher guiding a small group during computer class" fallback="/visuals/forest-adventure.webp"/><span><small>FOR EDUCATORS</small><strong>{language==='ms'?'Bimbing generasi pencipta':'Inspire young creators'}</strong><em>{language==='ms'?'Ruang guru':'Teacher space'} <ArrowRight size={17}/></em></span></button>
        </div>
        <div className="cilik-photo-story-grid" aria-label={language==='ms'?'Belajar bersama':'Learning together'}>
          <div className="cilik-photo-story cilik-story-strong"><RealPhoto photo="homeStudy" alt="Child learning online at home" fallback="/visuals/creative-pixels.webp"/><span>{language==='ms'?'Belajar pada kadar sendiri':'Learn at your own pace'}</span></div>
          <div className="cilik-photo-story"><RealPhoto photo="roboticsWorkshop" alt="Children building a robot during a hands-on classroom workshop" fallback="/visuals/coding-friends.webp"/><span>{language==='ms'?'Idea lebih hebat bersama':'Big ideas grow together'}</span></div>
          <div className="cilik-photo-story v27-photo-story-third"><RealPhoto photo="homeLearningDesk" alt="Student concentrating on a project at a quiet desk with plants" fallback="/visuals/creative-pixels.webp"/><span>{language==='ms'?'Ruang untuk cipta idea sendiri':'Room for original ideas'}</span></div>
        </div>
      </section>

      <section id="explore" className="bg-white border-y border-[#ebeff7] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-9">
          <div className="max-w-2xl mx-auto text-center mb-10"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-teal-700">{t('discover')}</span><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">{t('whatYouCanDo')}</h2><p className="text-sm sm:text-base text-slate-500 leading-7 mt-4">{t('discoverDesc')}</p></div>
          <div className="grid sm:grid-cols-3 gap-5 v21-learning-grid">
            {[
              {icon:BookOpen,title:t('benefitLearn'),description:t('benefitLearnDesc'),color:'bg-[#eff6ff] text-sky-700',photo:'interactiveClassroom' as const,alt:'Children learning together at an interactive classroom board',fallback:'/visuals/coding-friends.webp'},
              {icon:Code2,title:t('benefitCode'),description:t('benefitCodeDesc'),color:'bg-[#e7f8f3] text-teal-700',photo:'childrenITClass' as const,alt:'Children learning computer skills together',fallback:'/visuals/hero-adventure.webp'},
              {icon:Lightbulb,title:t('benefitHelp'),description:t('benefitHelpDesc'),color:'bg-[#fff5dd] text-amber-700',photo:'roboticsWorkshop' as const,alt:'Young learners building a robotics project with an educator',fallback:'/visuals/coding-friends.webp'},
            ].map(({icon:Icon,title,description,color,photo,alt,fallback})=><div key={title} className="v21-learning-card"><div className="v21-learning-photo"><RealPhoto photo={photo} alt={alt} fallback={fallback}/></div><div className="v21-learning-body"><div className={`v21-learning-icon ${color}`}><Icon className="w-5 h-5" /></div><h3 className="font-extrabold text-lg text-slate-900 mb-2">{title}</h3><p className="text-sm text-slate-600 leading-7">{description}</p></div></div>)}
          </div>
        </div>
      </section>

      <section id="python" className="max-w-7xl mx-auto px-5 sm:px-9 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-5"><div className="w-14 h-14 rounded-2xl bg-[#e5f2ff] text-sky-700 flex justify-center items-center"><WandSparkles className="w-7 h-7" /></div><h2 className="text-3xl sm:text-4xl tracking-tight font-extrabold">{t('pythonPlayground')}</h2><p className="text-sm sm:text-base text-slate-600 leading-7">{t('changeName')}</p><div className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-5 h-5 text-teal-600" />{t('benefitHelp')}</div><button onClick={()=>loginAs('student')} className="inline-flex items-center gap-2 text-sm font-extrabold text-sky-700 hover:text-sky-900">{t('startLearning')} <ArrowRight className="w-4 h-4" /></button><div className="premium-v18-python-photo"><RealPhoto photo="computerLearners" alt="Students working together on a classroom computer" fallback="/visuals/coding-friends.webp"/><span>{language==='ms'?'Cuba idea kamu sendiri':'Your ideas, brought to life'}</span></div></div>
        <div className="rounded-[26px] overflow-hidden shadow-[0_26px_68px_rgba(8,32,73,.16)] bg-[#0c1730] border border-[#1b3155]">
          <div className="flex justify-between items-center px-5 py-4 bg-[#172748] border-b border-[#2d4264]"><div className="flex items-center gap-2"><div className="flex gap-1.5"><i className="w-2.5 h-2.5 bg-[#ff7975] rounded-full"/><i className="w-2.5 h-2.5 bg-[#ffc45d] rounded-full"/><i className="w-2.5 h-2.5 bg-[#36c8ab] rounded-full"/></div><span className="ml-2 text-slate-300 text-xs font-mono">hello_ciliklab.py</span></div><button onClick={runSampler} disabled={running} className="inline-flex items-center gap-1.5 bg-[#35d0b6] hover:bg-[#60e3ce] text-[#093344] font-extrabold rounded-lg px-4 py-2 text-xs"><Play className="w-3 h-3" />{running?t('running'):t('run')}</button></div>
          <textarea spellCheck={false} aria-label="Python introductory code" value={code} onChange={e=>setCode(e.target.value)} className="w-full bg-[#0c1730] outline-none px-6 py-7 resize-none h-40 text-[#a5e8d5] font-mono text-sm leading-7" />
          <div className="border-t border-[#2d4264] p-5 bg-[#121e37]"><div className="text-xs text-[#94a8c7] mb-2 font-bold">{t('output')}</div><div className="rounded-xl px-4 py-3 bg-[#0c1730] text-emerald-300 font-mono text-sm min-h-12">{output}</div></div>
        </div>
      </section>

      <section id="educators" className="bg-[#eaf4fa] py-16 sm:py-20"><div className="premium-v18-educators max-w-7xl mx-auto px-5 sm:px-9"><div className="premium-v18-educators-photo"><RealPhoto photo="tabletClass" alt="Educator using a tablet to teach a small group in a classroom" fallback="/visuals/coding-friends.webp"/></div><div className="premium-v18-educators-copy"><span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">{t('teacherPortal')}</span><h2 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">{t('forTeachers')}</h2><p className="text-sm sm:text-base text-slate-600 mt-4 leading-7">{t('forTeachersDesc')}</p><button onClick={()=>loginAs('teacher')} className="shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#143866] hover:bg-[#0b294e] text-white text-sm font-extrabold">{t('enterTeacher')} <ArrowRight className="w-4 h-4" /></button></div></div></section>
    </main>
    <footer className="bg-white py-7 border-t border-slate-200"><div className="max-w-7xl mx-auto px-5 sm:px-9 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-2"><img src="/assets/aistudio/CilikLab_Logo_Transparent_d0d42c03.png" className="w-24" alt="CilikLab"/><span className="text-xs text-slate-500">© 2026. {t('footer')}</span></div></div></footer>
  </div>;
};
