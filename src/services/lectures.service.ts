import api from './api';

const VIDEO_BASE = 'https://admin.digitalworldtech.academy/uploads/courses/videos/';

export interface LectureComment {
  id: number;
  lecture_id: number;
  name: string;
  comment: string;
  date: string;
}

export interface Lecture {
  id: number;
  title: string;
  completed: boolean;
}

export interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

export interface FirstLecture {
  id: number;
  course_id: number;
  curriculum_id: number;
  title: string;
  type: number; // 1 = hosted video file, 2 = iframe embed HTML
  video: string;
  download: number;
  description: string;
}

export interface CourseWithLectures {
  id: number;
  title: string;
  description: string;
  image: string;
  teacher: string;
}

export interface LecturesResponse {
  course: CourseWithLectures;
  total_lectures: number;
  completed_lectures: number;
  sections: Section[];
  first_lecture: FirstLecture | null;
  first_comments: LectureComment[];
}

export interface LectureDetails {
  lecture: FirstLecture;
  comments: LectureComment[];
}

export function getVideoSrc(lecture: FirstLecture): { type: 'iframe' | 'video' | 'none'; src: string } {
  if (!lecture.video) return { type: 'none', src: '' };
  if (lecture.type === 2) {
    // Extract src URL from the stored iframe HTML string
    const match = lecture.video.match(/src="([^"]+)"/);
    const src = match ? match[1] : '';
    return { type: 'iframe', src };
  }
  return { type: 'video', src: VIDEO_BASE + lecture.video };
}

export async function getLectures(courseSlug: string): Promise<LecturesResponse> {
  const { data } = await api.get<LecturesResponse>('/lectures', {
    params: { course: courseSlug },
  });
  return data;
}

export async function getLectureDetails(lectureId: number): Promise<LectureDetails> {
  const { data } = await api.get<LectureDetails>('/lectures/details', {
    params: { id: lectureId },
  });
  return data;
}

export async function markLectureComplete(
  lectureId: number,
  courseId: number,
  progress = 1,
): Promise<{ success: boolean; course_progress: number }> {
  const { data } = await api.post('/lectures/progress', {
    lecture_id: lectureId,
    course_id: courseId,
    progress,
  });
  return data;
}

export async function postComment(
  lectureId: number,
  comment: string,
): Promise<{ success: boolean }> {
  const { data } = await api.post('/lectures/comment', {
    lecture_id: lectureId,
    comment,
  });
  return data;
}
