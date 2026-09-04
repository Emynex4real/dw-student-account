import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft, ChevronRight, Send, AlertTriangle,
  Maximize, Save, Grid3X3, X
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import { useAuthStore } from '../../../store/authStore';
import { useExamTimer } from '../hooks/useExamTimer';
import { useAutoSave } from '../hooks/useAutoSave';
import { useExamSecurity } from '../hooks/useExamSecurity';
import { ExamTimer } from './ExamTimer';
import { QuestionNavigation } from './QuestionNavigation';
import { QuestionDisplay } from './QuestionDisplay';
import { submitExam as submitExamApi, startExamSession } from '../../../services/exams.service';

export const ExamInterface: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const { currentExam, session, navigateToQuestion, clearSession, updateTimeRemaining } = useExamStore();
  const queryClient = useQueryClient();
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [graceSecondsLeft, setGraceSecondsLeft] = useState<number | null>(null);
  const hasAutoSubmitted = React.useRef(false);
  const autoSubmitTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Page reload = student accidentally refreshed, not a rule violation — don't auto-submit
  const isPageReload = React.useRef(
    (performance.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming)?.type === 'reload'
  );

  // On every mount (including page refresh), resync the timer against the server.
  // INSERT IGNORE means this won't reset an existing session — it just returns
  // the original started_unix so we can recalculate the true remaining time.
  // Setting timeRemaining to 0 lets the existing timer interval call onTimeUp naturally.
  useEffect(() => {
    if (!currentExam || !examId) return;
    startExamSession(Number(examId))
      .then(({ started_unix, server_time }) => {
        const elapsed = Math.max(0, server_time - started_unix);
        const remaining = Math.max(0, currentExam.totalDuration * 60 - elapsed);
        updateTimeRemaining(remaining);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabSwitch = useCallback(() => {
    setShowTabWarning(true);
    setTimeout(() => setShowTabWarning(false), 3000);
  }, []);

  const { enterFullScreen, tabSwitchCount, maxTabSwitches } = useExamSecurity(handleTabSwitch);

  useAutoSave();

  const handleTimeUp = async () => {
    // Open the modal so the student sees "Submitting..." and, if it fails,
    // sees the error with a "Try Again" button — otherwise they'd be stuck
    // staring at 0:00 with no feedback and no way to retry.
    setShowSubmitConfirm(true);

    // Start a 2-minute grace countdown so student knows how long they have to retry
    const GRACE = 120;
    setGraceSecondsLeft(GRACE);
    let remaining = GRACE;
    const graceInterval = setInterval(() => {
      remaining -= 1;
      setGraceSecondsLeft(remaining);
      if (remaining <= 0) clearInterval(graceInterval);
    }, 1000);

    await handleSubmitExam();
  };

  const { formattedTime, isLowTime } = useExamTimer(handleTimeUp);

  useEffect(() => {
    if (currentExam?.settings.fullScreenRequired) {
      enterFullScreen();
    }
  }, [currentExam, enterFullScreen]);

  // ── Block right-click & devtools shortcuts ───────────────────────────────
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      const blocked =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S');
      if (blocked) e.preventDefault();
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeys);
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  // ── Auto-submit on minimize / tab switch ────────────────────────────────
  // Page reloads: the browser can briefly fire visibilitychange=hidden during
  // the reload cycle. We ignore events for 2 seconds after a reload so the
  // student isn't punished for refreshing — but tab switches after that still
  // trigger auto-submit as normal.
  // Fire-and-forget with keepalive — don't await the response (browser suspends
  // JS when page is hidden, so awaiting res.json() fails). Navigate immediately
  // and let ExamResults fetch the result from history.
  useEffect(() => {
    let inReloadGrace = isPageReload.current;
    let graceTimer: ReturnType<typeof setTimeout> | null = null;
    if (inReloadGrace) {
      graceTimer = setTimeout(() => { inReloadGrace = false; }, 2000);
    }

    const autoSubmit = () => {
      if (hasAutoSubmitted.current) return;
      hasAutoSubmitted.current = true;

      const { currentExam: exam, session: s, clearSession: clear } = useExamStore.getState();
      if (!exam || !s) return;

      const token = useAuthStore.getState().token;
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '/students/api';

      const apiAnswers = s.answers.map((a) => ({
        question_id: Number(a.questionId),
        answer: (typeof a.answer === 'string' ? a.answer : a.answer[0] ?? '').toUpperCase(),
      }));

      // keepalive ensures the POST completes even when the page is hidden
      fetch(`${baseUrl}/exams/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ exam_id: Number(exam.id), answers: apiAnswers }),
        keepalive: true,
      }).catch(() => {});

      const id = exam.id;
      // Navigate immediately — ExamResults will fetch result from history API
      navigate(`/exams/${id}/results`, { state: { autoSubmitted: true } });
      clear();
    };

    const handleVisibilityChange = () => {
      if (inReloadGrace) return; // still within the reload grace window
      if (document.hidden) {
        // 3-second grace period — cancels if student returns quickly (e.g. phone notification)
        autoSubmitTimer.current = setTimeout(() => autoSubmit(), 3000);
      } else {
        if (autoSubmitTimer.current) {
          clearTimeout(autoSubmitTimer.current);
          autoSubmitTimer.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
      if (graceTimer) clearTimeout(graceTimer);
    };
  }, [navigate]);

  // Redirect to instructions if no active session (e.g. direct URL access)
  // But not if we just auto-submitted — hasAutoSubmitted handles that redirect
  useEffect(() => {
    if (!currentExam || !session) {
      if (hasAutoSubmitted.current) return;
      const target = examId
        ? `/exams/${examId}/instructions`
        : '/dashboard/examinations';
      navigate(target, { replace: true });
    }
  }, [currentExam, session, examId, navigate]);

  // Block browser back / forward during exam
  useEffect(() => {
    if (!currentExam || !session) return;
    // Push a duplicate entry so back navigation stays on this page
    window.history.pushState(null, '', window.location.href);
    const handlePop = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [currentExam, session]);

  if (!currentExam || !session) {
    return null;
  }

  const currentSection = currentExam.sections[session.currentSectionIndex];
  const currentQuestion = currentSection.questions[session.currentQuestionIndex];
  let totalQuestionNumber = 0;
  for (let i = 0; i < session.currentSectionIndex; i++) {
    totalQuestionNumber += currentExam.sections[i].questions.length;
  }
  totalQuestionNumber += session.currentQuestionIndex + 1;

  const canGoBack = session.currentSectionIndex > 0 || session.currentQuestionIndex > 0;
  const canGoNext = 
    session.currentSectionIndex < currentExam.sections.length - 1 ||
    session.currentQuestionIndex < currentSection.questions.length - 1;

  const handlePrevious = () => {
    if (!currentExam.settings.allowBackNavigation) return;
    
    if (session.currentQuestionIndex > 0) {
      navigateToQuestion(session.currentSectionIndex, session.currentQuestionIndex - 1);
    } else if (session.currentSectionIndex > 0) {
      const prevSection = currentExam.sections[session.currentSectionIndex - 1];
      navigateToQuestion(session.currentSectionIndex - 1, prevSection.questions.length - 1);
    }
  };

  const handleNext = () => {
    if (session.currentQuestionIndex < currentSection.questions.length - 1) {
      navigateToQuestion(session.currentSectionIndex, session.currentQuestionIndex + 1);
    } else if (session.currentSectionIndex < currentExam.sections.length - 1) {
      navigateToQuestion(session.currentSectionIndex + 1, 0);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const apiAnswers = session.answers.map(a => ({
        question_id: Number(a.questionId),
        answer: (typeof a.answer === 'string' ? a.answer : a.answer[0] ?? '').toUpperCase(),
      }));
      const apiResult = await submitExamApi(Number(currentExam.id), apiAnswers);
      const pct = parseFloat(apiResult.percentage);

      const result = {
        examId: currentExam.id,
        studentId: '',
        score: pct,
        totalPoints: apiResult.total,
        earnedPoints: apiResult.score,
        passed: pct >= (currentExam.passingScore ?? 70),
        completedAt: new Date().toISOString(),
        timeSpent: currentExam.totalDuration * 60 - session.timeRemaining,
        answers: session.answers,
      };

      await queryClient.invalidateQueries({ queryKey: ['exams'] });
      hasAutoSubmitted.current = true; // prevent redirect-to-instructions effect
      navigate(`/exams/${currentExam.id}/results`, { state: { result } });
      clearSession();
    } catch (error: any) {
      const isNetworkError = !error?.response?.status;
      setSubmitError(
        isNetworkError
          ? 'Connection failed. Your answers are saved — tap "Try Again" to resubmit.'
          : (error?.response?.data?.error || error?.response?.data?.message || 'Server error. Please try again.')
      );
      setIsSubmitting(false);
    }
  };

  const answeredCount = session.answers.filter(a => 
    (Array.isArray(a.answer) && a.answer.length > 0) || 
    (typeof a.answer === 'string' && a.answer !== '')
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Persistent minimize warning banner */}
      <div className="bg-red-600 text-white text-center text-sm font-bold px-4 py-2 flex items-center justify-center gap-2">
        <AlertTriangle size={15} />
        Warning: Switching tabs or minimizing this page will automatically submit your exam. Refreshing the page is safe.
      </div>

      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <AlertTriangle size={20} />
          <span className="font-bold">
            Warning: Tab switch detected! ({tabSwitchCount}/{maxTabSwitches})
          </span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">{currentExam.title}</h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Section {session.currentSectionIndex + 1}: {currentSection.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Save size={16} className="text-gray-400" />
            <span className="text-gray-600">Auto-saving...</span>
          </div>
          <ExamTimer formattedTime={formattedTime} isLowTime={isLowTime} />
          <button
            onClick={enterFullScreen}
            className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Enter fullscreen"
          >
            <Maximize size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Question navigator"
          >
            <Grid3X3 size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Question {totalQuestionNumber} of {currentExam.totalQuestions}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {answeredCount} answered
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#f7941d] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / currentExam.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
              <QuestionDisplay question={currentQuestion} questionNumber={totalQuestionNumber} />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-end gap-4">
              <div className="flex gap-3">
                {currentExam.settings.allowBackNavigation && (
                  <button
                    onClick={handlePrevious}
                    disabled={!canGoBack}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                )}

                {canGoNext ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#f7941d] text-black rounded-xl font-bold hover:bg-[#d67e15] transition-colors"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    <Send size={18} />
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <QuestionNavigation />
        </div>
      </div>

      {/* Mobile Question Navigator Overlay */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileNav(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Question Navigator</h3>
              <button onClick={() => setShowMobileNav(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <QuestionNavigation onNavigate={() => setShowMobileNav(false)} />
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Submit Exam?
            </h2>
            <p className="text-gray-600 text-center mb-4">
              You have answered {answeredCount} out of {currentExam.totalQuestions} questions.
            </p>

            {submitError && (
              <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span>{submitError}</span>
                  {graceSecondsLeft !== null && graceSecondsLeft > 0 && (
                    <p className="mt-1 font-semibold">
                      {Math.floor(graceSecondsLeft / 60)}:{String(graceSecondsLeft % 60).padStart(2, '0')} left to retry
                    </p>
                  )}
                  {graceSecondsLeft !== null && graceSecondsLeft <= 0 && (
                    <p className="mt-1 font-semibold">Submission window has closed.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSubmitConfirm(false); setSubmitError(null); }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : submitError ? 'Try Again' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
