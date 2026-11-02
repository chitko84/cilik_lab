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
  ShieldCheck,
  ClipboardList,
  BarChart3,
  Clock3,
  History,
  ListChecks,
  UserRoundCog,
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

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { role, activeTab, setActiveTab, supportRequests, feedbackReports } = useApp();
  const {t,language} = useLanguage();

  const openSupportCount = supportRequests.filter(r => r.status === 'open').length;
  const pendingFeedbackCount = feedbackReports.filter(r => r.status === 'pending').length;

  // Keep every existing destination individually clickable; headings are visual only.
  // No new routes, storage keys, or learning data are introduced by grouping.
  const studentSections: NavSection[] = [
    { title: language === 'ms' ? 'Papan utama' : 'Dashboard', items: [
      { id: 'dashboard', label: t('dashboard'), icon: Home },
    ] },
    { title: language === 'ms' ? 'Pembelajaran' : 'Learning', items: [
      { id: 'explore_classes', label: t('explore'), icon: Compass },
      { id: 'my_classes', label: t('myClasses'), icon: BookMarked },
      { id: 'lessons', label: t('lessons'), icon: BookOpen },
      { id: 'comic_library', label: language === 'ms' ? 'Komik Python' : 'Python Comics', icon: LibraryBig },
    ] },
    { title: language === 'ms' ? 'Kod dan latihan' : 'Coding & Practice', items: [
      { id: 'coding_workspace', label: t('workspace'), icon: Code2, highlight: true },
      { id: 'code_time_machine', label: language === 'ms' ? 'Mesin Masa Kod Ciko' : 'Ciko Code Time Machine', icon: History },
      { id: 'daily_solver', label: language === 'ms' ? 'Cabaran Kod Harian' : 'Daily Coding Solver', icon: Trophy },
      { id: 'knowledge_quiz', label: language === 'ms' ? 'Kuiz Pengetahuan' : 'Knowledge Quiz', icon: FileQuestion },
    ] },
    { title: language === 'ms' ? 'Permainan dan AI' : 'Games & AI', items: [
      { id: 'cilik_arcade', label: 'Cilik Arcade', icon: Gamepad2 },
      { id: 'ciko_assistant', label: 'Ciko', icon: Bot },
    ] },
    { title: language === 'ms' ? 'Kelas dan komuniti' : 'Classroom & Community', items: [
      { id: 'live_classroom', label: language === 'ms' ? 'Bilik Langsung' : 'My Live Room', icon: CalendarDays },
      { id: 'community', label: t('community'), icon: MessageSquare },
    ] },
    { title: language === 'ms' ? 'Kemajuan dan akaun' : 'Progress & Account', items: [
      { id: 'student_progress', label: t('myProgress'), icon: TrendingUp },
      { id: 'profile', label: t('profile'), icon: User },
      { id: 'settings', label: t('settings'), icon: Settings },
    ] },
  ];

  const teacherSections: NavSection[] = [
    { title: language === 'ms' ? 'Papan utama' : 'Dashboard', items: [
      { id: 'dashboard', label: t('dashboard'), icon: Home },
    ] },
    { title: language === 'ms' ? 'Pengurusan kelas' : 'Class Management', items: [
      { id: 'teacher_classes', label: t('myClasses'), icon: BookMarked },
      { id: 'create_class', label: t('createNewClass'), icon: PlusCircle },
      { id: 'live_classroom', label: language === 'ms' ? 'Kelas Langsung' : 'Live Classroom', icon: CalendarDays },
    ] },
    { title: language === 'ms' ? 'Sokongan murid' : 'Student Support', items: [
      { id: 'student_performance', label: t('studentPerformance'), icon: Users2 },
      { id: 'support_queue', label: t('supportQueue'), icon: LifeBuoy, badge: openSupportCount },
      { id: 'class_support', label: t('classSupport'), icon: Layers },
    ] },
    { title: language === 'ms' ? 'Sumber pengajaran' : 'Teaching Resources', items: [
      { id: 'guidance_library', label: t('guidanceLibrary'), icon: Sparkles },
      { id: 'feedback_review', label: t('feedbackReview'), icon: FileQuestion, badge: pendingFeedbackCount },
    ] },
    { title: language === 'ms' ? 'Laporan dan analitik' : 'Reports & Analytics', items: [
      { id: 'reports_analytics', label: t('reportsAnalytics'), icon: TrendingUp },
    ] },
    { title: language === 'ms' ? 'Komuniti' : 'Community', items: [
      { id: 'community', label: t('community'), icon: MessageSquare },
    ] },
    { title: language === 'ms' ? 'Akaun' : 'Account', items: [
      { id: 'profile', label: t('profile'), icon: User },
      { id: 'settings', label: t('settings'), icon: Settings },
    ] },
  ];
  const operatorSections: NavSection[] = [
    { title: language === 'ms' ? 'Ringkasan' : 'Overview', items: [
      { id: 'op_dashboard', label: 'Operator Dashboard', icon: Home },
    ] },
    { title: language === 'ms' ? 'Pengurusan pengguna' : 'User Management', items: [
      { id: 'op_students', label: 'Students', icon: Users2 },
      { id: 'op_teachers', label: 'Teachers', icon: Users2 },
      { id: 'op_accounts', label: 'Account Overview', icon: UserRoundCog },
    ] },
    { title: language === 'ms' ? 'Operasi akademik' : 'Academic Operations', items: [
      { id: 'op_classes', label: 'Classes & Enrollments', icon: BookOpen },
      { id: 'op_schedules', label: 'Schedules & Meetings', icon: CalendarDays },
      { id: 'op_content', label: 'Learning Content', icon: LibraryBig },
    ] },
    { title: language === 'ms' ? 'Pengurusan platform' : 'Platform Management', items: [
      { id: 'op_moderation', label: 'Community Moderation', icon: MessageSquare },
      { id: 'op_support', label: 'Support Requests', icon: LifeBuoy },
    ] },
    { title: language === 'ms' ? 'Pemantauan' : 'Monitoring', items: [
      { id: 'op_analytics', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'op_activity', label: 'Activity Log', icon: Clock3 },
    ] },
    { title: language === 'ms' ? 'Akaun' : 'Account', items: [
      { id: 'op_settings', label: 'Demo Settings', icon: Settings },
      { id: 'op_profile', label: 'Operator Profile', icon: User },
    ] },
  ];
  const navSections = role === 'operator' ? operatorSections : role === 'teacher' ? teacherSections : studentSections;

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
              {role === 'operator' ? 'Operator Demo' : role === 'teacher' ? t('teacherPortal') : t('studentPortal')}
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
              {role === 'operator' ? 'OPERATOR DEMO' : role === 'teacher' ? t('teacherSpace') : t('learningSpace')}
            </span>
          </div>

          {/* Each section is visible and all links remain one-click navigation. */}
          <nav className="premium-side-nav space-y-5" aria-label={role === 'operator' ? 'Operator demo pages' : role === 'teacher' ? 'Teacher pages' : 'Student pages'}>
            {navSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex ? 'border-t border-slate-100 pt-4' : ''}>
                <h2 className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-500">
                  {section.title}
                </h2>
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return <button
                      type="button"
                      key={item.id}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handleNavClick(item.id)}
                      className={`premium-side-item w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors group ${
                        isActive
                          ? role === 'operator' ? 'bg-teal-50 text-teal-700' : role === 'teacher' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? (role === 'operator' ? 'text-teal-600' : role === 'teacher' ? 'text-indigo-600' : 'text-sky-600') : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white tabular-nums">{item.badge}</span>
                      )}
                      {item.highlight && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                    </button>;
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Friendly encouragement banner at bottom of sidebar */}
          <div className="mt-auto pt-4 px-2">
            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-900">
                  {role === 'operator' ? 'DEMO DATA ONLY' : role === 'teacher' ? (language === 'ms' ? 'Petua untuk guru' : 'Need class tips?') : (language === 'ms' ? 'Petua kod hari ini' : 'Coding tip of the day')}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {role === 'operator' ? 'Sample records are stored in this browser only. No real accounts are managed.' : role === 'teacher'
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
