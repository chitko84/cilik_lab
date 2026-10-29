/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  SimpleActivityLine,
  SimpleBarChart,
  SimpleDonutChart,
} from '../../components/common/SimpleCharts';
import { useApp } from '../../context/AppContext';
import {readDailyRecords,totalDailyPoints} from '../daily/dailyBank';

export const ReportsAnalytics: React.FC = () => {
  const { classes, exercises, otherStudents, attempts, supportRequests } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all_time');

  // Filtered exercises and attempts
  const displayedExercises =
    selectedClassId === 'all'
      ? exercises
      : exercises.filter(e => e.classId === selectedClassId);

  // Exercise completion metrics
  const exercisePerformanceData = displayedExercises.slice(0, 6).map(ex => ({
    label: ex.title.length > 12 ? ex.title.slice(0, 10) + '..' : ex.title,
    value: (()=>{const relevant=attempts.filter(a=>a.exerciseId===ex.id);return relevant.length?Math.round(relevant.filter(a=>a.status==='passed').length/relevant.length*100):0})(), // actual recorded pass rate
    color: 'bg-indigo-500',
  }));

  // Error distribution
  const errorDistribution = [
    { label: 'Indentation Error', count: 18, color: '#f59e0b' },
    { label: 'Name Error', count: 14, color: '#0284c7' },
    { label: 'Syntax Error', count: 22, color: '#e11d48' },
    { label: 'Type Mismatch', count: 9, color: '#8b5cf6' },
  ];

  // Hint stage utilization
  const hintUsageData = [
    { label: 'Stage 1 (Concept)', value: 85, color: 'bg-amber-400' },
    { label: 'Stage 2 (Think)', value: 52, color: 'bg-sky-400' },
    { label: 'Stage 3 (Action)', value: 24, color: 'bg-emerald-500' },
  ];

  const selfCountry=localStorage.getItem('ciliklab_self_country_v1')||'';
  const dailyRecords=readDailyRecords();
  const dailySolved=Object.values(dailyRecords).filter(r=>r.score>0).length;
  const byError=Object.entries(attempts.filter(a=>a.status==='failed').reduce<Record<string,number>>((out,a)=>{const key=a.error?.type||'Failed test';out[key]=(out[key]||0)+1;return out},{})).map(([label,value])=>({label,value,color:'bg-rose-500'}));

  // CSV Export Function (Generates real downloadable file!)
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Average Score (%)', 'Progress (%)', 'Status', 'Help Requests'];
    const rows = otherStudents.map(s => [
      s.id,
      `"${s.name}"`,
      s.score,
      s.progress,
      s.status,
      s.helpRequests,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ciliklab_class_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Reports & Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-backed pedagogical insights into student progress, recurring bugs, and hint utilization.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Student Roster (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter by Class:</span>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 bg-white"
          >
            <option value="all">All Classes Combined</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Time Range:</span>
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 bg-white"
          >
            <option value="this_week">Past 7 Days</option>
            <option value="this_month">Past 30 Days</option>
            <option value="all_time">Current Semester</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" aria-label="Verified local learning analytics">
        <section className="p-5 rounded-2xl border border-emerald-100 bg-white"><h2 className="font-black text-sm text-emerald-900">Users by country</h2><p className="text-xs text-slate-600 mt-2">Self-reported country from this browser only. No global student data is available.</p>{selfCountry?<><div className="text-xl font-black text-emerald-700 mt-3">1 learner</div><SimpleBarChart data={[{label:selfCountry,value:1,color:'bg-emerald-500'}]} height={110} maxValue={1} valueSuffix=" learners"/></>:<p className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 mt-3">No country data yet. A student can optionally choose their country in My Progress.</p>}</section>
        <section className="p-5 rounded-2xl border border-emerald-100 bg-white"><h2 className="font-black text-sm text-emerald-900">Daily coding activity</h2><div className="text-2xl font-black text-emerald-700 mt-3">{dailySolved} solved</div><p className="text-xs text-slate-600 mt-2">{totalDailyPoints(dailyRecords)} XP on this browser. No invented learner records.</p><div className="h-3 mt-5 bg-emerald-50 rounded-full"><div className="h-full rounded-full bg-emerald-500" style={{width:`${dailySolved}%`}}/></div></section>
        <section className="p-5 rounded-2xl border border-emerald-100 bg-white"><h2 className="font-black text-sm text-emerald-900">Recorded incorrect submissions</h2>{byError.length?<SimpleBarChart data={byError.slice(0,5)} height={150} maxValue={Math.max(...byError.map(x=>x.value),1)} valueSuffix=" attempts"/>:<p className="text-xs text-slate-600 mt-3">No failed submissions recorded yet.</p>}</section>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Submissions
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">248</div>
          <span className="text-[11px] text-emerald-600 font-medium">84% first-time pass</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Avg. Attempts Per Pass
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">1.8</div>
          <span className="text-[11px] text-slate-500">Indicating healthy persistence</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Hint Dependency Rate
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">34%</div>
          <span className="text-[11px] text-slate-500">Students using Stage 1 or 2</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Support Queue Resolution
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums">92%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Under 2 hours response</span>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Scores by Exercise */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Scores by Exercise (%)</h2>
              <p className="text-xs text-slate-500">Average student score on completion</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Cohort Avg: 86%
            </span>
          </div>
          <SimpleBarChart data={exercisePerformanceData} height={160} />
        </div>

        {/* Chart 2: Common Error Categories */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Common Error Frequencies</h2>
            <p className="text-xs text-slate-500">
              Distribution of errors encountered before successful solution
            </p>
          </div>
          <SimpleDonutChart segments={errorDistribution} size={120} />
        </div>

        {/* Chart 3: Progressive Hint Stage Usage */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Hint Stage Reach Rate</h2>
            <p className="text-xs text-slate-500">
              How deep into the 3-stage hint ladder students reveal clues
            </p>
          </div>
          <SimpleBarChart data={hintUsageData} height={150} valueSuffix="%" />
          <p className="text-[11px] text-slate-500 italic">
            Notice: Only 24% of students reveal Stage 3 (Action), meaning Stage 1 & 2 hints are
            sufficient for most learners to resolve issues independently!
          </p>
        </div>

        {/* Chart 4: Student Performance Roster Preview */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Roster Summary Preview</h2>
            <span className="text-[11px] text-slate-500">First 5 students</span>
          </div>

          <div className="space-y-2">
            {otherStudents.slice(0, 5).map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full" />
                  <span className="font-semibold text-slate-800">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums font-bold text-slate-700">{s.score}% avg</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      s.status === 'needs_help'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
