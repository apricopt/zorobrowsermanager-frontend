'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { 
  LogOut, 
  Settings, 
  User, 
  Monitor, 
  Home,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Profiles',
      href: '/dashboard/profiles',
      icon: Monitor,
      current: pathname === '/dashboard/profiles'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname === '/dashboard/settings'
    }
  ];

  const userMenuItems = [
    {
      name: 'Your Profile',
      href: '/dashboard/profile',
      icon: User
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="Zoro Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Zoro Browser Manager
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      item.current
                        ? 'border-primary-500 text-primary-500'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - Search, Notifications, User Menu */}
          <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-gray-700 text-sm font-medium">
                  {user?.name || user?.email || 'User'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            router.push(item.href);
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </button>
                      );
                    })}
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    item.current
                      ? 'bg-primary-50 border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
          
          {/* Mobile User Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.name || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}