import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, CheckCircle, XCircle, Code } from 'lucide-react';
import type { Exam } from '../types/exam.types';
import { examService } from '../services/examService';

export const ExamReview: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const examData = await examService.getExam();
        setExam(examData);
        // In real app, fetch result from API
        // For now, we'll use mock data
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam data:', error);
        navigate('/exams');
      }
    };

    loadData();
  }, [examId, navigate]);

  if (loading || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading review...</p>
      </div>
    );
  }

  const showCorrectAnswers = exam.settings.showCorrectAnswers;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{exam.title}</h1>
              <p className="text-gray-600">Review your answers</p>
            </div>
            <button
              onClick={() => navigate('/exams')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Home size={18} />
              Back to Exams
            </button>
          </div>
        </div>

        {/* Questions Review */}
        {exam.sections.map((section, sectionIndex) => (
          <div key={section.id} className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Section {sectionIndex + 1}: {section.title}
              </h2>
              {section.description && (
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {section.questions.map((question, questionIndex) => {
                // Mock: Get student's answer (in real app, from result data)
                const studentAnswer = question.type === 'multiple-select' 
                  ? ['a', 'b'] // Mock answer
                  : 'a'; // Mock answer

                const isCorrect = showCorrectAnswers && (
                  Array.isArray(studentAnswer)
                    ? JSON.stringify(studentAnswer.sort()) === JSON.stringify((question.correctAnswer as string[]).sort())
                    : studentAnswer === question.correctAnswer
                );

                let globalQuestionNumber = 0;
                for (let i = 0; i < sectionIndex; i++) {
                  globalQuestionNumber += exam.sections[i].questions.length;
                }
                globalQuestionNumber += questionIndex + 1;

                return (
                  <div
                    key={question.id}
                    className={`bg-white rounded-2xl shadow-sm border-2 p-6 ${
                      showCorrectAnswers
                        ? isCorrect
                          ? 'border-green-300'
                          : 'border-red-300'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                        {globalQuestionNumber}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">
                            {question.type === 'multiple-choice' && 'Single Choice'}
                            {question.type === 'multiple-select' && 'Multiple Choice'}
                            {question.type === 'true-false' && 'True or False'}
                            {question.type === 'code' && 'Code Question'}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {question.points} pts
                          </span>
                          {showCorrectAnswers && (
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                              isCorrect
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {isCorrect ? (
                                <>
                                  <CheckCircle size={12} /> Correct
                                </>
                              ) : (
                                <>
                                  <XCircle size={12} /> Incorrect
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {question.text}
                        </h3>
                      </div>
                    </div>

                    {/* Code Block */}
                    {question.code && (
                      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 mb-4">
                        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                          <Code size={16} className="text-gray-400" />
                          <span className="text-xs font-mono text-gray-400">
                            {question.language || 'javascript'}
                          </span>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-gray-100">
                            {question.code}
                          </code>
                        </pre>
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options?.map((option) => {
                        const isStudentAnswer = Array.isArray(studentAnswer)
                          ? studentAnswer.includes(option.id)
                          : studentAnswer === option.id;
                        const isCorrectOption = showCorrectAnswers && option.isCorrect;

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border-2 ${
                              showCorrectAnswers
                                ? isCorrectOption
                                  ? 'border-green-500 bg-green-50'
                                  : isStudentAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-gray-50'
                                : isStudentAnswer
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {showCorrectAnswers && isCorrectOption && (
                                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                              )}
                              {showCorrectAnswers && isStudentAnswer && !isCorrectOption && (
                                <XCircle size={18} className="text-red-600 flex-shrink-0" />
                              )}
                              {!showCorrectAnswers && isStudentAnswer && (
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                              )}
                              <span className={`text-sm ${
                                showCorrectAnswers && (isCorrectOption || isStudentAnswer)
                                  ? 'font-medium'
                                  : ''
                              }`}>
                                {option.text}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showCorrectAnswers && question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-bold text-blue-900 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        {!showCorrectAnswers && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-medium">
              Correct answers are not available for this exam. Please contact your instructor for feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamReview;
