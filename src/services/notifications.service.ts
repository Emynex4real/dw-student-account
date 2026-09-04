import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'course_access' | 'class_reminder' | 'exam' | 'portfolio' | 'announcement';
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export async function getNotifications(): Promise<NotificationsResponse> {
  const { data } = await api.get<NotificationsResponse>('/notifications');
  return data;
}

export async function markAllRead(): Promise<void> {
  await api.post('/notifications/read', {});
}

export async function markOneRead(id: number): Promise<void> {
  await api.post('/notifications/read', { id });
}
