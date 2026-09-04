import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Home, ChevronRight, Calendar, MapPin,
  Users, Search, Filter, Loader2, AlertTriangle, CalendarPlus,
} from 'lucide-react';
import { getEvents, getEventImageUrl, type Event } from '../../../services/events.service';

const STATUS_STYLES = {
  happening: 'bg-green-100 text-green-700 border-green-200',
  upcoming:  'bg-blue-50 text-blue-600 border-blue-100',
  expired:   'bg-gray-100 text-gray-500 border-gray-200',
} as const;

function parseDateBadge(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: '—', day: '—' };
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
  };
}

// Formats a Date to ICS/Google Calendar date string: YYYYMMDDTHHMMSSZ
function toCalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.date + 'T10:00:00');
  const end   = new Date(event.date + 'T12:00:00');
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     event.name,
    dates:    `${toCalDate(start)}/${toCalDate(end)}`,
    details:  event.description,
    location: event.address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(event: Event): void {
  const start = new Date(event.date + 'T10:00:00');
  const end   = new Date(event.date + 'T12:00:00');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Digital World Tech Academy//EN',
    'BEGIN:VEVENT',
    `UID:event-${event.id}@digitalworldtech.academy`,
    `DTSTAMP:${toCalDate(new Date())}`,
    `DTSTART:${toCalDate(start)}`,
    `DTEND:${toCalDate(end)}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${event.name.replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

const AddToCalendarButton: React.FC<{ event: Event }> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Add to calendar"
        className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-[#f7941d] hover:text-[#f7941d] transition-colors flex items-center justify-center"
      >
        <CalendarPlus size={18} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" alt="Google" className="w-5 h-5 object-contain" />
            Google Calendar
          </a>
          <button
            onClick={() => { downloadIcs(event); setOpen(false); }}
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

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { month, day } = parseDateBadge(event.date);
  const imgUrl = getEventImageUrl(event.image);
  const statusStyle = STATUS_STYLES[event.status_label] ?? STATUS_STYLES.expired;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">

      {/* Left: Image & Date Badge */}
      <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-gray-100 shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={48} className="text-gray-300" />
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white rounded-xl overflow-hidden shadow-lg text-center w-16 border border-gray-100">
          <div className="bg-[#f7941d] text-black text-[10px] font-black py-1 uppercase tracking-wider">{month}</div>
          <div className="text-2xl font-black text-gray-900 py-1.5">{day}</div>
        </div>
      </div>

      {/* Right: Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <span className="text-xs font-bold text-[#f7941d] uppercase tracking-wider bg-[#f7941d]/10 px-2 py-1 rounded-md">
            {event.category}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded-md border capitalize ${statusStyle}`}>
            {event.status_label}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#f7941d] transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mt-auto pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <span>{event.date}</span>
          </div>
          {event.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span>{event.address}</span>
            </div>
          )}
          {event.capacity > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-gray-400 shrink-0" />
              <span>Capacity: {event.capacity}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          {event.host && (
            <p className="text-xs text-gray-500">
              Hosted by <span className="font-bold text-gray-700">{event.host}</span>
            </p>
          )}
          <div className="ml-auto">
            <AddToCalendarButton event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: events = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 0,
    refetchOnMount: true,
  });

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  const filtered = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || e.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ── HEADER ── */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">All Events</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Academy <span className="text-[#f7941d]">Events</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Register for upcoming workshops, networking sessions, and career fairs to accelerate your tech journey.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="text-[#f7941d] animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Failed to load events.</p>
            <button onClick={() => refetch()} className="px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors">
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-[#f7941d]/10 rounded-full flex items-center justify-center mb-6">
              <Calendar size={48} className="text-[#f7941d]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We are currently planning our next batch of workshops and meetups. Keep an eye on your dashboard for upcoming announcements!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Home size={18} /> Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={16} className="text-gray-500 shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === cat
                        ? 'bg-black text-[#f7941d] shadow-md'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#f7941d] hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No events match your search.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">Digital World Tech Academy © 2026</p>
      </footer>
    </div>
  );
};

export default EventsPage;
