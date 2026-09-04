import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth.service';
import { useAuthStore } from '../../../store/authStore';
import {
  Mail, Eye, EyeOff, AlertTriangle, ArrowRight,
  Sparkles, BookOpen
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  // --- Core State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // --- Validation ---
  const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.trim() !== '';
  const isFormValid = isEmailValid && isPasswordValid;

  // --- Restore remembered email on mount ---
  useEffect(() => {
    const saved = localStorage.getItem('sp_remembered_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  // --- Caps Lock Listener ---
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  // --- Submit Handler ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    setIsLoading(true);
    setLoadingSeconds(0);
    const timer = setInterval(() => setLoadingSeconds(s => s + 1), 1000);
    try {
      const response = await loginUser({ email, password });
      if (rememberMe) {
        localStorage.setItem('sp_remembered_email', email);
      } else {
        localStorage.removeItem('sp_remembered_email');
      }
      clearInterval(timer);
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      clearInterval(timer);
      const status = err?.response?.status;
      let msg: string;

      if (!err?.response) {
        // Network failure (timeout, no connection) — retries already exhausted
        msg = navigator.onLine
          ? 'Network too slow. Move to a stronger connection and try again.'
          : 'No internet connection. Please check your network and try again.';
      } else if (status === 429) {
        msg = err.response.data?.error ?? 'Too many attempts. Please try again in 15 minutes.';
      } else {
        msg = err.response.data?.error || err.response.data?.message || 'Invalid email or password.';
      }

      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans text-gray-900 selection:bg-[#f7941d]/30 selection:text-black">
      
      {/* ================= LEFT PANEL: Bento Box Showcase ================= */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Subtle Background Mesh */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(at 0% 0%, #f7941d 0px, transparent 50%), radial-gradient(at 100% 100%, #3b2308 0px, transparent 50%)`
        }}></div>

        <div className="relative z-10">
          <div className="mb-16">
            <img src="/logo.png" alt="Digital World Tech Academy" style={{ height: '48px', width: 'auto' }} />
          </div>

          <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6">
            Your bridge to a <br />
            <span className="text-[#f7941d]">world-class</span> tech career.
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            The ultimate student portal for tracking courses, building portfolios, and launching your journey into tech.
          </p>
        </div>

        {/* Bento Grid Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">100%</h3>
            <p className="text-sm font-medium text-gray-400">Project-Based Learning</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#f7941d] mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">24/7</h3>
            <p className="text-sm font-medium text-gray-400">Instructor Support</p>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-sm font-medium text-gray-600">
          © 2026 Digital World Tech Academy
        </div>
      </div>

      {/* ================= RIGHT PANEL: Interactive Form ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-32 relative">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-16 lg:hidden">
          <img src="/logo.png" alt="Digital World Tech Academy" className="h-12 w-auto" />
        </div>

        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Log In</h2>
            <p className="text-base font-medium text-gray-500">Welcome back! Please enter your details.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-100 bg-red-50 text-red-800 flex items-start gap-3">
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* --- Floating Label Email Input --- */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-3 text-base font-medium text-gray-900 placeholder-transparent focus:border-[#f7941d] focus:outline-none focus:ring-0 transition-colors"
                disabled={isLoading}
              />
              <label 
                htmlFor="email" 
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

            {/* --- Floating Label Password Input --- */}
            <div className="relative group h-[3.25rem]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-gray-200 px-0 py-3 text-base font-medium text-gray-900 placeholder-transparent focus:border-[#f7941d] focus:outline-none focus:ring-0 transition-colors pr-10"
                disabled={isLoading}
              />
              <label 
                htmlFor="password" 
                className="absolute left-0 -top-3.5 text-sm font-bold text-gray-500 transition-all 
                           peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 
                           peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#f7941d] cursor-text"
              >
                Password
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

            {/* Caps Lock Warning */}
            {capsLockActive && (
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold animate-pulse">
                <AlertTriangle size={14} /> Caps lock is currently on
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#f7941d] focus:ring-[#f7941d] transition-colors"
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-black transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-[#f7941d] hover:text-[#d67e15] transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Dynamic Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full py-4 mt-8 rounded-xl text-base font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading || !isFormValid
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-[#f7941d] shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f7941d]/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#f7941d]" />
                  {loadingSeconds < 5
                    ? 'Signing in...'
                    : loadingSeconds < 20
                    ? 'Still connecting...'
                    : loadingSeconds < 40
                    ? 'Poor network detected, retrying...'
                    : 'Almost there, hang tight...'}
                </>
              ) : (
                <>
                  Sign In Securely
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default LoginPage;