import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, ChevronRight, Calendar, Clock, MapPin,
  Users, Search, Filter, CalendarPlus,
  Crown, Ticket, CheckCircle
} from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    title: "Annual Tech Career Fair 2026",
    category: "Career",
    date: "Mar 28, 2026",
    month: "MAR",
    day: "28",
    time: "10:00 AM - 04:00 PM (WAT)",
    location: "Virtual / Google Meet",
    type: "Virtual",
    attendees: 145,
    description: "Connect with top tech recruiters and get your portfolio reviewed by industry experts.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    status: "Upcoming",
    icsDate: "20260328T100000Z",
    icsEnd: "20260328T160000Z",
  },
  {
    id: 2,
    title: "Frontend Architecture Workshop",
    category: "Workshop",
    date: "Apr 05, 2026",
    month: "APR",
    day: "05",
    time: "02:00 PM - 05:00 PM (WAT)",
    location: "Virtual / Zoom",
    type: "Virtual",
    attendees: 82,
    description: "Deep dive into building scalable web applications using React and Next.js.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    status: "Upcoming",
    icsDate: "20260405T140000Z",
    icsEnd: "20260405T170000Z",
  },
  {
    id: 3,
    title: "Lagos Tech Innovators Meetup",
    category: "Networking",
    date: "Apr 15, 2026",
    month: "APR",
    day: "15",
    time: "11:00 AM - 02:00 PM (WAT)",
    location: "Lagos, Nigeria",
    type: "In-Person",
    attendees: 210,
    description: "Join fellow students and alumni for an afternoon of networking, tech talks, and collaboration.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop",
    status: "Upcoming",
    icsDate: "20260415T110000Z",
    icsEnd: "20260415T140000Z",
  }
];

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasEvents, setHasEvents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const filters = ['All', 'Workshop', 'Career', 'Networking'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRsvp = (eventId: number, eventTitle: string) => {
    setRsvpedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
        showToast(`RSVP cancelled for "${eventTitle}"`);
      } else {
        next.add(eventId);
        showToast(`You're registered for "${eventTitle}"!`);
      }
      return next;
    });
  };

  const handleAddToCalendar = (event: typeof mockEvents[0]) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital World Tech Academy//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DTSTART:${event.icsDate}`,
      `DTEND:${event.icsEnd}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Calendar event downloaded!');
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || event.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <Link to="/dashboard" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">All Events</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Academy <span className="text-[#f7941d]">Events</span>
                </h1>
                <span className="hidden sm:flex items-center gap-1 bg-[#f7941d]/20 border border-[#f7941d]/50 text-[#f7941d] text-xs font-bold px-2.5 py-1 rounded-full">
                  <Crown size={14} /> Pro Student
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Register for upcoming workshops, networking sessions, and career fairs to accelerate your tech journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Dev toggle */}
        <div className="mb-8 flex justify-end">
          <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span>Show Empty State</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={hasEvents}
                onChange={() => setHasEvents(!hasEvents)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${hasEvents ? 'bg-[#f7941d]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasEvents ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span>Show Filled State</span>
          </label>
        </div>

        {!hasEvents ? (
          /* --- EMPTY STATE --- */
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
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
            >
              <Home size={18} />
              Return to Dashboard
            </button>
          </div>
        ) : (
          /* --- FILLED STATE --- */
          <div className="space-y-8">

            {/* Search and Filter Bar */}
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
                      activeFilter === filter
                        ? 'bg-black text-[#f7941d] shadow-md'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#f7941d] hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => {
                const isRsvped = rsvpedEvents.has(event.id);
                return (
                  <div key={event.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">

                    {/* Image & Date Badge */}
                    <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-gray-200 shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white rounded-xl overflow-hidden shadow-lg text-center w-16 border border-gray-100">
                        <div className="bg-[#f7941d] text-black text-[10px] font-black py-1 uppercase tracking-wider">
                          {event.month}
                        </div>
                        <div className="text-2xl font-black text-gray-900 py-1.5">
                          {event.day}
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-[#f7941d] uppercase tracking-wider bg-[#f7941d]/10 px-2 py-1 rounded-md">
                          {event.category}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${event.type === 'Virtual' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {event.type}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#f7941d] transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4 mt-auto pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-gray-400" />
                          <span>{isRsvped ? event.attendees + 1 : event.attendees} Attending</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                          onClick={() => handleRsvp(event.id, event.title)}
                          className={`flex-1 font-medium py-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm ${
                            isRsvped
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-black text-white hover:bg-[#f7941d] hover:text-black'
                          }`}
                        >
                          {isRsvped ? (
                            <><CheckCircle size={16} /> Registered</>
                          ) : (
                            <><Ticket size={16} /> RSVP Now</>
                          )}
                        </button>
                        <button
                          onClick={() => handleAddToCalendar(event)}
                          title="Add to Calendar"
                          className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-[#f7941d] hover:text-[#f7941d] transition-colors flex items-center justify-center"
                        >
                          <CalendarPlus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">Digital World Tech Academy © 2026</p>
      </footer>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle size={18} className="text-[#f7941d]" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
