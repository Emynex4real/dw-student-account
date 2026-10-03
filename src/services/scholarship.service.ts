import api from './api';

export interface ScholarshipBatch {
  name: string;
  class_link: string | null;
  class_title: string | null;
  class_date: string | null;
  class_start_time: string | null;
  class_end_time: string | null;
  whatsapp_link: string | null;
}

export interface ScholarshipStatus {
  has_application: boolean;
  status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  course_title?: string;
  acceptance_fee_paid_at?: string | null;
  payment_reference?: string | null;
  payment_method?: 'paystack' | 'bank_transfer' | null;
  /** True once the fee is paid, until the student dismisses the congratulations. */
  show_congrats?: boolean;
  /** Only present once the fee is paid; null until staff assign a batch. */
  batch?: ScholarshipBatch | null;
}

export async function getScholarshipStatus(): Promise<ScholarshipStatus> {
  const { data } = await api.get<ScholarshipStatus>('/scholarship/status');
  return data;
}

export async function markCongratsSeen(): Promise<void> {
  await api.post('/scholarship/congrats/seen');
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export async function verifyPaystackPayment(reference: string): Promise<VerifyPaymentResponse> {
  const { data } = await api.post<VerifyPaymentResponse>('/scholarship/pay/verify', { reference });
  return data;
}
