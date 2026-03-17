import React from 'react';
import { 
  BookOpen, Briefcase, User, 
  ChevronRight, ShieldCheck, GraduationCap
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-black p-8 text-white shadow-md">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome <span className="text-[#f7941d]">Michael Balogun</span>
                </h2>
                <p className="text-gray-400">You have successfully logged In.</p>
              </div>
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-[#f7941d] opacity-20 blur-3xl pointer-events-none"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Courses Card */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#f7941d]/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-[#f7941d]/10 text-[#f7941d]">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">My Courses</h3>
                <a href="#" className="mt-2 inline-flex items-center text-sm font-medium text-[#f7941d] hover:text-[#d67e15]">
                  See all your Courses <ChevronRight size={16} className="ml-1" />
                </a>
              </div>

              {/* Profile Card */}
              <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#f7941d]/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-[#f7941d] transition-colors">
                    <User size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">My Profile</h3>
                <a href="#" className="mt-2 inline-flex items-center text-sm font-medium text-gray-600 hover:text-black">
                  Edit your Profile <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Portfolio */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7941d]/10 text-[#f7941d]">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Showcase your skills to the World</h3>
                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  It's not enough to learn the skills but to showcase it to the world! Create a portfolio for each of your courses and they will appear on Digital World Tech Academy Website.
                </p>
                <div className="mt-6 rounded-lg bg-orange-50 border border-orange-100 p-3">
                  <p className="text-xs font-medium text-[#f7941d]">
                    * Portfolios only appear after approval from Digital World Admin!
                  </p>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-800">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure your Account</h3>
                <p className="text-sm text-gray-600 flex-1 leading-relaxed mb-6">
                  Change your password from the default password given on the receipt for your course to ensure your account remains safe.
                </p>
                <button className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                  Secure your account
                </button>
              </div>

              {/* Career */}
              <div className="rounded-2xl border border-[#f7941d] bg-[#f7941d] p-6 shadow-sm flex flex-col text-black">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#f7941d]">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Build your career in Tech</h3>
                <p className="text-sm font-medium opacity-90 flex-1 leading-relaxed">
                  Study and Finish your Courses. Digital World Tech academy IT career path training is created to help you choose a career in IT, get the required IT training and skills which prepare you for a well-paying job. Our IT career path specialist is always ready to guide you.
                </p>
              </div>

            </div>

          </div>
    </div>
  );
};

export default DashboardPage;