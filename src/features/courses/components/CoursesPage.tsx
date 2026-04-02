import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Home, ChevronRight, BookOpen, User,
  Clock, Star, BarChart3, Heart, Share2,
  PlayCircle, TrendingUp, Grid3X3, List, X,
  ChevronDown, SlidersHorizontal, CheckCircle
} from 'lucide-react';
import { useCourseStore } from '../../../store/courseStore';
import { getEnrolledCourses, type Course } from '../../../services/courses.service';

const AllCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Extract unique categories and levels
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(initialCourses.map(c => c.category)))],
    []
  );

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'progress', label: 'In Progress' },
  ];

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress_pct - a.progress_pct);
        break;
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [courses, searchQuery, activeCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  const formatPrice = (price: number) => `#${price.toLocaleString()}`;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  // ── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <div className="bg-black text-white py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="h-5 w-80 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load courses</h3>
          <p className="text-gray-500 mb-6">Could not connect to the server. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors"
          >
            <Loader2 size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* ── HEADER ── */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #f7941d 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <nav className="flex items-center text-sm text-gray-400 mb-6">
            <Link to="/dashboard" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Your Courses</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                My <span className="text-[#f7941d]">Courses</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Your enrolled courses. Pick up where you left off or start something new.
              </p>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">{courses.length}</div>
                <div className="text-sm text-gray-400">Enrolled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">
                  {courses.filter(c => c.progress_pct > 0).length}
                </div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#f7941d] opacity-10 blur-3xl"></div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">

              {/* Category Filter */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all whitespace-nowrap">
                  <span>{activeCategory === 'All' ? 'All Categories' : activeCategory}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                        activeCategory === cat ? 'text-[#f7941d] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all whitespace-nowrap">
                  <span>Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                        sortBy === option.value ? 'text-[#f7941d] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#f7941d]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#f7941d]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{Math.min(visibleCount, filteredCourses.length)}</span> of <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </p>
          {(searchQuery || activeCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#f7941d] hover:underline flex items-center gap-1"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {filteredCourses.length > 0 ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredCourses.slice(0, visibleCount).map((course: typeof initialCourses[0]) => {
              const discount = Math.round(((course.originalPrice - course.currentPrice) / course.originalPrice) * 100);
              const isWishlisted = wishlist.includes(course.id);

              if (viewMode === 'list') {
                return (
                  <div key={course.course_id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
                    <div className="relative sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0 bg-gray-200">
                      {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-[#f7941d] bg-[#f7941d]/10 px-2 py-1 rounded">{course.category}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#f7941d] transition-colors">{course.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <BarChart3 size={14} />
                            <span>{course.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{course.completed}/{course.total} lessons</span>
                          </div>
                        </div>

                        {course.progress_pct > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium text-[#f7941d]">{course.progress_pct}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#f7941d] rounded-full"
                                style={{ width: `${course.progress_pct}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 sm:min-w-[140px]">
                        <div className="text-right">
                          <p className="text-sm text-gray-400 line-through">{formatPrice(course.originalPrice)}</p>
                          <p className="text-xl font-bold text-gray-900">{formatPrice(course.currentPrice)}</p>
                        </div>
                        <button
                          onClick={() => showToast('Enrollment request submitted! Our team will contact you shortly.')}
                          className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-[#f7941d] hover:text-black transition-colors font-medium"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Grid View Card
              return (
                <div key={course.course_id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                        <BookOpen size={48} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {course.progress_pct > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {course.progress_pct}% COMPLETE
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => navigate('/dashboard/marketing')}
                        className="flex-1 bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-[#f7941d] transition-colors flex items-center justify-center gap-2"
                      >
                        <PlayCircle size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(window.location.origin + '/dashboard/courses'); showToast('Course link copied!'); }}
                        className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#f7941d] uppercase tracking-wider">{course.category}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {course.completed}/{course.total} lessons
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#f7941d] transition-colors leading-tight">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {getInitials(course.teacher)}
                      </div>
                      <span className="text-sm text-gray-600">{course.teacher}</span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>

                    {course.progress_pct > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-[#f7941d]">{course.progress_pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#f7941d] to-[#f7941d]/80 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress_pct}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-end justify-between mb-3">
                        <span className="text-2xl font-black text-gray-900">{formatPrice(course.amount)}</span>
                      </div>
                      
                      <button
                        onClick={() =>
                          course.progress > 0
                            ? navigate('/dashboard/marketing')
                            : showToast('Enrollment request submitted! Our team will contact you shortly.')
                        }
                        className={`w-full font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                          course.progress > 0
                            ? 'bg-[#f7941d] text-black hover:bg-[#e8850a]'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {course.progress > 0 ? (
                          <><PlayCircle size={18} /> Continue Learning</>
                        ) : (
                          <><BookOpen size={18} /> Enroll Now</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any courses matching your criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7941d] text-black rounded-xl font-semibold hover:bg-[#e8850a] transition-colors"
            >
              <X size={18} />
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredCourses.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#f7941d] hover:text-[#f7941d] transition-all"
            >
              Load More Courses
              <ChevronDown size={18} />
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Digital World Tech Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#f7941d] transition-colors">Help Center</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#f7941d] transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#f7941d] transition-colors">Privacy Policy</a>
          </div>
        </div>
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

export default AllCoursesPage;
