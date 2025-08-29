'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🏠 Dashboard layout mounted/updated - Auth state:', { isLoading, isAuthenticated });
    
    if (!isLoading && !isAuthenticated) {
      console.log('❌ Dashboard: User not authenticated, redirecting to login');
      router.push('/auth/login');
    } else if (!isLoading && isAuthenticated) {
      console.log('✅ Dashboard: User authenticated, showing dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    console.log('🏠 Dashboard layout component mounted');
    return () => {
      console.log('🏠 Dashboard layout component unmounted');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return children;
}