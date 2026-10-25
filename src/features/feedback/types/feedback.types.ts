export type FeedbackCategory = 'course' | 'instructor' | 'platform' | 'payment' | 'other';
export type FeedbackStatus = 'open' | 'in_review' | 'resolved' | 'closed';
export type StudentType = 'Physical' | 'Online';

export interface Feedback {
  id: number;
  matric_no: string | null;
  student_type: StudentType | null;
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
  /** From the student's account — pre-selects the form, the student can change it */
  account_student_type: StudentType;
}

export interface CreateFeedbackPayload {
  student_type: StudentType;
  category: FeedbackCategory;
  subject: string;
  message: string;
  rating: number | null;
  course_id: number | null;
  batch_id: number | null;
  instructor_id: number | null;
}
