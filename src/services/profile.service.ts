import api from './api';

const STUDENT_IMAGE_BASE = 'https://admin.digitalworldtech.academy/uploads/students/images/';

export interface Profile {
  id: number;
  username: string;
  email: string;
  image: string;
  password_change: number;
}

export function getProfileImageUrl(filename: string): string {
  return filename ? STUDENT_IMAGE_BASE + filename : '';
}

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get<{ profile: Profile }>('/profile');
  return data.profile;
}

export async function updateProfile(formData: FormData): Promise<Profile> {
  const { data } = await api.post<{ profile: Profile }>('/profile/update', formData);
  return data.profile;
}

export async function changePassword(password: string): Promise<{ message: string }> {
  const { data } = await api.post('/profile/change-password', { password });
  return data;
}
