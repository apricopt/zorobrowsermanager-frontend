'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { redirectToElectron } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, redirecting, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (token) {
          // Store the token
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_timestamp', Date.now().toString());
          
          setStatus('success');
          setMessage('Authentication successful! Opening Browser Manager...');
          
          // Automatically redirect to desktop app
          setTimeout(() => {
            try {
              const callbackUrl = process.env.NEXT_PUBLIC_ELECTRON_CALLBACK_URL || 'browsermanager://callback';
              const redirectUrl = `${callbackUrl}?token=${token}`;
              window.location.href = redirectUrl;
              
              setStatus('redirecting');
              setMessage('Redirecting to desktop app...');
            } catch (error) {
              console.warn('Electron redirect failed:', error);
              // Fallback to dashboard
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            }
          }, 1500);
        } else {
          setStatus('error');
          setMessage('No authentication token received');
        }
      } catch (error) {
        setStatus('error');
        setMessage(`Authentication error: ${error.message}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const handleManualRedirect = () => {
    const token = searchParams.get('token');
    if (token) {
      redirectToElectron();
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-card w-full max-w-md text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Authentication
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Opening Desktop App
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> If the desktop app doesn't open automatically, please check if it's installed and try again.
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="btn-secondary w-full"
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}