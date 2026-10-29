/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {Video, MessageCircle} from 'lucide-react';
import '../meetings/classroom-v34.css';
import {
  ArrowRight,
  Award,
  BookMarked,
  CheckCircle2,
  Clock,
  Code2,
  Gamepad2,
  LibraryBig,
  Flame,
  MessageSquare,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { SimpleActivityLine, SimpleBarChart } from '../../components/common/SimpleCharts';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLearningExtras } from '../../hooks/useLearningExtras';
import { WORLDS } from '../arcade/addons/AdventureExtras';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {PhotoSlideshow} from '../../components/visual/PhotoSlideshow';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    exercises,
    attempts,
    setActiveTab,
    selectExercise,
    selectClass,
  } = useApp();

  const {t,language} = useLanguage();
  const {progress:arcadeProgress,total:arcadeXP} = useLearningExtras();
  const allArcadeIds=WORLDS.flatMap(w=>[...w.ids]);
  const arcadeCompleted=allArcadeIds.filter(id=>arcadeProgress.completed.includes(id)).length;
  const nextWorld=WORLDS.find(w=>w.ids.some(id=>!arcadeProgress.completed.includes(id)))||WORLDS[0];
  const enrolledClasses = classes.filter(c => c.isEnrolled);

  // Calculate average score across passed student attempts
  const myAttempts = attempts.filter(a => a.studentId === currentUser.id);
  const passedAttempts = myAttempts.filter(a => a.status === 'passed');
  const avgScore =
    passedAttempts.length > 0
      ? Math.round(
          passedAttempts.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) /
            passedAttempts.length
        )
      : null;

  // Recent teacher feedback
  const feedbackAttempts = myAttempts.filter(a => a.teacherFeedback);
  const latestFeedback = feedbackAttempts.length > 0 ? feedbackAttempts[0] : null;

  // Continue learning target
  const continueExercise = exercises.find(e => e.id === 'ex_03') || exercises[0];

  // Illustrative activity chart data (not synced across devices)
  const activityData = [
    { day: 'Mon', minutes: 25, exercisesCompleted: 1 },
    { day: 'Tue', minutes: 40, exercisesCompleted: 2 },
    { day: 'Wed', minutes: 15, exercisesCompleted: 1 },
    { day: 'Thu', minutes: 50, exercisesCompleted: 2 },
    { day: 'Fri', minutes: 30, exercisesCompleted: 1 },
    { day: 'Sat', minutes: 65, exercisesCompleted: 3 },
    { day: 'Sun', minutes: 45, exercisesCompleted: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="premium-dashboard-hero premium-student-hero p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <RealPhoto photo="learningPartners" alt="Students learning together on laptops in a classroom" className="premium-dashboard-photo" fallback="/visuals/hero-adventure.webp"/>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('welcomeAgain')}, {currentUser.name}!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ms' ? 'Jom mulakan pengembaraan Python!' : 'Ready for today’s Python adventure?'}
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
            {language === 'ms' ? <>Kamu sudah belajar <strong className="text-white">{currentUser.streakDays} hari berturut-turut</strong>! Jom sambung latihan Python.</> : <>You're on a <strong className="text-white">{currentUser.streakDays}-day coding streak</strong>! Your robot companions and puzzles are waiting for you in the lab.</>}
          </p>
        </div>

        {/* Quick action card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shrink-0 w-full md:w-auto">
          <div className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider mb-1">
            {language === 'ms' ? 'Seterusnya' : 'Up next'}
          </div>
          <div className="text-sm font-bold text-white mb-2">{continueExercise.title}</div>
          <button
            onClick={() => selectExercise(continueExercise.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('continueLearning')}</span>
          </button>
        </div>
      </div>

      <section className="premium-discovery-grid" aria-label={language==='ms'?'Aktiviti interaktif':'Interactive adventures'}>
        <button type="button" onClick={()=>setActiveTab('cilik_arcade')} className="premium-feature-tile premium-feature-arcade">
          <img src={nextWorld.art} alt="" loading="lazy"/><span><small>{language==='ms'?'PENGEMBARAAN SETERUSNYA':'YOUR NEXT ADVENTURE'}</small><strong>{nextWorld.name}</strong><em>{arcadeCompleted}/{allArcadeIds.length} {language==='ms'?'cabaran selesai':'challenges done'} · {arcadeXP} XP</em><b>{language==='ms'?'Mula bermain':'Play now'} <ArrowRight size={15}/></b></span>
        </button>
        <button type="button" onClick={()=>setActiveTab('comic_library')} className="premium-feature-tile premium-feature-comics">
          <RealPhoto photo="homeStudy" alt="Child studying with a laptop at home" fallback="/visuals/coding-friends.webp"/><span><small>COMICCODE</small><strong>{language==='ms'?'Baca kisah Ciko':'Read with Ciko'}</strong><em>{language==='ms'?'Cerita Python yang penuh imaginasi':'Imaginative Python stories'}</em><b>{language==='ms'?'Buka komik':'Explore comics'} <ArrowRight size={15}/></b></span>
        </button>
        <button type="button" onClick={()=>setActiveTab('coding_workspace')} className="premium-feature-tile premium-feature-code">
          <img src="/arcade/code-escape.svg" alt="" loading="lazy"/><span><small>PYTHON LAB</small><strong>{language==='ms'?'Tulis kod sebenar':'Write real code'}</strong><em>{language==='ms'?'Cuba idea dalam ruang kod':'Experiment in the coding workspace'}</em><b>{language==='ms'?'Buka makmal':'Open lab'} <ArrowRight size={15}/></b></span>
        </button>
      </section>

      <section className="v30-coach-card rounded-3xl border border-emerald-100 bg-gradient-to-r from-[#f0f8f2] to-[#eff7fa] p-4 sm:p-5 gap-4 items-center shadow-sm" aria-label={language==='ms'?'Cadangan latihan peribadi':'Personal practice recommendation'}>
        <span className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-3xl shrink-0" aria-hidden="true">🧭</span>
        <div className="v30-coach-copy"><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{language==='ms'?'LALUAN PEMBELAJARAN':'YOUR LEARNING PATH'}</span><h2 className="text-base font-black text-slate-800 mt-1">{language==='ms'?'Ciko cadangkan latihan seterusnya':'Let Ciko recommend your next practice'}</h2><p className="text-xs text-slate-600 mt-1">{language==='ms'?'Cadangan berdasarkan aktiviti sebenar yang disimpan pada peranti ini.':'Suggestions based on actual play saved on this device.'}</p></div>
        <button type="button" className="rounded-xl bg-emerald-700 text-white px-4 py-3 text-xs font-black inline-flex items-center justify-center gap-2 hover:bg-emerald-800" onClick={()=>{try{sessionStorage.setItem('ciliklab_arcade_launch',JSON.stringify({mode:'coach',level:0}))}catch{}setActiveTab('cilik_arcade')}}>{language==='ms'?'Lihat cadangan':'View recommendations'} <ArrowRight size={16}/></button>
      </section>
      <section className="cilik-life-strip">
        <div className="cilik-life-media"><PhotoSlideshow variant="compact" label={language==='ms'?'Galeri aktiviti pembelajaran':'Learning moments gallery'} autoPlayMs={9200} slides={[
          {photo:'childrenITClass',alt:'Children exploring computers in a classroom',fallback:'/visuals/coding-friends.webp'},
          {photo:'groupComputerActivity',alt:'Learners using computers as a team',fallback:'/visuals/hero-adventure.webp'},
          {photo:'homeLearningDesk',alt:'Student making a school project at a calm desk',fallback:'/visuals/coding-friends.webp'}
        ]}/></div>
        <div className="cilik-life-body"><span>{language==='ms'?'BELAJAR MELALUI PENGALAMAN':'LEARNING TOGETHER'}</span><h2>{language==='ms'?'Idea hebat bermula dengan rasa ingin tahu.':'Big ideas start with curiosity.'}</h2><p>{language==='ms'?'Teroka kelas baharu, pelajari kemahiran, dan cuba cabaran kreatif.':'Explore a lesson, practise a skill, and build something you are proud of.'}</p></div>
        <button type="button" onClick={()=>setActiveTab('explore_classes')}>{language==='ms'?'Teroka kelas':'Discover classes'} <ArrowRight size={16}/></button>
      </section>
      <div className="md:hidden grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setActiveTab('lessons')} className="rounded-2xl bg-white border border-sky-100 shadow-sm p-4 flex items-center gap-3 text-left text-sky-800 font-extrabold text-sm"><span className="bg-sky-100 rounded-xl p-2"><BookMarked className="w-5 h-5"/></span>{t('goToLessons')}</button>
        <button type="button" onClick={() => setActiveTab('coding_workspace')} className="rounded-2xl bg-white border border-teal-100 shadow-sm p-4 flex items-center gap-3 text-left text-teal-800 font-extrabold text-sm"><span className="bg-teal-100 rounded-xl p-2"><Code2 className="w-5 h-5"/></span>{t('practicePython')}</button>
      </div>

      {/* Simple discovery shortcuts: core dashboard and existing learning tools remain. */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label={language==='ms'?'Aktiviti baharu':'Learning adventures'}>
        <button onClick={() => setActiveTab('cilik_arcade')} className="text-left group bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md">
          <span className="bg-white/15 p-3 rounded-xl"><Gamepad2 size={27}/></span><span className="flex-1"><strong className="block text-base">Cilik Arcade</strong><span className="text-xs text-violet-100">{language==='ms'?`Teroka ${WORLDS.length} permainan kod!`:`Explore ${WORLDS.length} coding games!`}</span></span><ArrowRight size={20}/>
        </button>
        <button onClick={() => setActiveTab('comic_library')} className="text-left group bg-white border border-sky-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md">
          <span className="bg-amber-100 text-amber-700 p-3 rounded-xl"><LibraryBig size={27}/></span><span className="flex-1"><strong className="block text-base text-slate-900">ComicCode</strong><span className="text-xs text-slate-500">{language==='ms'?'Tiga cerita Python untuk dibaca.':'Three Python stories to read.'}</span></span><ArrowRight size={20} className="text-sky-700"/>
        </button>
      </section>

      {/* Existing dashboard stays intact; the new quiz gets one discoverable shortcut. */}
      <section className="v25-quiz-promo" aria-label={language==='ms'?'Kuiz Pengetahuan':'Knowledge Quiz'}>
        <div className="v25-quiz-promo-photo"><RealPhoto photo="studyFriends" alt="Friends studying together using a tablet and books" fallback="/visuals/coding-friends.webp"/></div>
        <div className="v25-quiz-promo-body"><span>{language==='ms'?'KETAHUI LEBIH BANYAK':'DISCOVER SOMETHING NEW'}</span><h2>{language==='ms'?'Kuiz Pengetahuan':'Knowledge Quiz'}</h2><p>{language==='ms'?'Teroka 80 soalan tentang haiwan, sains, adiwira, angkasa dan banyak lagi.':'Explore 80 fun questions about animals, science, superheroes, space and more.'}</p></div>
        <button type="button" onClick={()=>setActiveTab('knowledge_quiz')}>{language==='ms'?'Mula kuiz':'Explore quizzes'} <ArrowRight size={17}/></button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="New learning shortcuts">
        <button onClick={()=>setActiveTab('daily_solver')} className="flex gap-3 items-center text-left bg-white border border-emerald-200 rounded-2xl p-5 hover:shadow-md"><span className="text-3xl">💻</span><span className="flex-1 min-w-0"><strong className="block text-emerald-900">Daily Coding Solver</strong><small className="block text-slate-600 mt-1">150 coding puzzles, run tests and earn XP</small></span><ArrowRight size={18}/></button>
        <article className="v34-student-live-card"><span className="icon"><Video size={23}/></span><span className="copy"><strong>{language==='ms'?'Bilik Langsung Saya':'My Live Room'}</strong><p>{language==='ms'?'Sertai kelas guru, semak kamera dan mikrofon, serta kongsikan skrin.':'Join teacher meetings, check your camera and mic, and share your screen.'}</p><button className="v34-inline-messages" type="button" onClick={()=>setActiveTab('community')}><MessageCircle size={13}/> {language==='ms'?'Mesej cikgu':'Message teacher'}</button></span><button type="button" onClick={()=>setActiveTab('live_classroom')}>{language==='ms'?'Buka bilik':'Open room'} <ArrowRight size={17}/></button></article>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('learningLevel')}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">{currentUser.gradeLevel}</div>
          <span className="text-[11px] text-slate-500">{currentUser.totalPoints} XP · {t('totalXP')}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('enrolledClasses')}</span>
            <BookMarked className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 tabular-nums">
            {enrolledClasses.length}
          </div>
          <span className="text-[11px] text-slate-500">{t('acrossCategories')}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('averageScore')}</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 tabular-nums">{avgScore === null ? "—" : `${avgScore}%`}</div>
          <span className="text-[11px] text-emerald-600 font-medium">{avgScore===null ? (language==='ms'?'Belum ada latihan lulus':'No completed tests yet') : t('strongProgress')}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('dailyStreak')}</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 tabular-nums">
            {currentUser.streakDays} {t('days')}
          </div>
          <span className="text-[11px] text-orange-600 font-medium">{t('keepGoing')}</span>
        </div>
      </div>

      {/* Main Grid: Enrolled Classes + Activity & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Active Courses (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">{t('myActiveClasses')}</h2>
                <p className="text-xs text-slate-500">{t('classesCaption')}</p>
              </div>
              <button
                onClick={() => setActiveTab('explore_classes')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>{t('exploreMore')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledClasses.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-all bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-medium text-sky-700">{c.category}</span>
                      <span>{c.difficulty}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {c.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span className="tabular-nums">{c.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>

                    <button
                      onClick={() => selectClass(c.id)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{t('continueClass')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Learning Activity Chart */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">{t('weeklyActivity')}</h2>
                <p className="text-xs text-slate-500">{language==='ms'?'Corak contoh untuk inspirasi — bukan aktiviti sebenar.':'Illustrative weekly pattern — not live activity data.'}</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                Illustrative activity
              </span>
            </div>
            <SimpleActivityLine data={activityData} height={140} />
          </div>
        </div>

        {/* Right Column: Achievements & Teacher Feedback (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Teacher Feedback Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">{t('teacherFeedback')}</h2>
            </div>

            {latestFeedback ? (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900">
                    {latestFeedback.teacherFeedback?.teacherName}
                  </span>
                  <span className="text-[10px] text-indigo-500">
                    {latestFeedback.teacherFeedback?.createdAt}
                  </span>
                </div>
                <p className="text-xs text-indigo-950 italic">
                  "{latestFeedback.teacherFeedback?.feedbackText}"
                </p>
                <div className="text-[11px] text-indigo-700 font-medium">
                  On Exercise: Welcome Robot (10/10)
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No teacher feedback yet.</p>
            )}
          </div>

          {/* Badges & Achievements */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Recent Badges</h2>
              </div>
              <button
                onClick={() => setActiveTab('student_progress')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
              >
                View all ({currentUser.badges.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {currentUser.badges.map(b => (
                <div
                  key={b.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{b.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Activities */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Recommended Next</h2>
            <div className="space-y-2">
              <div
                onClick={() => selectExercise('ex_05')}
                className="p-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 rounded-lg cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-slate-900">Multiplication Table of 5</div>
                <div className="text-[11px] text-slate-500">Logic & Loops Lab · 20 mins</div>
              </div>
              <div
                onClick={() => selectExercise('ex_06')}
                className="p-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 rounded-lg cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-slate-900">Treasure Chest Coins Total</div>
                <div className="text-[11px] text-slate-500">Accumulator pattern · 25 mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
