import api from './api';

export interface ExamResult {
  score: number;
  total: number;
  percentage: string;
  submitted_at: string;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  course_id: number;
  course_title: string;
  course_image: string;
  payment_status: string;
  already_taken: boolean;
  result: ExamResult | null;
}

export interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
}

export interface ExamHistory {
  id: number;
  exam_title: string;
  duration: number;
  score: number;
  total: number;
  percentage: string;
  submitted_at: string;
}

const COURSE_IMAGE_BASE = 'https://admin.digitalworldtech.academy/uploads/courses/images/';

export async function getExams(): Promise<Exam[]> {
  const { data } = await api.get<{ exams: Exam[] }>('/exams');
  return data.exams.map(e => ({
    ...e,
    course_image: e.course_image ? COURSE_IMAGE_BASE + e.course_image : '',
  }));
}

export async function getExamQuestions(examId: number): Promise<Question[]> {
  const { data } = await api.get<{ questions: Question[] }>('/exams/questions', {
    params: { exam_id: examId },
  });
  return data.questions;
}

export async function submitExam(
  examId: number,
  answers: { question_id: number; answer: string }[],
): Promise<{ success: boolean; score: number; total: number; percentage: string }> {
  const { data } = await api.post('/exams/submit', {
    exam_id: examId,
    answers,
  });
  return data;
}

export async function validateExamToken(token: string): Promise<{ valid: boolean }> {
  const { data } = await api.post('/exams/validate', { token });
  return { valid: !!data.exam };
}

export async function getExamHistory(): Promise<ExamHistory[]> {
  const { data } = await api.get<{ history: ExamHistory[] }>('/exams/history');
  return data.history;
}
