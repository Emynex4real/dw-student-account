import api from './api';

export interface BatchReplay {
  id: number;
  title: string;
  video_url: string;
  class_date: string | null;
  created_at: string;
  attendance_type: 'live' | 'replay' | null;
  marked_at: string | null;
}

export interface AttendanceSummary {
  total: number;
  attended: number;
  percentage: number;
}

export const getBatchReplays = async (batchId: number): Promise<BatchReplay[]> => {
  const { data } = await api.get('/attendance/replays', { params: { batch_id: batchId } });
  return data.replays;
};

export const markLiveAttendance = async (batchId: number): Promise<void> => {
  await api.post('/attendance/live', { batch_id: batchId });
};

export const markReplayAttendance = async (replayId: number): Promise<void> => {
  await api.post('/attendance/replay', { replay_id: replayId });
};

export const getAttendanceSummary = async (batchId: number): Promise<AttendanceSummary> => {
  const { data } = await api.get('/attendance/summary', { params: { batch_id: batchId } });
  return data;
};
