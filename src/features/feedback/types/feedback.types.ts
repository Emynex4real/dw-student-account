export type FeedbackCategory = 'course' | 'instructor' | 'platform' | 'payment' | 'other';
export type FeedbackStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export interface Feedback {
  id: number;
  matric_no: string | null;
  category: FeedbackCategory;
  course_id: number | null;
  batch_id: number | null;
  instructor_id: number | null;
  course_title: string | null;
  batch_name: string | null;
  instructor_name: string | null;
  rating: number | null;
  subject: string;
  message: string;
  is_anonymous: boolean;
  status: FeedbackStatus;
  last_reply_by: 'student' | 'staff' | null;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface FeedbackReply {
  id: number;
  author_type: 'student' | 'staff';
  message: string;
  created_at: string;
}

export interface FeedbackThread {
  feedback: Feedback;
  replies: FeedbackReply[];
}

export interface FeedbackInstructorOption {
  id: number;
  name: string;
}

export interface FeedbackBatchOption {
  id: number;
  name: string;
  instructors: FeedbackInstructorOption[];
}

export interface FeedbackCourseOption {
  id: number;
  title: string;
  batches: FeedbackBatchOption[];
}

export interface FeedbackOptions {
  courses: FeedbackCourseOption[];
}

export interface CreateFeedbackPayload {
  category: FeedbackCategory;
  subject: string;
  message: string;
  rating: number | null;
  course_id: number | null;
  batch_id: number | null;
  instructor_id: number | null;
  is_anonymous: boolean;
}
