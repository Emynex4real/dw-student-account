import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveCourse {
  id: number;
  title: string;
}

interface CourseStore {
  activeCourse: ActiveCourse | null;
  studiedCourseIds: number[];
  setActiveCourse: (course: ActiveCourse) => void;
  clearActiveCourse: () => void;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      activeCourse: null,
      studiedCourseIds: [],
      setActiveCourse: (course) =>
        set((state) => ({
          activeCourse: course,
          studiedCourseIds: state.studiedCourseIds.includes(course.id)
            ? state.studiedCourseIds
            : [...state.studiedCourseIds, course.id],
        })),
      clearActiveCourse: () => set({ activeCourse: null }),
    }),
    { name: 'sp_active_course' }
  )
);
