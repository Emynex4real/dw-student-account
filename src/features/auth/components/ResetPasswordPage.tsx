import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth.service';
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Terminal,
  AlertTriangle, CheckCircle2, ShieldCheck, KeyRound, XCircle,
} from 'lucide-react';

// ── Password strength helpers ──────────────────────────────────────────────

interface StrengthResult {
  score: number;       // 0–4
  label: string;
  color: string;
  barColor: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200', barColor: '' };

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Clamp to 4
  score = Math.min(score, 4);

  const map: Record<number, Omit<StrengthResult, 'score'>> = {
    0: { label: 'Too weak',  color: 'text-red-500',    barColor: 'bg-red-500'    },
    1: { label: 'Weak',      color: 'text-red-500',    barColor: 'bg-red-500'    },
    2: { label: 'Fair',      color: 'text-amber-500',  barColor: 'bg-amber-500'  },
    3: { label: 'Good',      color: 'text-blue-500',   barColor: 'bg-blue-500'   },
    4: { label: 'Strong',    color: 'text-green-600',  barColor: 'bg-green-500'  },
  };

  return { score, ...map[score] };
}

const requirements = [
  { label: 'At least 8 characters',          test: (p: string) => p.length >= 8 },
  { label: 'Uppercase & lowercase letters',   test: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: 'At least one number',             test: (p: string) => /[0-9]/.test(p) },
  { label: 'At least one special character',  test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

// ── Component ──────────────────────────────────────────────────────────────

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword !== '' && password === confirmPassword;
  const passwordMismatch = confirmPassword !== '' && password !== confirmPassword;
  const allRequirementsMet = requirements.every((r) => r.test(password));
  const isFormValid = allRequirementsMet && passwordsMatch && token !== '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }
    if (!allRequirementsMet) {
      setError('Your password does not meet all the requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ token, password });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans text-gray-900 selection:bg-[#f7941d]/30 selection:text-black">

      {/* ================= LEFT PANEL ================= */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] flex-col justify-between p-12 relative overflow-hidden">

        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(at 0% 0%, #f7941d 0px, transparent 50%), radial-gradient(at 100% 100%, #3b2308 0px, transparent 50%)`
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 bg-[#f7941d] rounded-xl flex items-center justify-center text-black shadow-lg shadow-[#f7941d]/20">
              <Terminal size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Digital<span className="text-[#f7941d]">World</span>
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6">
            Set a strong<br />
            <span className="text-[#f7941d]">new password.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            Choose a password that's unique and hard to guess. A strong password keeps your account and progress safe.
          </p>
        </div>

        {/* Security tips */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Unique</h3>
            <p className="text-sm font-medium text-gray-400">Never reuse passwords</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <KeyRound size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">12+ chars</h3>
            <p className="text-sm font-medium text-gray-400">Recommended length</p>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-sm font-medium text-gray-600">
          © 2026 Digital World Tech Academy
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-32 relative">

        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-16 lg:hidden flex items-center gap-2">
          <div className="h-8 w-8 bg-[#f7941d] rounded-lg flex items-center justify-center text-black">
            <Terminal size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-black">
            Digital<span className="text-[#f7941d]">World</span>
          </span>
        </div>

        <div className="w-full max-w-md mx-auto">

          {/* ── Invalid / Missing Token ── */}
          {!token && !isSuccess && (
            <div className="flex flex-col items-start">
              <div className="h-16 w-16 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-center text-red-500 mb-8">
                <XCircle size={32} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Link invalid</h2>
              <p className="text-base font-medium text-gray-500 leading-relaxed mb-8">
                This password reset link is missing or has expired. Please request a new one from the forgot password page.
              </p>
              <Link
                to="/forgot-password"
                className="w-full py-4 rounded-xl bg-black text-[#f7941d] text-base font-black tracking-wide shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Request New Link
                <ArrowRight size={20} />
              </Link>
            </div>
          )}

          {/* ── Success State ── */}
          {isSuccess && (
            <div className="flex flex-col items-start">
              <div className="h-16 w-16 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center text-green-600 mb-8">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Password updated!</h2>
              <p className="text-base font-medium text-gray-500 leading-relaxed mb-8">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="w-full py-4 rounded-xl bg-black text-[#f7941d] text-base font-black tracking-wide shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Go to Sign In
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* ── Reset Form ── */}
          {token && !isSuccess && (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Reset password</h2>
                <p className="text-base font-medium text-gray-500">
                  Enter your new password below. Make it strong.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-4 rounded-xl border bg-red-50 border-red-100 text-red-800 flex items-start gap-3">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8" noValidate>

                {/* ── New Password ── */}
                <div className="space-y-3">
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      disabled={isLoading}
                      className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-3 text-base font-medium text-gray-900 placeholder-transparent focus:border-[#f7941d] focus:outline-none focus:ring-0 transition-colors pr-10"
                    />
                    <label
                      htmlFor="new-password"
                      className="absolute left-0 -top-3.5 text-sm font-bold text-gray-500 transition-all
                                 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                                 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#f7941d] cursor-text"
                    >
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-3.5 text-gray-400 hover:text-black transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              bar <= strength.score ? strength.barColor : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-black ${strength.color}`}>{strength.label}</p>
                    </div>
                  )}

                  {/* Requirements checklist */}
                  {password && (
                    <ul className="space-y-1.5 pt-1">
                      {requirements.map((req) => {
                        const met = req.test(password);
                        return (
                          <li key={req.label} className={`flex items-center gap-2 text-xs font-bold transition-colors ${met ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle2 size={13} className={met ? 'text-green-500' : 'text-gray-300'} />
                            {req.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* ── Confirm Password ── */}
                <div className="relative group">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`peer w-full bg-transparent border-b-2 px-0 py-3 text-base font-medium text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 transition-colors pr-10 ${
                      passwordMismatch
                        ? 'border-red-400 focus:border-red-500'
                        : passwordsMatch
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-gray-200 focus:border-[#f7941d]'
                    }`}
                  />
                  <label
                    htmlFor="confirm-password"
                    className={`absolute left-0 -top-3.5 text-sm font-bold transition-all
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                               peer-focus:-top-3.5 peer-focus:text-sm cursor-text ${
                                 passwordMismatch
                                   ? 'text-red-500 peer-focus:text-red-500'
                                   : passwordsMatch
                                     ? 'text-green-600 peer-focus:text-green-600'
                                     : 'text-gray-500 peer-focus:text-[#f7941d]'
                               }`}
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-0 top-3.5 text-gray-400 hover:text-black transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>

                  {/* Match feedback */}
                  {passwordMismatch && (
                    <p className="mt-2 text-xs font-bold text-red-500">Passwords do not match.</p>
                  )}
                  {passwordsMatch && (
                    <p className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-4 rounded-xl text-base font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLoading || !isFormValid
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-[#f7941d] shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#f7941d]" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Set New Password
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
