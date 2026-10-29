/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Edit3,
  Layers,
  MessageSquare,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CodingExercise } from '../../types';

export const ClassManagement: React.FC = () => {
  const {
    classes,
    activeClassId,
    setActiveTab,
    exercises,
    otherStudents,
    attempts,
    createExercise,
  } = useApp();

  const currentClass = classes.find(c => c.id === activeClassId) || classes[0];

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'exercises' | 'students' | 'submissions'>('overview');

  // New exercise modal
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newStarterCode, setNewStarterCode] = useState('print("Hello!")\n');
  const [newExpectedOutput, setNewExpectedOutput] = useState('Hello!');
  const [newStage1, setNewStage1] = useState('Remember that print() outputs text.');
  const [newStage2, setNewStage2] = useState('Are quotes placed correctly?');
  const [newStage3, setNewStage3] = useState('Call print("Hello!")');

  const classExercises = exercises.filter(e => e.classId === currentClass.id);
  const classAttempts = attempts.filter(a => {
    const ex = exercises.find(e => e.id === a.exerciseId);
    return ex?.classId === currentClass.id;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createExercise({
      classId: currentClass.id,
      className: currentClass.title,
      title: newTitle.trim(),
      shortDesc: 'Practice problem for this class module.',
      instructions: newInstructions.trim() || 'Write Python code to solve the challenge.',
      learningObjective: 'Master the concept through hands-on practice.',
      difficulty: currentClass.difficulty,
      starterCode: newStarterCode,
      solutionCode: newStarterCode,
      maxMarks: 20,
      testCases: [
        {
          id: `tc_${Date.now()}`,
          name: 'Main verification test',
          expectedOutput: newExpectedOutput.trim(),
        },
      ],
      hints: {
        stage1Concept: newStage1,
        stage2Think: newStage2,
        stage3Action: newStage3,
      },
    });

    setShowAddExModal(false);
    setNewTitle('');
    alert(`Exercise "${newTitle}" added to ${currentClass.title}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('teacher_classes')}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-indigo-700">{currentClass.category}</span>
              <span>·</span>
              <span>{currentClass.difficulty}</span>
              <span>·</span>
              <span>{currentClass.enrolledCount} enrolled</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentClass.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddExModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Coding Exercise</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview & Syllabus
        </button>
        <button
          onClick={() => setActiveSubTab('exercises')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'exercises'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Exercises ({classExercises.length})
        </button>
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'students'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Enrolled Cohort ({currentClass.enrolledCount})
        </button>
        <button
          onClick={() => setActiveSubTab('submissions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'submissions'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Submissions History ({classAttempts.length})
        </button>
      </div>

      {/* Sub-Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Class Description</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentClass.description}
              </p>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Learning Outcomes
                </h3>
                <div className="space-y-1.5">
                  {currentClass.learningOutcomes.map((out, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Curriculum Syllabus</h2>
              <div className="space-y-2">
                {currentClass.syllabus.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{s.title}</span>
                    </div>
                    <span className="text-slate-400 capitalize">
                      {s.type} · {s.durationMin} mins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Class Key Metrics</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Language:</span>
                  <span className="font-bold text-slate-800">{currentClass.language}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Enrolled Students:</span>
                  <span className="font-bold text-slate-800">{currentClass.enrolledCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Duration:</span>
                  <span className="font-bold text-slate-800">{currentClass.durationHours} hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Last Curriculum Update:</span>
                  <span className="font-bold text-slate-800">{currentClass.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Exercises */}
      {activeSubTab === 'exercises' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classExercises.map(ex => (
              <div
                key={ex.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {ex.difficulty}
                  </span>
                  <span className="text-slate-500">{ex.maxMarks} marks</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{ex.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{ex.instructions}</p>

                <div className="p-2.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto">
                  <span className="text-slate-500 block text-[10px]">Starter Code:</span>
                  {ex.starterCode}
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <div><strong>Stage 1 Hint:</strong> {ex.hints.stage1Concept}</div>
                  <div><strong>Stage 2 Hint:</strong> {ex.hints.stage2Think}</div>
                  <div><strong>Stage 3 Hint:</strong> {ex.hints.stage3Action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Students */}
      {activeSubTab === 'students' && (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Enrolled Student Cohort</h2>
          <div className="divide-y divide-slate-100">
            {otherStudents.slice(0, 10).map(s => (
              <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full border border-slate-200" />
                  <div>
                    <span className="font-bold text-slate-900 block">{s.name}</span>
                    <span className="text-[10px] text-slate-400">Grade 5 · Active Explorer</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tabular-nums font-bold text-slate-700">{s.score}% avg score</span>
                  <span className="tabular-nums text-slate-500">{s.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Submissions */}
      {activeSubTab === 'submissions' && (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Recent Class Submissions</h2>
          {classAttempts.length === 0 ? (
            <p className="text-xs text-slate-400">No submissions recorded for this class yet.</p>
          ) : (
            <div className="space-y-3">
              {classAttempts.map(att => (
                <div key={att.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{att.studentName}</span>
                    <span className="text-[10px] text-slate-400">{att.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-600">{att.score}/{att.maxScore} pts</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${att.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {att.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Coding Exercise Modal */}
      {showAddExModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Exercise to {currentClass.title}</h3>
              <button onClick={() => setShowAddExModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exercise Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Secret Door Password Checker"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Explain what the learner must write in Python..."
                  value={newInstructions}
                  onChange={e => setNewInstructions(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Starter Code</label>
                <textarea
                  rows={3}
                  value={newStarterCode}
                  onChange={e => setNewStarterCode(e.target.value)}
                  className="w-full p-2 font-mono text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expected Test Output</label>
                <input
                  type="text"
                  value={newExpectedOutput}
                  onChange={e => setNewExpectedOutput(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                <span className="font-bold text-amber-900 block">Progressive Hints</span>
                <div>
                  <label className="text-[10px] font-bold text-amber-800 block">Stage 1 (Concept Reminder):</label>
                  <input
                    type="text"
                    value={newStage1}
                    onChange={e => setNewStage1(e.target.value)}
                    className="w-full p-1.5 bg-white text-xs rounded border border-amber-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-amber-800 block">Stage 2 (Guiding Question):</label>
                  <input
                    type="text"
                    value={newStage2}
                    onChange={e => setNewStage2(e.target.value)}
                    className="w-full p-1.5 bg-white text-xs rounded border border-amber-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-amber-800 block">Stage 3 (Debugging Action):</label>
                  <input
                    type="text"
                    value={newStage3}
                    onChange={e => setNewStage3(e.target.value)}
                    className="w-full p-1.5 bg-white text-xs rounded border border-amber-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs"
                >
                  Create Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
