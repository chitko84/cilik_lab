/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Layers,
  PlusCircle,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeacherClasses: React.FC = () => {
  const { classes, setActiveTab, selectClass } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Basics', 'Logic & Loops', 'Game Dev', 'Creative Coding', 'Data & Lists', 'Problem Solving'];

  const filtered = classes.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || c.difficulty === filterDifficulty;
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    return matchesSearch && matchesDiff && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Class Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, and monitor instructional curriculums and student cohorts.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create_class')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Class</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your classes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Four-Column Desktop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
            onClick={() => selectClass(c.id)}
          >
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                  {c.category}
                </span>
                <span className="text-slate-500 text-[11px] font-medium">{c.difficulty}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                {c.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 mt-auto">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.enrolledCount} Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.lessonsCount} Modules</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    selectClass(c.id);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
