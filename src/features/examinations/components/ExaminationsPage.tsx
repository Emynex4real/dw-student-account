import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ChevronRight, FileText, Clock, Award, 
  AlertTriangle, CheckCircle, Lock, PlayCircle, 
  ShieldCheck, ArrowRight, Crown 
} from 'lucide-react';

// --- Mock Data ---
const mockActiveExams = [
  {
    id: 1,
    title: "Frontend React Certification Exam",
    course: "Advanced Web Development",
    duration: "120 Mins",
    questions: 50,
    passingScore: "75%",
    deadline: "Mar 18, 2026 - 11:59 PM",
    status: "active"
  }
];

const mockUpcomingExams = [
  {
    id: 2,
    title: "Digital Marketing Final Assessment",
    course: "Study Digital Marketing",
    duration: "90 Mins",
    questions: 40,
    passingScore: "70%",
    opensAt: "Mar 20, 2026 - 09:00 AM",
    status: "locked"
  }
];

const mockCompletedExams = [
  {
    id: 3,
    title: "HTML & CSS Basics Quiz",
    course: "Web Development Fundamentals",
    dateTaken: "Mar 10, 2026",
    score: "92%",
    passed: true,
    status: "completed"
  }
];

const ExaminationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasExams, setHasExams] = useState(false);

  const handleStartExam = (examId: number) => {
    navigate(`/exams/${examId}/instructions`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Exams</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your <span className="text-[#f7941d]">Examinations</span>
                </h1>
                {/* Pro Account Badge */}
                <span className="hidden sm:flex items-center gap-1 bg-[#f7941d]/20 border border-[#f7941d]/50 text-[#f7941d] text-xs font-bold px-2.5 py-1 rounded-full">
                  <Crown size={14} /> Pro Student
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Manage your active assessments, view upcoming tests, and review past results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Toggle switch for development demonstration */}
        <div className="mb-8 flex justify-end">
          <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span>Show Empty State</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={hasExams}
                onChange={() => setHasExams(!hasExams)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${hasExams ? 'bg-[#f7941d]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasExams ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span>Show Filled State</span>
          </label>
        </div>

        {!hasExams ? (
          /* --- EMPTY STATE UI --- */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FileText size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You currently have no active exams.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Exams will appear here automatically when your instructors assign them or when you complete a course module.
            </p>
            <button className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors duration-300 flex items-center gap-2">
              <PlayCircle size={18} />
              Continue Studying
            </button>
          </div>
        ) : (
          /* --- FILLED STATE UI --- */
          <div className="space-y-10">
            
            {/* Active Exams Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-[#f7941d] rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Active Assessments 
                  <span className="bg-[#f7941d]/10 text-[#f7941d] text-xs font-bold px-2.5 py-1 rounded-full border border-[#f7941d]/20">
                    1 Pending
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockActiveExams.map((exam) => (
                  <div key={exam.id} className="relative bg-white rounded-2xl border-2 border-[#f7941d]/50 shadow-lg shadow-[#f7941d]/5 overflow-hidden flex flex-col">
                    
                    {/* Security Notice Banner */}
                    <div className="bg-[#f7941d]/10 px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-[#f7941d] border-b border-[#f7941d]/20">
                      <ShieldCheck size={14} /> Academic Integrity Monitored
                    </div>

                    <div className="p-6 flex-grow">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{exam.course}</p>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{exam.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                          <Clock className="text-gray-400" size={20} />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Duration</p>
                            <p className="text-sm font-bold text-gray-900">{exam.duration}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                          <FileText className="text-gray-400" size={20} />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Questions</p>
                            <p className="text-sm font-bold text-gray-900">{exam.questions}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3 col-span-2">
                          <AlertTriangle className="text-amber-500" size={20} />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Deadline to Complete</p>
                            <p className="text-sm font-bold text-gray-900">{exam.deadline}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-500">
                          Pass mark: <span className="text-black font-bold">{exam.passingScore}</span>
                        </p>
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

            {/* Upcoming Exams Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-gray-300 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Exams</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockUpcomingExams.map((exam) => (
                  <div key={exam.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col opacity-80 grayscale-[20%]">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{exam.course}</p>
                        <span className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Lock size={12} /> Locked
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{exam.title}</h3>
                      
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Clock size={16} /> Opens at:
                        </div>
                        <span className="font-bold text-gray-900">{exam.opensAt}</span>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{exam.questions} Questions</span>
                        <span>•</span>
                        <span>{exam.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Completed Exams Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-black rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Past Results</h2>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {mockCompletedExams.map((exam) => (
                    <div key={exam.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${exam.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {exam.passed ? <Award size={24} /> : <AlertTriangle size={24} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{exam.course}</p>
                          <h3 className="text-base font-bold text-gray-900 mb-1">{exam.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Completed on {exam.dateTaken}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-right flex-1 sm:flex-none">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Score</p>
                          <p className={`text-xl font-black ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>{exam.score}</p>
                        </div>
                        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
                          Review
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </section>

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