'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/register');
    }
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Zoro Browser Manager</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/downloads"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              Downloads
            </Link>
            <button 
              onClick={handleSignIn}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={handleGetStarted}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}