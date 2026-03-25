import React from 'react';
import { Flag, CheckCircle, Circle } from 'lucide-react';
import { useExamStore } from '../store/examStore';

export const QuestionNavigation: React.FC = () => {
  const { currentExam, session, navigateToQuestion } = useExamStore();

  if (!currentExam || !session) return null;

  let questionNumber = 0;

  return (
    <div className="bg-white border-l border-gray-200 w-64 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-sm text-gray-900">Question Navigator</h3>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Unanswered</span>
          </div>
        </div>
      </div>

      {currentExam.sections.map((section, sectionIndex) => (
        <div key={section.id} className="border-b border-gray-200">
          <div className="p-3 bg-gray-50">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wide">
              {section.title}
            </h4>
          </div>
          <div className="grid grid-cols-5 gap-2 p-3">
            {section.questions.map((question, questionIndex) => {
              const answer = session.answers.find(a => a.questionId === question.id);
              const isAnswered = answer && (
                (Array.isArray(answer.answer) && answer.answer.length > 0) ||
                (typeof answer.answer === 'string' && answer.answer !== '')
              );
              const isFlagged = answer?.flagged;
              const isCurrent = session.currentSectionIndex === sectionIndex && 
                               session.currentQuestionIndex === questionIndex;
              
              questionNumber++;

              return (
                <button
                  key={question.id}
                  onClick={() => navigateToQuestion(sectionIndex, questionIndex)}
                  className={`relative h-10 rounded-lg font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-[#f7941d] text-white ring-2 ring-[#f7941d] ring-offset-2'
                      : isAnswered
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {questionNumber}
                  {isFlagged && (
                    <Flag 
                      size={12} 
                      className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
