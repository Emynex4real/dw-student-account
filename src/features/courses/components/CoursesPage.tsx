import React, { useState } from 'react';
import { Search, Filter, Home, ChevronRight, BookOpen, User, Tag } from 'lucide-react';

// --- Mock Data ---
// Expanded slightly to demonstrate the search and filter functionality
const initialCourses = [
  {
    id: 1,
    title: 'Digital Marketing',
    teacher: 'lex olowo',
    category: 'Marketing',
    currentPrice: 170000,
    originalPrice: 200000,
    description: 'This is a course on digital marketing.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Advanced Web Development',
    teacher: 'Michael B.',
    category: 'Programming',
    currentPrice: 150000,
    originalPrice: 180000,
    description: 'Master modern frontend technologies and frameworks.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    teacher: 'Sarah J.',
    category: 'Design',
    currentPrice: 120000,
    originalPrice: 150000,
    description: 'Learn to design intuitive and beautiful user interfaces.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop'
  }
];

const AllCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories for the filter buttons
  const categories = ['All', ...Array.from(new Set(initialCourses.map(c => c.category)))];

  // Filter logic based on search input and selected category
  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function to format currency
  const formatPrice = (price: number) => {
    return `#${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-[#f7941d] transition-colors flex items-center gap-1">
              <Home size={14} />
              Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">Your Courses</span>
          </nav>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore <span className="text-[#f7941d]">Courses</span>
          </h1>
          <p className="mt-2 text-gray-400 max-w-2xl">
            Discover our industry-leading programs and take the next step in your tech career.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f7941d]/50 focus:border-[#f7941d] transition-all shadow-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-500 mr-2">
              <Filter size={16} />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-black text-[#f7941d] shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#f7941d] hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              // Calculate discount percentage
              const discount = Math.round(((course.originalPrice - course.currentPrice) / course.originalPrice) * 100);

              return (
                <div key={course.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  
                  {/* Card Image Header */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Tag size={12} className="text-[#f7941d]" />
                      {course.category}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    
                    {/* Title & Teacher */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#f7941d] transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <User size={16} />
                      <span>Teacher: <span className="font-medium text-gray-900">{course.teacher}</span></span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                      {course.description}
                    </p>

                    {/* Pricing & CTA */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400 line-through decoration-gray-300 mb-1">
                            {formatPrice(course.originalPrice)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-gray-900">
                              {formatPrice(course.currentPrice)}
                            </span>
                            {discount > 0 && (
                              <span className="bg-[#f7941d]/10 text-[#f7941d] text-xs font-bold px-2 py-1 rounded-md">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-[#f7941d] hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
                        <BookOpen size={18} />
                        View Course Details
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-4 text-[#f7941d] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center">
        <p className="text-sm text-gray-500 font-medium">
          Digital World Tech Academy © 2026
        </p>
      </footer>

    </div>
  );
};

export default AllCoursesPage;