import React, { useState } from 'react';
import { X, CreditCard, Landmark, MessageCircle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { verifyPaystackPayment } from '../services/scholarship.service';

// TODO: replace with the real bank details and WhatsApp number before this ships.
const BANK_DETAILS = {
  bankName: 'REPLACE_ME_BANK_NAME',
  accountNumber: 'REPLACE_ME_ACCOUNT_NUMBER',
  accountName: 'Digital World Tech Academy',
};
const WHATSAPP_NUMBER = 'REPLACE_ME_WHATSAPP_NUMBER'; // digits only, e.g. 2347063963246

const ACCEPTANCE_FEE_NAIRA = 11265;
const ACCEPTANCE_FEE_KOBO = ACCEPTANCE_FEE_NAIRA * 100;

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });
}

interface PaymentChoiceModalProps {
  onClose: () => void;
}

const PaymentChoiceModal: React.FC<PaymentChoiceModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'choice' | 'bank'>('choice');
  const [isPaying, setIsPaying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const handlePaystack = async () => {
    setVerifyError('');
    setIsPaying(true);
    try {
      await loadPaystackScript();
      const reference = `scholarship_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      window.PaystackPop!.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user?.email,
        amount: ACCEPTANCE_FEE_KOBO,
        currency: 'NGN',
        ref: reference,
        callback: (response: { reference: string }) => {
          verifyPaystackPayment(response.reference)
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ['scholarship-status'] });
              onClose();
            })
            .catch(() => {
              setVerifyError('Payment could not be verified. If you were charged, contact support.');
            })
            .finally(() => setIsPaying(false));
        },
        onClose: () => setIsPaying(false),
      }).openIframe();
    } catch {
      setVerifyError('Could not start Paystack checkout. Please try again.');
      setIsPaying(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hi, I'd like to verify my scholarship acceptance fee payment. Name: ${user?.firstName} ${user?.lastName}, Email: ${user?.email}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Pay Acceptance Fee</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {mode === 'choice' && (
            <>
              <p className="text-sm text-gray-600">
                Acceptance fee: <span className="font-bold text-gray-900">₦{ACCEPTANCE_FEE_NAIRA.toLocaleString()}</span>
              </p>

              {verifyError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{verifyError}</div>
              )}

              <button
                onClick={handlePaystack}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#f7941d] text-black rounded-xl font-bold text-sm hover:bg-[#d67e15] transition-all disabled:opacity-60"
              >
                {isPaying ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                Pay Online with Paystack
              </button>

              <button
                onClick={() => setMode('bank')}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                <Landmark size={18} />
                Pay via Bank Transfer
              </button>
            </>
          )}

          {mode === 'bank' && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p><span className="text-gray-500">Bank:</span> <span className="font-bold">{BANK_DETAILS.bankName}</span></p>
                <p><span className="text-gray-500">Account Number:</span> <span className="font-bold">{BANK_DETAILS.accountNumber}</span></p>
                <p><span className="text-gray-500">Account Name:</span> <span className="font-bold">{BANK_DETAILS.accountName}</span></p>
                <p className="text-gray-500 pt-1">Amount: <span className="font-bold text-gray-900">₦{ACCEPTANCE_FEE_NAIRA.toLocaleString()}</span></p>
              </div>
              <p className="text-xs text-gray-500">
                After transferring, message us on WhatsApp with your payment proof so our team can verify it manually.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all"
              >
                <MessageCircle size={18} />
                I've Made the Transfer — Verify on WhatsApp
              </a>
              <button
                onClick={() => setMode('choice')}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-900 pt-1"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentChoiceModal;
