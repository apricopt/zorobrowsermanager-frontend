'use client';

import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api-client';

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const testLogin = async () => {
    try {
      console.log('Testing login...');
      await login('raorehanweb@gmail.com', 'testpassword123');
    } catch (error) {
      console.error('Login test failed:', error);
    }
  };

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const health = await apiClient.healthCheck();
      console.log('Health check result:', health);
    } catch (error) {
      console.error('API connection test failed:', error);
    }
  };

  const testCurrentUser = async () => {
    try {
      console.log('Testing current user...');
      const user = await apiClient.getCurrentUser();
      console.log('Current user result:', user);
    } catch (error) {
      console.error('Current user test failed:', error);
    }
  };

  const checkLocalStorage = () => {
    console.log('=== LocalStorage Debug ===');
    console.log('auth_token:', localStorage.getItem('auth_token'));
    console.log('auth_timestamp:', localStorage.getItem('auth_timestamp'));
    console.log('Token age:', Date.now() - parseInt(localStorage.getItem('auth_timestamp') || '0'));
    console.log('API client token:', apiClient.getToken());
  };

  const forceNavigate = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-bold text-sm mb-2">Auth Debug Panel</h3>
      
      <div className="text-xs mb-2 space-y-1">
        <div>Loading: {isLoading.toString()}</div>
        <div>Authenticated: {isAuthenticated.toString()}</div>
        <div>User: {user?.email || 'null'}</div>
        <div>Token: {apiClient.getToken() ? 'Present' : 'None'}</div>
      </div>

      <div className="space-y-1">
        <button 
          onClick={testApiConnection}
          className="btn-secondary w-full text-xs py-1"
        >
          Test API Connection
        </button>
        <button 
          onClick={testLogin}
          className="btn-primary w-full text-xs py-1"
        >
          Test Login
        </button>
        <button 
          onClick={testCurrentUser}
          className="btn-secondary w-full text-xs py-1"
        >
          Test Current User
        </button>
        <button 
          onClick={checkLocalStorage}
          className="btn-secondary w-full text-xs py-1"
        >
          Check LocalStorage
        </button>
        <button 
          onClick={forceNavigate}
          className="btn-primary w-full text-xs py-1"
        >
          Force Navigate to Dashboard
        </button>
        {isAuthenticated && (
          <button 
            onClick={logout}
            className="btn-ghost w-full text-xs py-1"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}