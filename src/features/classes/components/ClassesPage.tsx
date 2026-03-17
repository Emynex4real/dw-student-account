import React, { useState } from 'react';
import { 
  Home, ChevronRight, Video, Calendar, Clock, 
  Copy, ExternalLink, CheckCircle, PlayCircle, 
  Crown, AlertCircle 
} from 'lucide-react';

// --- Mock Data ---
const mockActiveClasses = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals - Cohort 4",
    instructor: "Michael B.",
    date: "Today",
    time: "04:00 PM (WAT)",
    platform: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    type: "live",
    status: "starting-soon"
  },
  {
    id: 2,
    title: "Advanced React & Next.js Architecture",
    instructor: "Sarah J.",
    date: "Tomorrow",
    time: "10:00 AM (WAT)",
    platform: "Zoom",
    link: "https://zoom.us/j/123456789",
    type: "live",
    status: "upcoming"
  }
];

const mockPastRecordings = [
  {
    id: 3,
    title: "Introduction to Web Accessibility",
    date: "March 15, 2026",
    duration: "1h 45m",
    link: "#",
    type: "recorded"
  }
];

const ClassLinksPage: React.FC = () => {
  // Toggle this to true to see the populated state!
  const [hasClasses, setHasClasses] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyLink = (id: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <a href="#" className="hover:text-[#f7941d] transition-colors">Courses</a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Class Links</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your <span className="text-[#f7941d]">Class Links</span>
                </h1>
                {/* Pro Account Badge */}
                <span className="hidden sm:flex items-center gap-1 bg-[#f7941d]/20 border border-[#f7941d]/50 text-[#f7941d] text-xs font-bold px-2.5 py-1 rounded-full">
                  <Crown size={14} /> Pro Student
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Access your upcoming live sessions and recent class recordings all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Toggle switch for development demonstration */}
        <div className="mb-8 flex justify-end">
          <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span>Show Empty State</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={hasClasses}
                onChange={() => setHasClasses(!hasClasses)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${hasClasses ? 'bg-[#f7941d]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasClasses ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span>Show Filled State</span>
          </label>
        </div>

        {!hasClasses ? (
          /* --- EMPTY STATE UI --- */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Video size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You don’t have any active class links yet.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Once you enroll in a course with live instructor sessions, your meeting links and recordings will automatically appear here.
            </p>
            <button className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors duration-300">
              Browse Available Courses
            </button>
          </div>
        ) : (
          /* --- FILLED STATE UI --- */
          <div className="space-y-10">
            
            {/* Live Classes Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-[#f7941d] rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Live Classes</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockActiveClasses.map((cls) => (
                  <div key={cls.id} className={`bg-white rounded-2xl border ${cls.status === 'starting-soon' ? 'border-[#f7941d] shadow-md shadow-[#f7941d]/10' : 'border-gray-200 shadow-sm'} overflow-hidden flex flex-col`}>
                    
                    <div className={`p-4 flex justify-between items-center border-b ${cls.status === 'starting-soon' ? 'bg-[#f7941d]/10 border-[#f7941d]/20' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-2">
                        {cls.status === 'starting-soon' ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-[#f7941d] bg-white px-2.5 py-1 rounded-full shadow-sm">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7941d] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7941d]"></span>
                            </span>
                            Starting Soon
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
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{cls.title}</h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Calendar size={18} className="text-gray-400" />
                          <span>Date: <strong className="text-gray-900">{cls.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Clock size={18} className="text-gray-400" />
                          <span>Time: <strong className="text-gray-900">{cls.time}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Video size={18} className="text-gray-400" />
                          <span>Instructor: <strong className="text-gray-900">{cls.instructor}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button 
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-colors ${cls.status === 'starting-soon' ? 'bg-[#f7941d] text-black hover:bg-[#d67e15]' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                          Join Class <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => handleCopyLink(cls.id, cls.link)}
                          className="sm:w-32 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {copiedId === cls.id ? (
                            <><CheckCircle size={18} className="text-green-500" /> Copied</>
                          ) : (
                            <><Copy size={18} /> Copy Link</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Recordings Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-2 bg-black rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Recordings</h2>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {mockPastRecordings.map((recording) => (
                    <div key={recording.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                          <PlayCircle size={24} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">{recording.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {recording.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {recording.duration}</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-black hover:text-black transition-colors">
                        Watch Replay <PlayCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Notice for older recordings */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-start gap-3 text-sm text-gray-500">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p>Recordings are automatically deleted 30 days after the live session. Please ensure you download any materials you need before they expire.</p>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">
          Digital World Tech Academy © 2026
        </p>
      </footer>

    </div>
  );
};

export default ClassLinksPage;