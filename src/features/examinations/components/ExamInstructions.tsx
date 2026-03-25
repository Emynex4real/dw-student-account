import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, FileText, Award, ShieldCheck, AlertTriangle, 
  Monitor, Wifi, CheckCircle, ArrowRight 
} from 'lucide-react';
import type { Exam } from '../types/exam.types';
import { useExamStore } from '../store/examStore';

interface ExamInstructionsProps {
  exam: Exam;
}

export const ExamInstructions: React.FC<ExamInstructionsProps> = ({ exam }) => {
  const navigate = useNavigate();
  const { startExam } = useExamStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [systemCheckPassed, setSystemCheckPassed] = useState(false);

  React.useEffect(() => {
    // Simple system check
    const checkSystem = () => {
      const hasInternet = navigator.onLine;
      const hasModernBrowser = 'requestFullscreen' in document.documentElement;
      setSystemCheckPassed(hasInternet && hasModernBrowser);
    };
    
    checkSystem();
  }, []);

  const handleStartExam = () => {
    if (!agreedToTerms) {
      alert('Please agree to the exam rules before starting.');
      return;
    }
    
    startExam(exam);
    navigate(`/exams/${exam.id}/take`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-[#f7941d]/10 rounded-xl flex items-center justify-center">
              <FileText size={32} className="text-[#f7941d]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                {exam.course}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Clock className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 font-bold uppercase">Duration</p>
              <p className="text-lg font-bold text-gray-900">{exam.totalDuration} mins</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <FileText className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 font-bold uppercase">Questions</p>
              <p className="text-lg font-bold text-gray-900">{exam.totalQuestions}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Award className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 font-bold uppercase">Passing Score</p>
              <p className="text-lg font-bold text-gray-900">{exam.passingScore}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <ShieldCheck className="text-gray-400 mb-2" size={20} />
              <p className="text-xs text-gray-500 font-bold uppercase">Sections</p>
              <p className="text-lg font-bold text-gray-900">{exam.sections.length}</p>
            </div>
          </div>
        </div>

        {/* Exam Rules */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-[#f7941d]" size={24} />
            Exam Rules & Guidelines
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-700">
                You have <strong>{exam.totalDuration} minutes</strong> to complete all {exam.totalQuestions} questions.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-700">
                The exam will auto-submit when time expires.
              </span>
            </li>
            {exam.settings.fullScreenRequired && (
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-gray-700">
                  Full-screen mode is <strong>required</strong> during the exam.
                </span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-700">
                Switching tabs is monitored. Maximum allowed: <strong>{exam.settings.maxTabSwitches} times</strong>.
              </span>
            </li>
            {exam.settings.allowBackNavigation && (
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-gray-700">
                  You can navigate back to previous questions.
                </span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-700">
                Your progress is auto-saved every 30 seconds.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-700">
                You can flag questions for review before submitting.
              </span>
            </li>
          </ul>
        </div>

        {/* System Check */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="text-[#f7941d]" size={24} />
            System Requirements Check
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi size={20} className="text-gray-400" />
                <span className="text-gray-700">Internet Connection</span>
              </div>
              {navigator.onLine ? (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={18} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertTriangle size={18} /> Disconnected
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-gray-400" />
                <span className="text-gray-700">Browser Compatibility</span>
              </div>
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle size={18} /> Compatible
              </span>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#f7941d] border-gray-300 rounded focus:ring-[#f7941d]"
            />
            <span className="text-gray-700">
              I have read and understood the exam rules. I agree to maintain academic integrity 
              and understand that any violation may result in exam disqualification.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/exams')}
            className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExam}
            disabled={!agreedToTerms || !systemCheckPassed}
            className="flex-1 bg-[#f7941d] text-black font-bold py-4 px-6 rounded-xl hover:bg-[#d67e15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Start Exam <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
