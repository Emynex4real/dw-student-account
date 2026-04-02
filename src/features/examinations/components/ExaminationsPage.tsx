import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home, ChevronRight, FileText, Clock, Award,
  AlertTriangle, CheckCircle, PlayCircle,
  ShieldCheck, ArrowRight, Loader2
} from 'lucide-react';
import { getExams } from '../../../services/exams.service';

const ExaminationsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: exams = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
  });

  const activeExams = exams.filter(e => !e.already_taken);
  const completedExams = exams.filter(e => e.already_taken);

  const handleStartExam = (examId: number) => {
    navigate(`/exams/${examId}/instructions`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#f7941d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your exams...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load exams</h3>
          <p className="text-gray-500 mb-6">Could not connect to the server.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Exams</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Your <span className="text-[#f7941d]">Examinations</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-xl">
                Manage your active assessments and review past results.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">{activeExams.length}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">{completedExams.length}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {exams.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FileText size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You currently have no active exams.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Exams will appear here automatically when your instructors assign them.
            </p>
            <button
              onClick={() => navigate('/dashboard/courses')}
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors duration-300 flex items-center gap-2"
            >
              <PlayCircle size={18} />
              Continue Studying
            </button>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Active Exams Section */}
            {activeExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-2 bg-[#f7941d] rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Active Assessments
                    <span className="bg-[#f7941d]/10 text-[#f7941d] text-xs font-bold px-2.5 py-1 rounded-full border border-[#f7941d]/20">
                      {activeExams.length} Pending
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeExams.map((exam) => (
                    <div key={exam.id} className="relative bg-white rounded-2xl border-2 border-[#f7941d]/50 shadow-lg shadow-[#f7941d]/5 overflow-hidden flex flex-col">

                      <div className="bg-[#f7941d]/10 px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-[#f7941d] border-b border-[#f7941d]/20">
                        <ShieldCheck size={14} /> Academic Integrity Monitored
                      </div>

                      <div className="p-6 flex-grow">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{exam.course_title}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{exam.title}</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                            <Clock className="text-gray-400" size={20} />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold">Duration</p>
                              <p className="text-sm font-bold text-gray-900">{exam.duration} Mins</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold">Payment</p>
                              <p className="text-sm font-bold text-gray-900 capitalize">{exam.payment_status}</p>
                            </div>
                          </div>
                        </div>

                        {exam.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
                        )}

                        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleStartExam(exam.id)}
                            className="bg-[#f7941d] text-black font-bold py-2.5 px-6 rounded-xl hover:bg-[#d67e15] transition-colors flex items-center gap-2 shadow-md"
                          >
                            Start Exam <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed Exams Section */}
            {completedExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-2 bg-black rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Past Results</h2>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {completedExams.map((exam) => {
                      const pct = exam.result ? parseFloat(exam.result.percentage) : 0;
                      const passed = pct >= 70;
                      return (
                        <div key={exam.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">

                          <div className="flex items-start gap-4">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {passed ? <Award size={24} /> : <AlertTriangle size={24} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{exam.course_title}</p>
                              <h3 className="text-base font-bold text-gray-900 mb-1">{exam.title}</h3>
                              {exam.result && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <CheckCircle size={14} className="text-green-500" />
                                  <span>Submitted {new Date(exam.result.submitted_at).toLocaleDateString()}</span>
                                  <span>· {exam.result.score}/{exam.result.total} correct</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                            <div className="text-right flex-1 sm:flex-none">
                              <p className="text-[10px] font-bold text-gray-500 uppercase">Score</p>
                              <p className={`text-xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                {exam.result?.percentage ?? '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">
          Digital World Tech Academy © 2026
        </p>
      </footer>

    </div>
  );
};

export default ExaminationsPage;