import React from 'react';
import type { Question } from '../types/exam.types';
import { useExamStore } from '../store/examStore';
import { Code } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, questionNumber }) => {
  const { session, setAnswer } = useExamStore();
  
  const answer = session?.answers.find(a => a.questionId === question.id);
  const currentAnswer = answer?.answer || (question.type === 'multiple-select' ? [] : '');

  const handleOptionChange = (optionId: string) => {
    if (question.type === 'multiple-select') {
      const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      setAnswer(question.id, newAnswers);
    } else {
      setAnswer(question.id, optionId);
    }
  };

  const isSelected = (optionId: string): boolean => {
    if (question.type === 'multiple-select') {
      return Array.isArray(currentAnswer) && currentAnswer.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-[#f7941d] text-white rounded-full flex items-center justify-center font-bold">
          {questionNumber}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {question.type === 'multiple-choice' && 'Single Choice'}
              {question.type === 'multiple-select' && 'Multiple Choice (Select All That Apply)'}
              {question.type === 'true-false' && 'True or False'}
              {question.type === 'code' && 'Code Question'}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {question.text}
          </h3>
        </div>
      </div>

      {/* Code Block (if applicable) */}
      {question.code && (
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <Code size={16} className="text-gray-400" />
            <span className="text-xs font-mono text-gray-400">
              {question.language || 'javascript'}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-100 leading-relaxed">
              {question.code}
            </code>
          </pre>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option) => {
          const selected = isSelected(option.id);
          
          return (
            <label
              key={option.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selected
                  ? 'border-[#f7941d] bg-[#f7941d]/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {question.type === 'multiple-select' ? (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected 
                      ? 'bg-[#f7941d] border-[#f7941d]' 
                      : 'border-gray-300'
                  }`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected 
                      ? 'border-[#f7941d]' 
                      : 'border-gray-300'
                  }`}>
                    {selected && <div className="w-3 h-3 rounded-full bg-[#f7941d]"></div>}
                  </div>
                )}
              </div>
              <input
                type={question.type === 'multiple-select' ? 'checkbox' : 'radio'}
                name={question.id}
                value={option.id}
                checked={selected}
                onChange={() => handleOptionChange(option.id)}
                className="sr-only"
              />
              <span className={`flex-1 text-base ${selected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                {option.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
