'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User, Monitor, Plus, ExternalLink } from 'lucide-react';
import DashboardNavbar from '../../components/DashboardNavbar';

export default function DashboardPage() {
  const { user, logout, redirectToElectron } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleOpenElectronApp = () => {
    setIsRedirecting(true);
    if (redirectToElectron) {
      redirectToElectron();
    }
    
    // Reset state after a delay
    setTimeout(() => setIsRedirecting(false), 3000);
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-600">
            Manage your browser profiles and automation settings from here.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Open Desktop App */}
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Desktop App
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Launch the full desktop application to manage your browser profiles
            </p>
            <button
              onClick={handleOpenElectronApp}
              disabled={isRedirecting}
              className="btn-primary w-full"
            >
              {isRedirecting ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Opening App...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Desktop App
                </>
              )}
            </button>
          </div>

          {/* Profile Management */}
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Browser Profiles
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create and manage your browser profiles with custom settings
            </p>
            <button className="btn-secondary w-full">
              <Plus className="w-4 h-4 mr-2" />
              Manage Profiles
            </button>
          </div>

          {/* Settings */}
          <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                Account Settings
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your account preferences and security settings
            </p>
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="btn-secondary w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Open Settings
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{user?.name || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{user?.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Type</dt>
              <dd className="text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Login Method</dt>
              <dd className="text-sm text-gray-900">
                {user?.provider || 'Email & Password'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Instructions */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                Desktop Application Required
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                To create and manage browser profiles, use the desktop application. 
                Click "Open Desktop App" above to launch it with your authenticated session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}