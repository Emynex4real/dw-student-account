import React from 'react';
import { useAuthStore } from '../../../store/authStore';

const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Profile</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
              <div className="text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100">{user.firstName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
              <div className="text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100">{user.lastName}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100">{user.email}</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading profile information...</p>
      )}
    </div>
  );
};

export default ProfilePage;
