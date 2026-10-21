import { isAxiosError } from 'axios';
import type { FeedbackCategory, FeedbackStatus } from '../types/feedback.types';

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  course: 'Course',
  instructor: 'Instructor / Class',
  platform: 'Platform / Technical',
  payment: 'Payment',
  other: 'Other',
};

export const STATUS_META: Record<FeedbackStatus, { label: string; className: string }> = {
  open:      { label: 'Open',      className: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_review: { label: 'In Review', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  resolved:  { label: 'Resolved',  className: 'bg-green-50 text-green-700 border-green-200' },
  closed:    { label: 'Closed',    className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export function apiErrorMessage(err: unknown, fallback: string): string {
  return (isAxiosError(err) && err.response?.data?.error) || fallback;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr.replace(' ', 'T')).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
