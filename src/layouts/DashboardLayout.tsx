import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import {
  Search, Bell, User, LayoutDashboard, BookOpen,
  Briefcase, Users, Calendar, FileText, LogOut, Menu, X, PlayCircle
} from 'lucide-react';

const staticNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/dashboard/courses', label: 'All Courses', icon: <BookOpen size={20} /> },
  { to: '/dashboard/replays', label: 'Class Replays', icon: <PlayCircle size={20} /> },
  { to: '/dashboard/portfolios', label: 'My Portfolios', icon: <Briefcase size={20} /> },
  { to: '/dashboard/classes', label: 'My Classes', icon: <Users size={20} /> },
  { to: '/dashboard/events', label: 'Events', icon: <Calendar size={20} /> },
  { to: '/dashboard/examinations', label: 'Examinations', icon: <FileText size={20} /> },
];

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const activeCourse = useCourseStore((s) => s.activeCourse);

  const navItems = [
    ...staticNavItems.slice(0, 2),
    ...(activeCourse
      ? [{
          to: `/dashboard/courses/${activeCourse.id}`,
          label: `Continue Studying`,
          icon: <PlayCircle size={20} />,
        }]
      : []),
    ...staticNavItems.slice(2),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Student';
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'S';

  // --- Mock Data ---
  const notifications = [
    { id: 1, text: "You have been given access to a new Course.", time: "02:14" },
    { id: 2, text: "Welcome to the world of Tech!", time: "7 Min" },
    { id: 3, text: "Account created successfully.", time: "2 May" },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* ── Mobile Overlay Backdrop ─────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none`}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <span className="text-lg font-black tracking-wider text-[#f7941d]">
            DIGITAL WORLD
          </span>
          <button
            className="lg:hidden p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard" || item.to === "/dashboard/courses"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#f7941d] text-black font-bold shadow-md shadow-[#f7941d]/10"
                    : "text-gray-400 font-medium hover:bg-gray-900 hover:text-white"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — Logout */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 font-medium hover:bg-gray-900 hover:text-red-400 transition-colors group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between bg-white px-4 lg:px-8 border-b border-gray-200 shrink-0 z-30">
          {/* Left: Mobile Toggle & Desktop Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <div className="relative hidden md:block max-w-md w-full">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search courses, events, or portfolios..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center justify-end gap-2 sm:gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-500 hover:bg-gray-100 hover:text-black rounded-xl transition-colors"
                aria-label="View notifications"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#f7941d] ring-2 ring-white animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <span className="text-xs font-bold text-[#f7941d] bg-[#f7941d]/10 px-2.5 py-1 rounded-md">
                        3 New
                      </span>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <p className="text-sm font-medium text-gray-800 group-hover:text-black">
                            {notif.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5 font-medium">
                            {notif.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50/50 text-center border-t border-gray-100">
                      <button className="text-sm font-bold text-[#f7941d] hover:text-[#d67e15] transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <div
              className="flex items-center gap-3 border-l border-gray-200 pl-4 sm:pl-6 cursor-pointer group"
              onClick={() => navigate("/dashboard/profile")}
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#f7941d] transition-colors">
                  {displayName}
                </p>
                <span className="flex gap-1 text-[10px] font-bold text-[#f7941d]  tracking-wider">
                 Physical Student
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-[#f7941d] font-bold shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
                {user ? initials : <User size={18} />}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content (Outlet) ──────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-gray-50 relative custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Global Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
      `,
        }}
      />
    </div>
  );
};

export default DashboardLayout;