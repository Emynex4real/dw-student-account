import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Home, Loader2, MessageSquare, MessageSquareHeart, Plus } from 'lucide-react';
import StarRating from './StarRating';
import FeedbackFormModal from './FeedbackFormModal';
import FeedbackThreadModal from './FeedbackThreadModal';
import { CATEGORY_LABELS, STATUS_META, formatDate } from './feedbackLabels';
import { useMyFeedback } from '../hooks/useFeedback';

const FeedbackPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openThreadId, setOpenThreadId] = useState<number | null>(null);
  const { data: feedback = [], isLoading, isError, refetch } = useMyFeedback();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ── HEADER ── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <Link to="/dashboard" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Feedback</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Your <span className="text-[#f7941d]">Feedback</span>
              </h1>
              <p className="mt-2 text-gray-400 text-sm max-w-xl">
                Rate your courses and instructors, report a problem, or suggest an improvement. Our team replies right here.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#f7941d] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#d67e15] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#f7941d]/20"
            >
              <Plus size={20} /> Send Feedback
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Failed to load your feedback.</p>
            <button onClick={() => refetch()} className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
              Retry
            </button>
          </div>
        ) : feedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <div className="w-24 h-24 bg-[#f7941d]/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquareHeart size={48} className="text-[#f7941d]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No feedback yet.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Tell us how your classes are going. We read every message.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Send Your First Feedback
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {feedback.map((item) => {
              const status = STATUS_META[item.status];
              const hasNewStaffReply = item.last_reply_by === 'staff' && item.status !== 'closed';
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setOpenThreadId(item.id)}
                    className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-gray-500">{CATEGORY_LABELS[item.category]}</span>
                          {item.course_title && (
                            <span className="text-xs text-gray-400">· {item.course_title}</span>
                          )}
                          {item.instructor_name && (
                            <span className="text-xs text-gray-400">· {item.instructor_name}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 break-words">{item.subject}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 break-words">{item.message}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${status.className}`}>
                          {status.label}
                        </span>
                        {item.rating && <StarRating rating={item.rating} size={14} />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                      <span>Sent {formatDate(item.created_at)}</span>
                      <span className={`flex items-center gap-1.5 ${hasNewStaffReply ? 'text-[#f7941d] font-bold' : ''}`}>
                        <MessageSquare size={14} />
                        {hasNewStaffReply
                          ? 'New reply from staff'
                          : `${item.reply_count} ${item.reply_count === 1 ? 'reply' : 'replies'}`}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {isFormOpen && <FeedbackFormModal onClose={() => setIsFormOpen(false)} />}
      {openThreadId !== null && (
        <FeedbackThreadModal feedbackId={openThreadId} onClose={() => setOpenThreadId(null)} />
      )}
    </div>
  );
};

export default FeedbackPage;
