/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportRequest } from '../../types';

export const SupportQueue: React.FC = () => {
  const {
    supportRequests,
    resolveSupportRequest,
    dismissSupportRequest,
    guidanceResources,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'open' | 'resolved' | 'all'>('open');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(() => {
    const firstOpen = supportRequests.find(r => r.status === 'open');
    return firstOpen ? firstOpen.id : supportRequests[0]?.id || '';
  });

  const [replyMessage, setReplyMessage] = useState('');
  const [selectedGuidanceTitle, setSelectedGuidanceTitle] = useState('');

  const displayedRequests = supportRequests.filter(r => {
    if (filterStatus === 'open') return r.status === 'open' || r.status === 'in_progress';
    if (filterStatus === 'resolved') return r.status === 'resolved';
    return true;
  });

  const activeRequest: SupportRequest | undefined = supportRequests.find(
    r => r.id === selectedRequestId
  );

  const handleResolve = () => {
    if (!replyMessage.trim() && !selectedGuidanceTitle) {
      alert('Please write an encouraging reply message or select guidance to attach.');
      return;
    }
    if (activeRequest) {
      resolveSupportRequest(
        activeRequest.id,
        replyMessage || 'Attached guidance from curriculum library.',
        selectedGuidanceTitle || undefined
      );
      setReplyMessage('');
      setSelectedGuidanceTitle('');
      alert(`Help request for ${activeRequest.studentName} marked as resolved!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Support Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review contextual help requests and repeated error patterns that need mentor guidance.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterStatus('open')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterStatus === 'open'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Open Queue ({supportRequests.filter(r => r.status !== 'resolved').length})
        </button>
        <button
          onClick={() => setFilterStatus('resolved')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterStatus === 'resolved'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resolved Archive ({supportRequests.filter(r => r.status === 'resolved').length})
        </button>
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Requests ({supportRequests.length})
        </button>
      </div>

      {/* Main 2-Column Interface: Cards List + Active Card Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intervention Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {displayedRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1">
                No outstanding support requests in this queue view.
              </p>
            </div>
          ) : (
            displayedRequests.map(req => {
              const isSelected = req.id === activeRequest?.id;
              const isResolved = req.status === 'resolved';

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={req.studentAvatar}
                        alt={req.studentName}
                        className="w-7 h-7 rounded-full border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {req.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400">{req.className}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isResolved ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            req.priority === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-800">
                    {req.exerciseTitle}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded border border-slate-100">
                    &quot;{req.message}&quot;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{req.attemptCount} attempt(s)</span>
                    <span>{req.createdAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Card Inspector & Response Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {activeRequest ? (
            <div className="space-y-6">
              {/* Card Title & Student Info */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {activeRequest.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{activeRequest.createdAt}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeRequest.exerciseTitle}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={activeRequest.studentAvatar}
                      alt={activeRequest.studentName}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {activeRequest.studentName}
                    </span>
                    <span className="text-xs text-slate-400">({activeRequest.className})</span>
                  </div>
                </div>

                <button
                  onClick={() => dismissSupportRequest(activeRequest.id)}
                  title="Dismiss request"
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Message */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-amber-900 uppercase block">
                  Student&apos;s Stated Difficulty:
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  &quot;{activeRequest.message}&quot;
                </p>
              </div>

              {/* Code Snapshot */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Student Code at Time of Request</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Attempts: {activeRequest.attemptCount}
                  </span>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-800">
                  {activeRequest.currentCode}
                </pre>
              </div>

              {/* Latest execution error */}
              {activeRequest.latestError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-rose-900 block">Reported Error Trace:</span>
                  <pre className="text-rose-800 font-mono text-[11px] whitespace-pre-wrap">
                    {activeRequest.latestError}
                  </pre>
                </div>
              )}

              {/* Existing Response if resolved */}
              {activeRequest.teacherResponse && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>Teacher Guidance Sent ({activeRequest.teacherResponse.teacherName}):</span>
                    <span className="text-[10px] text-emerald-700">
                      {activeRequest.teacherResponse.respondedAt}
                    </span>
                  </div>
                  <p>{activeRequest.teacherResponse.message}</p>
                  {activeRequest.teacherResponse.attachedGuidanceTitle && (
                    <div className="text-[11px] text-emerald-800 font-medium">
                      Attached: {activeRequest.teacherResponse.attachedGuidanceTitle}
                    </div>
                  )}
                </div>
              )}

              {/* Teacher Reply Composer */}
              {activeRequest.status !== 'resolved' && (
                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <h3 className="font-bold text-slate-900">
                    Send Encouraging Guidance & Hints
                  </h3>

                  {/* Attach Guidance from Library */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Optionally attach guidance from your Guidance Library:
                    </label>
                    <select
                      value={selectedGuidanceTitle}
                      onChange={e => setSelectedGuidanceTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="">-- No attached library guidance --</option>
                      {guidanceResources.map(g => (
                        <option key={g.id} value={g.title}>
                          {g.title} ({g.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Personalized note for {activeRequest.studentName}:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Remember to check what variable name you defined on line 1..."
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={handleResolve}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Guidance & Mark Resolved</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select an intervention card from the left queue to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
