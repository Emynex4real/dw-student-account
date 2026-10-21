import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFeedback,
  getFeedbackOptions,
  getFeedbackThread,
  getMyFeedback,
  replyToFeedback,
} from '../api/feedback.service';

const KEYS = {
  list: ['feedback'] as const,
  thread: (id: number) => ['feedback', id] as const,
  options: ['feedback-options'] as const,
};

export function useMyFeedback() {
  return useQuery({ queryKey: KEYS.list, queryFn: getMyFeedback });
}

export function useFeedbackThread(id: number | null) {
  return useQuery({
    queryKey: KEYS.thread(id ?? 0),
    queryFn: () => getFeedbackThread(id as number),
    enabled: id !== null,
  });
}

export function useFeedbackOptions(enabled: boolean) {
  return useQuery({
    queryKey: KEYS.options,
    queryFn: getFeedbackOptions,
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.list }),
  });
}

export function useReplyToFeedback(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => replyToFeedback(id, message),
    // Prefix match refreshes both the list and this thread
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.list }),
  });
}
