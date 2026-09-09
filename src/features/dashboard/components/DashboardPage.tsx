import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Briefcase, User,
  ChevronRight, ShieldCheck, GraduationCap,
  TrendingUp, Award, ArrowRight, CheckCircle, AlertTriangle, Loader2, CalendarCheck,
  PlayCircle,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { getDashboardStats } from '../../../services/dashboard.service';
import { getAttendanceSummary } from '../../../services/attendance.service';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: getAttendanceSummary,
    staleTime: 0,
    refetchOnMount: true,
  });
  // Defends against a malformed/incomplete API response (missing `overall`)
  // still crashing the whole dashboard — falls back to an empty summary.
  const overall = attendance?.overall ?? { total: 0, attended: 0, percentage: 0 };
  const breakdown = attendance?.breakdown ?? [];

  const passwordChanged = stats ? stats.password_change === 1 : true;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── WELCOME BANNER ── */}
        <div className="relative overflow-hidden rounded-2xl bg-black p-8 lg:p-10 text-white shadow-xl border border-gray-800">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#f7941d]/20 border border-[#f7941d]/30 text-[#f7941d] text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Award size={14} /> Student
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
              Welcome back, <span className="text-[#f7941d]">{user?.firstName ?? 'Student'}</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-xl">
              Track your courses, manage your portfolio, and secure your account from your personal dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard/courses')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f7941d] text-black rounded-xl font-bold text-sm hover:bg-[#d67e15] transition-colors shadow-lg shadow-[#f7941d]/20"
              >
                <BookOpen size={18} /> Continue Learning
              </button>
              <button
                onClick={() => navigate('/dashboard/portfolios')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-700 text-white rounded-xl font-medium text-sm hover:bg-gray-800 hover:border-gray-600 transition-colors"
              >
                <TrendingUp size={18} /> My Portfolios
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#f7941d] opacity-[0.07] blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>

        {/* ── QUICK STATS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Active Courses */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#f7941d]/50 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-[#f7941d]/10 text-[#f7941d] group-hover:scale-105 transition-transform">
                <BookOpen size={24} strokeWidth={2} />
              </div>
              <span className="text-2xl font-black text-gray-900">
                {isLoading ? <Loader2 size={20} className="animate-spin text-gray-300" /> : stats?.member_count ?? 0}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Active Courses</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">Continue where you left off</p>
            <button onClick={() => navigate('/dashboard/courses')} className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link">
              View Courses <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* My Portfolios */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#f7941d]/50 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-orange-50 text-[#f7941d] group-hover:scale-105 transition-transform">
                <Briefcase size={24} strokeWidth={2} />
              </div>
              <span className="text-2xl font-black text-gray-900">
                {isLoading ? <Loader2 size={20} className="animate-spin text-gray-300" /> : stats?.portfolio_count ?? 0}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">My Portfolios</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">Projects submitted for review</p>
            <button onClick={() => navigate('/dashboard/portfolios')} className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link">
              View All <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* My Profile */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-[#f7941d] transition-all">
                <User size={24} strokeWidth={2} />
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">My Profile</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">Manage your account settings</p>
            <button onClick={() => navigate('/dashboard/profile')} className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link">
              Edit Profile <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Account Security */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl transition-all ${passwordChanged ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {passwordChanged ? <CheckCircle size={24} strokeWidth={2} /> : <AlertTriangle size={24} strokeWidth={2} />}
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Account Security</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">
              {isLoading ? 'Checking status...' : passwordChanged ? 'Your password is up to date' : 'Default password detected'}
            </p>
            {!passwordChanged && (
              <button onClick={() => navigate('/dashboard/profile')} className="mt-auto inline-flex items-center text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group/link">
                Update Now <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* ── HOW TO USE THE LMS ── */}
        {import.meta.env.VITE_PORTAL_GUIDE_VIDEO_ID && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7941d]/10 text-[#f7941d]">
                <PlayCircle size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">How to Use the Student Portal</h2>
                <p className="text-xs text-gray-500">Watch this short guide to get the most out of your learning experience</p>
              </div>
            </div>
            <div className="p-6">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-gray-200 shadow-sm">
                <iframe
                  src={`https://www.youtube.com/embed/${import.meta.env.VITE_PORTAL_GUIDE_VIDEO_ID}`}
                  title="How to use the Student Portal"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ── ATTENDANCE OVERVIEW ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CalendarCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Attendance Overview</h2>
                <p className="text-xs text-gray-500">Your attendance across all enrolled courses</p>
              </div>
            </div>
            {!attendanceLoading && (
              <span className="text-2xl font-black text-gray-900">{overall.percentage}%</span>
            )}
          </div>
          <div className="p-6">
            {attendanceLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={28} className="animate-spin text-gray-300" />
              </div>
            ) : breakdown.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No attendance records yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {breakdown.map(b => (
                  <div key={b.batch_id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{b.course_title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{b.batch_name}</p>
                      </div>
                      <span className={`text-lg font-black ${b.percentage >= 75 ? 'text-green-600' : b.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {b.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5 border border-gray-200">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${b.percentage >= 75 ? 'bg-green-500' : b.percentage >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${b.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{b.attended} of {b.total} sessions attended</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/classes')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#f7941d] transition-colors"
            >
              View all classes <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── ACTION CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7941d]/10 text-[#f7941d] group-hover:-translate-y-1 transition-transform">
              <Briefcase size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Showcase Your Skills</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Create a professional portfolio for each course to demonstrate your expertise. Featured portfolios are highlighted on the academy homepage.
            </p>
            <div className="mt-auto space-y-4">
              <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f7941d] mt-1.5 shrink-0" />
                <p className="text-xs font-medium text-gray-700">Portfolios require admin approval before going live.</p>
              </div>
              <button onClick={() => navigate('/dashboard/portfolios')} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-900 px-4 py-3 text-sm font-bold hover:border-[#f7941d] hover:text-[#f7941d] transition-colors">
                Create Portfolio <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white transition-all">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Account Security</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Protect your learning progress. We highly recommend updating your password from the default provided on your enrollment receipt.
            </p>
            <div className="mt-auto space-y-4">
              {!isLoading && !passwordChanged && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <ShieldCheck size={16} /> Password update recommended
                </div>
              )}
              {!isLoading && passwordChanged && (
                <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                  <CheckCircle size={16} /> Password is secure
                </div>
              )}
              <button onClick={() => navigate('/dashboard/profile')} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Manage Security
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-[#f7941d] p-6 shadow-md flex flex-col text-black">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-[#f7941d] shadow-lg group-hover:-translate-y-1 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-black mb-2">Build Your Tech Career</h3>
              <p className="text-sm font-medium opacity-90 leading-relaxed mb-6">
                Our specialized IT career paths guide you from beginner to job-ready. Get personalized training and direct support to land your dream role.
              </p>
              <button onClick={() => navigate('/dashboard/courses')} className="mt-auto w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-900 shadow-lg flex items-center justify-center gap-2">
                Explore Courses <ArrowRight size={16} />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white opacity-20 blur-2xl" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
