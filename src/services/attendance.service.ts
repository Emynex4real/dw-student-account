import api from './api';

export interface ReplayAssignment {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  due_date: string | null;
}

export interface BatchReplay {
  id: number;
  title: string;
  video_url: string;
  class_date: string | null;
  created_at: string;
  attendance_type: 'live' | 'replay' | null;
  marked_at: string | null;
  assignments: ReplayAssignment[];
}

export interface BatchAttendance {
  batch_id: number;
  batch_name: string;
  course_title: string;
  total: number;
  attended: number;
  percentage: number;
}

export interface AttendanceSummary {
  overall: { total: number; attended: number; percentage: number };
  breakdown: BatchAttendance[];
}

export const getBatchReplays = async (batchId: number): Promise<BatchReplay[]> => {
  const { data } = await api.get('/attendance/replays', { params: { batch_id: batchId } });
  return data.replays;
};

export const markLiveAttendance = async (batchId: number): Promise<void> => {
  await api.post('/attendance/live', { batch_id: batchId }, { timeout: 60000 });
};

export const markReplayAttendance = async (replayId: number): Promise<void> => {
  await api.post('/attendance/replay', { replay_id: replayId }, { timeout: 60000 });
};

export const getAttendanceSummary = async (): Promise<AttendanceSummary> => {
  const { data } = await api.get('/attendance/summary');
  return data;
};
