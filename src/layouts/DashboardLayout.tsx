import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Search, Bell, User, LayoutDashboard, BookOpen, 
  Briefcase, Users, Calendar, FileText, LogOut, Menu, X 
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/dashboard/courses', label: 'All Courses', icon: <BookOpen size={20} /> },
  { to: '/dashboard/marketing', label: 'Study Digital Marketing', icon: <FileText size={20} /> },
  { to: '/dashboard/portfolios', label: 'My Portfolios', icon: <Briefcase size={20} /> },
  { to: '/dashboard/classes', label: 'My Classes', icon: <Users size={20} /> },
  { to: '/dashboard/events', label: 'Events', icon: <Calendar size={20} /> },
  { to: '/dashboard/examinations', label: 'Examinations', icon: <FileText size={20} /> },
];

/**
 * DashboardLayout — authenticated area with a collapsible sidebar,
 * top header showing real user info, and main content area via <Outlet />.
 */
const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Student';

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'S';

  // --- Mock Data ---
  const notifications = [
    { id: 1, text: "You have been given access to a new Course.", time: "02:14" },
    { id: 2, text: "Welcome to the world of Tech!", time: "7 Min" },
    { id: 3, text: "Account created successfully.", time: "2 May" },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col`}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <span className="text-lg font-bold tracking-wider text-[#f7941d]">
            DIGITAL WORLD
          </span>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#f7941d]/10 text-[#f7941d]'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-gray-900 hover:text-[#f7941d] transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between bg-white px-4 lg:px-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="search something..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f7941d] text-[10px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-900">User Notifications</h3>
                    <span className="text-xs font-medium text-[#f7941d] bg-[#f7941d]/10 px-2 py-1 rounded-md">3 New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 sm:pl-6 cursor-pointer group" onClick={() => navigate('/dashboard/profile')}>
              <div className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-[#f7941d] overflow-hidden ring-2 ring-transparent group-hover:ring-[#f7941d] transition-all">
                {user ? initials : <User size={18} />}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#f7941d] transition-colors">{displayName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
