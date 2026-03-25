import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Flag, Send, AlertTriangle,
  Maximize, Save
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import { useExamTimer } from '../hooks/useExamTimer';
import { useAutoSave } from '../hooks/useAutoSave';
import { useExamSecurity } from '../hooks/useExamSecurity';
import { ExamTimer } from './ExamTimer';
import { QuestionNavigation } from './QuestionNavigation';
import { QuestionDisplay } from './QuestionDisplay';
import { examService } from '../services/examService';

export const ExamInterface: React.FC = () => {
  const navigate = useNavigate();
  const { currentExam, session, navigateToQuestion, toggleFlag, clearSession } = useExamStore();
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enterFullScreen, tabSwitchCount, maxTabSwitches } = useExamSecurity(() => {
    setShowTabWarning(true);
    setTimeout(() => setShowTabWarning(false), 3000);
  });

  useAutoSave();

  const handleTimeUp = async () => {
    await handleSubmitExam();
  };

  useExamTimer(handleTimeUp);

  useEffect(() => {
    if (currentExam?.settings.fullScreenRequired) {
      enterFullScreen();
    }
  }, [currentExam, enterFullScreen]);

  if (!currentExam || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentSection = currentExam.sections[session.currentSectionIndex];
  const currentQuestion = currentSection.questions[session.currentQuestionIndex];
  const currentAnswer = session.answers.find(a => a.questionId === currentQuestion.id);

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
      const result = await examService.submitExam(currentExam.id, session.answers);
      clearSession();
      navigate(`/exams/${currentExam.id}/results`, { state: { result } });
    } catch (error) {
      console.error('Failed to submit exam:', error);
      alert('Failed to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  const answeredCount = session.answers.filter(a => 
    (Array.isArray(a.answer) && a.answer.length > 0) || 
    (typeof a.answer === 'string' && a.answer !== '')
  ).length;

  const flaggedCount = session.answers.filter(a => a.flagged).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{currentExam.title}</h1>
            <p className="text-sm text-gray-500">
              Section {session.currentSectionIndex + 1}: {currentSection.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Save size={16} className="text-gray-400" />
            <span className="text-gray-600">Auto-saving...</span>
          </div>
          <ExamTimer onTimeUp={handleTimeUp} />
          <button
            onClick={enterFullScreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Enter fullscreen"
          >
            <Maximize size={20} className="text-gray-600" />
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
                  {answeredCount} answered • {flaggedCount} flagged
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
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentAnswer?.flagged
                    ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                }`}
              >
                <Flag size={18} className={currentAnswer?.flagged ? 'fill-yellow-700' : ''} />
                {currentAnswer?.flagged ? 'Unflag' : 'Flag for Review'}
              </button>

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

        {/* Question Navigation Sidebar */}
        <QuestionNavigation />
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Submit Exam?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              You have answered {answeredCount} out of {currentExam.totalQuestions} questions.
              {flaggedCount > 0 && ` ${flaggedCount} questions are flagged for review.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
