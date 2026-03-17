import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — wraps authentication pages (Login, Forgot Password)
 * in a centered card layout with a branded header.
 */
const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900 px-4">
      <div className="w-full max-w-md">
        {/* ── Branding ──────────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Student Portal
          </h1>
          <p className="mt-2 text-primary-200 text-sm">
            Manage your account, courses, and feedback
          </p>
        </div>

        {/* ── Card ──────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
