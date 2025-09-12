'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
          setMessage('Authentication successful! Redirecting to dashboard...');
          
          // Redirect to dashboard for web users (default behavior)
          setTimeout(() => {
            router.push('/dashboard');
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="auth-card w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h1>
          <p className="text-gray-600">Preparing authentication...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}