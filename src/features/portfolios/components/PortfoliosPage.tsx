import React, { useState } from 'react';
import { 
  Home, ChevronRight, Briefcase, Plus, 
  ExternalLink, Github, LayoutTemplate, 
  CheckCircle, Clock, X
} from 'lucide-react';

// --- Mock Data ---
// Seeded with some relevant tech projects to show how the filled state will look
const mockPortfolios = [
  {
    id: 1,
    title: "InnovaTeam EdTech Platform",
    course: "Advanced Frontend Development",
    description: "An AI-powered educational platform designed for students preparing for JAMB and WAEC exams.",
    techStack: ["React", "Next.js", "TypeScript"],
    status: "Approved",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "BoosterSphere Dashboard",
    course: "Digital Marketing Mastery",
    description: "A comprehensive digital marketing and social media management interface.",
    techStack: ["React", "Tailwind CSS"],
    status: "Pending Review",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Midas Coin (MDC) Interface",
    course: "Web3 & DeFi Development",
    description: "A decentralized finance website interface for token management.",
    techStack: ["React", "TypeScript", "Web3"],
    status: "Approved",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec051?q=80&w=600&auto=format&fit=crop"
  }
];

const MyPortfoliosPage: React.FC = () => {
  // Toggle this to true to see the populated state!
  const [hasPortfolios, setHasPortfolios] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <span className="text-white">My Portfolios</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                My <span className="text-[#f7941d]">Portfolios</span>
              </h1>
              <p className="mt-2 text-gray-400 text-sm max-w-xl">
                Showcase your skills to the world. Projects uploaded here will appear on the Digital World Tech Academy website after admin approval.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f7941d] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#d67e15] transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#f7941d]/20"
            >
              <Plus size={20} />
              Add New Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Toggle switch just for development demonstration */}
        <div className="mb-8 flex justify-end">
          <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span>Show Empty State</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={hasPortfolios}
                onChange={() => setHasPortfolios(!hasPortfolios)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${hasPortfolios ? 'bg-[#f7941d]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hasPortfolios ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span>Show Filled State</span>
          </label>
        </div>

        {!hasPortfolios ? (
          /* --- EMPTY STATE UI --- */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-[#f7941d]/10 rounded-full flex items-center justify-center mb-6">
              <LayoutTemplate size={48} className="text-[#f7941d]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You do not have any portfolio yet.</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              It's not enough to learn the skills—you need to show them off! Start building your professional presence by uploading your first course project.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Your First Portfolio
            </button>
          </div>
        ) : (
          /* --- FILLED STATE UI --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                
                {/* Image & Status Badge */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={portfolio.image} 
                    alt={portfolio.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    {portfolio.status === 'Approved' ? (
                      <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs font-bold tracking-wider text-[#f7941d] uppercase mb-1">
                    {portfolio.course}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#f7941d] transition-colors">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-2">
                    {portfolio.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {portfolio.techStack.map(tech => (
                      <span key={tech} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100">
                      <Github size={20} />
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-black hover:text-[#f7941d] transition-colors">
                      View Live <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ================= ADD PORTFOLIO MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Portfolio</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input type="text" placeholder="e.g. E-commerce Dashboard" className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Course</label>
                <select className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent appearance-none bg-white">
                  <option>Select a course...</option>
                  <option>Advanced Web Development</option>
                  <option>Digital Marketing</option>
                  <option>UI/UX Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (Live or GitHub)</label>
                <input type="url" placeholder="https://" className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold bg-[#f7941d] text-black hover:bg-[#d67e15] rounded-xl transition-colors shadow-md"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-sm text-gray-500 font-medium">
          Digital World Tech Academy © 2026
        </p>
      </footer>

    </div>
  );
};

export default MyPortfoliosPage;