import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamSession, Exam } from '../types/exam.types';

interface Answer {
  questionId: string;
  answer: string | string[];
  timeSpent: number;
}

interface ExamStore {
  currentExam: Exam | null;
  session: ExamSession | null;
  
  // Actions
  startExam: (exam: Exam, elapsedSeconds?: number) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  navigateToQuestion: (sectionIndex: number, questionIndex: number) => void;
  updateTimeRemaining: (seconds: number) => void;
  incrementTabSwitch: () => void;
  setFullScreen: (isFullScreen: boolean) => void;
  saveSession: () => void;
  submitExam: () => void;
  clearSession: () => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      currentExam: null,
      session: null,

      startExam: (exam: Exam, elapsedSeconds = 0) => {
        const answers: Answer[] = [];

        exam.sections.forEach(section => {
          section.questions.forEach(question => {
            answers.push({
              questionId: question.id,
              answer: question.type === 'multiple-select' ? [] : '',
              timeSpent: 0
            });
          });
        });

        const timeRemaining = Math.max(0, exam.totalDuration * 60 - elapsedSeconds);

        set({
          currentExam: exam,
          session: {
            examId: exam.id,
            startTime: Date.now(),
            answers,
            currentSectionIndex: 0,
            currentQuestionIndex: 0,
            timeRemaining,
            tabSwitchCount: 0,
            isFullScreen: false,
            lastSaved: Date.now()
          }
        });
      },

      setAnswer: (questionId: string, answer: string | string[]) => {
        const { session } = get();
        if (!session) return;

        const updatedAnswers = session.answers.map(a =>
          a.questionId === questionId ? { ...a, answer } : a
        );

        set({
          session: {
            ...session,
            answers: updatedAnswers
          }
        });
      },

      navigateToQuestion: (sectionIndex: number, questionIndex: number) => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            currentSectionIndex: sectionIndex,
            currentQuestionIndex: questionIndex
          }
        });
      },

      updateTimeRemaining: (seconds: number) => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            timeRemaining: seconds
          }
        });
      },

      incrementTabSwitch: () => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            tabSwitchCount: session.tabSwitchCount + 1
          }
        });
      },

      setFullScreen: (isFullScreen: boolean) => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            isFullScreen
          }
        });
      },

      saveSession: () => {
        const { session } = get();
        if (!session) return;

        set({
          session: {
            ...session,
            lastSaved: Date.now()
          }
        });
      },

      submitExam: () => {
        set({ currentExam: null, session: null });
      },

      clearSession: () => {
        set({
          currentExam: null,
          session: null
        });
      }
    }),
    {
      name: 'exam-session-storage',
      partialize: (state) => ({ session: state.session, currentExam: state.currentExam })
    }
  )
);
