import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Home, ChevronRight, Video, Calendar, Clock,
  ExternalLink, PlayCircle, CalendarPlus,
  AlertCircle, Loader2, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { getClasses } from '../../../services/classes.service';
import { markLiveAttendance } from '../../../services/attendance.service';

// All class times in DB are Nigerian time (WAT = UTC+1)
// This creates a proper Date object from a Nigerian time string + date
function parseNigerianTime(classDate: string, timeStr: string): Date | null {
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2] ?? '0');
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === 'pm' && hours !== 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  // Build ISO string with +01:00 (WAT) offset so browser converts to local time
  const iso = `${classDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+01:00`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isClassExpired(classDate: string | null, classTime: string | null, classEndTime: string | null): boolean {
  if (!classDate || classDate === 'TBD') return false;

  const today = new Date().toISOString().split('T')[0];
  if (classDate < today) return true;
  if (classDate > today) return false;

  const now = new Date();

  if (classEndTime && classEndTime !== 'TBD') {
    const endLocal = parseNigerianTime(classDate, classEndTime);
    if (!endLocal) return false;
    return now > new Date(endLocal.getTime() + 60 * 60 * 1000); // 1hr after end
  }

  if (classTime && classTime !== 'TBD') {
    const startLocal = parseNigerianTime(classDate, classTime);
    if (!startLocal) return false;
    return now > new Date(startLocal.getTime() + 4 * 60 * 60 * 1000); // 4hrs after start
  }

  return false;
}

function detectPlatform(link: string): string {
  if (!link) return 'Online';
  if (link.includes('meet.google')) return 'Google Meet';
  if (link.includes('zoom.us')) return 'Zoom';
  if (link.includes('teams.microsoft')) return 'MS Teams';
  return 'Online';
}

function toCalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildCalendarDates(classDate: string, rawTime: string | null): { start: Date; end: Date } {
  const start = (classDate !== 'TBD' && rawTime)
    ? (parseNigerianTime(classDate, rawTime) ?? new Date())
    : new Date();
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // default 2hr duration
  return { start, end };
}

