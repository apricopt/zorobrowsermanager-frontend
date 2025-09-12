'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

function AuthenticatedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { redirectToElectron } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Store token if provided in URL (from OAuth callback)
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_timestamp', Date.now().toString());
    }

    // Auto-redirect after a short delay
    const timer = setTimeout(() => {
      handleOpenApp();
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams]);

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
          Authentication Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          {isRedirecting 
            ? 'Redirecting to desktop app...' 
            : "Opening your Zoro Browser Manager desktop app..."
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

export default function AlreadyAuthenticatedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="auth-card w-full max-w-md text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h1>
          <p className="text-gray-600">Preparing authentication...</p>
        </div>
      </div>
    }>
      <AuthenticatedContent />
    </Suspense>
  );
}