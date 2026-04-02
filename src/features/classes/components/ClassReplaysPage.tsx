import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home, ChevronRight, PlayCircle,
  Calendar, ChevronDown, BookOpen,
  Upload, FileText, X, CheckCircle, Loader2, AlertTriangle,
} from 'lucide-react';
import { getClasses } from '../../../services/classes.service';
import { getBatchReplays, markReplayAttendance } from '../../../services/attendance.service';
import type { BatchReplay } from '../../../services/attendance.service';

const ClassReplaysPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courses, isLoading: loadingClasses, isError: classesError } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });

  // Flatten courses into batch list for dropdown
  const batches = courses
    ? Object.entries(courses).flatMap(([courseName, batchList]) =>
        batchList.map(b => ({ batch_id: b.batch_id, label: `${courseName} — ${b.batch_name}` }))
      )
    : [];

  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeReplayId, setActiveReplayId] = useState<number | null>(null);
  const [modalReplayId, setModalReplayId] = useState<number | null>(null);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);

  const activeBatchId = selectedBatchId ?? batches[0]?.batch_id ?? null;
  const selectedBatch = batches.find(b => b.batch_id === activeBatchId) ?? batches[0] ?? null;

  const { data: replays = [], isLoading: loadingReplays } = useQuery({
    queryKey: ['batch-replays', activeBatchId],
    queryFn: () => getBatchReplays(activeBatchId!),
    enabled: !!activeBatchId,
  });

  const activeReplay: BatchReplay | null =
    replays.find(r => r.id === activeReplayId) ?? replays[0] ?? null;

  const modalReplay = replays.find(r => r.id === modalReplayId) ?? null;

  const handleSelectBatch = (batchId: number) => {
    setSelectedBatchId(batchId);
    setActiveReplayId(null);
    setDropdownOpen(false);
  };

  const handlePlayReplay = (replay: BatchReplay) => {
    setActiveReplayId(replay.id);
    // Mark attendance if not already attended
    if (!replay.attendance_type) {
      markReplayAttendance(replay.id);
    }
  };

  const openModal = (replayId: number) => {
    setModalReplayId(replayId);
    setModalFile(null);
  };

  const closeModal = () => {
    setModalReplayId(null);
    setModalFile(null);
  };

  const handleSubmit = () => {
    if (modalFile && modalReplayId !== null) {
      setSubmittedIds(prev => [...prev, modalReplayId]);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-[#f7941d] transition-colors flex items-center gap-1"
            >
              <Home size={14} /> Home
            </button>
            <ChevronRight size={14} className="mx-2" />
            <button
              onClick={() => navigate('/dashboard/classes')}
              className="hover:text-[#f7941d] transition-colors"
            >
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
                <ChevronDown
                  size={16}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
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
                          batch.batch_id === activeBatchId
                            ? 'bg-[#f7941d]/10 text-[#f7941d] font-semibold'
                            : 'text-gray-700'
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

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
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
            <button
              onClick={() => navigate('/dashboard/courses')}
              className="px-6 py-2.5 bg-[#f7941d] text-black font-semibold rounded-xl hover:bg-[#e8850a] transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT — Video Player + Info */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {loadingReplays ? (
              <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                <Loader2 size={40} className="text-[#f7941d] animate-spin" />
              </div>
            ) : activeReplay?.video_url ? (
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src={activeReplay.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={activeReplay.title}
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg group border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayCircle size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-400">No video available for this session</p>
                  </div>
                </div>
              </div>
            )}

            {activeReplay && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{activeReplay.title}</h2>
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
                    const isSubmitted = submittedIds.includes(replay.id);
                    const attended = !!replay.attendance_type;
                    return (
                      <button
                        key={replay.id}
                        onClick={() => handlePlayReplay(replay)}
                        className={`w-full flex items-start gap-3 p-4 text-left rounded-xl transition-colors mb-1 border-2 ${
                          isActive ? 'bg-[#f7941d]/10 border-[#f7941d]' : 'border-transparent hover:bg-gray-50'
                        }`}
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
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-2">
                              <span className="flex items-center gap-1"><Calendar size={11} /> {replay.class_date}</span>
                            </div>
                          )}
                          {attended && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mb-2">
                              <CheckCircle size={11} />
                              {replay.attendance_type === 'live' ? 'Attended live' : 'Watched replay'}
                            </span>
                          )}

                          {/* Submit Assignment */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {isSubmitted ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                                <CheckCircle size={12} /> Submitted
                              </span>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); openModal(replay.id); }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f7941d] text-black text-xs font-semibold rounded-lg hover:bg-[#e8850a] transition-colors"
                              >
                                <Upload size={12} /> Submit Assignment
                              </button>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
        )}
      </div>

      {/* ── UPLOAD MODAL ────────────────────────────────────────── */}
      {modalReplay && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeModal}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Submit Assignment</h3>
                  <p className="text-xs text-gray-500 mt-0.5 pr-4 line-clamp-1">{modalReplay.title}</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <label className="flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-gray-300 hover:border-[#f7941d] rounded-xl p-8 cursor-pointer transition-colors group">
                  <div className="h-14 w-14 rounded-full bg-gray-100 group-hover:bg-[#f7941d]/10 flex items-center justify-center transition-colors">
                    <FileText size={26} className="text-gray-400 group-hover:text-[#f7941d] transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      {modalFile ? modalFile.name : 'Click to select a document'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setModalFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {modalFile && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <FileText size={18} className="text-[#f7941d] shrink-0" />
                    <span className="text-sm text-gray-700 truncate flex-1">{modalFile.name}</span>
                    <button onClick={() => setModalFile(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!modalFile}
                  onClick={handleSubmit}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    modalFile
                      ? 'bg-black text-white hover:bg-[#f7941d] hover:text-black'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Upload size={15} /> Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
