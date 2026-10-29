/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  INITIAL_ATTEMPTS,
  INITIAL_CLASSES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_EXERCISES,
  INITIAL_FEEDBACK_REPORTS,
  INITIAL_GUIDANCE,
  INITIAL_MISCONCEPTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_REQUESTS,
  OTHER_STUDENTS,
} from '../data/initialData';
import {
  CodeAttempt,
  CodingClass,
  CodingExercise,
  CommunityComment,
  CommunityPost,
  FeedbackReport,
  GuidanceResource,
  NotificationItem,
  PeerCodeReview,
  ReflectionNotes,
  SharedMisconception,
  SupportRequest,
  UserProfile,
  UserRole,
} from '../types';

interface AppContextType {
  currentUser: UserProfile;
  role: UserRole;
  classes: CodingClass[];
  exercises: CodingExercise[];
  attempts: CodeAttempt[];
  supportRequests: SupportRequest[];
  misconceptions: SharedMisconception[];
  guidanceResources: GuidanceResource[];
  feedbackReports: FeedbackReport[];
  communityPosts: CommunityPost[];
  notifications: NotificationItem[];
  otherStudents: typeof OTHER_STUDENTS;
  activeExerciseId: string;
  activeClassId: string;
  activeTab: string;
  activeComicId: string | null;
  selectComic: (id: string) => void;
  
