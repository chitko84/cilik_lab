/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  FileQuestion,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeedbackReview: React.FC = () => {
  const { feedbackReports, resolveFeedbackReport } = useApp();

  const [selectedReportId, setSelectedReportId] = useState<string>(() => {
    const pending = feedbackReports.find(r => r.status === 'pending');
    return pending ? pending.id : feedbackReports[0]?.id || '';
  });

  const [revisedGuidance, setRevisedGuidance] = useState('');
  const [resolutionAction, setResolutionAction] = useState('Revised hint to provide guiding questions without spoiling the syntax.');

  const activeReport = feedbackReports.find(r => r.id === selectedReportId);

  const handleResolve = () => {
    if (!activeReport) return;
    resolveFeedbackReport(activeReport.id, resolutionAction, revisedGuidance || undefined);
    setRevisedGuidance('');
    alert(`Feedback report for ${activeReport.studentName} marked as resolved!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Feedback Quality Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review student reports on hints and explanations that were confusing, too revealing, or incorrect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reports List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {feedbackReports.map(rep => {
            const isSelected = rep.id === activeReport?.id;
            const isPending = rep.status === 'pending';

            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.reason === 'too_revealing'
                          ? 'bg-amber-100 text-amber-800'
                          : rep.reason === 'confusing'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rep.reason.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                  </div>

                  {isPending ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Needs Review
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900">{rep.exerciseTitle}</h3>
                <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                  Reported by {rep.studentName}: &quot;{rep.studentNotes || 'No notes provided'}&quot;
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Report Inspection & Revision (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          {activeReport ? (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Student Feedback Investigation
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {activeReport.exerciseTitle}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Reported by <strong>{activeReport.studentName}</strong> · Reason:{' '}
                  <span className="capitalize font-semibold text-slate-700">
                    {activeReport.reason.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Reported Content Box */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Flagged Hint / Guidance Content
                </span>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950">
                  {activeReport.reportedGuidance}
                </div>
              </div>

              {/* Student Notes */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Student Notes & Reasoning
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  &quot;{activeReport.studentNotes}&quot;
                </p>
              </div>

              {/* Action resolution status */}
              {activeReport.status === 'resolved' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-950">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolved Action Taken:
                  </span>
                  <p>{activeReport.actionTaken}</p>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <h3 className="font-bold text-slate-900">
                    Approve Revised Guidance
                  </h3>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Action description:
                    </label>
                    <input
                      type="text"
                      value={resolutionAction}
                      onChange={e => setResolutionAction(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Replacement Guidance Content (will be added to Guidance Library):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write replacement guidance that balances helpful clues without spoiling..."
                      value={revisedGuidance}
                      onChange={e => setRevisedGuidance(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleResolve}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Replacement & Mark Report Resolved</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a report from the list to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
