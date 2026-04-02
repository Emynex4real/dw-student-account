import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Award, TrendingUp, Clock, CheckCircle, XCircle,
  Home, Download, Loader2,
} from 'lucide-react';
import { getExamHistory } from '../../../services/exams.service';

interface ResultData {
  score: number;       // percentage 0-100
  earnedPoints: number;
  totalPoints: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  answeredCount?: number;
  totalAnswers?: number;
}

const ExamResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = useParams();

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If navigate() passed state, use it directly
    const state = location.state?.result;
    if (state && typeof state.score === 'number') {
      setResult({
        score: state.score,
        earnedPoints: state.earnedPoints ?? state.score,
        totalPoints: state.totalPoints ?? 100,
        passed: state.passed,
        timeSpent: state.timeSpent ?? 0,
        completedAt: state.completedAt ?? new Date().toISOString(),
        answeredCount: state.answers?.filter((a: any) =>
          (Array.isArray(a.answer) && a.answer.length > 0) ||
          (typeof a.answer === 'string' && a.answer !== '')
        ).length,
        totalAnswers: state.answers?.length,
      });
      setLoading(false);
      return;
    }

    // Fallback: fetch from API history
    const fetchResult = async () => {
      try {
        const history = await getExamHistory();
        const match = history.find(h => String(h.id) === String(examId) ||
          // history entries don't have exam_id directly, so take the most recent
          false
        ) ?? history[0];

        if (match) {
          const pct = parseFloat(match.percentage);
          setResult({
            score: pct,
            earnedPoints: match.score,
            totalPoints: match.total,
            passed: pct >= 70,
            timeSpent: 0,
            completedAt: match.submitted_at,
          });
        } else {
          navigate('/dashboard/examinations');
        }
      } catch {
        navigate('/dashboard/examinations');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds: number): string => {
    if (!seconds) return '—';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#f7941d]" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Result Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.passed
              ? <Award size={48} className="text-green-600" />
              : <XCircle size={48} className="text-red-600" />}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Exam Completed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {result.passed
              ? 'You have successfully passed the exam!'
              : 'Unfortunately, you did not meet the passing score this time.'}
          </p>

          {/* Score */}
          <div className="inline-flex items-center gap-4 bg-gray-50 rounded-2xl px-8 py-6 border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-bold uppercase mb-1">Your Score</p>
              <p className={`text-5xl font-black ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                {result.score.toFixed(1)}%
              </p>
            </div>
            <div className="w-px h-16 bg-gray-300" />
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
              {result.answeredCount !== undefined && result.totalAnswers !== undefined
                ? `${result.answeredCount} / ${result.totalAnswers}`
                : `${result.earnedPoints} / ${result.totalPoints}`}
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

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <button
              onClick={() => navigate('/dashboard/examinations')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              <Home size={20} />
              Back to Examinations
            </button>
          </div>
        </div>

        {/* Certificate (if passed) */}
        {result.passed && (
          <div className="mt-6 bg-gradient-to-r from-[#f7941d] to-yellow-500 rounded-2xl shadow-lg p-8 text-center text-white">
            <Award size={48} className="mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Certificate Available!</h3>
            <p className="mb-4 opacity-90">Download your certificate of completion</p>
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
