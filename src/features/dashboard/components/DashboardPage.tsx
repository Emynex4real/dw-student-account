import React from 'react';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
=======
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
>>>>>>> 8a7c66f (api changes linked)
import {
  BookOpen, Briefcase, User,
  ChevronRight, ShieldCheck, GraduationCap,
  TrendingUp, Award, ArrowRight, CheckCircle, AlertTriangle, Loader2, CalendarCheck,
} from 'lucide-react';
<<<<<<< HEAD

const recentActivities = [
  {
    id: 1,
    title: "Completed Module 4: React Server Components",
    time: "2 hours ago",
    course: "Advanced Next.js Architecture",
    status: "Completed",
    icon: <CheckCircle size={20} className="text-green-600" />
  },
  {
    id: 2,
    title: "Submitted Assignment: Dynamic Routing",
    time: "Yesterday",
    course: "React & TypeScript Mastery",
    status: "Graded",
    icon: <Award size={20} className="text-purple-600" />
  },
  {
    id: 3,
    title: "Watched: State Management Patterns",
    time: "2 days ago",
    course: "Frontend Architecture",
    status: "In Progress",
    icon: <PlayCircle size={20} className="text-[#f7941d]" />
  }
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
=======
import { useAuthStore } from '../../../store/authStore';
import { getDashboardStats } from '../../../services/dashboard.service';
import { getClasses } from '../../../services/classes.service';
import { getAttendanceSummary } from '../../../services/attendance.service';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: courses } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });

  // Use first batch for attendance summary
  const firstBatchId = courses
    ? Object.values(courses).flat()[0]?.batch_id ?? null
    : null;

  const { data: attendance } = useQuery({
    queryKey: ['attendance-summary', firstBatchId],
    queryFn: () => getAttendanceSummary(firstBatchId!),
    enabled: !!firstBatchId,
  });

  const passwordChanged = stats ? stats.password_change === 1 : true;
>>>>>>> 8a7c66f (api changes linked)

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">

<<<<<<< HEAD
        {/* ================= WELCOME BANNER ================= */}
=======
        {/* ── WELCOME BANNER ── */}
>>>>>>> 8a7c66f (api changes linked)
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
<<<<<<< HEAD

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard/marketing')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f7941d] text-black rounded-xl font-bold text-sm hover:bg-[#d67e15] transition-colors shadow-lg shadow-[#f7941d]/20"
              >
                <BookOpen size={18} />
                Continue Learning
              </button>
              <button
                onClick={() => navigate('/dashboard/courses')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-700 text-white rounded-xl font-medium text-sm hover:bg-gray-800 hover:border-gray-600 transition-colors"
              >
                <TrendingUp size={18} />
                View Progress
              </button>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#f7941d] opacity-[0.07] blur-3xl pointer-events-none"></div>
=======
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
>>>>>>> 8a7c66f (api changes linked)
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>

<<<<<<< HEAD
        {/* ================= QUICK STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

=======
        {/* ── QUICK STATS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {/* Active Courses */}
>>>>>>> 8a7c66f (api changes linked)
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
<<<<<<< HEAD

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-900 mb-2">
                <span>Course Progress</span>
                <span className="text-[#f7941d]">65%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-[#f7941d] rounded-full"></div>
              </div>
            </div>
=======
            <button
              onClick={() => navigate('/dashboard/courses')}
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link"
            >
              View Courses <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
>>>>>>> 8a7c66f (api changes linked)
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
            <button
              onClick={() => navigate('/dashboard/portfolios')}
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link"
            >
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
<<<<<<< HEAD
            <Link
              to="/dashboard/profile"
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link"
            >
              Edit Profile <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
=======
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link"
            >
              Edit Profile <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
>>>>>>> 8a7c66f (api changes linked)
          </div>

          {/* Attendance */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#f7941d]/50 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:scale-105 transition-transform">
                <CalendarCheck size={24} strokeWidth={2} />
              </div>
              <span className="text-2xl font-black text-gray-900">
                {attendance ? `${attendance.percentage}%` : <Loader2 size={20} className="animate-spin text-gray-300" />}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Attendance</h3>
            <p className="text-xs text-gray-500 mb-3 flex-grow">
              {attendance ? `${attendance.attended} of ${attendance.total} classes attended` : 'Loading...'}
            </p>
            {attendance && (
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${attendance.percentage}%` }}
                />
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/classes')}
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#f7941d] transition-colors group/link"
            >
              View Classes <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Account Security */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl transition-all ${passwordChanged ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {passwordChanged ? <CheckCircle size={24} strokeWidth={2} /> : <AlertTriangle size={24} strokeWidth={2} />}
              </div>
            </div>
<<<<<<< HEAD
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Certificates</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">Earned achievements</p>
            <Link
              to="/dashboard/courses"
              className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-purple-600 transition-colors group/link"
            >
              View All <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
=======
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Account Security</h3>
            <p className="text-xs text-gray-500 mb-4 flex-grow">
              {isLoading ? 'Checking status...' : passwordChanged ? 'Your password is up to date' : 'Default password detected'}
            </p>
            {!passwordChanged && (
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="mt-auto inline-flex items-center text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group/link"
              >
                Update Now <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
              </button>
            )}
>>>>>>> 8a7c66f (api changes linked)
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
              <button
                onClick={() => navigate('/dashboard/portfolios')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-900 px-4 py-3 text-sm font-bold hover:border-[#f7941d] hover:text-[#f7941d] transition-colors"
              >
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
<<<<<<< HEAD
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                <ShieldCheck size={16} /> Password update recommended
              </div>
              <button
                onClick={() => navigate('/dashboard/profile', { state: { tab: 'security' } })}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Secure Account
=======
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
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Manage Security
>>>>>>> 8a7c66f (api changes linked)
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
              <button
                onClick={() => navigate('/dashboard/courses')}
                className="mt-auto w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-900 shadow-lg flex items-center justify-center gap-2"
              >
<<<<<<< HEAD
                Explore Paths <ArrowRight size={16} />
=======
                Explore Courses <ArrowRight size={16} />
>>>>>>> 8a7c66f (api changes linked)
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white opacity-20 blur-2xl" />
          </div>

        </div>

<<<<<<< HEAD
        {/* ================= RECENT ACTIVITY FEED ================= */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button
              onClick={() => navigate('/dashboard/courses')}
              className="text-sm font-bold text-gray-500 hover:text-[#f7941d] transition-colors"
            >
              View History
            </button>
          </div>

          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => navigate('/dashboard/marketing')}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{activity.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span>{activity.course}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {activity.time}</span>
                  </div>
                </div>
                <div className="hidden sm:block text-xs font-bold text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

=======
>>>>>>> 8a7c66f (api changes linked)
      </div>
    </div>
  );
};

export default DashboardPage;
