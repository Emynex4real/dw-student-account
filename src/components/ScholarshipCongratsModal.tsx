import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PartyPopper, MessageCircle, Users } from 'lucide-react';
import { markCongratsSeen } from '../services/scholarship.service';
import type { ScholarshipStatus } from '../services/scholarship.service';

interface ScholarshipCongratsModalProps {
  data: ScholarshipStatus | undefined;
  firstName?: string;
}

// Shown once per account after the acceptance fee is confirmed — straight after
// a verified Paystack payment, or on the first visit after staff mark a bank
// transfer as paid. Dismissing it is recorded server-side, so it won't reappear
// on another device.
export default function ScholarshipCongratsModal({ data, firstName }: ScholarshipCongratsModalProps): React.ReactElement | null {
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);

  const { mutate } = useMutation({
    mutationFn: markCongratsSeen,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['scholarship-status'] }),
  });

  if (dismissed || !data?.show_congrats) return null;

  const close = () => {
    setDismissed(true);
    mutate();
  };

  const batch = data.batch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-center">
        <div className="bg-black px-6 pt-10 pb-8 relative overflow-hidden">
          <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-[#f7941d] text-black flex items-center justify-center shadow-lg shadow-[#f7941d]/30">
            <PartyPopper size={40} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Congratulations{firstName ? `, ${firstName}` : ''}!
          </h2>
          <p className="text-gray-400 text-sm mt-2">Your acceptance fee has been received.</p>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-[#f7941d] opacity-[0.15] blur-3xl pointer-events-none" />
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Your <span className="font-bold text-gray-900">{data.course_title}</span> scholarship is confirmed — welcome to Digital World Tech Academy!
          </p>

          {batch ? (
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-left">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Batch</p>
              <p className="text-lg font-black text-gray-900">{batch.name}</p>
              {batch.whatsapp_link && (
                <a
                  href={batch.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={18} /> Join the Batch WhatsApp Group
                </a>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f7941d]/5 border border-[#f7941d]/20 p-4 flex items-start gap-3 text-left">
              <Users size={20} className="text-[#f7941d] shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                You'll be added to a class batch shortly, along with the batch's WhatsApp group. Keep an eye on the <span className="font-bold">Scholarship Batch</span> card on your dashboard.
              </p>
            </div>
          )}

          <button
            onClick={close}
            className="w-full px-5 py-3.5 bg-[#f7941d] text-black rounded-xl font-bold text-sm sm:text-base hover:bg-[#d67e15] transition-colors"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
