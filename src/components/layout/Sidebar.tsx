/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Award,
  BookMarked,
  BookOpen,
  Code2,
  Compass,
  FileQuestion,
  CalendarDays,
  Trophy,
  HelpCircle,
  Home,
  Gamepad2,
  Bot,
  LibraryBig,
  Layers,
  LifeBuoy,
  MessageSquare,
  PlusCircle,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Users2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { role, activeTab, setActiveTab, supportRequests, feedbackReports } = useApp();
  const {t,language} = useLanguage();

  const openSupportCount = supportRequests.filter(r => r.status === 'open').length;
  const pendingFeedbackCount = feedbackReports.filter(r => r.status === 'pending').length;

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'explore_classes', label: t('explore'), icon: Compass },
    { id: 'my_classes', label: t('myClasses'), icon: BookMarked },
    { id: 'lessons', label: t('lessons'), icon: BookOpen },
    { id: 'cilik_arcade', label: 'Cilik Arcade', icon: Gamepad2 },
    { id: 'daily_solver', label: language === 'ms' ? 'Cabaran Kod Harian' : 'Daily Coding Solver', icon: Trophy },
    { id: 'live_classroom', label: language === 'ms' ? 'Bilik Langsung' : 'My Live Room', icon: CalendarDays },
    { id: 'knowledge_quiz', label: language === 'ms' ? 'Kuiz Pengetahuan' : 'Knowledge Quiz', icon: FileQuestion },
    { id: 'ciko_assistant', label: 'Ciko', icon: Bot },
    { id: 'comic_library', label: language === 'ms' ? 'Komik Python' : 'Python Comics', icon: LibraryBig },
    { id: 'coding_workspace', label: t('workspace'), icon: Code2, highlight: true },
    { id: 'student_progress', label: t('myProgress'), icon: TrendingUp },
    { id: 'community', label: t('community'), icon: MessageSquare },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'teacher_classes', label: t('myClasses'), icon: BookMarked },
    { id: 'create_class', label: t('createNewClass'), icon: PlusCircle },
    { id: 'student_performance', label: t('studentPerformance'), icon: Users2 },
    { id: 'live_classroom', label: language === 'ms' ? 'Kelas Langsung' : 'Live Classroom', icon: CalendarDays },
    { id: 'support_queue', label: t('supportQueue'), icon: LifeBuoy, badge: openSupportCount },
    { id: 'class_support', label: t('classSupport'), icon: Layers },
    { id: 'guidance_library', label: t('guidanceLibrary'), icon: Sparkles },
    { id: 'feedback_review', label: t('feedbackReview'), icon: FileQuestion, badge: pendingFeedbackCount },
    { id: 'reports_analytics', label: t('reportsAnalytics'), icon: TrendingUp },
    { id: 'community', label: t('community'), icon: MessageSquare },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`premium-sidebar fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto py-4 px-3">
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between px-3 pb-3 mb-2 border-b border-slate-100 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {role === 'teacher' ? t('teacherPortal') : t('studentPortal')}
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-500 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Indicator */}
          <div className="px-3 mb-2 hidden md:block">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {role === 'teacher' ? t('teacherSpace') : t('learningSpace')}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="premium-side-nav space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`premium-side-item w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors group ${
                    isActive
                      ? role === 'teacher'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? role === 'teacher'
                            ? 'text-indigo-600'
                            : 'text-sky-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white tabular-nums">
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Friendly encouragement banner at bottom of sidebar */}
          <div className="mt-auto pt-4 px-2">
            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-900">
                  {role === 'teacher' ? (language === 'ms' ? 'Petua untuk guru' : 'Need class tips?') : (language === 'ms' ? 'Petua kod hari ini' : 'Coding tip of the day')}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {role === 'teacher'
                  ? (language === 'ms' ? 'Semak permintaan bantuan untuk membimbing murid.' : 'Check the Support Queue to guide students encountering repeated error loops.')
                  : (language === 'ms' ? 'Kod tak jalan? Cuba arahan print() untuk melihat nilai!' : 'Stuck on a bug? Break the program into smaller print() steps to see values!')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
