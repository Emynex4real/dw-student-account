import api from './api';

export interface ClassLink {
  batch_id: number;
  batch_name: string;
  class_link: string;
  today: string;
}

export type ClassesResponse = Record<string, ClassLink[]>;

export async function getClasses(): Promise<ClassesResponse> {
  const { data } = await api.get<{ courses: ClassesResponse }>('/classes');
  return data.courses;
}
