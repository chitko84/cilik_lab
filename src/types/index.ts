/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  gradeLevel?: string;
  bio: string;
  streakDays: number;
  totalPoints: number;
  completedLessonsCount: number;
  enrolledClassesCount: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
  preferences: {
    theme: 'light' | 'system';
    emailNotifications: boolean;
    soundEffects: boolean;
    learningReminders: boolean;
    accessibilityHighContrast: boolean;
  };
}

export interface ClassSyllabusItem {
  id: string;
  title: string;
  type: 'concept' | 'exercise' | 'mini_project' | 'quiz';
  durationMin: number;
  completed?: boolean;
  exerciseId?: string;
}

export interface CodingClass {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string;
  language: string;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
  category: 'Basics' | 'Game Dev' | 'Logic & Loops' | 'Creative Coding' | 'Problem Solving' | 'Data & Lists';
  durationHours: number;
  enrolledCount: number;
  lessonsCount: number;
  exercisesCount: number;
  accentColor: string;
  isEnrolled?: boolean;
  progressPercent?: number;
  syllabus: ClassSyllabusItem[];
  learningOutcomes: string[];
  status: 'active' | 'upcoming' | 'archived';
  lastUpdated: string;
}

export interface TestCase {
  id: string;
  name: string;
  inputDescription?: string;
  expectedOutput: string;
  isHidden?: boolean;
  testFunction?: string; // code check logic
}

export interface ExerciseHintStages {
  stage1Concept: string; // Remember the concept
  stage2Think: string;   // Think about your attempt
  stage3Action: string;  // Try a debugging action
}

export interface CodingExercise {
  id: string;
  classId: string;
  className: string;
  title: string;
  shortDesc: string;
  instructions: string;
  learningObjective: string;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: ExerciseHintStages;
  maxMarks: number;
  dueDays?: number;
}

export interface TestResultItem {
  testId: string;
  testName: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface ErrorDiagnostic {
  type: 'SyntaxError' | 'NameError' | 'TypeError' | 'IndentationError' | 'IndexError' | 'ZeroDivisionError' | 'ValueError' | 'RuntimeError';
  message: string;
  line: number;
  friendlyTitle: string;
  friendlyExplanation: string;
  whatToInspect: string;
  tinyNextAction: string;
  rawError: string;
}

export interface ReflectionNotes {
  whatChanged: string;
  whyChanged: string;
  howVerified: string;
  submittedAt: string;
}

export interface CodeAttempt {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  attemptNumber: number;
  code: string;
  timestamp: string;
  status: 'passed' | 'failed' | 'needs_review';
  score: number;
  maxScore: number;
  stdout: string;
  testResults: TestResultItem[];
  error?: ErrorDiagnostic;
  reflectionNotes?: ReflectionNotes;
  teacherFeedback?: {
    teacherName: string;
    feedbackText: string;
    createdAt: string;
  };
}

export interface SupportRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  classId: string;
  className: string;
  exerciseId: string;
  exerciseTitle: string;
  category: 'task_confusion' | 'error_confusion' | 'approach_check';
  message: string;
  currentCode: string;
  latestError?: string;
  attemptCount: number;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  sessionShareApproved: boolean;
  teacherResponse?: {
    teacherName: string;
    message: string;
    attachedGuidanceTitle?: string;
    respondedAt: string;
  };
}

export interface SharedMisconception {
  id: string;
  label: string;
  category: string;
  affectedAttemptsCount: number;
  exerciseId: string;
  exerciseTitle: string;
  recurringSnippet: string;
  suggestedMiniLesson: string;
  reviewStatus: 'suggested' | 'approved' | 'addressed';
}

export interface GuidanceResource {
  id: string;
  title: string;
  content: string;
  conceptTags: string[];
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
  relatedErrorType?: string;
  resourceType: 'concept_reminder' | 'debugging_question' | 'progressive_hint' | 'mini_lesson';
  reviewStatus: 'approved' | 'draft';
  updatedAt: string;
  usageCount: number;
}

export interface FeedbackReport {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  reportedGuidance: string;
  reason: 'confusing' | 'incorrect' | 'too_revealing';
  studentNotes?: string;
  studentName: string;
  studentId: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  actionTaken?: string;
}

export interface PeerCodeReview {
  lineNumber: number;
  codeExcerpt: string;
  observation: string;
  guidingQuestion: string;
  constructiveSuggestion?: string;
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  timestamp: string;
  peerReview?: PeerCodeReview;
}

export interface CommunityPost {
  id: string;
  classId?: string;
  className?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'announcement' | 'showcase' | 'question' | 'tips' | 'code_review';
  codeSnippet?: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  comments: CommunityComment[];
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'enrollment' | 'submission' | 'help_request' | 'feedback' | 'achievement' | 'community';
  actionTab?: string;
  relatedId?: string;
}

export interface ExecutionTraceStep {
  step: number;
  line: number;
  lineContent: string;
  variables: Record<string, string | number | boolean | any[]>;
  stdoutSoFar: string;
  explanation: string;
}