const AddToCalendarButton: React.FC<{ title: string; classDate: string; classTime: string | null }> = ({ title, classDate, classTime }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { start, end } = buildCalendarDates(classDate, classTime);
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${toCalDate(start)}/${toCalDate(end)}`;

  const downloadIcs = () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Digital World Tech Academy//EN',
      'BEGIN:VEVENT',
      `UID:class-${Date.now()}@digitalworldtech.academy`,
      `DTSTAMP:${toCalDate(new Date())}`,
      `DTSTART:${toCalDate(start)}`,
      `DTEND:${toCalDate(end)}`,
      `SUMMARY:${title}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g, '-')}.ics`; a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative sm:w-40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#f7941d] hover:text-[#f7941d] transition-colors"
      >
        <CalendarPlus size={18} /> Add to Calendar
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google" className="w-5 h-5 object-contain" />
            Google Calendar
          </a>
          <button
            onClick={downloadIcs}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <Calendar size={18} className="text-gray-500" />
            Download .ics
          </button>
        </div>
      )}
    </div>
  );
};

const ClassLinksPage: React.FC = () => {
  const navigate = useNavigate();
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  const { data: courses, isLoading, isError, refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
    staleTime: 0,        // always fetch fresh — class links change frequently
    refetchOnMount: true, // refetch every time student opens this page
  });

  const today = new Date().toISOString().split('T')[0];

  const classCards = courses
    ? Object.entries(courses).flatMap(([courseName, batches]) =>
        batches
          .filter(batch => !isClassExpired(batch.class_date, batch.class_time, batch.class_end_time))
          .map((batch) => {
            const classDate = batch.class_date ?? 'TBD';
            const startLocal = classDate !== 'TBD' && batch.class_time
              ? parseNigerianTime(classDate, batch.class_time) : null;
            const endLocal = classDate !== 'TBD' && batch.class_end_time
              ? parseNigerianTime(classDate, batch.class_end_time) : null;

            const now = new Date();
            let status: 'upcoming' | 'starting-soon' | 'live' | 'ended' = 'upcoming';
            if (endLocal && now >= endLocal) {
              status = 'ended';
            } else if (startLocal && now >= startLocal) {
              status = 'live';
            } else if (classDate === today) {
              status = 'starting-soon';
            }

            return {
              id: batch.batch_id,
              title: `${courseName} — ${batch.batch_name}`,
              classTitle: batch.class_title,
              instructor: batch.instructor_name,
              date: classDate,
              time: startLocal ? formatLocalTime(startLocal) : (batch.class_time ?? 'TBD'),
              endTime: endLocal ? formatLocalTime(endLocal) : null,
              rawTime: batch.class_time,
              platform: detectPlatform(batch.class_link),
              link: batch.class_link,
              status,
            };
          })
      )
    : [];

  const hasClasses = classCards.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ── HEADER ── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </button>
            <ChevronRight size={14} className="mx-2" />
            <button onClick={() => navigate('/dashboard/courses')} className="hover:text-[#f7941d] transition-colors">Courses</button>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Class Links</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your <span className="text-[#f7941d]">Class Links</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Access your upcoming live sessions and recent class recordings all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance error toast */}
      {attendanceError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-bold">
          <AlertTriangle size={16} className="shrink-0" />
          {attendanceError}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Failed to load class links.</p>
            <button onClick={() => refetch()} className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-10">

            {/* ── Upcoming Live Classes ── */}
            {!hasClasses ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Video size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You don't have any active class links yet.</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Once you enroll in a course with live instructor sessions, your meeting links and recordings will automatically appear here.
                </p>
                <button
                  onClick={() => navigate('/dashboard/courses')}
                  className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors duration-300"
                >
                  Browse Available Courses
                </button>
              </div>
            ) : (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-2 bg-[#f7941d] rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Live Classes</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {classCards.map((cls) => (
                    <div
                      key={cls.id}
                      className={`bg-white rounded-2xl border overflow-hidden flex flex-col ${
                        cls.status === 'live' ? 'border-green-500 shadow-md shadow-green-500/10' :
                        cls.status === 'starting-soon' ? 'border-[#f7941d] shadow-md shadow-[#f7941d]/10' :
                        cls.status === 'ended' ? 'border-gray-300 shadow-sm opacity-75' :
                        'border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className={`p-4 flex justify-between items-center border-b ${
                        cls.status === 'live' ? 'bg-green-50 border-green-100' :
                        cls.status === 'starting-soon' ? 'bg-[#f7941d]/10 border-[#f7941d]/20' :
                        cls.status === 'ended' ? 'bg-gray-100 border-gray-200' :
                        'bg-gray-50 border-gray-100'
                      }`}>
                        <div className="flex items-center gap-2">
                          {cls.status === 'live' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-white px-2.5 py-1 rounded-full shadow-sm">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                              </span>
                              Class Started
                            </span>
                          ) : cls.status === 'starting-soon' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#f7941d] bg-white px-2.5 py-1 rounded-full shadow-sm">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7941d] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7941d]" />
                              </span>
                              Starting Soon
                            </span>
                          ) : cls.status === 'ended' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-white px-2.5 py-1 rounded-full shadow-sm">
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400" />
                              Class Ended
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded-full shadow-sm">
                              <Calendar size={12} /> Scheduled
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 uppercase">
                          {cls.platform}
                        </span>
                      </div>

                      <div className="p-6 flex-grow">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 leading-snug">{cls.title}</h3>
                          {cls.classTitle && (
                            <p className="text-sm text-gray-500 mt-0.5">{cls.classTitle}</p>
                          )}
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Calendar size={18} className="text-gray-400" />
                            <span>Date: <strong className="text-gray-900">{cls.date}</strong></span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock size={18} className="text-gray-400" />
                            <span>Time: <strong className="text-gray-900">
                              {cls.time}{cls.endTime ? ` – ${cls.endTime}` : ''} <span className="text-xs font-normal text-gray-400">(your time)</span>
                            </strong></span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Video size={18} className="text-gray-400" />
                            <span>Instructor: <strong className="text-gray-900">{cls.instructor}</strong></span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                          <a
                            href={cls.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              markLiveAttendance(cls.id).catch(() => {
                                setAttendanceError('Attendance could not be recorded. Please inform your instructor.');
                                setTimeout(() => setAttendanceError(null), 6000);
                              });
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-colors ${cls.status === 'starting-soon' ? 'bg-[#f7941d] text-black hover:bg-[#d67e15]' : 'bg-black text-white hover:bg-gray-800'}`}
                          >
                            Join Class <ExternalLink size={18} />
                          </a>
                          <AddToCalendarButton title={cls.classTitle ? `${cls.title} — ${cls.classTitle}` : cls.title} classDate={cls.date} classTime={cls.rawTime} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Recent Recordings ── always visible ── */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-black rounded-full" />
                <h2 className="text-2xl font-bold text-gray-900">Recent Recordings</h2>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-10 flex flex-col items-center text-center gap-4">
                  <PlayCircle size={48} className="text-gray-300" />
                  <div>
                    <p className="text-base font-bold text-gray-700 mb-1">Watch All Class Replays</p>
                    <p className="text-sm text-gray-400">Access recordings of all your past live sessions.</p>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/replays')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors"
                  >
                    View Class Replays <ArrowRight size={16} />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-start gap-3 text-sm text-gray-500">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p>All class recordings are saved and available for you to rewatch at any time.</p>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">Digital World Tech Academy © 2026</p>
      </footer>
    </div>
  );
};

export default ClassLinksPage;
