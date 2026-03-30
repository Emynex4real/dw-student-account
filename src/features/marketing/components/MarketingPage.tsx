import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, ChevronRight, PlayCircle, CheckCircle,
  MessageSquare, Award, ChevronDown, Send, User,
  Clock, Share2, Bookmark, PauseCircle
} from 'lucide-react';

const initialModules = [
  {
    title: "Introduction to Digital Marketing",
    lessons: [
      { id: 1, title: "Introduction to Selling", duration: "12:45" },
      { id: 2, title: "Target Market Research", duration: "18:20" },
      { id: 3, title: "How to Sell to a Local Market", duration: "15:10" },
      { id: 4, title: "Sales Funnel & Psychology of Sales", duration: "22:05" },
    ]
  },
  {
    title: "Facebook Ads",
    lessons: [
      { id: 5, title: "How to Create a Facebook Page", duration: "10:15" },
      { id: 6, title: "Creating A Business Manager", duration: "14:30" },
      { id: 7, title: "Intro to Facebook Ads", duration: "25:00" },
      { id: 8, title: "How to Setup Re-targeting Ads", duration: "19:45" },
    ]
  },
  {
    title: "Google & SEO",
    lessons: [
      { id: 9, title: "Introduction to Google Apps", duration: "11:20" },
      { id: 10, title: "Understanding How SEO Works", duration: "30:15" },
      { id: 11, title: "Google Search Ad", duration: "28:40" },
    ]
  },
  {
    title: "WordPress",
    lessons: [
      { id: 12, title: "How to Install WordPress", duration: "15:00" },
      { id: 13, title: "How to Buy a Domain Name", duration: "08:50" },
      { id: 14, title: "Building Landing Page", duration: "45:20" },
    ]
  }
];

const initialComments = [
  { id: 1, user: "Fred Chukwuemeka Ekpeti", date: "2026-01-16", text: "It was a very informative and engaging lecture. The concepts were explained clearly and were easy to relate to real-life applications. I am pleased to be a student here." },
  { id: 2, user: "Giveaway User", date: "2026-01-15", text: "I am really overwhelmed going through the courses" },
  { id: 3, user: "???????? ????? ???", date: "2025-12-23", text: "You are so wonderful, To be parts of this program is an opportunity. Forward ever backward never." },
  { id: 4, user: "Giveaway User", date: "2025-12-14", text: "I cannot download the courses. The Download button is not getting the courses for me. Please help me." },
];

const totalLessons = initialModules.reduce((sum, m) => sum + m.lessons.length, 0);

const StudyCoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('comments');
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleModule = (index: number) => {
    setExpandedModules(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleLessonClick = (lessonId: number) => {
    // Mark previous lesson as completed when switching
    setCompletedLessons(prev => new Set([...prev, activeLessonId]));
    setActiveLessonId(lessonId);
    setIsPlaying(false);
  };

  const activeLesson = initialModules
    .flatMap(m => m.lessons)
    .find(l => l.id === activeLessonId);

  const completedCount = completedLessons.size;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    setComments(prev => [{
      id: Date.now(),
      user: "Michael Balogun",
      date: new Date().toISOString().split('T')[0],
      text: commentInput.trim()
    }, ...prev]);
    setCommentInput('');
  };

  const handleSendReply = (parentId: number) => {
    if (!replyInput.trim()) return;
    setComments(prev => [{
      id: Date.now(),
      user: "Michael Balogun",
      date: new Date().toISOString().split('T')[0],
      text: `↩ Replying to comment: ${replyInput.trim()}`
    }, ...prev]);
    setReplyInput('');
    setReplyingTo(null);
  };

  const handleShareLesson = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Lesson link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">

      {/* ================= HEADER ================= */}
      <div className="bg-black text-white pt-6 pb-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-xs font-medium text-gray-400 mb-4">
            <Link to="/dashboard" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/dashboard/courses" className="hover:text-[#f7941d] transition-colors">My Courses</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#f7941d]">Study Digital Marketing</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Digital Marketing</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                  <PlayCircle size={14} className="text-[#f7941d]" />
                  Now watching: <strong className="text-white ml-1">{activeLesson?.title ?? 'Select a lesson'}</strong>
                </span>
              </div>
            </div>

            {/* Progress & Certificate */}
            <div className="w-full md:w-72 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Course Progress</p>
                  <p className="text-lg font-bold text-white">
                    {completedCount} / {totalLessons} <span className="text-sm font-normal text-gray-500">({progressPct}%)</span>
                  </p>
                </div>
                <Award size={24} className={completedCount > 0 ? 'text-[#f7941d]' : 'text-gray-600'} />
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
                <div className="bg-[#f7941d] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
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

          {/* LEFT COLUMN: Video & Tabs */}
          <div className="lg:w-2/3 flex flex-col gap-6">

            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg group border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-20 w-20 bg-[#f7941d] rounded-full flex items-center justify-center text-white transform transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(247,148,29,0.4)]"
                >
                  {isPlaying
                    ? <PauseCircle size={40} />
                    : <PlayCircle size={40} className="ml-2" />
                  }
                </button>
              </div>
              {/* Video Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying
                    ? <PauseCircle size={24} className="hover:text-[#f7941d]" />
                    : <PlayCircle size={24} className="hover:text-[#f7941d]" />
                  }
                </button>
                <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative">
                  <div className="absolute left-0 top-0 h-full w-1/4 bg-[#f7941d] rounded-full"></div>
                </div>
                <span className="text-xs font-medium">04:12 / {activeLesson?.duration ?? '00:00'}</span>
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
                  <MessageSquare size={16} /> Comments ({comments.length})
                </button>
              </div>

              <div className="p-6">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-gray-900">{activeLesson?.title ?? 'Select a lesson'}</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      In this lesson, we will cover fundamental concepts and practical techniques you can apply immediately.
                      Each section builds on the previous one to give you a solid foundation in digital marketing strategy.
                    </p>
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => { setIsSaved(!isSaved); showToast(isSaved ? 'Removed from saved lessons.' : 'Lesson saved for later!'); }}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isSaved ? 'text-[#f7941d]' : 'text-gray-600 hover:text-black'}`}
                      >
                        <Bookmark size={18} className={isSaved ? 'fill-[#f7941d]' : ''} />
                        {isSaved ? 'Saved' : 'Save for later'}
                      </button>
                      <button
                        onClick={handleShareLesson}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                      >
                        <Share2 size={18} /> Share Lesson
                      </button>
                    </div>
                  </div>
                )}

                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                  <div className="flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Add Comment */}
                    <div className="flex gap-4 mb-8">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-black text-[#f7941d] flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
                          placeholder="Enter your comment here..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] resize-none h-20 transition-all"
                        ></textarea>
                        <button
                          onClick={handleSendComment}
                          className="absolute right-3 bottom-3 p-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#d67e15] transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                      {comments.map(comment => (
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
                              <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="text-xs font-medium text-[#f7941d] hover:underline"
                              >
                                Reply
                              </button>
                            </div>

                            {/* Inline reply input */}
                            {replyingTo === comment.id && (
                              <div className="mt-3 flex gap-2 pl-2">
                                <input
                                  type="text"
                                  value={replyInput}
                                  onChange={e => setReplyInput(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') handleSendReply(comment.id); }}
                                  placeholder="Write a reply..."
                                  autoFocus
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d]"
                                />
                                <button
                                  onClick={() => handleSendReply(comment.id)}
                                  className="p-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#d67e15] transition-colors"
                                >
                                  <Send size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Course Syllabus */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6 max-h-[calc(100vh-2rem)] flex flex-col">

              <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Course Content</h3>
                <span className="text-xs font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                  {totalLessons} Lessons
                </span>
              </div>

              <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                {initialModules.map((module, index) => {
                  const isExpanded = expandedModules.includes(index);

                  return (
                    <div key={index} className="mb-2 border border-gray-100 rounded-xl overflow-hidden">
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

                      {isExpanded && (
                        <div className="bg-white border-t border-gray-100">
                          {module.lessons.map(lesson => {
                            const isActive = lesson.id === activeLessonId;
                            const isCompleted = completedLessons.has(lesson.id);
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson.id)}
                                className={`w-full flex items-start gap-3 p-3 text-left transition-colors group ${isActive ? 'bg-[#f7941d]/10 border-l-2 border-[#f7941d]' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle size={16} className="text-green-500" />
                                  ) : isActive ? (
                                    <PlayCircle size={16} className="text-[#f7941d]" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors"></div>
                                  )}
                                </div>
                                <div>
                                  <p className={`text-sm leading-tight mb-1 ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'}`}>
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={10} /> {lesson.duration}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
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

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
      `}} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle size={18} className="text-[#f7941d]" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      )}
    </div>
  );
};

export default StudyCoursePage;
