import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Home, ChevronRight, BookOpen, User,
  Clock, Star, BarChart3, Heart, Share2,
  PlayCircle, TrendingUp, Grid3X3, List, X,
  ChevronDown, SlidersHorizontal, CheckCircle
} from 'lucide-react';

// --- Enhanced Mock Data ---
const initialCourses = [
  {
    id: 1,
    title: 'Digital Marketing Mastery',
    teacher: 'Lex Olowo',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
    category: 'Marketing',
    level: 'Beginner',
    duration: '12 weeks',
    lessons: 48,
    students: 1234,
    rating: 4.8,
    reviews: 256,
    currentPrice: 170000,
    originalPrice: 200000,
    description: 'Master the art of digital marketing with proven strategies for SEO, social media, and content marketing. Build campaigns that convert.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
    tags: ['SEO', 'Social Media', 'Analytics'],
    isNew: true,
    isBestseller: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 2,
    title: 'Advanced Web Development Bootcamp',
    teacher: 'Michael Balogun',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    category: 'Programming',
    level: 'Advanced',
    duration: '16 weeks',
    lessons: 84,
    students: 3421,
    rating: 4.9,
    reviews: 892,
    currentPrice: 250000,
    originalPrice: 350000,
    description: 'Become a full-stack developer. Master React, Node.js, databases, and deployment with real-world projects and mentorship.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB'],
    isNew: false,
    isBestseller: true,
    progress: 35,
    lastAccessed: '2 days ago'
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    teacher: 'Sarah Johnson',
    teacherAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    category: 'Design',
    level: 'Intermediate',
    duration: '8 weeks',
    lessons: 32,
    students: 2156,
    rating: 4.7,
    reviews: 445,
    currentPrice: 120000,
    originalPrice: 150000,
    description: 'Learn to design intuitive interfaces and user experiences. From wireframing to high-fidelity prototypes using Figma.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
    tags: ['Figma', 'Prototyping', 'User Research'],
    isNew: false,
    isBestseller: true,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 4,
    title: 'Data Science & Machine Learning',
    teacher: 'Dr. Emmanuel Ade',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    category: 'Data Science',
    level: 'Advanced',
    duration: '20 weeks',
    lessons: 96,
    students: 987,
    rating: 4.9,
    reviews: 178,
    currentPrice: 300000,
    originalPrice: 400000,
    description: 'Dive deep into data analysis, visualization, and machine learning algorithms. Build predictive models with Python.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    tags: ['Python', 'ML', 'TensorFlow'],
    isNew: true,
    isBestseller: false,
    progress: 12,
    lastAccessed: '1 week ago'
  },
  {
    id: 5,
    title: 'Mobile App Development with Flutter',
    teacher: 'Chioma Nnamdi',
    teacherAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    category: 'Programming',
    level: 'Intermediate',
    duration: '10 weeks',
    lessons: 40,
    students: 1567,
    rating: 4.6,
    reviews: 234,
    currentPrice: 180000,
    originalPrice: 220000,
    description: 'Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart programming language.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
    tags: ['Flutter', 'Dart', 'Mobile'],
    isNew: false,
    isBestseller: false,
    progress: 0,
    lastAccessed: null
  },
  {
    id: 6,
    title: 'Cybersecurity Fundamentals',
    teacher: 'James Okonkwo',
    teacherAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
    category: 'Security',
    level: 'Beginner',
    duration: '6 weeks',
    lessons: 24,
    students: 2341,
    rating: 4.8,
    reviews: 567,
    currentPrice: 100000,
    originalPrice: 130000,
    description: 'Learn essential cybersecurity skills to protect systems and networks. Ethical hacking basics and security protocols.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
    tags: ['Security', 'Networking', 'Ethical Hacking'],
    isNew: false,
    isBestseller: true,
    progress: 0,
    lastAccessed: null
  }
];

const AllCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
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
  
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Enhanced filter logic
  const filteredCourses = useMemo(() => {
    const filtered = initialCourses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      const matchesLevel = activeLevel === 'All' || course.level === activeLevel;
      const matchesPrice = course.currentPrice >= priceRange[0] && course.currentPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        filtered.sort((a, b) => b.students - a.students);
    }

    return filtered;
  }, [searchQuery, activeCategory, activeLevel, sortBy, priceRange]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev: number[]) => 
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveLevel('All');
    setPriceRange([0, 500000]);
  };

  const formatPrice = (price: number) => `#${price.toLocaleString()}`;

  const activeFiltersCount = [
    activeCategory !== 'All',
    activeLevel !== 'All',
    searchQuery !== '',
    priceRange[0] > 0 || priceRange[1] < 500000
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* ================= ENHANCED HEADER & HERO ================= */}
      <div className="bg-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #f7941d 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
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
                Explore <span className="text-[#f7941d]">Courses</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Discover industry-leading programs designed to accelerate your tech career. 
                Learn from experts and join thousands of successful graduates.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">50+</div>
                <div className="text-sm text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">15k+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#f7941d]">4.8</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#f7941d] opacity-10 blur-3xl"></div>
      </div>

      {/* ================= STICKY FILTER BAR ================= */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search courses, teachers, or tags..." 
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
              {/* Filter Toggle Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#f7941d] text-black' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

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

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeCategory === category 
                          ? 'bg-black text-[#f7941d]' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Level</label>
                <div className="flex flex-wrap gap-2">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setActiveLevel(level)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeLevel === level 
                          ? 'bg-black text-[#f7941d]' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f7941d]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Free</span>
                  <span>₦500k</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f7941d]/10 text-[#f7941d] text-sm rounded-full">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('All')}><X size={14} /></button>
                </span>
              )}
              {activeLevel !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f7941d]/10 text-[#f7941d] text-sm rounded-full">
                  {activeLevel}
                  <button onClick={() => setActiveLevel('All')}><X size={14} /></button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 500000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f7941d]/10 text-[#f7941d] text-sm rounded-full">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <button onClick={() => setPriceRange([0, 500000])}><X size={14} /></button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{Math.min(visibleCount, filteredCourses.length)}</span> of <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Course Grid/List */}
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
                  <div key={course.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      {course.isNew && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                      )}
                      {course.isBestseller && (
                        <span className="absolute top-3 left-3 bg-[#f7941d] text-black text-xs font-bold px-2 py-1 rounded">BESTSELLER</span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-grow flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-[#f7941d] bg-[#f7941d]/10 px-2 py-1 rounded">{course.category}</span>
                          <span className="text-xs text-gray-500">{course.level}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#f7941d] transition-colors">{course.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-medium text-gray-900">{course.rating}</span>
                            <span>({course.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{course.students.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{course.duration}</span>
                          </div>
                        </div>
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
                <div key={course.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  
                  {/* Card Image Header */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {course.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          NEW
                        </span>
                      )}
                      {course.isBestseller && (
                        <span className="bg-[#f7941d] text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <TrendingUp size={12} />
                          BESTSELLER
                        </span>
                      )}
                      {course.progress > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {course.progress}% COMPLETE
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(course.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all hover:scale-110"
                    >
                      <Heart 
                        size={18} 
                        className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </button>

                    {/* Quick Actions on Hover */}
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

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    
                    {/* Meta Row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#f7941d] uppercase tracking-wider">{course.category}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <BarChart3 size={12} />
                        {course.level}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#f7941d] transition-colors leading-tight">
                      {course.title}
                    </h3>

                    {/* Teacher */}
                    <div className="flex items-center gap-2 mb-3">
                      <img src={course.teacherAvatar} alt={course.teacher} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-sm text-gray-600">{course.teacher}</span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{course.rating}</span>
                        <span className="text-xs">({course.reviews})</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 2 && (
                        <span className="text-xs text-gray-400 px-1">+{course.tags.length - 2}</span>
                      )}
                    </div>

                    {/* Progress Bar (if started) */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-[#f7941d]">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#f7941d] to-[#f7941d]/80 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last accessed {course.lastAccessed}</p>
                      </div>
                    )}

                    {/* Pricing & CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-400 line-through decoration-gray-300 mb-1">
                            {formatPrice(course.originalPrice)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-gray-900">
                              {formatPrice(course.currentPrice)}
                            </span>
                            {discount > 0 && (
                              <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-md">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </div>
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
          /* Empty State */
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

      {/* ================= FOOTER ================= */}
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
