import api from './api';

export interface AssignmentSubmission {
  id: number;
  file_url: string;
  file_name: string;
  issues_faced: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  feedback: string | null;
  created_at: string;
}

export async function submitAssignment(
  assignmentId: number,
  file: File,
  issuesFaced: string,
): Promise<{ success: boolean; file_url: string; file_name: string }> {
  const form = new FormData();
  form.append('assignment_id', String(assignmentId));
  form.append('file', file);
  if (issuesFaced.trim()) form.append('issues_faced', issuesFaced.trim());
  const { data } = await api.post('/submissions/assignment', form, { timeout: 60000 });
  return data;
}

export async function getMySubmission(
  assignmentId: number,
): Promise<AssignmentSubmission | null> {
  const { data } = await api.get('/submissions/assignment', {
    params: { assignment_id: assignmentId },
  });
  return data.submission;
}
