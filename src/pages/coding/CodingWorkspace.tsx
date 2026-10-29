import {RealPhoto} from '../../components/visual/RealPhoto';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  CornerDownRight,
  Eye,
  FileQuestion,
  HelpCircle,
  History,
  Layers,
  Lightbulb,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Split,
  Terminal,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { executePythonCode, RunPythonResult } from '../../services/pythonRunner';
import { CodeAttempt, CodingExercise, ErrorDiagnostic, ExecutionTraceStep } from '../../types';

export const CodingWorkspace: React.FC = () => {
  const {
    exercises,
    activeExerciseId,
    selectExercise,
    saveDraft,
    getDraft,
    clearDraft,
    recordAttempt,
    attempts,
    createSupportRequest,
    reportGuidanceFeedback,
    currentUser,
  } = useApp();

  // Active exercise
  const currentExercise = exercises.find(e => e.id === activeExerciseId) || exercises[0];

  // Code state & draft recovery
  const [code, setCode] = useState<string>(() => {
    const draft = getDraft(currentExercise.id);
    return draft ? draft.code : currentExercise.starterCode;
  });

  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>('Saved');
  const [hasDraftRestored, setHasDraftRestored] = useState<boolean>(() => {
    return Boolean(getDraft(currentExercise.id));
  });

  // Execution & Test Result State
  const [executionResult, setExecutionResult] = useState<RunPythonResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<
    'output' | 'error_help' | 'hints' | 'trace' | 'compare' | 'reflect' | 'request_help'
  >('output');

  // Progressive Hints (Revealed one by one)
  const [hintStage, setHintStage] = useState<number>(0);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<'confusing' | 'incorrect' | 'too_revealing'>('confusing');
  const [reportNotes, setReportNotes] = useState<string>('');

  // Execution Tracing
  const [traceIndex, setTraceIndex] = useState<number>(0);
  const [isPlayingTrace, setIsPlayingTrace] = useState<boolean>(false);

  // Compare Attempts
  const exerciseAttempts = attempts.filter(
    a => a.exerciseId === currentExercise.id && a.studentId === currentUser.id
  );
  const [compareAttempt1Id, setCompareAttempt1Id] = useState<string>('');
  const [compareAttempt2Id, setCompareAttempt2Id] = useState<string>('');

  // Explain My Changes (Reflection)
  const [reflectionWhat, setReflectionWhat] = useState<string>('');
  const [reflectionWhy, setReflectionWhy] = useState<string>('');
  const [reflectionVerify, setReflectionVerify] = useState<string>('');
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  // Request Teacher Help
  const [helpCategory, setHelpCategory] = useState<'task_confusion' | 'error_confusion' | 'approach_check'>('error_confusion');
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [shareSessionConsent, setShareSessionConsent] = useState<boolean>(true);
  const [helpSubmitted, setHelpSubmitted] = useState<boolean>(false);

  // Reset exercise state when exerciseId changes
  useEffect(() => {
    const draft = getDraft(currentExercise.id);
    if (draft) {
      setCode(draft.code);
      setHasDraftRestored(true);
      setLastSavedTimestamp(`Restored draft (${draft.lastSaved})`);
    } else {
      setCode(currentExercise.starterCode);
      setHasDraftRestored(false);
      setLastSavedTimestamp('Initial starter code');
    }

    setExecutionResult(null);
    setHintStage(0);
    setTraceIndex(0);
    setActiveRightTab('output');
    setReflectionSaved(false);
    setHelpSubmitted(false);
  }, [currentExercise.id]);

  // Handle draft auto-saving
  const handleCodeChange = (newVal: string) => {
    setCode(newVal);
    saveDraft(currentExercise.id, newVal);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTimestamp(`Saved at ${now}`);
  };

  // Run Code
  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = executePythonCode(code, currentExercise.testCases);
      setExecutionResult(result);
      setIsRunning(false);
      setTraceIndex(0);

      // If an error occurred, proactively suggest looking at Error Explanation tab
      if (!result.success && result.error) {
        setActiveRightTab('error_help');
      } else {
        setActiveRightTab('output');
      }
    }, 150);
  };

  // Submit Answer
  const handleSubmitCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = executePythonCode(code, currentExercise.testCases);
      setExecutionResult(result);
      setIsRunning(false);

      const score = result.allPassed
        ? currentExercise.maxMarks
        : Math.round(
            (result.testResults.filter(t => t.passed).length / Math.max(1, result.testResults.length)) *
              currentExercise.maxMarks
          );

      const newAttempt = recordAttempt({
        exerciseId: currentExercise.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAvatar: currentUser.avatar,
        attemptNumber: exerciseAttempts.length + 1,
        code,
        status: result.allPassed ? 'passed' : 'failed',
        score,
        maxScore: currentExercise.maxMarks,
        stdout: result.stdout,
        testResults: result.testResults,
        error: result.error,
      });

      if (result.allPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setActiveRightTab('reflect');
      } else {
        setActiveRightTab('output');
      }
    }, 200);
  };

  // Reset to starter code
  const handleResetCode = () => {
    if (confirm('Reset editor back to original starter code? Any unsaved edits will be cleared.')) {
      setCode(currentExercise.starterCode);
      clearDraft(currentExercise.id);
      setHasDraftRestored(false);
      setLastSavedTimestamp('Reset to starter code');
      setExecutionResult(null);
    }
  };

  // Stepper playback
  useEffect(() => {
    let timer: any;
    if (isPlayingTrace && executionResult && executionResult.traceSteps.length > 0) {
      timer = setInterval(() => {
        setTraceIndex(prev => {
          if (prev < executionResult.traceSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingTrace(false);
            return prev;
          }
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlayingTrace, executionResult]);

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      handleCodeChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Current active line in execution trace
  const activeTraceStep: ExecutionTraceStep | undefined =
    executionResult?.traceSteps?.[traceIndex];

  // Handle reflection submit
  const handleSaveReflection = () => {
    if (!reflectionWhat.trim()) return;
    const latestPassed = attempts.find(
      a => a.exerciseId === currentExercise.id && a.studentId === currentUser.id && a.status === 'passed'
    );
    if (latestPassed) {
      latestPassed.reflectionNotes = {
        whatChanged: reflectionWhat,
        whyChanged: reflectionWhy || 'To pass test cases and fix syntax.',
        howVerified: reflectionVerify || 'Verified by running tests successfully.',
        submittedAt: 'Just now',
      };
    }
    setReflectionSaved(true);
  };

  // Handle Help Request Submit
  const handleSendHelpRequest = () => {
    if (!helpMessage.trim()) return;
    createSupportRequest(
      currentExercise.id,
      helpCategory,
      helpMessage,
      code,
      executionResult?.error?.message || executionResult?.stdout,
      shareSessionConsent
    );
    setHelpSubmitted(true);
  };

  // Handle report feedback
  const handleSendFeedbackReport = () => {
    const hintText =
      hintStage === 1
        ? currentExercise.hints.stage1Concept
        : hintStage === 2
        ? currentExercise.hints.stage2Think
        : currentExercise.hints.stage3Action;

    reportGuidanceFeedback(currentExercise.id, hintText, reportReason, reportNotes);
    setShowReportModal(false);
    setReportNotes('');
    alert('Thank you! Your feedback has been sent to the teacher for review.');
  };

  const lineCount = Math.max(12, code.split('\n').length);

  return (
    <div className="space-y-4">
      {/* Top Exercise Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">{currentExercise.className}</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-sky-700">{currentExercise.difficulty}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">{currentExercise.maxMarks} marks</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {currentExercise.title}
            </h1>
          </div>
        </div>

        {/* Exercise Quick Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Exercise:</span>
          <select
            value={currentExercise.id}
            onChange={e => selectExercise(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-sky-500 bg-white font-medium"
          >
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="premium-workspace-ribbon"><RealPhoto photo="realComputerLab" alt="Students using computers during an assisted learning activity" fallback="/arcade/code-escape.svg"/><div><strong>{'Python Lab'}</strong><span>{'Write, run and debug code with clear feedback. Your drafts stay connected to this exercise.'}</span></div><span className="premium-workspace-live">● {'Interactive workspace'}</span></div>

      {/* Main 3-Area Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ======================================================== */}
        {/* LEFT AREA: Exercise Instructions (3 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4 max-h-[720px] overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Mission Task
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {currentExercise.instructions}
            </p>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-lg">
            <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block mb-1">
              Learning Objective
            </span>
            <p className="text-xs text-sky-800 leading-snug">
              {currentExercise.learningObjective}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Test Cases ({currentExercise.testCases.length})
            </span>
            <div className="space-y-2">
              {currentExercise.testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 font-mono"
                >
                  <div className="text-[11px] font-bold text-slate-700 font-sans flex items-center justify-between">
                    <span>{tc.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">Test #{idx + 1}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">Expected Screen Output:</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded text-slate-800 text-[11px] whitespace-pre-wrap">
                    {tc.expectedOutput}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guidance Teaser */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveRightTab('hints')}
              className="w-full flex items-center justify-between p-2.5 bg-amber-50 hover:bg-amber-100/70 rounded-lg text-xs font-semibold text-amber-900 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Need a Hint?</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER AREA: Python Code Editor (5 cols) */}
        {/* ======================================================== */}
        <div className="v30-code-editor lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 shadow-md flex flex-col overflow-hidden h-[720px]">
          {/* Editor Toolbar */}
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              <span className="font-mono text-slate-200 text-xs">solution.py</span>
              <span className="text-slate-500 text-[10px]">Python 3</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Save className="w-3 h-3 text-slate-400" />
              <span>{lastSavedTimestamp}</span>
            </div>
          </div>

          {/* Draft Restored Banner */}
          {hasDraftRestored && (
            <div className="px-3 py-1.5 bg-amber-950/70 border-b border-amber-800 text-amber-200 text-[11px] flex items-center justify-between">
              <span>Restored your saved local draft.</span>
              <button
                onClick={handleResetCode}
                className="underline hover:text-white transition-colors"
              >
                Discard Draft
              </button>
            </div>
          )}

          {/* Line Numbers + Textarea Editor */}
          <div className="flex-1 flex overflow-hidden relative font-mono text-xs bg-slate-900">
            {/* Gutter */}
            <div className="v30-code-gutter w-10 py-3 bg-slate-950 text-slate-600 select-none text-right pr-2 space-y-0.5 leading-6 shrink-0 border-r border-slate-800/60">
              {Array.from({ length: lineCount }, (_, i) => {
                const lineNum = i + 1;
                const isTraceActive =
                  activeRightTab === 'trace' && activeTraceStep?.line === lineNum;
                const hasError = executionResult?.error?.line === lineNum;

                return (
                  <div
                    key={i}
                    className={`leading-6 h-6 ${
                      isTraceActive
                        ? 'text-amber-400 font-bold bg-amber-500/20 rounded-xs'
                        : hasError
                        ? 'text-rose-400 font-bold bg-rose-500/20'
                        : ''
                    }`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Code Input */}
            <div className="flex-1 relative h-full overflow-hidden">
              <textarea
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full p-3 bg-transparent text-slate-100 outline-none resize-none font-mono leading-6 whitespace-pre overflow-auto focus:ring-0 selection:bg-sky-500/30"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleResetCode}
              title="Reset code to starter template"
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Submit Answer</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT AREA: Learning Support Tabs (4 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[720px] overflow-hidden">
          {/* Support Tabs Header */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveRightTab('output')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'output'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Output</span>
            </button>

            {executionResult?.error && (
              <button
                onClick={() => setActiveRightTab('error_help')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeRightTab === 'error_help'
                    ? 'bg-rose-50 text-rose-800 font-bold shadow-xs'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                <span>Error Advice</span>
              </button>
            )}

            <button
              onClick={() => setActiveRightTab('hints')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'hints'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Hints ({hintStage}/3)</span>
            </button>

            <button
              onClick={() => setActiveRightTab('trace')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'trace'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3 text-sky-500" />
              <span>Trace</span>
            </button>

            <button
              onClick={() => setActiveRightTab('compare')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'compare'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3 h-3 text-purple-500" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => setActiveRightTab('reflect')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'reflect'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Reflect</span>
            </button>

            <button
              onClick={() => setActiveRightTab('request_help')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeRightTab === 'request_help'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3 h-3 text-indigo-500" />
              <span>Teacher Help</span>
            </button>
          </div>

          {/* Support Tab Content Panels */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* TAB 1: OUTPUT & TESTS */}
            {activeRightTab === 'output' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    <span>Console Output</span>
                    {executionResult && (
                      <span className={executionResult.allPassed ? 'text-emerald-600' : 'text-slate-500'}>
                        {executionResult.allPassed ? 'All Tests Passed 🎉' : 'Executed'}
                      </span>
                    )}
                  </div>
                  <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg border border-slate-800 min-h-[90px] whitespace-pre-wrap">
                    {executionResult ? executionResult.stdout : 'Click "Run Code" or "Submit Answer" to see output here.'}
                  </div>
                </div>

                {/* Test Results */}
                {executionResult && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Test Suite Verification
                    </span>
                    <div className="space-y-2">
                      {executionResult.testResults.map(tr => (
                        <div
                          key={tr.testId}
                          className={`p-3 rounded-lg border text-xs ${
                            tr.passed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              {tr.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                              {tr.testName}
                            </span>
                            <span className="text-[10px] font-semibold uppercase">
                              {tr.passed ? 'PASSED' : 'CHECK FAILED'}
                            </span>
                          </div>

                          {!tr.passed && (
                            <div className="space-y-1 font-mono text-[11px] pt-1">
                              <div>Expected: &quot;{tr.expected}&quot;</div>
                              <div>Actual: &quot;{tr.actual}&quot;</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Encouraging advice */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Next Step Guidance</span>
                  <p>
                    {executionResult?.allPassed
                      ? 'Awesome work! You passed all checks. Switch to the Reflect tab to note down what you learned!'
                      : 'Review any differences between expected and actual output, or check the Hints tab if you feel stuck!'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PLAIN LANGUAGE ERROR EXPLANATION */}
            {activeRightTab === 'error_help' && (
              <div className="space-y-4">
                {executionResult?.error ? (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-rose-950">
                          {executionResult.error.friendlyTitle}
                        </h3>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                        Spotted on line {executionResult.error.line}
                      </span>
                      <p className="text-xs text-rose-900 leading-relaxed">
                        {executionResult.error.friendlyExplanation}
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>What to inspect:</span>
                      </div>
                      <p className="text-amber-900/90">{executionResult.error.whatToInspect}</p>
                    </div>

                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1.5 text-xs text-sky-950">
                      <div className="font-bold text-sky-900 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-sky-700" />
                        <span>Tiny next action:</span>
                      </div>
                      <p className="text-sky-900/90">{executionResult.error.tinyNextAction}</p>
                    </div>

                    {/* Preserved Raw Technical Error (Expandable) */}
                    <details className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <summary className="font-bold text-slate-600 cursor-pointer text-[11px]">
                        Technical Error Details (Python traceback)
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-900 text-slate-200 font-mono text-[10px] rounded overflow-x-auto whitespace-pre-wrap">
                        {executionResult.error.rawError}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No active syntax errors!</p>
                    <p className="mt-1">Your code parsed cleanly. Test outputs appear in the Output tab.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROGRESSIVE DEBUGGING HINTS */}
            {activeRightTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Progressive Clues
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Stage {hintStage} of 3 revealed
                  </span>
                </div>

                {/* Stage 1 */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    hintStage >= 1
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Stage 1: Remember the Concept</span>
                    {hintStage >= 1 ? (
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <span className="text-[10px]">Locked</span>
                    )}
                  </div>
                  {hintStage >= 1 ? (
                    <p className="text-xs leading-relaxed mt-1">
                      {currentExercise.hints.stage1Concept}
                    </p>
                  ) : (
                    <p className="text-xs italic">A quick reminder about the relevant rule.</p>
                  )}
                </div>

                {/* Stage 2 */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    hintStage >= 2
                      ? 'bg-sky-50/80 border-sky-200 text-sky-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Stage 2: Think About Your Attempt</span>
                    {hintStage >= 2 ? (
                      <Check className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <span className="text-[10px]">Locked</span>
                    )}
                  </div>
                  {hintStage >= 2 ? (
                    <p className="text-xs leading-relaxed mt-1">
                      {currentExercise.hints.stage2Think}
                    </p>
                  ) : (
                    <p className="text-xs italic">A guiding question to check your logic.</p>
                  )}
                </div>

                {/* Stage 3 */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    hintStage >= 3
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Stage 3: Try a Debugging Action</span>
                    {hintStage >= 3 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px]">Locked</span>
                    )}
                  </div>
                  {hintStage >= 3 ? (
                    <p className="text-xs leading-relaxed mt-1">
                      {currentExercise.hints.stage3Action}
                    </p>
                  ) : (
                    <p className="text-xs italic">A specific action you can test in the editor.</p>
                  )}
                </div>

                {/* Reveal Next Stage Button */}
                <div className="flex items-center justify-between pt-2">
                  {hintStage < 3 ? (
                    <button
                      onClick={() => setHintStage(prev => Math.min(3, prev + 1))}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Reveal Stage {hintStage + 1} Clue</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> All clues revealed
                    </span>
                  )}

                  {hintStage > 0 && (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
                    >
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>Report Hint</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: VISUAL CODE TRACING */}
            {activeRightTab === 'trace' && (
              <div className="space-y-4">
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-900 leading-snug">
                  Watch how Python steps through your program line by line and updates memory boxes!
                </div>

                {executionResult && executionResult.traceSteps.length > 0 ? (
                  <div className="space-y-4">
                    {/* Stepper Controls */}
                    <div className="p-3 bg-slate-950 text-white rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTraceIndex(prev => Math.max(0, prev - 1))}
                          disabled={traceIndex === 0}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs font-bold"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setIsPlayingTrace(!isPlayingTrace)}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded text-xs font-bold flex items-center gap-1"
                        >
                          {isPlayingTrace ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{isPlayingTrace ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={() =>
                            setTraceIndex(prev =>
                              Math.min(executionResult.traceSteps.length - 1, prev + 1)
                            )
                          }
                          disabled={traceIndex >= executionResult.traceSteps.length - 1}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs font-bold"
                        >
                          Next
                        </button>
                      </div>

                      <span className="text-xs font-mono text-slate-400">
                        Step {traceIndex + 1} / {executionResult.traceSteps.length}
                      </span>
                    </div>

                    {/* Step Highlight Card */}
                    {activeTraceStep && (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs space-y-1">
                          <span className="text-[11px] font-bold text-amber-800 uppercase block">
                            Currently Running Line {activeTraceStep.line}
                          </span>
                          <div className="p-2 bg-slate-950 text-amber-300 font-mono text-xs rounded border border-slate-800">
                            {activeTraceStep.lineContent}
                          </div>
                          <p className="text-amber-950 font-medium text-xs mt-1">
                            {activeTraceStep.explanation}
                          </p>
                        </div>

                        {/* Variable Memory State Box */}
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Variable Memory Snapshot
                          </span>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 font-mono">
                            {Object.keys(activeTraceStep.variables).length === 0 ? (
                              <span className="text-slate-400 font-sans italic">
                                No variables initialized yet.
                              </span>
                            ) : (
                              Object.entries(activeTraceStep.variables).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between">
                                  <span className="text-sky-700 font-bold">{k}</span>
                                  <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {JSON.stringify(v)}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Cumulative Output so far */}
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Screen Output at this Step
                          </span>
                          <div className="p-2.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded border border-slate-800 min-h-[44px]">
                            {activeTraceStep.stdoutSoFar || '(No print yet)'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <p>Click &quot;Run Code&quot; to generate an interactive execution trace.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: COMPARE ATTEMPTS */}
            {activeRightTab === 'compare' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Compare Code Attempts
                </span>

                {exerciseAttempts.length < 2 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                    You need at least 2 submitted attempts to compare diffs. Run and submit your
                    current code to see how your changes improved!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          Earlier Attempt:
                        </label>
                        <select
                          value={compareAttempt1Id || exerciseAttempts[exerciseAttempts.length - 1]?.id}
                          onChange={e => setCompareAttempt1Id(e.target.value)}
                          className="w-full text-xs rounded border border-slate-200 p-1.5"
                        >
                          {exerciseAttempts.map(a => (
                            <option key={a.id} value={a.id}>
                              Attempt #{a.attemptNumber} ({a.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          Later Attempt:
                        </label>
                        <select
                          value={compareAttempt2Id || exerciseAttempts[0]?.id}
                          onChange={e => setCompareAttempt2Id(e.target.value)}
                          className="w-full text-xs rounded border border-slate-200 p-1.5"
                        >
                          {exerciseAttempts.map(a => (
                            <option key={a.id} value={a.id}>
                              Attempt #{a.attemptNumber} ({a.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Diff Preview */}
                    <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg space-y-2 border border-slate-800">
                      <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        Side-by-side Inspection
                      </div>
                      <div className="text-emerald-400">
                        + Later attempt corrected syntax & test matching.
                      </div>
                      <div className="text-slate-400">
                        Notice how un-indenting or fixing variable names allowed the code to pass!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: EXPLAIN MY CHANGES (REFLECTION) */}
            {activeRightTab === 'reflect' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-snug">
                  <span className="font-bold block mb-1">Reflect on Your Learning</span>
                  Writing down what you fixed builds deep muscle memory and helps your teacher see
                  how you think!
                </div>

                {reflectionSaved ? (
                  <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-xs font-bold text-emerald-950">
                      Reflection Note Saved!
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Your teacher can now review your reasoning alongside your working code.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        1. What did you change to make it work?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fixed capital letters and un-indented the print line..."
                        value={reflectionWhat}
                        onChange={e => setReflectionWhat(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        2. Why did that change fix the issue?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Because Python only repeats lines that are indented..."
                        value={reflectionWhy}
                        onChange={e => setReflectionWhy(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        3. How did you check your answer?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. I watched the Visual Trace and all tests passed green..."
                        value={reflectionVerify}
                        onChange={e => setReflectionVerify(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveReflection}
                      disabled={!reflectionWhat.trim()}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Save Reflection Note
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: REQUEST TEACHER HELP */}
            {activeRightTab === 'request_help' && (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-snug">
                  <span className="font-bold block mb-1">Teacher Assistance Queue</span>
                  Send your question directly to your instructor. Your current code snapshot and any
                  error messages are included automatically.
                </div>

                {helpSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-xs font-bold text-emerald-950">Help Request Sent!</h4>
                    <p className="text-[11px] text-emerald-800">
                      Your teacher has been notified and your request is in their Support Queue.
                    </p>
                    <button
                      onClick={() => setHelpSubmitted(false)}
                      className="text-xs text-sky-700 underline font-semibold"
                    >
                      Send another note
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        What kind of help do you need?
                      </label>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg cursor-pointer hover:bg-slate-100">
                          <input
                            type="radio"
                            name="helpCat"
                            checked={helpCategory === 'error_confusion'}
                            onChange={() => setHelpCategory('error_confusion')}
                            className="text-sky-600"
                          />
                          <span className="text-xs text-slate-800">
                            I don&apos;t understand the error message
                          </span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg cursor-pointer hover:bg-slate-100">
                          <input
                            type="radio"
                            name="helpCat"
                            checked={helpCategory === 'task_confusion'}
                            onChange={() => setHelpCategory('task_confusion')}
                            className="text-sky-600"
                          />
                          <span className="text-xs text-slate-800">
                            I don&apos;t understand what the task wants
                          </span>
                        </label>
                        <label className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg cursor-pointer hover:bg-slate-100">
                          <input
                            type="radio"
                            name="helpCat"
                            checked={helpCategory === 'approach_check'}
                            onChange={() => setHelpCategory('approach_check')}
                            className="text-sky-600"
                          />
                          <span className="text-xs text-slate-800">
                            I want someone to check my general approach
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Optional note for the teacher:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Explain what you tried so far..."
                        value={helpMessage}
                        onChange={e => setHelpMessage(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                      />
                    </div>

                    {/* Privacy requirement: Explicit session sharing toggle */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareSessionConsent}
                          onChange={e => setShareSessionConsent(e.target.checked)}
                          className="mt-0.5"
                        />
                        <div className="text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800 block">
                            Student Privacy Consent
                          </span>
                          Allow teacher to view my code attempt and error logs. (Never shares screen
                          or camera).
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={handleSendHelpRequest}
                      disabled={!helpMessage.trim()}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to Teacher Support Queue</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Guidance Feedback Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Report Feedback on Hint</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Help us improve CilikLab hints so other students learn better! Why was this clue
              unhelpful?
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  checked={reportReason === 'confusing'}
                  onChange={() => setReportReason('confusing')}
                />
                <span>It was confusing or hard to understand</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  checked={reportReason === 'too_revealing'}
                  onChange={() => setReportReason('too_revealing')}
                />
                <span>It was too revealing (spoiled the answer directly)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reportReason"
                  checked={reportReason === 'incorrect'}
                  onChange={() => setReportReason('incorrect')}
                />
                <span>It felt incorrect or didn’t match my code</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Optional detail:
              </label>
              <textarea
                rows={2}
                placeholder="What part was tricky?..."
                value={reportNotes}
                onChange={e => setReportNotes(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-200 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedbackReport}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
