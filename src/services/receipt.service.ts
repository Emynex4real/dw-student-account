import api from './api';

export interface Receipt {
  transaction_id: string;
  transaction_date: string;
  member_name: string;
  course_title: string;
  course_amount: string | number;
}

export interface ReceiptData {
  course: { id: number; title: string; amount: number; image: string };
  member: { id: number; username: string; email: string };
  receipt: Receipt | null;
}

export async function getReceipt(courseSlug: string, memberId: number): Promise<ReceiptData> {
  const { data } = await api.get<ReceiptData>('/receipt', {
    params: { course: courseSlug, member_id: memberId },
  });
  return data;
}
