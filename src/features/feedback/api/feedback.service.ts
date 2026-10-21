import api from '../../../services/api';
import type {
  CreateFeedbackPayload,
  Feedback,
  FeedbackOptions,
  FeedbackThread,
} from '../types/feedback.types';

export async function getMyFeedback(): Promise<Feedback[]> {
  const { data } = await api.get<{ feedback: Feedback[] }>('/feedback');
  return data.feedback;
}

export async function getFeedbackThread(id: number): Promise<FeedbackThread> {
  const { data } = await api.get<FeedbackThread>('/feedback/show', { params: { id } });
  return data;
}

export async function getFeedbackOptions(): Promise<FeedbackOptions> {
  const { data } = await api.get<FeedbackOptions>('/feedback/options');
  return data;
}

export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
  const { data } = await api.post<{ feedback: Feedback }>('/feedback', payload);
  return data.feedback;
}

export async function replyToFeedback(id: number, message: string): Promise<void> {
  await api.post('/feedback/reply', { id, message });
}
