import api from './api';

export interface ClassLink {
  batch_id: number;
  batch_name: string;
  class_link: string;
  class_date: string | null;
  class_time: string | null;
  class_end_time: string | null;
  class_title: string | null;
  instructor_name: string;
  instructor_image: string | null;
}

export type ClassesResponse = Record<string, ClassLink[]>;

export async function getClasses(): Promise<ClassesResponse> {
  const { data } = await api.get<{ courses: ClassesResponse }>('/classes');
  return data.courses;
}

export interface EnrolledBatch {
  batch_id: number;
  batch_name: string;
  course_title: string;
}

export async function getEnrolledBatches(): Promise<EnrolledBatch[]> {
  const { data } = await api.get<{ batches: EnrolledBatch[] }>('/classes/batches');
  return data.batches;
}