  // Navigation & Role
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;
  selectExercise: (exerciseId: string) => void;
  selectClass: (classId: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  
  // Student actions
  enrollClass: (classId: string) => void;
  leaveClass: (classId: string) => void;
  saveDraft: (exerciseId: string, code: string) => void;
  getDraft: (exerciseId: string) => { code: string; lastSaved: string } | null;
  clearDraft: (exerciseId: string) => void;
  clearAllDrafts: () => void;
  recordAttempt: (attempt: Omit<CodeAttempt, 'id' | 'timestamp'>) => CodeAttempt;
  addReflectionNote: (attemptId: string, notes: ReflectionNotes) => void;
  createSupportRequest: (
    exerciseId: string,
    category: SupportRequest['category'],
    message: string,
    currentCode: string,
    latestError?: string,
    sessionShareApproved?: boolean
  ) => void;
  reportGuidanceFeedback: (
    exerciseId: string,
    reportedGuidance: string,
    reason: FeedbackReport['reason'],
    studentNotes?: string
  ) => void;
  updateStudentProfile: (updated: Partial<UserProfile>) => void;

  // Teacher actions
  createClass: (newClass: Omit<CodingClass, 'id' | 'lastUpdated' | 'enrolledCount' | 'progressPercent'>) => CodingClass;
  updateClass: (classId: string, patch: Partial<CodingClass>) => void;
  createExercise: (newExercise: Omit<CodingExercise, 'id'>) => CodingExercise;
  resolveSupportRequest: (requestId: string, replyMessage: string, attachedGuidanceTitle?: string) => void;
  dismissSupportRequest: (requestId: string) => void;
  createGuidance: (newGuidance: Omit<GuidanceResource, 'id' | 'updatedAt' | 'usageCount'>) => GuidanceResource;
  updateGuidance: (guidanceId: string, patch: Partial<GuidanceResource>) => void;
  resolveFeedbackReport: (reportId: string, actionTaken: string, revisedGuidanceContent?: string) => void;
  sendTeacherFeedbackToAttempt: (attemptId: string, feedbackText: string) => void;

  // Community & Social
  likePost: (postId: string) => void;
  addPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  addComment: (postId: string, content: string, peerReview?: PeerCodeReview) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Demo helpers
  resetDemoData: () => void;
}

const STORAGE_KEY = 'ciliklab_app_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : CURRENT_STUDENT;
  });

  const [classes, setClasses] = useState<CodingClass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [exercises, setExercises] = useState<CodingExercise[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exercises`);
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [attempts, setAttempts] = useState<CodeAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attempts`);
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_support`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_REQUESTS;
  });

  const [misconceptions] = useState<SharedMisconception[]>(INITIAL_MISCONCEPTIONS);

  const [guidanceResources, setGuidanceResources] = useState<GuidanceResource[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guidance`);
    return saved ? JSON.parse(saved) : INITIAL_GUIDANCE;
  });

  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feedback_rep`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK_REPORTS;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeExerciseId, setActiveExerciseId] = useState<string>('ex_01');
  const [activeClassId, setActiveClassId] = useState<string>('cls_01');
  const [activeTab, setActiveTab] = useState<string>('landing'); // 'landing' | 'dashboard' | ...
  const [activeComicId, setActiveComicId] = useState<string | null>(null);
  const selectComic = (id: string) => { setActiveComicId(id); setActiveTab('comic_library'); };
  useEffect(() => { if (activeTab !== 'comic_library') setActiveComicId(null); }, [activeTab]);

  // Save to localStorage when critical state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attempts`, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_support`, JSON.stringify(supportRequests));
  }, [supportRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guidance`, JSON.stringify(guidanceResources));
  }, [guidanceResources]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feedback_rep`, JSON.stringify(feedbackReports));
  }, [feedbackReports]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  const loginAs = (role: UserRole) => {
    if (role === 'teacher') {
      setCurrentUser(CURRENT_TEACHER);
    } else {
      setCurrentUser(CURRENT_STUDENT);
    }
    setActiveTab('dashboard');
  };

  const setRole = (role: UserRole) => {
    loginAs(role);
  };

  const logout = () => {
    setActiveTab('landing');
  };

  const selectExercise = (exerciseId: string) => {
    setActiveExerciseId(exerciseId);
    const ex = exercises.find(e => e.id === exerciseId);
    if (ex) setActiveClassId(ex.classId);
    setActiveTab('coding_workspace');
  };

  const selectClass = (classId: string) => {
    setActiveClassId(classId);
    if (currentUser.role === 'teacher') {
      setActiveTab('class_management');
    } else {
      setActiveTab('my_classes');
    }
  };

  const enrollClass = (classId: string) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === classId) {
          return {
            ...c,
            isEnrolled: true,
            progressPercent: c.progressPercent || 0,
            enrolledCount: c.enrolledCount + 1,
          };
        }
        return c;
      })
    );
    // Add notification
    const c = classes.find(item => item.id === classId);
    if (c) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        targetRole: 'student',
        targetUserId: currentUser.id,
        title: 'Class Enrolled! 🎓',
        message: `You are now enrolled in "${c.title}". Happy coding!`,
        timestamp: 'Just now',
        read: false,
        type: 'enrollment',
        actionTab: 'my_classes',
        relatedId: classId,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const leaveClass = (classId: string) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === classId) {
          return { ...c, isEnrolled: false, progressPercent: 0, enrolledCount: Math.max(0, c.enrolledCount - 1) };
        }
        return c;
      })
    );
  };

  // Drafts
  const saveDraft = (exerciseId: string, code: string) => {
    const draftKey = `ciliklab_draft_${currentUser.id}_${exerciseId}`;
    const payload = {
      code,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem(draftKey, JSON.stringify(payload));
  };

  const getDraft = (exerciseId: string) => {
    const draftKey = `ciliklab_draft_${currentUser.id}_${exerciseId}`;
    const item = localStorage.getItem(draftKey);
    return item ? JSON.parse(item) : null;
  };

  const clearDraft = (exerciseId: string) => {
    const draftKey = `ciliklab_draft_${currentUser.id}_${exerciseId}`;
    localStorage.removeItem(draftKey);
  };

  const clearAllDrafts = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`ciliklab_draft_${currentUser.id}`)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  };

  // Submissions & Attempts
  const recordAttempt = (attemptData: Omit<CodeAttempt, 'id' | 'timestamp'>): CodeAttempt => {
    const newAttempt: CodeAttempt = {
      ...attemptData,
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // If passed, update class progress and student points
    if (newAttempt.status === 'passed') {
      const ex = exercises.find(e => e.id === newAttempt.exerciseId);
      if (ex) {
        setClasses(prev =>
          prev.map(c => {
            if (c.id === ex.classId) {
              const updatedSyllabus = c.syllabus.map(s => (s.exerciseId === ex.id ? { ...s, completed: true } : s));
              const compCount = updatedSyllabus.filter(s => s.completed).length;
              const newProgress = Math.min(100, Math.round((compCount / updatedSyllabus.length) * 100));
              return { ...c, syllabus: updatedSyllabus, progressPercent: newProgress };
            }
            return c;
          })
        );
      }

      setCurrentUser(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + (newAttempt.score || 10),
        completedLessonsCount: prev.completedLessonsCount + 1,
      }));

      // Notify Teacher of new submission
      const teacherNotif: NotificationItem = {
        id: `notif_${Date.now() + 1}`,
        targetRole: 'teacher',
        title: `Exercise Passed: ${newAttempt.studentName}`,
        message: `${newAttempt.studentName} successfully completed "${ex?.title || 'an exercise'}" with ${newAttempt.score}/${newAttempt.maxScore} marks!`,
        timestamp: 'Just now',
        read: false,
        type: 'submission',
        actionTab: 'student_performance',
      };
      setNotifications(prev => [teacherNotif, ...prev]);
    }

    return newAttempt;
  };

  const addReflectionNote = (attemptId: string, notes: ReflectionNotes) => {
    setAttempts(prev =>
      prev.map(a => {
        if (a.id === attemptId) {
          return { ...a, reflectionNotes: notes };
        }
        return a;
      })
    );
  };

  const createSupportRequest = (
    exerciseId: string,
    category: SupportRequest['category'],
    message: string,
    currentCode: string,
    latestError?: string,
    sessionShareApproved: boolean = true
  ) => {
    const ex = exercises.find(e => e.id === exerciseId);
    const newReq: SupportRequest = {
      id: `sup_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      classId: ex?.classId || 'cls_01',
      className: ex?.className || 'Python Lab',
      exerciseId,
      exerciseTitle: ex?.title || 'Coding Exercise',
      category,
      message,
      currentCode,
      latestError,
      attemptCount: 1,
      priority: category === 'error_confusion' ? 'high' : 'medium',
      status: 'open',
      createdAt: 'Just now',
      sessionShareApproved,
    };

    setSupportRequests(prev => [newReq, ...prev]);

    // Teacher notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      targetRole: 'teacher',
      title: `Help Request: ${currentUser.name}`,
      message: `${currentUser.name} needs guidance on "${ex?.title}": "${message.slice(0, 50)}..."`,
      timestamp: 'Just now',
      read: false,
      type: 'help_request',
      actionTab: 'support_queue',
      relatedId: newReq.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const reportGuidanceFeedback = (
    exerciseId: string,
    reportedGuidance: string,
    reason: FeedbackReport['reason'],
    studentNotes?: string
  ) => {
    const ex = exercises.find(e => e.id === exerciseId);
    const newReport: FeedbackReport = {
      id: `rep_${Date.now()}`,
      exerciseId,
      exerciseTitle: ex?.title || 'Coding Exercise',
      reportedGuidance,
      reason,
      studentNotes,
      studentName: currentUser.name,
      studentId: currentUser.id,
      status: 'pending',
      createdAt: 'Just now',
    };
    setFeedbackReports(prev => [newReport, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      targetRole: 'teacher',
      title: `Guidance Feedback Reported`,
      message: `${currentUser.name} reported guidance for "${ex?.title}" as ${reason.replace('_', ' ')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'feedback',
      actionTab: 'feedback_review',
      relatedId: newReport.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateStudentProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
  };

  // Teacher actions
  const createClass = (newClassData: Omit<CodingClass, 'id' | 'lastUpdated' | 'enrolledCount' | 'progressPercent'>): CodingClass => {
    const newClass: CodingClass = {
      ...newClassData,
      id: `cls_${Date.now()}`,
      lastUpdated: 'Today',
      enrolledCount: 1,
      progressPercent: 0,
      isEnrolled: false,
    };
    setClasses(prev => [newClass, ...prev]);
    return newClass;
  };

  const updateClass = (classId: string, patch: Partial<CodingClass>) => {
    setClasses(prev => prev.map(c => (c.id === classId ? { ...c, ...patch, lastUpdated: 'Today' } : c)));
  };

  const createExercise = (newExerciseData: Omit<CodingExercise, 'id'>): CodingExercise => {
    const newEx: CodingExercise = {
      ...newExerciseData,
      id: `ex_${Date.now()}`,
    };
    setExercises(prev => [...prev, newEx]);
    return newEx;
  };

  const resolveSupportRequest = (requestId: string, replyMessage: string, attachedGuidanceTitle?: string) => {
    setSupportRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'resolved',
            teacherResponse: {
              teacherName: currentUser.name,
              message: replyMessage,
              attachedGuidanceTitle,
              respondedAt: 'Just now',
            },
          };
        }
        return r;
      })
    );

    // Notify student
    const targetReq = supportRequests.find(r => r.id === requestId);
    if (targetReq) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        targetRole: 'student',
        targetUserId: targetReq.studentId,
        title: `Teacher Replied to Your Request`,
        message: `${currentUser.name} replied to your question on "${targetReq.exerciseTitle}": "${replyMessage.slice(0, 60)}..."`,
        timestamp: 'Just now',
        read: false,
        type: 'feedback',
        actionTab: 'coding_workspace',
        relatedId: targetReq.exerciseId,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const dismissSupportRequest = (requestId: string) => {
    setSupportRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const createGuidance = (newGuidanceData: Omit<GuidanceResource, 'id' | 'updatedAt' | 'usageCount'>): GuidanceResource => {
    const newG: GuidanceResource = {
      ...newGuidanceData,
      id: `gd_${Date.now()}`,
      updatedAt: 'Today',
      usageCount: 0,
    };
    setGuidanceResources(prev => [newG, ...prev]);
    return newG;
  };

  const updateGuidance = (guidanceId: string, patch: Partial<GuidanceResource>) => {
    setGuidanceResources(prev => prev.map(g => (g.id === guidanceId ? { ...g, ...patch, updatedAt: 'Today' } : g)));
  };

  const resolveFeedbackReport = (reportId: string, actionTaken: string, revisedGuidanceContent?: string) => {
    setFeedbackReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'resolved', actionTaken } : r))
    );

    if (revisedGuidanceContent) {
      createGuidance({
        title: `Teacher-Approved Replacement Guidance`,
        content: revisedGuidanceContent,
        conceptTags: ['Pedagogical Correction', 'Class Review'],
        difficulty: 'Beginner',
        resourceType: 'progressive_hint',
        reviewStatus: 'approved',
      });
    }
  };

  const sendTeacherFeedbackToAttempt = (attemptId: string, feedbackText: string) => {
    setAttempts(prev =>
      prev.map(a => {
        if (a.id === attemptId) {
          return {
            ...a,
            teacherFeedback: {
              teacherName: currentUser.name,
              feedbackText,
              createdAt: 'Just now',
            },
          };
        }
        return a;
      })
    );

    const att = attempts.find(a => a.id === attemptId);
    if (att) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        targetRole: 'student',
        targetUserId: att.studentId,
        title: `Teacher Feedback from ${currentUser.name}`,
        message: feedbackText,
        timestamp: 'Just now',
        read: false,
        type: 'feedback',
        actionTab: 'student_progress',
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Community
  const likePost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
            hasLiked,
          };
        }
        return p;
      })
    );
  };

  const addPost = (postData: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post_${Date.now()}`,
      timestamp: 'Just now',
      likes: 0,
      hasLiked: false,
      comments: [],
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const addComment = (postId: string, content: string, peerReview?: PeerCodeReview) => {
    const newComment: CommunityComment = {
      id: `c_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content,
      timestamp: 'Just now',
      peerReview,
    };

    setCommunityPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    localStorage.removeItem(`${STORAGE_KEY}_classes`);
    localStorage.removeItem(`${STORAGE_KEY}_exercises`);
    localStorage.removeItem(`${STORAGE_KEY}_attempts`);
    localStorage.removeItem(`${STORAGE_KEY}_support`);
    localStorage.removeItem(`${STORAGE_KEY}_guidance`);
    localStorage.removeItem(`${STORAGE_KEY}_feedback_rep`);
    localStorage.removeItem(`${STORAGE_KEY}_posts`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    clearAllDrafts();
    localStorage.removeItem('ciliklab_extras_progress_v1');

    setCurrentUser(CURRENT_STUDENT);
    setClasses(INITIAL_CLASSES);
    setExercises(INITIAL_EXERCISES);
    setAttempts(INITIAL_ATTEMPTS);
    setSupportRequests(INITIAL_SUPPORT_REQUESTS);
    setGuidanceResources(INITIAL_GUIDANCE);
    setFeedbackReports(INITIAL_FEEDBACK_REPORTS);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        classes,
        exercises,
        attempts,
        supportRequests,
        misconceptions,
        guidanceResources,
        feedbackReports,
        communityPosts,
        notifications,
        otherStudents: OTHER_STUDENTS,
        activeExerciseId,
        activeClassId,
        activeTab,
        activeComicId,
        selectComic,
        setRole,
        setActiveTab,
        selectExercise,
        selectClass,
        loginAs,
        logout,
        enrollClass,
        leaveClass,
        saveDraft,
        getDraft,
        clearDraft,
        clearAllDrafts,
        recordAttempt,
        addReflectionNote,
        createSupportRequest,
        reportGuidanceFeedback,
        updateStudentProfile,
        createClass,
        updateClass,
        createExercise,
        resolveSupportRequest,
        dismissSupportRequest,
        createGuidance,
        updateGuidance,
        resolveFeedbackReport,
        sendTeacherFeedbackToAttempt,
        likePost,
        addPost,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
