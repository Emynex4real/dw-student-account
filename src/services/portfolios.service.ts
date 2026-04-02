import api from './api';

const STUDENT_IMAGE_BASE = 'https://admin.digitalworldtech.academy/uploads/students/images/';

export interface Portfolio {
  id: number;
  user_id: number;
  name: string;
  course_title: string;
  image: string;
  specification: string;
  project_link: string;
  status: number; // 0=pending, 1=approved, 3=disapproved
  admin_note: string;
  created_on: string;
}

export function getStudentImageUrl(filename: string): string {
  return filename ? STUDENT_IMAGE_BASE + filename : '';
}

export async function getPortfolios(): Promise<Portfolio[]> {
  const { data } = await api.get<{ portfolios: Portfolio[] }>('/portfolios');
  return data.portfolios;
}

export async function getPortfolioCourses(): Promise<string[]> {
  const { data } = await api.get<{ courses: string[] }>('/portfolios/courses');
  return data.courses;
}

export async function createPortfolio(formData: FormData): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/portfolios/create', formData);
  return data;
}

export async function getPortfolio(id: number): Promise<Portfolio> {
  const { data } = await api.get<{ portfolio: Portfolio }>('/portfolios/show', {
    params: { id },
  });
  return data.portfolio;
}

export async function updatePortfolio(id: number, formData: FormData): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post(`/portfolios/update`, formData, {
    params: { id },
  });
  return data;
}

export async function resubmitPortfolio(id: number): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/portfolios/resubmit', null, {
    params: { id },
  });
  return data;
}
