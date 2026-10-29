/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  HelpCircle,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Split,
  User,
  Users2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentPerformance: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    exercises,
    otherStudents,
    attempts,
    classes,
    sendTeacherFeedbackToAttempt,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [classFilter,setClassFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('usr_student_01');

  // Combined student roster
  const allStudents = [
    {
      id: 'usr_student_01',
      name: 'Sarah Ahmad',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahAhmad',
      score: 94,
      progress: 88,
      status: 'on_track',
      helpRequests: 1,
    },
    ...otherStudents,
  ];

  const filtered = allStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const inClass=classFilter==='all'||attempts.some(a=>a.studentId===s.id&&exercises.some(e=>e.id===a.exerciseId&&e.classId===classFilter));
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'needs_help' && s.status === 'needs_help') ||
      (filterStatus === 'on_track' && s.status === 'on_track') ||
      (filterStatus === 'advanced' && s.status === 'advanced');
    return matchesSearch && matchesStatus && inClass;
  });

  const selectedStudent =
    allStudents.find(s => s.id === selectedStudentId) || allStudents[0];

  // Attempts for selected student
  const studentAttempts = attempts.filter(a => a.studentId === selectedStudent.id && (classFilter==='all'||exercises.some(e=>e.id===a.exerciseId&&e.classId===classFilter)));

  // Teacher feedback input
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSendFeedback = (attemptId: string) => {
    if (!feedbackText.trim()) return;
    sendTeacherFeedbackToAttempt(attemptId, feedbackText.trim());
    setFeedbackSent(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Performance & Roster
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Inspect individual submissions, compare code revisions, and send encouraging mentor feedback.
        </p>
      </div>

      {/* Main 2-Column Split: Roster Table + Student Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <label className="block text-xs text-slate-600 font-bold">Class filter <select aria-label="Filter student attempts by class" value={classFilter} onChange={e=>setClassFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2 mt-1"><option value="all">All recorded classes</option>{classes.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select></label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white"
            >
              <option value="All">All Status</option>
              <option value="needs_help">Needs Help</option>
              <option value="on_track">On Track</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto">
            {filtered.map(student => {
              const isSelected = student.id === selectedStudent.id;
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>Avg: {student.score}%</span>
                        <span>·</span>
                        <span>Prog: {student.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {student.status === 'needs_help' ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs Help
                      </span>
                    ) : student.status === 'advanced' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Advanced
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        On Track
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Student Detailed Inspection (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Student Profile Card Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-12 h-12 rounded-full border border-slate-200"
              />
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedStudent.name}
                </h2>
                <span className="text-xs text-slate-500">
                  Grade 5 · Registered Explorer
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                {selectedStudent.score}%
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Average Mark
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 items-center flex-wrap justify-between"><div><strong className="text-amber-900 text-sm">{studentAttempts.filter(a=>a.status==='failed').length} incorrect submissions</strong><p className="text-xs text-amber-800 mt-1">Based on recorded code attempts in the selected class. Open each error below for details.</p></div><button type="button" onClick={()=>{sessionStorage.setItem('ciliklab_meeting_target',selectedStudent.id);setActiveTab('live_classroom')}} className="rounded-xl bg-emerald-700 text-white px-3 py-2 text-xs font-black">Schedule a meeting</button></div>

          {/* Submissions & Code Attempts History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Exercise Attempts History ({studentAttempts.length})
              </h3>
              <span className="text-xs text-slate-500">Recorded code attempts</span>
            </div>

            {studentAttempts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No detailed attempts recorded yet for this student.
              </div>
            ) : (
              <div className="space-y-4">
                {studentAttempts.map(att => (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Attempt #{att.attemptNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{att.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            att.status === 'passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.status === 'passed' ? 'Passed' : 'Error Encountered'}
                        </span>
                        <span className="font-bold text-slate-800 tabular-nums">
                          {att.score} / {att.maxScore} pts
                        </span>
                      </div>
                    </div>

                    {/* Code snippet */}
                    <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto whitespace-pre-wrap border border-slate-800">
                      {att.code}
                    </pre>

                    {/* Error info if failed */}
                    {att.error && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-rose-900 block">
                          {att.error.type} on Line {att.error.line}
                        </span>
                        <p className="text-rose-800">{att.error.friendlyExplanation}</p>
                      </div>
                    )}

                    {/* Reflection Note if student submitted one */}
                    {att.reflectionNotes && (
                      <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs space-y-1.5 text-sky-950">
                        <span className="font-bold text-sky-900 block">
                          Student Reflection Note:
                        </span>
                        <div className="space-y-1">
                          <p>
                            <strong>What changed:</strong> {att.reflectionNotes.whatChanged}
                          </p>
                          <p>
                            <strong>Why:</strong> {att.reflectionNotes.whyChanged}
                          </p>
                          <p>
                            <strong>How checked:</strong> {att.reflectionNotes.howVerified}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Existing Teacher Feedback */}
                    {att.teacherFeedback && (
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs space-y-1 text-indigo-950">
                        <span className="font-bold text-indigo-900 block">
                          Your Feedback ({att.teacherFeedback.teacherName}):
                        </span>
                        <p className="italic">&quot;{att.teacherFeedback.feedbackText}&quot;</p>
                      </div>
                    )}

                    {/* Send Feedback Input */}
                    <div className="pt-2 border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type personalized mentor guidance for this attempt..."
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        className="flex-1 p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleSendFeedback(att.id)}
                        disabled={!feedbackText.trim()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
