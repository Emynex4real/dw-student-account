import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { ScholarshipStatus } from '../services/scholarship.service';
import PaymentChoiceModal from './PaymentChoiceModal';

const STATUS_COPY: Record<string, { icon: React.ReactNode; heading: string; body: string }> = {
  'Pending': {
    icon: <Clock size={28} className="text-[#f7941d]" />,
    heading: 'Application Pending',
    body: "You'll get a response within 24 hours.",
  },
  'Under Review': {
    icon: <Clock size={28} className="text-[#f7941d]" />,
    heading: 'Application Under Review',
    body: "You'll get a response within 24 hours.",
  },
  'Rejected': {
    icon: <XCircle size={28} className="text-red-500" />,
    heading: 'Application Not Approved',
    body: 'Unfortunately your scholarship application was not approved this time.',
  },
};

interface ScholarshipStatusOverlayProps {
  data: ScholarshipStatus | undefined;
}

// Renders nothing for students with no scholarship application, or once the
// acceptance fee has been paid (dashboard becomes fully usable at that point).
// `data` is fetched by the parent (DashboardLayout), matching this codebase's
// existing convention of keeping dashboard-level queries in the layout itself
// (see the notifications useQuery there) rather than duplicating fetch logic
// here — the layout also needs this same data to decide whether to blur the
// Outlet.
export default function ScholarshipStatusOverlay({ data }: ScholarshipStatusOverlayProps): React.ReactElement | null {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!data?.has_application) return null;
  if (data.status === 'Approved' && data.acceptance_fee_paid_at) return null;

  const isApproved = data.status === 'Approved';
  const copy = isApproved
    ? { icon: <CheckCircle2 size={28} className="text-green-500" />, heading: 'Scholarship Approved!', body: `Pay your ₦11,265 acceptance fee to continue.` }
    : STATUS_COPY[data.status || 'Pending'];

  return (
    <>
      <div className="fixed inset-0 lg:left-64 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full mx-4 p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            {copy.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{copy.heading}</h3>
          <p className="text-sm text-gray-500 mb-1">{data.course_title}</p>
          <p className="text-sm text-gray-600">{copy.body}</p>

          {isApproved && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="mt-6 w-full px-5 py-3 bg-[#f7941d] text-black rounded-xl font-bold text-sm hover:bg-[#d67e15] transition-all"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>

      {showPaymentModal && <PaymentChoiceModal onClose={() => setShowPaymentModal(false)} />}
    </>
  );
}
