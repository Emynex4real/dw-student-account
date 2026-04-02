import api from './api';

export interface Course {
  member_id: number;
  course_id: number;
  title: string;
  description: string;
  teacher: string;
  category: string;
  image: string;
  amount: number;
  date: string;
  progress_pct: number;
  completed: number;
  total: number;
  slug: string;
}

const COURSE_IMAGE_BASE = 'https://admin.digitalworldtech.academy/uploads/courses/images/';

function withImageUrl(courses: Course[]): Course[] {
  return courses.map(c => ({
    ...c,
    image: c.image ? COURSE_IMAGE_BASE + c.image : '',
  }));
}

export async function getEnrolledCourses(): Promise<Course[]> {
  const { data } = await api.get<{ courses: Course[] }>('/courses');
  return withImageUrl(data.courses);
}

export async function searchCourses(query: string): Promise<Course[]> {
  const { data } = await api.get<{ courses: Course[] }>('/courses/search', {
    params: { q: query },
  });
  return withImageUrl(data.courses);
}
