/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Filter,
  Layers,
  Lightbulb,
  PlusCircle,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GuidanceResource } from '../../types';

export const GuidanceLibrary: React.FC = () => {
  const { guidanceResources, createGuidance } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // New guidance modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [newType, setNewType] = useState<'concept_reminder' | 'debugging_question' | 'progressive_hint' | 'mini_lesson'>('concept_reminder');
  const [newTags, setNewTags] = useState('Loops, Variables');
  const [newErrorType, setNewErrorType] = useState('IndentationError');

  const filtered = guidanceResources.filter(g => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.conceptTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || g.resourceType === filterType;
    const matchesDiff = filterDifficulty === 'All' || g.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDiff;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    createGuidance({
      title: newTitle.trim(),
      content: newContent.trim(),
      conceptTags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      difficulty: newDifficulty,
      resourceType: newType,
      relatedErrorType: newErrorType || undefined,
      reviewStatus: 'approved',
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    alert('Guidance resource added to library!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Reusable Guidance Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized, teacher-approved explanations and progressive hints ready to attach to student support requests.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Guidance Resource</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic tag, error, or explanation keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Resource:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
          >
            <option value="All">All Types</option>
            <option value="concept_reminder">Concept Reminders</option>
            <option value="debugging_question">Debugging Questions</option>
            <option value="progressive_hint">Progressive Hints</option>
            <option value="mini_lesson">Mini Lessons</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={e => setFilterDifficulty(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Elementary">Elementary</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>
      </div>

      {/* Grid of Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] capitalize">
                  {item.resourceType.replace('_', ' ')}
                </span>
                <span className="text-slate-500 text-[11px] font-medium">{item.difficulty}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.conceptTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {item.relatedErrorType && (
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-mono font-medium">
                    {item.relatedErrorType}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Used {item.usageCount} times</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Teacher Approved
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Guidance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Guidance Resource</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Off-by-one Loop Boundary Clarification"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Plain-Language Content *
                </label>
                <textarea
                  rows={4}
                  placeholder="Write an encouraging, child-friendly explanation..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Resource Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 text-xs rounded border border-slate-200 bg-white"
                  >
                    <option value="concept_reminder">Concept Reminder</option>
                    <option value="debugging_question">Debugging Question</option>
                    <option value="progressive_hint">Progressive Hint</option>
                    <option value="mini_lesson">Mini Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 text-xs rounded border border-slate-200 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Concept Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Loops, Indentation, Variables"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
