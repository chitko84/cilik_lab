/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Lock,
  Moon,
  RotateCcw,
  Shield,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitch } from '../../components/layout/LanguageSwitch';

export const SettingsView: React.FC = () => {
  const { currentUser, clearAllDrafts, resetDemoData } = useApp();
  const {t,language} = useLanguage();

  const [soundEffects, setSoundEffects] = useState(currentUser.preferences.soundEffects);
  const [emailNotifs, setEmailNotifs] = useState(currentUser.preferences.emailNotifications);
  const [reminders, setReminders] = useState(currentUser.preferences.learningReminders);
  const [draftsCleared, setDraftsCleared] = useState(false);

  const handleClearDrafts = () => {
    if (confirm('Clear all local coding drafts? This will restore original exercise templates on shared school devices.')) {
      clearAllDrafts();
      setDraftsCleared(true);
      setTimeout(() => setDraftsCleared(false), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Restore initial learning content? Local changes, classes and submissions will be reset on this device.')) {
      resetDemoData();
      alert('Learning content restored.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('settingsCaption')}
        </p>
      </div>

      {draftsCleared && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All local drafts cleared successfully.</span>
        </div>
      )}

      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">{t('chooseLanguage')}</h2>
        <LanguageSwitch />
        <p className="text-xs text-slate-500 leading-relaxed">{t('languageNote')}</p>
      </div>

      {/* Preferences Section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          {t('audioPrefs')}
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-bold text-slate-800 block">{t('soundEffects')}</span>
                <span className="text-[11px] text-slate-400">Play pleasant audio tones on test pass and level up</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={e => setSoundEffects(e.target.checked)}
              className="accent-sky-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-bold text-slate-800 block">{t('learningReminders')}</span>
                <span className="text-[11px] text-slate-400">Friendly daily nudges to keep your streak alive</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders}
              onChange={e => setReminders(e.target.checked)}
              className="accent-sky-600 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Interrupted Work Recovery & Shared Devices */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Local Work & Draft Storage
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          CilikLab automatically saves your code drafts locally so you never lose progress if the browser tab refreshes or connection drops.
          If you are using a shared computer at school or a library, you can clear all drafts below.
        </p>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Clear Saved Local Drafts</span>
            <span className="text-[11px] text-slate-400">Restores starter templates for all exercises</span>
          </div>

          <button
            onClick={handleClearDrafts}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Drafts</span>
          </button>
        </div>
      </div>

      {/* Demo Prototype Control */}
      <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <h2 className="text-sm font-bold text-amber-950">{t('restoreData')}</h2>
        </div>

        <p className="text-xs text-amber-900 leading-relaxed">
          {t('restoreCaption')}
        </p>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
        >
          {t('resetData')}
        </button>
      </div>
    </div>
  );
};
