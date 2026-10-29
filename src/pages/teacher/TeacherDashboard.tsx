/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookMarked,
  CheckCircle2,
  Clock,
  FileQuestion,
  HelpCircle,
  Layers,
  LifeBuoy,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users2,
  Video,
  MessageSquare,
} from 'lucide-react';
import {
  SimpleActivityLine,
  SimpleBarChart,
  SimpleDonutChart,
} from '../../components/common/SimpleCharts';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLearningExtras } from '../../hooks/useLearningExtras';
import { WORLDS } from '../arcade/addons/AdventureExtras';
import { Gamepad2 } from 'lucide-react';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {PhotoSlideshow} from '../../components/visual/PhotoSlideshow';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    supportRequests,
    feedbackReports,
    misconceptions,
    setActiveTab,
    otherStudents,
    selectClass,
  } = useApp();

  const {t,language} = useLanguage();
  const {progress:extras,total:arcadePoints} = useLearningExtras();
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + c.enrolledCount, 0);
  const openHelpRequests = supportRequests.filter(r => r.status === 'open');
  const pendingFeedback = feedbackReports.filter(r => r.status === 'pending');

  // Chart data: Average score by class
  const classScoreData = [
    { label: 'Beginners', value: 88, color: 'bg-sky-500' },
    { label: 'Loops Lab', value: 74, color: 'bg-amber-500' },
    { label: 'Game Dev', value: 82, color: 'bg-indigo-500' },
    { label: 'Variables', value: 92, color: 'bg-emerald-500' },
    { label: 'Functions', value: 78, color: 'bg-teal-500' },
    { label: 'Lists', value: 85, color: 'bg-purple-500' },
  ];

  // Donut score distribution
  const scoreSegments = [
    { label: 'Mastery (90-100%)', count: 14, color: '#10b981' },
    { label: 'Proficient (75-89%)', count: 18, color: '#0284c7' },
    { label: 'Needs Support (<75%)', count: 6, color: '#f59e0b' },
  ];

  // Activity trend data
  const activityData = [
    { day: 'Mon', minutes: 120, exercisesCompleted: 18 },
    { day: 'Tue', minutes: 190, exercisesCompleted: 26 },
    { day: 'Wed', minutes: 160, exercisesCompleted: 22 },
    { day: 'Thu', minutes: 240, exercisesCompleted: 34 },
    { day: 'Fri', minutes: 210, exercisesCompleted: 29 },
    { day: 'Sat', minutes: 90, exercisesCompleted: 12 },
    { day: 'Sun', minutes: 140, exercisesCompleted: 19 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="premium-dashboard-hero premium-teacher-hero p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <RealPhoto photo="roboticsWorkshop" alt="Teacher helping children assemble a robot during a class activity" className="premium-dashboard-photo" fallback="/visuals/coding-friends.webp"/>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('teacherSpace')} · {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('teacherDashboard')}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {t('teacherDashboardDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('create_class')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('createClass')}</span>
          </button>
          <button
            onClick={() => setActiveTab('support_queue')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>{t('supportQueue')} ({openHelpRequests.length})</span>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
        <Gamepad2 size={20} className="text-indigo-600 shrink-0 mt-0.5"/>
        <div><p className="font-bold text-sm text-indigo-950">{language==='ms'?'Aktiviti Cilik Arcade pada peranti ini':'Cilik Arcade activity on this device'}</p>
        <p className="text-xs text-indigo-700 mt-1">{extras.completed.filter(k=>WORLDS.some(w=>w.ids.includes(k as never))).length} {language==='ms'?'cabaran selesai':'challenges completed'} · {arcadePoints} {language==='ms'?'mata permainan':'game points'} · {language==='ms'?'Data ini belum disegerakkan merentas peranti.':'This data is not yet synchronized across devices.'}</p></div>
      </div>

      <div className="premium-teacher-feature">
        <PhotoSlideshow variant="compact" label={language==='ms'?'Galeri kelas':'Classroom moments gallery'} autoPlayMs={8900} slides={[
          {photo:'mentoringMoment',alt:'Teacher helping children with schoolwork in a bright classroom',fallback:'/visuals/coding-friends.webp'},
          {photo:'educatorLaptop',alt:'Teacher preparing lessons at a laptop',fallback:'/visuals/hero-adventure.webp'},
          {photo:'modernComputerClass',alt:'Students learning in a classroom computer lab',fallback:'/visuals/coding-friends.webp'}
        ]}/>
        <div><span className="premium-eyebrow">{language==='ms'?'SUMBER UNTUK GURU':'EDUCATOR TOOLS'}</span><h2>{language==='ms'?'Bina pengalaman belajar yang hebat':'Bring great learning moments to your class'}</h2><p>{language==='ms'?'Urus kelas, beri maklum balas dan bantu pelajar meneroka Python.':'Manage classes, support learners and explore creative coding lessons.'}</p></div>
        <button onClick={()=>setActiveTab('teacher_classes')}>{language==='ms'?'Lihat kelas':'View classes'} <ArrowRight size={17}/></button>
      </div>

      <section className="v34-teacher-connect" aria-label="Teacher classroom communications">
        <div><span className="v34-eyebrow">KEEP LEARNING TOGETHER</span><h2>Meet and message your learners</h2><p>Open a live coding session, or continue a helpful conversation from Class Community.</p></div>
        <div className="v34-teacher-connect-actions"><button type="button" onClick={()=>setActiveTab('live_classroom')}><Video size={17}/> Live Classroom</button><button type="button" className="outline" onClick={()=>setActiveTab('community')}><MessageSquare size={17}/> Conversations</button></div>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('activeClasses')}</span>
            <BookMarked className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{totalClasses}</div>
          <span className="text-[11px] text-slate-500">Across 6 programming domains</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('learners')}</span>
            <Users2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{totalStudents}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Current enrollment snapshot</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Support Requests</span>
            <LifeBuoy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {openHelpRequests.length} Open
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Needs teacher response</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Example Class Avg.</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">84.2%</div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Illustrative starter value
          </span>
        </div>
      </div>

      {/* Main Grid: Charts & Support Queue Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Average Scores by Class */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Average Scores by Class · Example Data</h2>
                <p className="text-xs text-slate-500">Illustrative values; not live synced performance</p>
              </div>
              <button
                onClick={() => setActiveTab('reports_analytics')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Full Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <SimpleBarChart data={classScoreData} height={160} />
          </div>

          {/* Activity Trends */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Student Exercise Submissions</h2>
                <p className="text-xs text-slate-500">Weekly student workspace activity and runs</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                Illustrative activity chart
              </span>
            </div>
            <SimpleActivityLine data={activityData} height={140} />
          </div>

          {/* Performance Distribution */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Performance Distribution · Example Data</h2>
            <SimpleDonutChart segments={scoreSegments} size={110} />
          </div>
        </div>

        {/* Right Column: Support Queue Action Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Urgent Support Cards */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Student Support Queue</h2>
              </div>
              <button
                onClick={() => setActiveTab('support_queue')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
              >
                View all ({openHelpRequests.length})
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Students who explicitly requested help or encountered repeated test errors:
            </p>

            <div className="space-y-3">
              {openHelpRequests.slice(0, 3).map(req => (
                <div
                  key={req.id}
                  onClick={() => setActiveTab('support_queue')}
                  className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl hover:bg-amber-100/60 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={req.studentAvatar}
                        alt={req.studentName}
                        className="w-6 h-6 rounded-full border border-slate-200"
                      />
                      <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {req.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 font-medium">
                    {req.exerciseTitle}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    &quot;{req.message}&quot;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-amber-200/60">
                    <span>{req.attemptCount} attempts</span>
                    <span>{req.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Misconceptions Quick Callout */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-bold text-slate-900">Class Misconceptions</h2>
              </div>
              <button
                onClick={() => setActiveTab('class_support')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Manage ({misconceptions.length})
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Recurring error patterns grouped across student submissions:
            </p>

            <div className="space-y-2">
              {misconceptions.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('class_support')}
                  className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-slate-800 block truncate">{m.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{m.exerciseTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[11px] shrink-0">
                    {m.affectedAttemptsCount} students
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
