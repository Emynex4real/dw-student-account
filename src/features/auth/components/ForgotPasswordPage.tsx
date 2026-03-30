import React, { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth.service';
import {
  Mail, ArrowRight, ArrowLeft, Terminal,
  AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw,
} from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      startResendCooldown();
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
            Account security<br />
            <span className="text-[#f7941d]">made simple.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            Regain access to your account in seconds. We'll send a secure reset link straight to your inbox.
          </p>
        </div>

        {/* Security trust indicators */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">256-bit</h3>
            <p className="text-sm font-medium text-gray-400">Encrypted Reset Links</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">15 min</h3>
            <p className="text-sm font-medium text-gray-400">Link Expiry Window</p>
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

          {!isSubmitted ? (
            /* ── REQUEST FORM ── */
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Forgot password?</h2>
                <p className="text-base font-medium text-gray-500">
                  No worries — enter your email and we'll send you a secure reset link.
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

                {/* Floating Label Email */}
                <div className="relative group">
                  <input
                    type="email"
                    id="fp-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-3 text-base font-medium text-gray-900 placeholder-transparent focus:border-[#f7941d] focus:outline-none focus:ring-0 transition-colors"
                  />
                  <label
                    htmlFor="fp-email"
                    className="absolute left-0 -top-3.5 text-sm font-bold text-gray-500 transition-all
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                               peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#f7941d] cursor-text"
                  >
                    Email Address
                  </label>
                  <div className="absolute right-0 top-3.5 text-gray-400 peer-focus:text-[#f7941d] transition-colors">
                    <Mail size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isEmailValid}
                  className={`w-full py-4 rounded-xl text-base font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLoading || !isEmailValid
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-[#f7941d] shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#f7941d]" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
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
          ) : (
            /* ── SUCCESS STATE ── */
            <>
              <div className="flex flex-col items-start">

                <div className="h-16 w-16 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center text-green-600 mb-8">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Check your email</h2>
                <p className="text-base font-medium text-gray-500 leading-relaxed mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-base font-black text-gray-900 mb-8">{email}</p>

                <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 mb-8">
                  <p className="text-sm font-medium text-gray-500 leading-relaxed">
                    The link will expire in <span className="font-black text-gray-900">15 minutes</span>.
                    If you don't see it, check your spam folder.
                  </p>
                </div>

                {/* Error Banner for resend */}
                {error && (
                  <div className="w-full mb-6 p-4 rounded-xl border bg-red-50 border-red-100 text-red-800 flex items-start gap-3">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-bold">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleResend}
                  disabled={isLoading || resendCooldown > 0}
                  className={`w-full py-4 rounded-xl text-base font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mb-4 ${
                    isLoading || resendCooldown > 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-[#f7941d] shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#f7941d]" />
                      Resending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Resend Email
                    </>
                  )}
                </button>

                <div className="w-full text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
