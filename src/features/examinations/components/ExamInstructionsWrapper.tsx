import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamInstructions } from './ExamInstructions';
import type { Exam } from '../types/exam.types';
import { getExams, getExamQuestions } from '../../../services/exams.service';

const ExamInstructionsWrapper: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const id = Number(examId);
        const [allExams, questions] = await Promise.all([
          getExams(),
          getExamQuestions(id),
        ]);

        const apiExam = allExams.find(e => e.id === id);
        if (!apiExam) {
          navigate('/exams');
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
                correctAnswer: q.correct.toLowerCase(),
              })),
            },
          ],
          settings: {
            allowReview: true,
            randomizeQuestions: false,
            randomizeOptions: false,
            showResultsImmediately: true,
            showCorrectAnswers: true,
            allowBackNavigation: true,
            fullScreenRequired: true,
            calculatorAllowed: false,
            maxTabSwitches: 3,
          },
        };

        setExam(internalExam);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam:', error);
        navigate('/exams');
      }
    };

    loadExam();
  }, [examId, navigate]);

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

  if (!exam) return null;

  return <ExamInstructions exam={exam} />;
};

export default ExamInstructionsWrapper;
