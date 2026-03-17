import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth.service';

/**
 * ForgotPasswordPage — sends a mock password reset email.
 * Shows a success message after submission.
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const emailError =
    touched && !email.trim()
      ? 'Email is required'
      : touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Enter a valid email address'
        : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsLoading(true);
    try {
      const response = await forgotPassword({ email });
      setSuccessMessage(response.message);
      setEmail('');
      setTouched(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      {/* ── Success Banner ────────────────────────────────────── */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <span className="text-green-500">✓</span>
          {successMessage}
        </div>
      )}

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="text-red-500">⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
