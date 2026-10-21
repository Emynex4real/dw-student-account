import React, { useState } from 'react';
import { AlertTriangle, EyeOff, Loader2, Send, X } from 'lucide-react';
import StarRating from './StarRating';
import { CATEGORY_LABELS, STATUS_META, apiErrorMessage, formatDate } from './feedbackLabels';
import { useFeedbackThread, useReplyToFeedback } from '../hooks/useFeedback';

interface FeedbackThreadModalProps {
  feedbackId: number;
  onClose: () => void;
}

const FeedbackThreadModal: React.FC<FeedbackThreadModalProps> = ({ feedbackId, onClose }) => {
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const { data: thread, isLoading, isError } = useFeedbackThread(feedbackId);
  const replyMutation = useReplyToFeedback(feedbackId);

  const feedback = thread?.feedback;
  const isClosed = feedback?.status === 'closed';

  const handleReply = () => {
    if (reply.trim().length < 2) return;
    setError('');
    replyMutation.mutate(reply.trim(), {
      onSuccess: () => setReply(''),
      onError: (err) => setError(apiErrorMessage(err, 'Could not send your reply.')),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start gap-4 p-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 break-words">{feedback?.subject ?? 'Feedback'}</h2>
            {feedback && (
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                <span className={`px-2.5 py-1 rounded-lg font-bold border ${STATUS_META[feedback.status].className}`}>
                  {STATUS_META[feedback.status].label}
                </span>
                <span className="px-2.5 py-1 rounded-lg font-semibold bg-gray-100 text-gray-600">
                  {CATEGORY_LABELS[feedback.category]}
                </span>
                {feedback.is_anonymous && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-gray-100 text-gray-600">
                    <EyeOff size={12} /> Anonymous
                  </span>
                )}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-[#f7941d] animate-spin" />
            </div>
          ) : isError || !thread || !feedback ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
              Failed to load this feedback.
            </div>
          ) : (
            <>
              {/* Original feedback */}
              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                {(feedback.course_title || feedback.instructor_name) && (
                  <p className="text-xs text-gray-500 mb-2">
                    {[feedback.course_title, feedback.batch_name, feedback.instructor_name].filter(Boolean).join(' · ')}
                  </p>
                )}
                {feedback.rating && <div className="mb-2"><StarRating rating={feedback.rating} size={16} /></div>}
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{feedback.message}</p>
                <p className="text-xs text-gray-400 mt-3">You · {formatDate(feedback.created_at)}</p>
              </div>

              {/* Replies */}
              {thread.replies.map((r) => {
                const isStaff = r.author_type === 'staff';
                return (
                  <div key={r.id} className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${isStaff ? 'bg-black text-white' : 'bg-[#f7941d]/10 text-gray-900'}`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{r.message}</p>
                      <p className={`text-xs mt-2 ${isStaff ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isStaff ? 'Digital World Team' : 'You'} · {formatDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {thread.replies.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">
                  No replies yet. Our team will get back to you here.
                </p>
              )}
            </>
          )}
        </div>

        {feedback && (
          <div className="p-4 border-t border-gray-100">
            {isClosed ? (
              <p className="text-sm text-center text-gray-500">This feedback is closed. Send new feedback if you need more help.</p>
            ) : (
              <>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    maxLength={5000}
                    placeholder="Write a reply…"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  />
                  <button
                    onClick={handleReply}
                    disabled={replyMutation.isPending || reply.trim().length < 2}
                    aria-label="Send reply"
                    className="self-end px-4 py-3 bg-[#f7941d] text-black rounded-xl font-bold hover:bg-[#d67e15] transition-colors disabled:opacity-50"
                  >
                    {replyMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackThreadModal;
