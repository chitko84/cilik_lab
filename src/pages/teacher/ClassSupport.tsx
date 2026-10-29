/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClassSupport: React.FC = () => {
  const { misconceptions, addPost, setActiveTab, currentUser } = useApp();
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  const handleBroadcastMiniLesson = (miscLabel: string, explanation: string) => {
    addPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'teacher',
      authorAvatar: currentUser.avatar,
      title: `Teacher Mini-Lesson: ${miscLabel} 💡`,
      content: `Notice on common pattern: ${explanation}\nKeep experimenting and check your line indentations and variable names!`,
      category: 'tips',
    });

    setBroadcastSuccess(miscLabel);
    setTimeout(() => setBroadcastSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Class Support & Shared Misconceptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detect recurring mistake patterns across student code and broadcast targeted mini-lessons.
        </p>
      </div>

      {broadcastSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mini-lesson on &quot;{broadcastSuccess}&quot; posted to Class Community feed!
          </span>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs underline font-bold"
          >
            View Post
          </button>
        </div>
      )}

      {/* Misconceptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {misconceptions.map(m => (
          <div
            key={m.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                  {m.category}
                </span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {m.affectedAttemptsCount} student attempts
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{m.label}</h3>
              <p className="text-xs text-slate-500 mb-3">On Exercise: {m.exerciseTitle}</p>

              {/* Recurring Code Pattern Snippet */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Recurring Code Pattern
                </span>
                <pre className="p-2.5 bg-slate-950 text-rose-300 font-mono text-xs rounded-lg border border-slate-800 whitespace-pre-wrap">
                  {m.recurringSnippet}
                </pre>
              </div>

              {/* Suggested Mini-Lesson Explanation */}
              <div className="mt-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Suggested Pedagogical Explanation:</span>
                </div>
                <p className="text-indigo-950 leading-relaxed">{m.suggestedMiniLesson}</p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 capitalize">
                Status: {m.reviewStatus}
              </span>
              <button
                onClick={() => handleBroadcastMiniLesson(m.label, m.suggestedMiniLesson)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Broadcast Mini-Lesson</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
