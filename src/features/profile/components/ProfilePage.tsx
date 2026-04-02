<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, ChevronRight, User, Mail, Lock,
  Camera, Github, Linkedin, Globe, ShieldCheck,
  Save, MapPin, Briefcase, Key, CheckCircle, AlertTriangle, Eye, EyeOff
=======
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Home, ChevronRight, User, Mail, Lock,
  Camera, ShieldCheck, Save, Key, CheckCircle,
  AlertTriangle, Loader2, Briefcase, Github, Linkedin, Globe,
>>>>>>> 8a7c66f (api changes linked)
} from 'lucide-react';
import {
  getProfile, updateProfile, changePassword, getProfileImageUrl,
} from '../../../services/profile.service';
import { useAuthStore } from '../../../store/authStore';

const EditProfilePage: React.FC = () => {
<<<<<<< HEAD
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'general' | 'professional' | 'security'>(
    (location.state as { tab?: string })?.tab === 'security' ? 'security' : 'general'
  );

  // Avatar state
  const [avatar, setAvatar] = useState<string | null>(null);

  // Save loading states
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingProfessional, setIsSavingProfessional] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSavingGeneral(false);
    showToast('Profile updated successfully!');
  };

  const handleSaveProfessional = async () => {
    setIsSavingProfessional(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSavingProfessional(false);
    showToast('Professional profile saved!');
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setIsSavingPassword(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully!');
  };
=======
  const [activeTab, setActiveTab] = useState<'general' | 'professional' | 'security'>('general');
  const queryClient = useQueryClient();
  const setUser = useAuthStore(s => s.setUser);
  const authUser = useAuthStore(s => s.user);

  // ── Fetch profile ──────────────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // ── General Info state ─────────────────────────────────────────────────
  const [form, setForm] = useState({ username: '', email: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({ username: profile.username, email: profile.email });
      setAvatarPreview(getProfileImageUrl(profile.image));
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      // Sync auth store so the welcome banner name updates
      if (authUser) {
        const nameParts = updated.username.trim().split(' ');
        setUser({
          ...authUser,
          firstName: nameParts[0] ?? updated.username,
          lastName: nameParts.slice(1).join(' ') || '',
          avatarUrl: getProfileImageUrl(updated.image) || authUser.avatarUrl,
        });
      }
      setGeneralSuccess('Profile updated successfully');
      setGeneralError('');
      setImageFile(null);
      setTimeout(() => setGeneralSuccess(''), 3000);
    },
    onError: (err: any) => {
      setGeneralError(err?.response?.data?.error ?? 'Failed to update profile');
      setGeneralSuccess('');
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleGeneralSubmit = () => {
    if (!form.username || form.username.length < 5) {
      setGeneralError('Username must be at least 5 characters');
      return;
    }
    if (!form.email) {
      setGeneralError('Email is required');
      return;
    }
    const fd = new FormData();
    fd.append('username', form.username);
    fd.append('email', form.email);
    if (imageFile) fd.append('image', imageFile);
    updateMutation.mutate(fd);
  };

  // ── Security state ─────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setSecuritySuccess('Password changed successfully');
      setSecurityError('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSecuritySuccess(''), 3000);
    },
    onError: (err: any) => {
      setSecurityError(err?.response?.data?.error ?? 'Failed to change password');
      setSecuritySuccess('');
    },
  });

  const handlePasswordSubmit = () => {
    if (!newPassword) { setSecurityError('New password is required'); return; }
    if (newPassword !== confirmPassword) { setSecurityError('Passwords do not match'); return; }
    passwordMutation.mutate(newPassword);
  };

  // ── Initials fallback ──────────────────────────────────────────────────
  const initials = profile
    ? profile.username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';
>>>>>>> 8a7c66f (api changes linked)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

<<<<<<< HEAD
      {/* ================= HEADER & BREADCRUMBS ================= */}
=======
      {/* ── HEADER ── */}
>>>>>>> 8a7c66f (api changes linked)
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <Link to="/dashboard" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Edit Profile</span>
          </nav>
<<<<<<< HEAD

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Account <span className="text-[#f7941d]">Settings</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Manage your personal information, professional links, and security preferences.
            </p>
          </div>
=======
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Account <span className="text-[#f7941d]">Settings</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Manage your personal information and security preferences.
          </p>
>>>>>>> 8a7c66f (api changes linked)
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
<<<<<<< HEAD
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Sidebar (Tabs) ── */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 sticky top-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'general' ? 'bg-[#f7941d] text-black shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <User size={18} /> General Info
                </button>
                <button
                  onClick={() => setActiveTab('professional')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'professional' ? 'bg-[#f7941d] text-black shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <Briefcase size={18} /> Professional Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'security' ? 'bg-[#f7941d] text-black shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <ShieldCheck size={18} /> Security
                </button>
              </nav>
            </div>
          </div>

          {/* ── Right Content Area ── */}
          <div className="flex-1">

            {/* --- GENERAL INFO TAB --- */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">General Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your photo and personal details here.</p>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="h-24 w-24 rounded-full bg-black text-[#f7941d] flex items-center justify-center text-3xl font-black shadow-lg overflow-hidden border-4 border-white ring-2 ring-gray-100">
                        {avatar ? (
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : 'MB'}
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <div>
                      <div className="flex gap-3 mb-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Upload New
                        </button>
                        <button
                          onClick={() => setAvatar(null)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Recommended: Square JPG, PNG, or GIF, at least 400x400px.</p>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" defaultValue="Michael" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" defaultValue="Balogun" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Username</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
                        <input type="text" defaultValue="michaelb" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="email" defaultValue="student@example.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-bold text-gray-700">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" defaultValue="Ikorodu, Nigeria" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                  <button
                    onClick={handleSaveGeneral}
                    disabled={isSavingGeneral}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-[#f7941d] font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingGeneral ? (
                      <><div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f7941d]/30 border-t-[#f7941d]" /> Saving...</>
                    ) : (
                      <><Save size={18} /> Save Changes</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* --- PROFESSIONAL PROFILE TAB --- */}
            {activeTab === 'professional' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Professional Profile</h2>
                  <p className="text-sm text-gray-500 mt-1">These details will be displayed on your approved academy portfolios.</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Professional Headline</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" defaultValue="Frontend Developer" placeholder="e.g. Digital Marketer or Web Developer" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Short Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="Frontend Developer specializing in React, TypeScript, and Next.js. Passionate about building accessible and scalable web applications."
                      placeholder="Tell us a bit about your skills and goals..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Social Links</h3>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">GitHub Profile</label>
                      <div className="relative">
                        <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="url" placeholder="https://github.com/yourusername" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">LinkedIn Profile</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="url" placeholder="https://linkedin.com/in/yourusername" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Personal Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="url" placeholder="https://yourportfolio.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                  <button
                    onClick={handleSaveProfessional}
                    disabled={isSavingProfessional}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-[#f7941d] font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingProfessional ? (
                      <><div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f7941d]/30 border-t-[#f7941d]" /> Saving...</>
                    ) : (
                      <><Save size={18} /> Save Profile</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Password Recommendation</h4>
                      <p className="text-xs text-amber-700 mt-1">If you are still using the default password provided on your enrollment receipt, please change it immediately to ensure your course progress is safe.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" tabIndex={-1}>
                        {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-gray-100">
                    <label className="text-sm font-bold text-gray-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Create new password"
                        className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" tabIndex={-1}>
                        {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          confirmPassword && newPassword !== confirmPassword
                            ? 'border-red-300 focus:ring-red-300'
                            : 'border-gray-200 focus:ring-[#f7941d]'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" tabIndex={-1}>
                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs font-bold text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isSavingPassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingPassword ? (
                      <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Updating...</>
                    ) : (
                      <><ShieldCheck size={18} className="text-[#f7941d]" /> Update Password</>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
=======
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar Tabs ── */}
            <div className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 sticky top-6">
                <nav className="space-y-1">
                  {([
                    { key: 'general', label: 'General Info', icon: <User size={18} /> },
                    { key: 'professional', label: 'Professional Profile', icon: <Briefcase size={18} /> },
                    { key: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
                  ] as const).map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === key
                          ? 'bg-[#f7941d] text-black shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* ── Content Area ── */}
            <div className="flex-1">

              {/* ── GENERAL INFO ── */}
              {activeTab === 'general' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">General Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your photo and personal details here.</p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-8">
                    {generalError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                        <AlertTriangle size={16} /> {generalError}
                      </div>
                    )}
                    {generalSuccess && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                        <CheckCircle size={16} /> {generalSuccess}
                      </div>
                    )}

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div
                        className="relative group cursor-pointer shrink-0"
                        onClick={() => fileRef.current?.click()}
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="avatar"
                            className="h-24 w-24 rounded-full object-cover border-4 border-white ring-2 ring-gray-100 shadow-lg"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-black text-[#f7941d] flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white ring-2 ring-gray-100">
                            {initials}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="text-white" />
                        </div>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          className="hidden"
                          onChange={e => handleImageChange(e.target.files?.[0] ?? null)}
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          {imageFile ? imageFile.name : 'Upload New Photo'}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF — max 500KB</p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Username</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={form.username}
                            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button
                      onClick={handleGeneralSubmit}
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-[#f7941d] font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-md disabled:opacity-50"
                    >
                      {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* ── PROFESSIONAL PROFILE ── */}
              {activeTab === 'professional' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Professional Profile</h2>
                    <p className="text-sm text-gray-500 mt-1">These details will be displayed on your approved academy portfolios.</p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Professional Headline</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Digital Marketer or Web Developer"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Short Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us a bit about your skills and goals..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-6">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Social Links</h3>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">GitHub Profile</label>
                        <div className="relative">
                          <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="url" placeholder="https://github.com/yourusername" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">LinkedIn Profile</label>
                        <div className="relative">
                          <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="url" placeholder="https://linkedin.com/in/yourusername" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Personal Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="url" placeholder="https://yourportfolio.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-[#f7941d] font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-md">
                      <Save size={18} /> Save Profile
                    </button>
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 sm:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {securityError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                        <AlertTriangle size={16} /> {securityError}
                      </div>
                    )}
                    {securitySuccess && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                        <CheckCircle size={16} /> {securitySuccess}
                      </div>
                    )}

                    {profile?.password_change === 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">Password Recommendation</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            You are still using the default password from your enrollment receipt. Please change it to secure your account.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          placeholder="Create new password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-400">Min 3 characters, must include at least one number.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={passwordMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
                    >
                      {passwordMutation.isPending
                        ? <Loader2 size={18} className="animate-spin" />
                        : <ShieldCheck size={18} className="text-[#f7941d]" />}
                      Update Password
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
>>>>>>> 8a7c66f (api changes linked)
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">Digital World Tech Academy © 2026</p>
      </footer>
<<<<<<< HEAD

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-900 text-white'}`}>
          {toast.type === 'success'
            ? <CheckCircle size={18} className="text-[#f7941d]" />
            : <AlertTriangle size={18} className="text-red-400" />
          }
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}
=======
>>>>>>> 8a7c66f (api changes linked)
    </div>
  );
};

export default EditProfilePage;
