import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Home, ChevronRight, Plus, ExternalLink, LayoutTemplate,
  CheckCircle, Clock, X, AlertTriangle, Loader2, Pencil, RefreshCw
} from 'lucide-react';
import {
  getPortfolios, getPortfolioCourses, createPortfolio,
  updatePortfolio, resubmitPortfolio, getStudentImageUrl,
  type Portfolio,
} from '../../../services/portfolios.service';

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS = {
  0: { label: 'Pending Review', color: 'bg-amber-500', icon: Clock },
  1: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
  3: { label: 'Disapproved', color: 'bg-red-500', icon: AlertTriangle },
} as const;

type StatusKey = keyof typeof STATUS;

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateModalProps {
  courses: string[];
  onClose: () => void;
  onSuccess: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ courses, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', course_title: '', specification: '', project_link: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => { onSuccess(); onClose(); },
    onError: (err: any) => setError(err?.response?.data?.error ?? 'Failed to create portfolio'),
  });

  const handleSubmit = () => {
    if (!form.name || !form.course_title || !form.specification || !form.project_link) {
      setError('All fields are required');
      return;
    }
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('course_title', form.course_title);
    fd.append('specification', form.specification);
    fd.append('project_link', form.project_link);
    if (imageFile) fd.append('image', imageFile);
    mutation.mutate(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Portfolio</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. E-commerce Dashboard"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Course *</label>
            <select
              value={form.course_title}
              onChange={e => setForm(f => ({ ...f, course_title: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent bg-white"
            >
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
            <textarea
              placeholder="Briefly describe what you built..."
              value={form.specification}
              onChange={e => setForm(f => ({ ...f, specification: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Link *</label>
            <input
              type="url"
              placeholder="https://"
              value={form.project_link}
              onChange={e => setForm(f => ({ ...f, project_link: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#f7941d] transition-colors"
            >
              {imageFile ? (
                <p className="text-sm text-gray-700 font-medium">{imageFile.name}</p>
              ) : (
                <p className="text-sm text-gray-400">Click to upload a photo (jpg/png, max 500KB)</p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={e => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#f7941d] text-black hover:bg-[#d67e15] rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Edit Modal ────────────────────────────────────────────────────────────────
interface EditModalProps {
  portfolio: Portfolio;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ portfolio, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: portfolio.name,
    specification: portfolio.specification,
    project_link: portfolio.project_link,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(getStudentImageUrl(portfolio.image));
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (fd: FormData) => updatePortfolio(portfolio.id, fd),
    onSuccess: () => { onSuccess(); onClose(); },
    onError: (err: any) => setError(err?.response?.data?.error ?? 'Failed to update portfolio'),
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.name || !form.specification || !form.project_link) {
      setError('All fields are required');
      return;
    }
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('specification', form.specification);
    fd.append('project_link', form.project_link);
    if (imageFile) fd.append('image', imageFile);
    mutation.mutate(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Portfolio</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea
              value={form.specification}
              onChange={e => setForm(f => ({ ...f, specification: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
            <input
              type="url"
              value={form.project_link}
              onChange={e => setForm(f => ({ ...f, project_link: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#f7941d] transition-colors flex items-center gap-4"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <LayoutTemplate size={24} className="text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {imageFile ? imageFile.name : preview ? 'Click to change photo' : 'Click to upload photo'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">jpg/png, max 500KB</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={e => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#f7941d] text-black hover:bg-[#d67e15] rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyPortfoliosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPortfolio, setEditPortfolio] = useState<Portfolio | null>(null);

  const { data: portfolios = [], isLoading, isError } = useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['portfolio-courses'],
    queryFn: getPortfolioCourses,
    enabled: isCreateOpen,
  });

  const resubmitMutation = useMutation({
    mutationFn: resubmitPortfolio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['portfolios'] });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ── HEADER ── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">My Portfolios</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                My <span className="text-[#f7941d]">Portfolios</span>
              </h1>
              <p className="mt-2 text-gray-400 text-sm max-w-xl">
                Showcase your skills. Projects appear on the Digital World Tech Academy website after admin approval.
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#f7941d] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#d67e15] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#f7941d]/20"
            >
              <Plus size={20} /> Add New Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Failed to load portfolios.</p>
            <button onClick={refresh} className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
              Retry
            </button>
          </div>
        ) : portfolios.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-[#f7941d]/10 rounded-full flex items-center justify-center mb-6">
              <LayoutTemplate size={48} className="text-[#f7941d]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No portfolios yet.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Start building your professional presence by uploading your first course project.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Create Your First Portfolio
            </button>
          </div>
        ) : (
          /* ── PORTFOLIO GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map(portfolio => {
              const statusKey = (portfolio.status in STATUS ? portfolio.status : 0) as StatusKey;
              const { label, color, icon: StatusIcon } = STATUS[statusKey];
              const avatarUrl = getStudentImageUrl(portfolio.image);

              return (
                <div key={portfolio.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

                  {/* Card Header */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, #f7941d 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }} />
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={portfolio.name} className="w-20 h-20 rounded-full object-cover border-4 border-white/20 relative z-10" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#f7941d]/20 border-4 border-white/20 flex items-center justify-center relative z-10">
                        <LayoutTemplate size={32} className="text-[#f7941d]" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 ${color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                        <StatusIcon size={12} /> {label}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-bold tracking-wider text-[#f7941d] uppercase mb-1 truncate">
                      {portfolio.course_title}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#f7941d] transition-colors line-clamp-1">
                      {portfolio.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
                      {portfolio.specification}
                    </p>

                    {/* Admin note if disapproved */}
                    {portfolio.status === 3 && portfolio.admin_note && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-xs font-bold text-red-700 mb-0.5">Admin Feedback</p>
                        <p className="text-xs text-red-600">{portfolio.admin_note}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditPortfolio(portfolio)}
                          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        {portfolio.status === 3 && (
                          <button
                            onClick={() => resubmitMutation.mutate(portfolio.id)}
                            disabled={resubmitMutation.isPending}
                            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
                            title="Resubmit for review"
                          >
                            <RefreshCw size={14} /> Resubmit
                          </button>
                        )}
                      </div>
                      <a
                        href={portfolio.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-[#f7941d] transition-colors"
                      >
                        View Project <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">Digital World Tech Academy © 2026</p>
      </footer>

      {/* ── MODALS ── */}
      {isCreateOpen && (
        <CreateModal
          courses={courses}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={refresh}
        />
      )}
      {editPortfolio && (
        <EditModal
          portfolio={editPortfolio}
          onClose={() => setEditPortfolio(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
};

export default MyPortfoliosPage;
