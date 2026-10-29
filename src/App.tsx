/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState,useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CodingWorkspace } from './pages/coding/CodingWorkspace';
import { CommunityView } from './pages/community/CommunityView';
import { LandingPage } from './pages/LandingPage';
import { ProfileView } from './pages/profile/ProfileView';
import { SettingsView } from './pages/settings/SettingsView';
import { ExploreClasses } from './pages/student/ExploreClasses';
import { LessonsView } from './pages/student/LessonsView';
import { MyClasses } from './pages/student/MyClasses';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProgress } from './pages/student/StudentProgress';
import { ClassManagement } from './pages/teacher/ClassManagement';
import { ClassSupport } from './pages/teacher/ClassSupport';
import { CreateClass } from './pages/teacher/CreateClass';
import { FeedbackReview } from './pages/teacher/FeedbackReview';
import { GuidanceLibrary } from './pages/teacher/GuidanceLibrary';
import { ReportsAnalytics } from './pages/teacher/ReportsAnalytics';
import { StudentPerformance } from './pages/teacher/StudentPerformance';
import { SupportQueue } from './pages/teacher/SupportQueue';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { CikoAssistant } from './pages/ciko/CikoAssistant';
import { ArcadeView } from './pages/arcade/ArcadeView';
import { ComicLibrary } from './pages/comics/ComicLibrary';
import {QuizPage} from './pages/quiz/QuizPage';
import {DailyCodingSolver} from './pages/daily/DailyCodingSolver';
import {LiveClassroom} from './pages/meetings/LiveClassroom';
import type { ComicId } from './data/comicBooks';
import {PremiumMotion} from './components/visual/PremiumMotion';

const MainLayout: React.FC = () => {
  const { role, activeTab, activeComicId, setActiveTab } = useApp();
  useEffect(()=>{const query=new URLSearchParams(window.location.search);if(query.get('meeting')&&query.get('invite')){setActiveTab('live_classroom')}else if(query.get('comicBook')){setActiveTab('comic_library')}},[]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If on landing page, display the dedicated full landing experience
  if (activeTab === 'landing') {
    return <><PremiumMotion/><LandingPage /></>;
  }

  // Render role-specific and shared views
  const renderContent = () => {
    // Shared tabs
    if (activeTab === 'community') return <CommunityView />;
    if (activeTab === 'profile') return <ProfileView />;
    if (activeTab === 'settings') return <SettingsView />;
    if (activeTab === 'coding_workspace') return <CodingWorkspace />;
    if (activeTab === 'live_classroom') return <LiveClassroom />;
    if (activeTab === 'comic_library') return <ComicLibrary initialBook={activeComicId as ComicId | null} />;

    // Student tabs
    if (role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'ciko_assistant':
          return <CikoAssistant />;
        case 'cilik_arcade':
          return <ArcadeView />;
        case 'comic_library':
          return <ComicLibrary initialBook={activeComicId as ComicId | null} />;
        case 'explore_classes':
          return <ExploreClasses />;
        case 'my_classes':
          return <MyClasses />;
        case 'lessons':
          return <LessonsView />;
        case 'knowledge_quiz':
          return <QuizPage />;
        case 'daily_solver':
          return <DailyCodingSolver />;
        case 'student_progress':
          return <StudentProgress />;
        default:
          return <StudentDashboard />;
      }
    }

    // Teacher tabs
    if (role === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'teacher_classes':
          return <TeacherClasses />;
        case 'create_class':
          return <CreateClass />;
        case 'class_management':
          return <ClassManagement />;
        case 'student_performance':
          return <StudentPerformance />;
        case 'support_queue':
          return <SupportQueue />;
        case 'class_support':
          return <ClassSupport />;
        case 'guidance_library':
          return <GuidanceLibrary />;
        case 'feedback_review':
          return <FeedbackReview />;
        case 'reports_analytics':
          return <ReportsAnalytics />;
        default:
          return <TeacherDashboard />;
      }
    }

    return <StudentDashboard />;
  };

  return (
    <div className="cilik-shell premium-site-shell min-h-screen bg-slate-50 flex flex-col">
      <PremiumMotion />
      {/* Top Navigation Bar */}
      <TopBar onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Main Container with Sidebar + Content */}
      <div className="premium-layout flex-1 flex max-w-[1800px] w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="premium-main flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-[100px] md:pb-8 overflow-y-auto" id="main-content">
          <div key={`${role}-${activeTab}`} className="premium-page-enter">{renderContent()}</div>
        </main>
      </div>
      <MobileBottomNav onMore={() => setIsMobileSidebarOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MainLayout />
      </LanguageProvider>
    </AppProvider>
  );
}
