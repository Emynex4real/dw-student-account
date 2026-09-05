import api from './api';

export interface ScholarshipStatus {
  has_application: boolean;
  status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  course_title?: string;
  acceptance_fee_paid_at?: string | null;
  payment_reference?: string | null;
  payment_method?: 'paystack' | 'bank_transfer' | null;
}

export async function getScholarshipStatus(): Promise<ScholarshipStatus> {
  const { data } = await api.get<ScholarshipStatus>('/scholarship/status');
  return data;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export async function verifyPaystackPayment(reference: string): Promise<VerifyPaymentResponse> {
  const { data } = await api.post<VerifyPaymentResponse>('/scholarship/pay/verify', { reference });
  return data;
}
