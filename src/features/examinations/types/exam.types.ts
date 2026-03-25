type QuestionType = 'multiple-choice' | 'multiple-select' | 'true-false' | 'code';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  sectionId: string;
  type: QuestionType;
  text: string;
  code?: string;
  language?: string;
  options?: QuestionOption[];
  points: number;
  explanation?: string;
  correctAnswer?: string | string[];
}

interface ExamSection {
  id: string;
  title: string;
  description?: string;
  duration: number;
  questions: Question[];
}

interface ExamSettings {
  allowReview: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResultsImmediately: boolean;
  showCorrectAnswers: boolean;
  allowBackNavigation: boolean;
  fullScreenRequired: boolean;
  calculatorAllowed: boolean;
  maxTabSwitches: number;
}

interface Exam {
  id: string;
  title: string;
  course: string;
  description: string;
  totalDuration: number;
  totalQuestions: number;
  passingScore: number;
  sections: ExamSection[];
  settings: ExamSettings;
  deadline?: string;
}

interface Answer {
  questionId: string;
  answer: string | string[];
  flagged: boolean;
  timeSpent: number;
}

interface ExamSession {
  examId: string;
  startTime: number;
  answers: Answer[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  timeRemaining: number;
  tabSwitchCount: number;
  isFullScreen: boolean;
  lastSaved: number;
}

interface ExamResult {
  examId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number;
  answers: Answer[];
  sectionResults?: SectionResult[];
}

interface SectionResult {
  sectionId: string;
  sectionTitle: string;
  score: number;
  totalPoints: number;
  earnedPoints: number;
}

export type {
  QuestionType,
  QuestionOption,
  Question,
  ExamSection,
  ExamSettings,
  Exam,
  Answer,
  ExamSession,
  ExamResult,
  SectionResult
};
