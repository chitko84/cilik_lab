/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useState} from 'react';
import {
  Award,
  BookMarked,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  HelpCircle,
  Medal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { SimpleActivityLine, SimpleBarChart } from '../../components/common/SimpleCharts';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLearningExtras } from '../../hooks/useLearningExtras';
import { WORLDS } from '../arcade/addons/AdventureExtras';
import { Gamepad2 } from 'lucide-react';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {readDailyRecords,totalDailyPoints} from '../daily/dailyBank';

export const StudentProgress: React.FC = () => {
  const { currentUser, classes, attempts, exercises, otherStudents } = useApp();
  const {t,language} = useLanguage();
  const {progress:extraProgress,total:arcadeXP} = useLearningExtras();

  const [country,setCountry]=useState(()=>localStorage.getItem('ciliklab_self_country_v1')||'');
  const dailyRecords=readDailyRecords();
  const solvedDaily=Object.values(dailyRecords).filter(r=>r.score>0).length;
  const dailyPoints=totalDailyPoints(dailyRecords);
  const enrolled = classes.filter(c => c.isEnrolled);

  // Student attempts
  const myAttempts = attempts.filter(a => a.studentId === currentUser.id);
  const passedAttempts = myAttempts.filter(a => a.status === 'passed');

  // Compute average score
  const avgScore =
    passedAttempts.length > 0
      ? Math.round(
          passedAttempts.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) /
            passedAttempts.length
        )
      : 88;

  // Chart data: Scores by exercise
  const exerciseChartData = [
    { label: 'Welcome Robot', value: 100, color: 'bg-emerald-500' },
    { label: 'Superhero Bio', value: 100, color: 'bg-emerald-500' },
    { label: 'Pet Age Calc', value: 85, color: 'bg-sky-500' },
    { label: 'Rocket Countdown', value: 100, color: 'bg-emerald-500' },
    { label: 'Multiples of 5', value: 75, color: 'bg-amber-500' },
  ];

  // Weekly timeline
  const weeklyData = [
    { day: 'Mon', minutes: 25, exercisesCompleted: 1 },
    { day: 'Tue', minutes: 40, exercisesCompleted: 2 },
    { day: 'Wed', minutes: 15, exercisesCompleted: 1 },
    { day: 'Thu', minutes: 50, exercisesCompleted: 2 },
    { day: 'Fri', minutes: 30, exercisesCompleted: 1 },
    { day: 'Sat', minutes: 65, exercisesCompleted: 3 },
    { day: 'Sun', minutes: 45, exercisesCompleted: 2 },
  ];

  // Constructive ranking list (Current student + fictional peers)
  const classRoster = [
    { name: 'Danial Haziq', score: 96, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Danial', level: 'Level 6 Explorer' },
    { name: 'Sarah Ahmad (You)', score: 94, avatar: currentUser.avatar, isCurrent: true, level: 'Level 5 Explorer' },
    { name: 'Alya Dania', score: 92, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alya', level: 'Level 5 Explorer' },
    { name: 'Nurul Izzah', score: 90, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nurul', level: 'Level 5 Explorer' },
    { name: 'Ethan Walker', score: 88, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ethan', level: 'Level 4 Explorer' },
    { name: 'Kenji Tanaka', score: 85, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kenji', level: 'Level 4 Explorer' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('myProgress')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your coding milestones, score consistency, and unlocked badges.
        </p>
      </div>

      <div className="v26-progress-photo" aria-label={language==='ms'?'Suasana belajar':'Learning inspiration'}>
        <RealPhoto photo="independentStudy" alt="Child working independently on schoolwork at a desk" fallback="/visuals/coding-friends.webp"/>
        <div><span>{language==='ms'?'LANGKAH DEMI LANGKAH':'ONE STEP AT A TIME'}</span><strong>{language==='ms'?'Setiap percubaan membawa kemajuan.':'Every try is a step forward.'}</strong></div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white border border-violet-100 rounded-2xl shadow-sm">
        <span className="rounded-xl bg-violet-100 text-violet-700 p-3"><Gamepad2/></span>
        <div><p className="font-extrabold text-slate-900 text-sm">Cilik Arcade</p><p className="text-xs text-slate-500">{extraProgress.completed.filter(k=>WORLDS.some(w=>w.ids.includes(k as never))).length} {language==='ms'?'cabaran selesai':'challenges completed'} · {arcadeXP} {language==='ms'?'mata permainan':'game points'}</p></div>
      </div>

      <p className="text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-3">{language==='ms'?'Carta mingguan dan kedudukan kelas di bawah menggunakan data contoh; rekod Arcade yang sebenar terpapar di Cilik Arcade → Kemajuan.':'The weekly chart and class standing below use illustrative starter data; your actual Arcade records are available in Cilik Arcade → My Progress.'}</p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Daily coding and country profile">
        <div className="p-5 bg-white border border-emerald-100 rounded-2xl"><h2 className="font-extrabold text-emerald-900 text-sm">Daily Coding Solver</h2><div className="text-2xl font-black mt-2 text-emerald-700">{solvedDaily} / 100</div><p className="text-xs text-slate-600 mt-2">Solved challenges · {dailyPoints} XP earned on this device</p><div className="h-3 bg-emerald-50 rounded-xl mt-3 overflow-hidden"><div className="h-full bg-emerald-500 rounded-xl" style={{width:`${solvedDaily}%`}}/></div></div>
        <div className="p-5 bg-white border border-emerald-100 rounded-2xl"><h2 className="font-extrabold text-emerald-900 text-sm">My country (optional)</h2><p className="text-xs text-slate-600 my-2">Country charts use only self-reported profile data, not assumed locations.</p><select aria-label="Select your country" className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white" value={country} onChange={e=>{setCountry(e.target.value);localStorage.setItem('ciliklab_self_country_v1',e.target.value)}}>{['','Malaysia','Myanmar','Bangladesh','Nigeria','Afghanistan','Indonesia','Other'].map(c=><option key={c} value={c}>{c||'Prefer not to say'}</option>)}</select></div>
      </section>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Overall Class Standing
            </span>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>Top 5%</span>
              <Medal className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Rank #2 of 28 peers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Exercises Completed
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {currentUser.completedLessonsCount}
            </div>
            <span className="text-[11px] text-slate-500">Across 4 enrolled classes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Average Performance
            </span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{avgScore}%</div>
            <span className="text-[11px] text-emerald-600 font-medium">
              Excellent problem solving
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Charts + Class Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Charts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Exercise Score History Chart */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Exercise Scores</h2>
                <p className="text-xs text-slate-500">Score percentage on first successful submission</p>
              </div>
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                Python Exercises
              </span>
            </div>
            <SimpleBarChart data={exerciseChartData} height={160} />
          </div>

          {/* Weekly Practice Time */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Weekly Practice Minutes</h2>
                <p className="text-xs text-slate-500">Time spent in Python Coding Workspace</p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">
                270 Mins Total
              </span>
            </div>
            <SimpleActivityLine data={weeklyData} height={140} />
          </div>

          {/* Strengths & Growth Areas */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Learning Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                <span className="font-bold text-emerald-900 block mb-1">Key Strengths</span>
                <ul className="list-disc list-inside text-emerald-800 space-y-1">
                  <li>Precise variable naming</li>
                  <li>Clean for-loop structure</li>
                  <li>Active use of Visual Tracing</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-lg">
                <span className="font-bold text-amber-900 block mb-1">Opportunities to Grow</span>
                <ul className="list-disc list-inside text-amber-800 space-y-1">
                  <li>range(start, stop) boundary checks</li>
                  <li>Keeping accumulators outside loops</li>
                  <li>String vs Int conversions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Class breakdown & constructive ranking (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Class-by-Class Progress */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Class-by-Class Progress</h2>

            <div className="space-y-3">
              {enrolled.map(c => (
                <div key={c.id} className="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">
                      {c.title}
                    </span>
                    <span className="font-semibold text-slate-600 tabular-nums">
                      {c.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constructive Class Leaderboard */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Class Encouragement Board</h2>
              <span className="text-[11px] text-slate-500">Curious Beginners</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Celebrates consistent practice, problem solving, and helping classmates.
            </p>

            <div className="space-y-2">
              {classRoster.map((student, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    student.isCurrent
                      ? 'bg-sky-50 border-sky-300 shadow-xs font-semibold'
                      : 'bg-white border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-7 h-7 rounded-full border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-xs block text-slate-900 truncate">
                        {student.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {student.level}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-900 tabular-nums shrink-0 ml-2">
                    {student.score} pts
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
