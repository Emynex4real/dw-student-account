import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home, ChevronRight, Printer, AlertCircle, Loader2,
  CheckCircle, Receipt as ReceiptIcon
} from 'lucide-react';
import { getReceipt } from '../../../services/receipt.service';

const ReceiptPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const courseSlug = searchParams.get('course') ?? '';
  const memberId   = parseInt(searchParams.get('member_id') ?? '0', 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['receipt', courseSlug, memberId],
    queryFn: () => getReceipt(courseSlug, memberId),
    enabled: !!courseSlug && !!memberId,
  });

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', 'PRINT', 'height=700,width=900');
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt – ${data?.receipt?.course_title ?? ''}</title>
      <style>
        body { font-family: Inter, sans-serif; padding: 40px; color: #111; }
        h1,h2,h3,h4,p { margin: 0; }
        .orange { color: #f7941d; }
      </style>
      </head><body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (!courseSlug || !memberId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Invalid Receipt Link</h3>
          <p className="text-gray-500 mb-6">Course and member ID are required.</p>
          <button onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#f7941d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Receipt Not Found</h3>
          <p className="text-gray-500 mb-6">No receipt found for this course.</p>
          <button onClick={() => navigate('/dashboard/courses')}
            className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const { receipt, course } = data;
  const courseTitle = receipt.course_title || course?.title || '';
  const amountPaid  = Number(receipt.course_amount);
  const fullAmount  = Number(course?.amount ?? amountPaid);
  const currency    = (amountPaid === 100 || amountPaid === 150) ? '₵' : '₦';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header */}
      <div className="bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <button onClick={() => navigate('/dashboard')}
              className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </button>
            <ChevronRight size={14} className="mx-2" />
            <button onClick={() => navigate('/dashboard/courses')}
              className="hover:text-[#f7941d] transition-colors">
              Courses
            </button>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#f7941d]">Receipt</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#f7941d]/20 rounded-xl flex items-center justify-center">
                <ReceiptIcon size={20} className="text-[#f7941d]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Payment Receipt</h1>
                <p className="text-gray-400 text-sm">{courseTitle}</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors text-sm"
            >
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Top accent */}
          <div className="h-2 bg-[#f7941d]" />

          <div className="p-8">

            {/* Academy Logo & Title */}
            <div className="text-center mb-8">
              <img
                src="https://digitalworldtech.academy/assets/img/logo.png"
                alt="Digital World Tech Academy"
                className="h-12 mx-auto mb-4"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <p className="text-[#f7941d] font-bold text-lg">Receipt from Digital World Tech Academy</p>
              <p className="text-gray-500 text-sm mt-1 font-mono tracking-wider uppercase">
                Invoice #{receipt.transaction_id}
              </p>
            </div>

            {/* Date & Method */}
            <div className="flex justify-center gap-12 mb-8 pb-8 border-b border-gray-100">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Paid</p>
                <p className="text-gray-900 font-semibold">{receipt.transaction_date}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-gray-900 font-semibold">Transfer</p>
              </div>
            </div>

            {/* Billing Details */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Billing Details</h3>
              <div className="bg-[#f7941d] rounded-2xl p-6 text-white">
                <h2 className="text-xl font-bold text-center mb-6">
                  Receipt for {receipt.member_name}
                </h2>
                <div className="flex items-center justify-between py-4 border-b border-white/20">
                  <span className="font-semibold">{courseTitle}</span>
                  <span className="font-bold">{currency}{fullAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-semibold">Amount Paid</span>
                  <span className="text-xl font-black">{currency}{amountPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Verified badge */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold">
                <CheckCircle size={16} /> Payment Verified
              </div>
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
              <p>
                If you have any questions, contact Digital World at{' '}
                <a href="mailto:digitalworld@gmail.com" className="text-[#f7941d] font-semibold">
                  digitalworld@gmail.com
                </a>{' '}
                or call{' '}
                <a href="tel:+2347063963243" className="font-semibold text-gray-700">
                  +234 706 396 324
                </a>.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                You are receiving this receipt because you made a purchase at{' '}
                <strong className="text-[#f7941d]">Digital World Tech Academy</strong>.
              </p>
              <p className="text-xs text-gray-400">
                Digital World, 175 Success Street, Lagos State, Nigeria (114104)
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
