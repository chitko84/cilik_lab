/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  PlusCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassSyllabusItem } from '../../types';

export const CreateClass: React.FC = () => {
  const { createClass, setActiveTab, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [category, setCategory] = useState<'Basics' | 'Game Dev' | 'Logic & Loops' | 'Creative Coding' | 'Problem Solving' | 'Data & Lists'>('Basics');
  const [durationHours, setDurationHours] = useState<number>(6);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Write clean, readable Python code',
    'Understand fundamental programming logic',
  ]);
  const [newOutcome, setNewOutcome] = useState('');

  const [syllabus, setSyllabus] = useState<ClassSyllabusItem[]>([
    { id: 's_init_1', title: 'Introduction & Core Concepts', type: 'concept', durationMin: 20 },
    { id: 's_init_2', title: 'First Interactive Code Challenge', type: 'exercise', durationMin: 25 },
  ]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleType, setNewModuleType] = useState<'concept' | 'exercise' | 'mini_project'>('concept');

  const [errorMsg, setErrorMsg] = useState('');

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      const newModule: ClassSyllabusItem = {
        id: `mod_${Date.now()}`,
        title: newModuleTitle.trim(),
        type: newModuleType,
        durationMin: 20,
      };
      setSyllabus([...syllabus, newModule]);
      setNewModuleTitle('');
    }
  };

  const handleRemoveModule = (id: string) => {
    setSyllabus(syllabus.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a class title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please write a brief description of the class.');
      return;
    }

    createClass({
      title: title.trim(),
      description: description.trim(),
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      language: 'Python',
      difficulty,
      category,
      durationHours,
      lessonsCount: syllabus.length,
      exercisesCount: syllabus.filter(s => s.type === 'exercise').length,
      accentColor: 'indigo',
      syllabus,
      learningOutcomes,
      status: 'active',
    });

    alert(`Class "${title}" created and published successfully!`);
    setActiveTab('teacher_classes');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('teacher_classes')}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Coding Class
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Design a structured learning module with interactive exercises for your students.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Basic Class Information
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Class Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Python Adventures: Game Crafting"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Short Description *
              </label>
              <textarea
                rows={3}
                placeholder="Describe what young coders will discover in this class..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Beginner">Beginner (Ages 7–10)</option>
                  <option value="Elementary">Elementary (Ages 10–12)</option>
                  <option value="Intermediate">Intermediate (Ages 12+)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subject Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Basics">Basics & Syntax</option>
                  <option value="Logic & Loops">Logic & Loops</option>
                  <option value="Game Dev">Game Development</option>
                  <option value="Creative Coding">Creative Coding</option>
                  <option value="Data & Lists">Data & Lists</option>
                  <option value="Problem Solving">Problem Solving</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estimated Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={durationHours}
                  onChange={e => setDurationHours(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Learning Outcomes
          </h2>

          <div className="space-y-2">
            {learningOutcomes.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOutcome(idx)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add another outcome (e.g. Master while-loops)..."
                value={newOutcome}
                onChange={e => setNewOutcome(e.target.value)}
                className="flex-1 p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddOutcome}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors"
              >
                Add Outcome
              </button>
            </div>
          </div>
        </div>

        {/* Syllabus Modules */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Syllabus Outline ({syllabus.length} Items)
          </h2>

          <div className="space-y-2">
            {syllabus.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{m.title}</span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {m.type} · {m.durationMin} mins
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(m.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add Module Row */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Module title (e.g. Practice: Rocket Launch Challenge)..."
                value={newModuleTitle}
                onChange={e => setNewModuleTitle(e.target.value)}
                className="flex-1 p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newModuleType}
                onChange={e => setNewModuleType(e.target.value as any)}
                className="p-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value="concept">Concept Lesson</option>
                <option value="exercise">Coding Exercise</option>
                <option value="mini_project">Mini Project</option>
              </select>
              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('teacher_classes')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Publish Class to Students</span>
          </button>
        </div>
      </form>
    </div>
  );
};
