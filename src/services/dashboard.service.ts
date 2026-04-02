import api from './api';

export interface DashboardStats {
  member_count: number;
  portfolio_count: number;
  password_change: number; // 0 = never changed, 1 = changed
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard');
  return data;
}
