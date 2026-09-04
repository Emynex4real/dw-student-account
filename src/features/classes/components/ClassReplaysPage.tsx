import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Home, ChevronRight, PlayCircle, Calendar, ChevronDown, BookOpen,
  Upload, FileText, X, CheckCircle, Loader2, AlertTriangle, Clock,
  RefreshCw, Tag,
} from 'lucide-react';
import { getEnrolledBatches } from '../../../services/classes.service';
import { getBatchReplays, markReplayAttendance } from '../../../services/attendance.service';
import type { BatchReplay, ReplayAssignment } from '../../../services/attendance.service';
import { submitAssignment, getMySubmission } from '../../../services/submissions.service';

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseFileUrls(fileUrl: string | null): string[] {
  if (!fileUrl) return [];
  try {
    const parsed = JSON.parse(fileUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [fileUrl];
}

function toEmbedUrl(url: string): string {
  if (!url) return url;
  if (url.trim().startsWith('<iframe')) {
    const match = url.match(/src=["']([^"']+)["']/);
    if (match) return match[1];
  }
  if (url.includes('youtube.com/embed/')) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

// ── AssignmentCard ────────────────────────────────────────────────────────────

const AssignmentCard: React.FC<{ assignment: ReplayAssignment }> = ({ assignment }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [issues, setIssues] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: submission, isLoading: loadingSub } = useQuery({
    queryKey: ['my-submission', assignment.id],
    queryFn: () => getMySubmission(assignment.id),
  });

  const fileUrls = parseFileUrls(assignment.file_url);
  const isTextOnly = fileUrls.length === 0;

  const handleTextareaInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const openForm = () => {
    setFile(null);
    setIssues('');
    setSubmitError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFile(null);
    setIssues('');
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitAssignment(assignment.id, file, issues);
      await queryClient.invalidateQueries({ queryKey: ['my-submission', assignment.id] });
      closeForm();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = () => {
    if (!submission) return null;
    if (submission.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-lg">
          <Clock size={11} /> Awaiting Review
        </span>
      );
    }
    if (submission.status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
          <CheckCircle size={11} /> Accepted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
        <X size={11} /> Rejected
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} className="text-[#f7941d] shrink-0" />
            <h3 className="text-sm font-bold text-gray-900 truncate">{assignment.title}</h3>
          </div>
          {isTextOnly && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              <Tag size={10} /> Text Only
            </span>
          )}
        </div>
        {assignment.due_date && (
          <span className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md shrink-0">
            Due: {assignment.due_date}
          </span>
        )}
      </div>

      {/* Description */}
      {assignment.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{assignment.description}</p>
      )}

      {/* Files */}
      {fileUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {fileUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:border-[#f7941d] hover:bg-[#f7941d]/5 rounded-lg text-xs font-medium text-gray-700 hover:text-[#f7941d] transition-colors"
            >
              <FileText size={12} />
              {fileUrls.length > 1 ? `File ${i + 1}` : (url.split('/').pop() ?? 'Download File')}
            </a>
          ))}
        </div>
      )}

      {/* Submission status */}
      {loadingSub ? (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Loader2 size={12} className="animate-spin" /> Checking submission...
        </div>
      ) : submission ? (
        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2">
            {statusBadge()}
            <a
              href={submission.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#f7941d] hover:underline truncate"
            >
              {submission.file_name}
            </a>
          </div>
          {submission.feedback && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700">
              <span className="font-semibold text-gray-500 block mb-0.5">Instructor feedback:</span>
              {submission.feedback}
            </div>
          )}
        </div>
      ) : null}

      {/* Submit form toggle */}
      {!showForm ? (
        <button
          onClick={openForm}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f7941d] text-black text-xs font-semibold rounded-lg hover:bg-[#e8850a] transition-colors"
        >
          {submission ? <><RefreshCw size={12} /> Re-submit</> : <><Upload size={12} /> Submit Assignment</>}
        </button>
      ) : (
        <div className="border-t border-gray-100 pt-4 mt-1 space-y-3">
          {/* File upload */}
          <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-[#f7941d] rounded-xl p-5 cursor-pointer transition-colors group">
            <div className="h-10 w-10 rounded-full bg-gray-100 group-hover:bg-[#f7941d]/10 flex items-center justify-center transition-colors">
              <FileText size={20} className="text-gray-400 group-hover:text-[#f7941d] transition-colors" />
            </div>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              {file ? file.name : 'Click to select a file'}
            </p>
            <p className="text-xs text-gray-400">PDF, DOC, DOCX, XLS, XLSX, CSV — max 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {file && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <FileText size={15} className="text-[#f7941d] shrink-0" />
              <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Issues faced */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Issues Faced <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              ref={textareaRef}
              value={issues}
              onInput={handleTextareaInput}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="Describe any challenges you faced..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl resize-none overflow-hidden focus:outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] placeholder:text-gray-400 transition-colors"
            />
          </div>

          {submitError && (
            <p className="text-xs text-red-600 font-medium text-center">{submitError}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={closeForm}
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={!file || isSubmitting}
              onClick={handleSubmit}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                file && !isSubmitting
                  ? 'bg-black text-white hover:bg-[#f7941d] hover:text-black'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting
                ? <><Loader2 size={12} className="animate-spin" /> Submitting...</>
                : <><Upload size={12} /> Submit</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── ClassReplaysPage ──────────────────────────────────────────────────────────

const ClassReplaysPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: enrolledBatches, isLoading: loadingClasses, isError: classesError } = useQuery({
    queryKey: ['enrolled-batches'],
    queryFn: getEnrolledBatches,
  });

  const batches = (enrolledBatches ?? []).map(b => ({
    batch_id: b.batch_id,
    label: `${b.course_title} — ${b.batch_name}`,
  }));

  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeReplayId, setActiveReplayId] = useState<number | null>(null);

  const activeBatchId = selectedBatchId ?? batches[0]?.batch_id ?? null;
  const selectedBatch = batches.find(b => b.batch_id === activeBatchId) ?? batches[0] ?? null;

  const { data: replays = [], isLoading: loadingReplays } = useQuery({
    queryKey: ['batch-replays', activeBatchId],
    queryFn: () => getBatchReplays(activeBatchId!),
    enabled: !!activeBatchId,
    staleTime: 0,
  });

  const activeReplay: BatchReplay | null =
    replays.find(r => r.id === activeReplayId) ?? replays[0] ?? null;

  const handleSelectBatch = (batchId: number) => {
    setSelectedBatchId(batchId);
    setActiveReplayId(null);
    setDropdownOpen(false);
  };

  const handlePlayReplay = (replay: BatchReplay) => {
    setActiveReplayId(replay.id);
    if (!replay.attendance_type) {
      markReplayAttendance(replay.id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['batch-replays', activeBatchId] });
        })
        .catch((err) => {
          console.error('Failed to record replay attendance:', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </button>
            <ChevronRight size={14} className="mx-2" />
            <button onClick={() => navigate('/dashboard/classes')} className="hover:text-[#f7941d] transition-colors">
              My Classes
            </button>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Class Replays</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Class <span className="text-[#f7941d]">Replays</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-xl">
                All your recorded sessions are saved here. Rewatch any class at your own pace.
              </p>
            </div>

            {/* Batch Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-3 bg-gray-900 border border-gray-700 hover:border-[#f7941d] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors min-w-[220px] justify-between"
              >
                <span className="truncate">{selectedBatch?.label ?? 'Select a batch'}</span>
                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-full min-w-[260px] bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                    {batches.map(batch => (
                      <button
                        key={batch.batch_id}
                        onClick={() => handleSelectBatch(batch.batch_id)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                          batch.batch_id === activeBatchId ? 'bg-[#f7941d]/10 text-[#f7941d] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {batch.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {loadingClasses ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : classesError || batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {classesError ? <AlertTriangle size={40} className="text-red-400" /> : <BookOpen size={40} className="text-gray-400" />}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{classesError ? 'Failed to load classes' : 'No class replays yet'}</h2>
            <p className="text-gray-500 text-sm max-w-sm mb-6">
              {classesError ? 'Please try again later.' : 'Once you are enrolled in a batch, replays will appear here.'}
            </p>
            <button onClick={() => navigate('/dashboard/courses')} className="px-6 py-2.5 bg-[#f7941d] text-black font-semibold rounded-xl hover:bg-[#e8850a] transition-colors">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT — Video Player + Info + Assignments */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {loadingReplays ? (
                <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Loader2 size={40} className="text-[#f7941d] animate-spin" />
                </div>
              ) : activeReplay?.video_url ? (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    src={toEmbedUrl(activeReplay.video_url)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    title={activeReplay.title}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg border border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                    <div className="text-center text-white">
                      <PlayCircle size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-400">No video available for this session</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Replay title + meta */}
              {activeReplay && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{activeReplay.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {activeReplay.class_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-[#f7941d]" /> {activeReplay.class_date}
                      </span>
                    )}
                    {activeReplay.attendance_type && (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={15} className="text-green-500" />
                        Attended ({activeReplay.attendance_type === 'live' ? 'Live class' : 'Replay'})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment cards */}
              {activeReplay && activeReplay.assignments.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Assignments ({activeReplay.assignments.length})
                  </h3>
                  {activeReplay.assignments.map(assignment => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Replay List */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6 max-h-[calc(100vh-2rem)] flex flex-col">
                <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">All Replays</h3>
                  <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                    {replays.length} Sessions
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                  {loadingReplays ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={24} className="text-[#f7941d] animate-spin" />
                    </div>
                  ) : replays.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-10">
                      No replays uploaded for this batch yet.
                    </p>
                  ) : (
                    replays.map((replay) => {
                      const isActive = replay.id === (activeReplayId ?? activeReplay?.id);
                      const attended = !!replay.attendance_type;
                      return (
                        <div
                          key={replay.id}
                          className={`w-full flex items-start gap-3 p-4 rounded-xl transition-colors mb-1 border-2 cursor-pointer ${
                            isActive ? 'bg-[#f7941d]/10 border-[#f7941d]' : 'border-transparent hover:bg-gray-50'
                          }`}
                          onClick={() => handlePlayReplay(replay)}
                        >
                          <div className="mt-0.5 shrink-0">
                            {attended
                              ? <CheckCircle size={20} className="text-green-500" />
                              : <PlayCircle size={20} className={isActive ? 'text-[#f7941d]' : 'text-gray-400'} />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold leading-snug mb-1 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                              {replay.title}
                            </p>
                            {replay.class_date && (
                              <span className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                <Calendar size={11} /> {replay.class_date}
                              </span>
                            )}
                            {attended && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle size={11} />
                                {replay.attendance_type === 'live' ? 'Attended live' : 'Watched replay'}
                              </span>
                            )}
                            {replay.assignments.length > 0 && (
                              <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#f7941d]">
                                <FileText size={11} />
                                {replay.assignments.length} assignment{replay.assignments.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
      `}} />
    </div>
  );
};

export default ClassReplaysPage;
