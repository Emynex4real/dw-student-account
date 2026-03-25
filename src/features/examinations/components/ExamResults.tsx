import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Award, TrendingUp, Clock, CheckCircle, XCircle, 
  Home, Eye, Download, Share2 
} from 'lucide-react';
import type { ExamResult } from '../types/exam.types';

const ExamResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as ExamResult;

  if (!result) {
    navigate('/exams');
    return null;
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result.passed 
              ? 'bg-green-100' 
              : 'bg-red-100'
          }`}>
            {result.passed ? (
              <Award size={48} className="text-green-600" />
            ) : (
              <XCircle size={48} className="text-red-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Exam Completed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {result.passed 
              ? 'You have successfully passed the exam!' 
              : 'Unfortunately, you did not meet the passing score this time.'}
          </p>

          {/* Score Display */}
          <div className="inline-flex items-center gap-4 bg-gray-50 rounded-2xl px-8 py-6 border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Your Score</p>
              <p className={`text-5xl font-black ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.score.toFixed(1)}%
              </p>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Points</p>
              <p className="text-3xl font-bold text-gray-900">
                {result.earnedPoints}/{result.totalPoints}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-gray-400" size={24} />
              <p className="text-sm font-bold text-gray-500 uppercase">Time Spent</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-gray-400" size={24} />
              <p className="text-sm font-bold text-gray-500 uppercase">Answered</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {result.answers.filter(a => 
                (Array.isArray(a.answer) && a.answer.length > 0) || 
                (typeof a.answer === 'string' && a.answer !== '')
              ).length} / {result.answers.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-gray-400" size={24} />
              <p className="text-sm font-bold text-gray-500 uppercase">Performance</p>
            </div>
            <p className={`text-2xl font-bold ${
              result.score >= 90 ? 'text-green-600' :
              result.score >= 75 ? 'text-blue-600' :
              result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.score >= 90 ? 'Excellent' :
               result.score >= 75 ? 'Good' :
               result.score >= 60 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
        </div>

        {/* Section Results */}
        {result.sectionResults && result.sectionResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Section Breakdown</h2>
            <div className="space-y-4">
              {result.sectionResults.map((section) => (
                <div key={section.sectionId} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{section.sectionTitle}</h3>
                    <span className="text-lg font-bold text-gray-900">
                      {section.score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        section.score >= 75 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${section.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {section.earnedPoints} / {section.totalPoints} points
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/exams')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              <Home size={20} />
              Back to Exams
            </button>
            <button
              onClick={() => navigate(`/exams/${result.examId}/review`)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#f7941d] text-black rounded-xl font-bold hover:bg-[#d67e15] transition-colors"
            >
              <Eye size={20} />
              Review Answers
            </button>
          </div>
        </div>

        {/* Certificate (if passed) */}
        {result.passed && (
          <div className="mt-6 bg-gradient-to-r from-[#f7941d] to-yellow-500 rounded-2xl shadow-lg p-8 text-center text-white">
            <Award size={48} className="mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Certificate Available!</h3>
            <p className="mb-4 opacity-90">
              Download your certificate of completion
            </p>
            <button className="bg-white text-[#f7941d] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <Download size={20} />
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
