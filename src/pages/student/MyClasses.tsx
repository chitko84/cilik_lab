/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const MyClasses: React.FC = () => {
  const { classes, setActiveTab, selectExercise, selectClass } = useApp();
  const {t,language} = useLanguage();
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  const enrolledClasses = classes.filter(c => c.isEnrolled);

  const displayedClasses = enrolledClasses.filter(c => {
    if (filterTab === 'in_progress') return (c.progressPercent || 0) < 100;
    if (filterTab === 'completed') return (c.progressPercent || 0) === 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('myClasses')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language==='ms'?'Sambung kelas kamu dan bina projek Python yang menarik.':'Pick up right where you paused and build your Python project portfolio.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore_classes')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-lg transition-colors border border-sky-200"
        >
          <Compass className="w-4 h-4" />
          <span>{t('exploreMore')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {language==='ms'?'Semua kelas':'All enrolled'} ({enrolledClasses.length})
        </button>
        <button
          onClick={() => setFilterTab('in_progress')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterTab === 'in_progress'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {language==='ms'?'Sedang belajar':'In progress'} ({enrolledClasses.filter(c => (c.progressPercent || 0) < 100).length})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterTab === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {language==='ms'?'Selesai':'Completed'} ({enrolledClasses.filter(c => (c.progressPercent || 0) === 100).length})
        </button>
      </div>

      {/* Classes list */}
      {displayedClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No classes in this view</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Discover beginner-friendly classes and start your journey today!
          </p>
          <button
            onClick={() => setActiveTab('explore_classes')}
            className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg shadow-xs"
          >
            Browse Class Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedClasses.map(c => {
            const nextItem = c.syllabus.find(s => !s.completed) || c.syllabus[0];
            const isFinished = (c.progressPercent || 0) === 100;

            return (
              <div
                key={c.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                      {c.category}
                    </span>
                    <span>{c.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {c.description}
                  </p>

                  {/* Progress section */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Progress</span>
                      <span className="tabular-nums">{c.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFinished ? 'bg-emerald-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Syllabus mini summary */}
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Next Step
                    </div>
                    <div className="font-semibold text-slate-800 truncate">
                      {isFinished ? 'All lessons completed! 🌟' : nextItem?.title}
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {nextItem?.exerciseId ? (
                    <button
                      onClick={() => selectExercise(nextItem.exerciseId!)}
                      className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isFinished ? 'Review Exercise' : 'Continue Exercise'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('lessons')}
                      className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Lesson</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
