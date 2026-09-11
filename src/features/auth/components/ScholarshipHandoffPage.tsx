import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { scholarshipHandoffLogin } from '../api/auth.service';
import { useAuthStore } from '../../../store/authStore';
import { GraduationCap, AlertTriangle, ArrowRight } from 'lucide-react';

const ScholarshipHandoffPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.login);

  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token') ?? '';

    if (!token) {
      setErrorMsg('This login link is invalid or incomplete.');
      setStatus('error');
      return;
    }

    scholarshipHandoffLogin(token)
      .then((res) => {
        setAuth(res.user, res.token);
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        setErrorMsg(
          err?.response?.data?.error || 'This login link has expired or already been used.',
        );
        setStatus('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-sans px-6">
      <div className="w-full max-w-md text-center">

        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-full bg-[#f7941d]/10 border-2 border-[#f7941d]/30 flex items-center justify-center">
                <GraduationCap size={36} className="text-[#f7941d] animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Setting up your dashboard…</h1>
            <p className="text-gray-400 font-medium mb-8">
              Hold on while we log you in.
            </p>
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-[#f7941d]" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                <AlertTriangle size={36} className="text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Link expired</h1>
            <p className="text-gray-400 font-medium mb-8">{errorMsg}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#f7941d] text-black font-black tracking-wide hover:bg-[#f7941d]/90 transition-colors"
            >
              Go to Login
              <ArrowRight size={18} />
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ScholarshipHandoffPage;
