import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { ScholarshipStatus } from '../services/scholarship.service';
import type { AuthUser } from '../features/auth/types/auth.types';
import PaymentChoiceModal from './PaymentChoiceModal';

const STATUS_COPY: Record<string, { icon: React.ReactNode; heading: string; body: string }> = {
  'Pending': {
    icon: <Clock size={32} className="text-[#f7941d]" />,
    heading: 'Application Pending',
    body: "You'll get a response within 24 hours. Be sure to check your email.",
  },
  'Under Review': {
    icon: <Clock size={32} className="text-[#f7941d]" />,
    heading: 'Application Under Review',
    body: "You'll get a response within 24 hours. Be sure to check your email.",
  },
  'Rejected': {
    icon: <XCircle size={32} className="text-red-500" />,
    heading: 'Application Not Approved',
    body: 'Unfortunately your scholarship application was not approved this time.',
  },
};

interface ScholarshipStatusOverlayProps {
  data: ScholarshipStatus | undefined;
  user: AuthUser | null;
}

// Renders nothing for students with no scholarship application, or once the
// acceptance fee has been paid (dashboard becomes fully usable at that point).
// `data` is fetched by the parent (DashboardLayout), matching this codebase's
// existing convention of keeping dashboard-level queries in the layout itself
// (see the notifications useQuery there) rather than duplicating fetch logic
// here — the layout also needs this same data to decide whether to blur the
// Outlet.
export default function ScholarshipStatusOverlay({ data, user }: ScholarshipStatusOverlayProps): React.ReactElement | null {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!data?.has_application) return null;
  if (data.status === 'Approved' && data.acceptance_fee_paid_at) return null;

  const isApproved = data.status === 'Approved';
  const copy = isApproved
    ? { icon: <CheckCircle2 size={32} className="text-green-500" />, heading: 'Scholarship Approved!', body: `Pay your ₦11,265 acceptance fee to continue.` }
    : STATUS_COPY[data.status || 'Pending'];

  const applicantName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <>
      <div className="fixed inset-0 lg:left-64 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm sm:max-w-md md:max-w-lg w-full p-6 sm:p-10 md:p-12 text-center">
          <div className="mx-auto mb-5 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            {copy.icon}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{copy.heading}</h3>
          {(applicantName || user?.email) && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              {applicantName && <p className="text-base sm:text-lg font-semibold text-gray-900">{applicantName}</p>}
              {user?.email && <p className="text-sm sm:text-base text-gray-500 break-words">{user.email}</p>}
            </div>
          )}
          <p className="text-base sm:text-lg text-gray-500 mb-2">{data.course_title}</p>
          <p className="text-sm sm:text-base text-gray-600">{copy.body}</p>

          {isApproved && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="mt-8 w-full px-5 py-3 sm:py-4 bg-[#f7941d] text-black rounded-xl font-bold text-sm sm:text-base hover:bg-[#d67e15] transition-all"
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
