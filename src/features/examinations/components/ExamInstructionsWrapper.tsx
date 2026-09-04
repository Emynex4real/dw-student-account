import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ExamInstructions } from './ExamInstructions';
import type { Exam } from '../types/exam.types';
import { getExams, getExamQuestions } from '../../../services/exams.service';

const EXAM_SETTINGS: Exam['settings'] = {
  allowReview:            true,
  randomizeQuestions:     false,
  randomizeOptions:       false,
  showResultsImmediately: true,
  showCorrectAnswers:     true,
  allowBackNavigation:    true,
  fullScreenRequired:     true,
  calculatorAllowed:      false,
  maxTabSwitches:         3,
};

const ExamInstructionsWrapper: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const id = Number(examId);
        const [allExams, questions] = await Promise.all([
          getExams(),
          getExamQuestions(id),
        ]);

        const apiExam = allExams.find(e => e.id === id);
        if (!apiExam) {
          setErrorMsg(`Exam #${id} not found in your exam list. It may have been removed or you may not have access.`);
          setLoading(false);
          return;
        }

        if (!questions || questions.length === 0) {
          setErrorMsg(`No questions were returned for this exam. Please contact your instructor or try again.`);
          setLoading(false);
          return;
        }

        // Transform API types to the internal Exam shape used by ExamInstructions / ExamInterface
        const internalExam: Exam = {
          id: String(apiExam.id),
          title: apiExam.title,
          course: apiExam.course_title,
          description: apiExam.description ?? '',
          totalDuration: apiExam.duration,
          totalQuestions: questions.length,
          passingScore: 70,
          sections: [
            {
              id: 'section-1',
              title: apiExam.title,
              description: apiExam.description ?? '',
              duration: apiExam.duration,
              questions: questions.map(q => ({
                id: String(q.id),
                sectionId: 'section-1',
                type: 'multiple-choice' as const,
                text: q.question,
                options: [
                  { id: 'a', text: q.options.A },
                  { id: 'b', text: q.options.B },
                  { id: 'c', text: q.options.C },
                  { id: 'd', text: q.options.D },
                ],
                points: 1,
                correctAnswer: q.correct?.toLowerCase() ?? '',
              })),
            },
          ],
          settings: EXAM_SETTINGS,
        };

        setExam(internalExam);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to load exam:', error);
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Unknown error';
        const status = error?.response?.status;
        setErrorMsg(`Failed to load exam (${status ? `HTTP ${status}: ` : ''}${msg})`);
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f7941d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Could Not Load Exam</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/examinations')}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              className="flex-1 px-4 py-3 bg-[#f7941d] text-black rounded-xl font-bold hover:bg-[#d67e15] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  return <ExamInstructions exam={exam} />;
};

export default ExamInstructionsWrapper;
