import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, MessageCircle, Video, CalendarDays, Clock, Hourglass } from 'lucide-react';
import { getScholarshipStatus } from '../services/scholarship.service';

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  return isNaN(d.getTime()) ? date : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(time: string | null): string | null {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h)) return time;
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

// Scholarship students only, once their acceptance fee is paid. Shares the
// ['scholarship-status'] query with DashboardLayout, so it costs no extra request.
const ScholarshipBatchCard: React.FC = () => {
  const { data } = useQuery({ queryKey: ['scholarship-status'], queryFn: getScholarshipStatus });

  if (!data?.has_application || data.status !== 'Approved' || !data.acceptance_fee_paid_at) return null;

  const batch = data.batch;
  const start = formatTime(batch?.class_start_time ?? null);
  const end = formatTime(batch?.class_end_time ?? null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7941d]/10 text-[#f7941d]">
          <Users size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Scholarship Batch</h2>
          <p className="text-xs text-gray-500">{data.course_title}</p>
        </div>
      </div>

      <div className="p-6">
        {!batch ? (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Hourglass size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">You'll be added to a batch shortly</p>
              <p className="text-sm text-gray-500 mt-1">
                Our team is assigning you to a class batch. Once you're in, your batch details and its WhatsApp group link will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Batch</p>
              <p className="text-xl font-black text-gray-900">{batch.name}</p>
            </div>

            {(batch.class_title || batch.class_date || start) && (
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Next Class</p>
                {batch.class_title && <p className="text-sm font-bold text-gray-900">{batch.class_title}</p>}
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
                  {batch.class_date && (
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> {formatDate(batch.class_date)}</span>
                  )}
                  {start && (
                    <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {start}{end ? ` – ${end}` : ''}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {batch.whatsapp_link ? (
                <a
                  href={batch.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={18} /> Join WhatsApp Group
                </a>
              ) : (
                <p className="flex-1 text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  Your batch's WhatsApp group link will appear here soon.
                </p>
              )}
              {batch.class_link && (
                <a
                  href={batch.class_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  <Video size={18} /> Join Live Class
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipBatchCard;
