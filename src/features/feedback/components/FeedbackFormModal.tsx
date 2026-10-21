import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import StarRating from './StarRating';
import { CATEGORY_LABELS, apiErrorMessage } from './feedbackLabels';
import { useCreateFeedback, useFeedbackOptions } from '../hooks/useFeedback';
import type { FeedbackCategory } from '../types/feedback.types';

interface FeedbackFormModalProps {
  onClose: () => void;
}

const RATED: FeedbackCategory[] = ['course', 'instructor'];

const inputClass =
  'w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent bg-white';

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({ onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('course');
  const [courseId, setCourseId] = useState<number | null>(null);
  const [batchId, setBatchId] = useState<number | null>(null);
  const [instructorId, setInstructorId] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');

  const { data: options, isLoading: optionsLoading } = useFeedbackOptions(true);
  const courses = options?.courses ?? [];
  const createMutation = useCreateFeedback();

  const isRated = RATED.includes(category);
  const selectedCourse = courses.find((c) => c.id === courseId);
  const selectedBatch = selectedCourse?.batches.find((b) => b.id === batchId);
  const instructors = selectedBatch?.instructors ?? [];

  const handleCategoryChange = (next: FeedbackCategory) => {
    setCategory(next);
    if (!RATED.includes(next)) setRating(null);
    if (next !== 'instructor') setInstructorId(null);
  };

  const handleCourseChange = (value: string) => {
    setCourseId(value ? Number(value) : null);
    setBatchId(null);
    setInstructorId(null);
  };

  const handleBatchChange = (value: string) => {
    setBatchId(value ? Number(value) : null);
    setInstructorId(null);
  };

  const handleSubmit = () => {
    if (isRated && !rating) return setError('Please add a star rating.');
    if (category === 'course' && !courseId) return setError('Please choose the course this is about.');
    if (category === 'instructor' && !instructorId) return setError('Please choose the instructor this is about.');
    if (subject.trim().length < 3) return setError('Please add a short subject (at least 3 characters).');
    if (message.trim().length < 10) return setError('Please tell us a bit more (at least 10 characters).');

    setError('');
    createMutation.mutate(
      {
        category,
        subject: subject.trim(),
        message: message.trim(),
        rating: isRated ? rating : null,
        course_id: courseId,
        batch_id: batchId,
        instructor_id: category === 'instructor' ? instructorId : null,
        is_anonymous: isAnonymous,
      },
      {
        onSuccess: onClose,
        onError: (err) => setError(apiErrorMessage(err, 'Could not send your feedback. Please try again.')),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Send Feedback</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What is this about? *</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as FeedbackCategory[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    category === key
                      ? 'bg-black text-[#f7941d] border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {CATEGORY_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course {category === 'course' || category === 'instructor' ? '*' : '(optional)'}
              </label>
              <select
                value={courseId ?? ''}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={optionsLoading}
                className={inputClass}
              >
                <option value="">{optionsLoading ? 'Loading…' : 'Select a course…'}</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch {category === 'instructor' ? '*' : '(optional)'}
              </label>
              <select
                value={batchId ?? ''}
                onChange={(e) => handleBatchChange(e.target.value)}
                disabled={!selectedCourse || selectedCourse.batches.length === 0}
                className={inputClass}
              >
                <option value="">Select a batch…</option>
                {selectedCourse?.batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          {category === 'instructor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor *</label>
              <select
                value={instructorId ?? ''}
                onChange={(e) => setInstructorId(e.target.value ? Number(e.target.value) : null)}
                disabled={!selectedBatch}
                className={inputClass}
              >
                <option value="">
                  {!selectedBatch ? 'Choose a batch first…' : instructors.length ? 'Select an instructor…' : 'No instructor assigned to this batch'}
                </option>
                {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          )}

          {isRated && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your rating *</label>
              <StarRating rating={rating} onChange={setRating} size={28} />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              maxLength={200}
              placeholder="A short summary"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your feedback *</label>
            <textarea
              rows={5}
              maxLength={5000}
              placeholder="Tell us what went well, what didn't, or what we can improve…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#f7941d]"
            />
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Hide my name from staff.</span>{' '}
              Staff can still reply here, but won't see who sent it.
            </span>
          </label>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="px-6 py-2.5 text-sm font-bold bg-[#f7941d] text-black hover:bg-[#d67e15] rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {createMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormModal;
