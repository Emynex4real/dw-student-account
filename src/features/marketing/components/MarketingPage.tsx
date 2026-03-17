import React, { useState } from 'react';
import { 
  Home, ChevronRight, PlayCircle, CheckCircle, 
  MessageSquare, Award, ChevronDown, Send, User, 
  Clock, Share2, Bookmark
} from 'lucide-react';

// --- Structured Mock Data based on your text ---
const courseModules = [
  {
    title: "Introduction to Digital Marketing",
    lessons: [
      { id: 1, title: "Introduction to Selling", duration: "12:45", completed: false, active: true },
      { id: 2, title: "Target Market research", duration: "18:20", completed: false, active: false },
      { id: 3, title: "How to Sell to a Local Market", duration: "15:10", completed: false, active: false },
      { id: 4, title: "Sales Funnel & Psychology of Sales", duration: "22:05", completed: false, active: false },
    ]
  },
  {
    title: "Facebook Ads",
    lessons: [
      { id: 5, title: "How to Create a Facebook page", duration: "10:15", completed: false, active: false },
      { id: 6, title: "Creating A Business manager", duration: "14:30", completed: false, active: false },
      { id: 7, title: "Intro to Facebook ads", duration: "25:00", completed: false, active: false },
      { id: 8, title: "How to setup re-targeting ads", duration: "19:45", completed: false, active: false },
    ]
  },
  {
    title: "Google & SEO",
    lessons: [
      { id: 9, title: "Introduction to Google Apps", duration: "11:20", completed: false, active: false },
      { id: 10, title: "Understanding How SEO Works", duration: "30:15", completed: false, active: false },
      { id: 11, title: "Google Search Ad", duration: "28:40", completed: false, active: false },
    ]
  },
  {
    title: "WordPress",
    lessons: [
      { id: 12, title: "How to Install Wordpress", duration: "15:00", completed: false, active: false },
      { id: 13, title: "How to Buy a Domain Name", duration: "08:50", completed: false, active: false },
      { id: 14, title: "Building Landing Page", duration: "45:20", completed: false, active: false },
    ]
  }
];

const commentsData = [
  { id: 1, user: "Fred Chukwuemeka Ekpeti", date: "2026-01-16", text: "It was a very informative and engaging lecture. The concepts were explained clearly and were easy to relate to real-life applications. I am pleased to be a student here." },
  { id: 2, user: "Giveaway User", date: "2026-01-15", text: "I am really overwhelmed going through the courses" },
  { id: 3, user: "???????? ????? ???", date: "2025-12-23", text: "You are so wonderful, To be parts of this program is an opportunity . forward ever backward never ." },
  { id: 4, user: "Giveaway User", date: "2025-12-14", text: "I cannot download the courses. The Download button is not getting the courses for me. Please help me." },
];

const StudyCoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('comments');
  const [expandedModules, setExpandedModules] = useState<number[]>([0]); // First module open by default
  const [commentInput, setCommentInput] = useState('');

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      
      {/* ================= HEADER ================= */}
      <div className="bg-black text-white pt-6 pb-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs font-medium text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <a href="#" className="hover:text-[#f7941d] transition-colors">My Courses</a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#f7941d]">Study Digital Marketing</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Digital Marketing</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                  <PlayCircle size={14} className="text-[#f7941d]" />
                  Now watching: <strong className="text-white ml-1">Introduction to Selling</strong>
                </span>
              </div>
            </div>

            {/* Progress & Certificate Notice */}
            <div className="w-full md:w-72 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Course Progress</p>
                  <p className="text-lg font-bold text-white">0 / 153 <span className="text-sm font-normal text-gray-500">(0%)</span></p>
                </div>
                <Award size={24} className="text-gray-600" />
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
                <div className="bg-[#f7941d] h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                After completing all sections, you will be able to get a Certificate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Video & Tabs (Takes up 2/3 of space on desktop) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            
            {/* Video Player Placeholder */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg group border border-gray-200">
              {/* Fake Video Thumbnail/Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                <button className="h-20 w-20 bg-[#f7941d] rounded-full flex items-center justify-center text-white transform transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(247,148,29,0.4)]">
                  <PlayCircle size={40} className="ml-2" />
                </button>
              </div>
              {/* Fake Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                <PlayCircle size={24} className="cursor-pointer hover:text-[#f7941d]" />
                <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative">
                  <div className="absolute left-0 top-0 h-full w-1/4 bg-[#f7941d] rounded-full"></div>
                </div>
                <span className="text-xs font-medium">04:12 / 12:45</span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'overview' ? 'text-[#f7941d] border-b-2 border-[#f7941d]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  Lesson Overview
                </button>
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2 ${activeTab === 'comments' ? 'text-[#f7941d] border-b-2 border-[#f7941d]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <MessageSquare size={16} /> Comments (291)
                </button>
              </div>

              <div className="p-6">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-gray-900">Introduction to Selling</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      In this introductory lesson, we will cover the fundamental psychology behind why people buy. 
                      You will learn how to transition from simply "offering a service" to providing a solution that your target market actively seeks out.
                    </p>
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <Bookmark size={18} /> Save for later
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <Share2 size={18} /> Share Lesson
                      </button>
                    </div>
                  </div>
                )}

                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                  <div className="flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Add Comment Input */}
                    <div className="flex gap-4 mb-8">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-black text-[#f7941d] flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="flex-1 relative">
                        <textarea 
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Enter your comment here..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] resize-none h-20 transition-all"
                        ></textarea>
                        <button className="absolute right-3 bottom-3 p-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#d67e15] transition-colors">
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                      {commentsData.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
                            {comment.user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4">
                              <p className="text-sm text-gray-800 leading-relaxed">{comment.text}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 px-1">
                              <span className="text-xs font-semibold text-gray-900">{comment.user}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={12} /> {comment.date}
                              </span>
                              <button className="text-xs font-medium text-[#f7941d] hover:underline">Reply</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Course Syllabus (Sidebar) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6 max-h-[calc(100vh-2rem)] flex flex-col">
              
              <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Course Content</h3>
                <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                  153 Lessons
                </span>
              </div>

              <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                {courseModules.map((module, index) => {
                  const isExpanded = expandedModules.includes(index);
                  
                  return (
                    <div key={index} className="mb-2 border border-gray-100 rounded-xl overflow-hidden">
                      {/* Module Accordion Header */}
                      <button 
                        onClick={() => toggleModule(index)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isExpanded ? 'bg-[#f7941d]/5' : 'hover:bg-gray-50'}`}
                      >
                        <span className="font-semibold text-sm text-gray-900 pr-4 leading-tight">
                          {module.title}
                        </span>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#f7941d]' : ''}`} 
                        />
                      </button>

                      {/* Module Lessons (Expanded State) */}
                      {isExpanded && (
                        <div className="bg-white border-t border-gray-100">
                          {module.lessons.map(lesson => (
                            <button 
                              key={lesson.id}
                              className={`w-full flex items-start gap-3 p-3 text-left transition-colors group ${lesson.active ? 'bg-[#f7941d]/10 border-l-2 border-[#f7941d]' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : lesson.active ? (
                                  <PlayCircle size={16} className="text-[#f7941d]" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors"></div>
                                )}
                              </div>
                              <div>
                                <p className={`text-sm leading-tight mb-1 ${lesson.active ? 'font-bold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'}`}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock size={10} /> {lesson.duration}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Add a simple custom scrollbar style block for the lists */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
      `}} />
    </div>
  );
};

export default StudyCoursePage;