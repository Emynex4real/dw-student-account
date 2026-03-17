import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth.service';
import { useAuthStore } from '../../../store/authStore';

/**
 * LoginPage — fully wired authentication form.
 * Validates inputs, calls the mock auth service,
 * stores the token in Zustand, then redirects to /dashboard.
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  // ── Form State ──────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Validation ──────────────────────────────────────────────
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError =
    touched.email && !email.trim()
      ? 'Email is required'
      : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Enter a valid email address'
        : null;

  const passwordError =
    touched.password && !password.trim() ? 'Password is required' : null;

  const isFormValid =
    email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.trim();

  // ── Submit Handler ──────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError(null);

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-6">
        Sign in to your student account
      </p>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* ── Email ───────────────────────────────────────────── */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="student@university.edu"
            disabled={isLoading}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
              emailError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
            } disabled:cursor-not-allowed disabled:bg-gray-50`}
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>

        {/* ── Password ────────────────────────────────────────── */}
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
              passwordError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
            } disabled:cursor-not-allowed disabled:bg-gray-50`}
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-600">{passwordError}</p>
          )}
        </div>

        {/* ── Submit ──────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link
          to="/forgot-password"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Forgot your password?
        </Link>
      </p>

      {/* ── Dev hint ──────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-400">
        <strong className="text-gray-500">Dev credentials:</strong>{' '}
        student@university.edu / password123
      </div>
    </div>
  );
};

export default LoginPage;
