'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function AlreadyAuthenticatedPage() {
  const router = useRouter();
  const { redirectToElectron } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Auto-redirect after a short delay
    const timer = setTimeout(() => {
      handleOpenApp();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenApp = () => {
    setIsRedirecting(true);
    try {
      const callbackUrl = process.env.NEXT_PUBLIC_ELECTRON_CALLBACK_URL || 'browsermanager://callback';
      const token = localStorage.getItem('auth_token');
      const redirectUrl = `${callbackUrl}?token=${token}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.warn('Electron redirect failed:', error);
      if (redirectToElectron) {
        redirectToElectron();
      }
    }
    
    // Reset state after a delay
    setTimeout(() => setIsRedirecting(false), 3000);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-card w-full max-w-md text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Already Authenticated
        </h1>
        <p className="text-gray-600 mb-6">
          {isRedirecting 
            ? 'Redirecting to desktop app...' 
            : "You're already logged in! Redirecting to desktop app..."
          }
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleOpenApp}
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
          
          <button
            onClick={handleGoToDashboard}
            className="btn-secondary w-full"
          >
            Go to Web Dashboard
          </button>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Tip:</strong> The desktop app should open automatically. If it doesn't, click "Open Desktop App" above.
          </p>
        </div>
      </div>
    </div>
  );
}