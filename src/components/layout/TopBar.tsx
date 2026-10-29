/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  HelpCircle,
  LogOut,
  Menu,
  RotateCcw,
  Settings,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { QuickNavigator } from './QuickNavigator';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentUser,
    role,
    setRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    logout,
    resetDemoData,
  } = useApp();

  const {t} = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifications = notifications.filter(
    n => !n.read && (n.targetRole === role || !n.targetRole)
  );

  return (
    <header className="premium-topbar sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-5 md:px-6 bg-white/95 backdrop-blur-xl border-b border-[#e4eaf5] shadow-xs">
      {/* Left side: Hamburger (mobile) + Logo & Identity */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          aria-label={t('openMenu')}
          className="p-1.5 text-slate-600 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left group"
        >
          <img
            src="/assets/aistudio/CilikLab_Logo_Transparent_d0d42c03.png"
            alt="CilikLab Logo"
            className="h-10 w-auto max-w-[150px] sm:max-w-[180px] object-contain"
            onError={e => {
              // Fallback if logo fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">
              Little Learners’ Lab
            </span>
          </div>
        </button>
      </div>

      {/* Middle & Right: Role switcher + Notifications + Profile */}
      <div className="flex items-center gap-1 sm:gap-3">
        <QuickNavigator />
        <LanguageSwitch compact />
        {/* Role Toggle Switcher */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'student'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('studentView')}</span>
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'teacher'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('teacherView')}</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label={t('notifications')}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white tabular-nums">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-sky-600 hover:text-sky-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications
                    .filter(n => n.targetRole === role || !n.targetRole)
                    .map(n => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-sky-50/50' : ''
                        }`}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionTab) {
                            setActiveTab(n.actionTab);
                            setShowNotifications(false);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-slate-200 bg-amber-50"
            />
            <div className="hidden lg:block text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentUser.role === 'teacher' ? 'Educator' : 'Explorer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <button onClick={() => { setRole(role === 'teacher' ? 'student' : 'teacher'); setShowUserMenu(false); }} className="sm:hidden w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{role === 'teacher' ? t('studentView') : t('teacherView')}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('profile')}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('settings')}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t('restoreCaption'))) resetDemoData();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('resetData')}</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t('signOut')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
