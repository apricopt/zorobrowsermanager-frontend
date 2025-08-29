import { useState, useEffect, useCallback } from 'react';
import { authManager } from '../lib/auth-utils';

export function useAuth() {
  const [authState, setAuthState] = useState(() => {
    const initialState = authManager.getAuthState();
    console.log('🎣 useAuth initialized with state:', initialState);
    return initialState;
  });

  useEffect(() => {
    console.log('🎣 useAuth subscribing to auth manager');
    
    const unsubscribe = authManager.subscribe((newState) => {
      console.log('🎣 useAuth received state update:', newState);
      setAuthState(newState);
    });
    
    // Always sync with the latest state on mount
    const currentState = authManager.getAuthState();
    console.log('🎣 useAuth syncing with current state:', currentState);
    if (JSON.stringify(currentState) !== JSON.stringify(authState)) {
      setAuthState(currentState);
    }
    
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    await authManager.login(email, password);
  }, []);

  const register = useCallback(async (data) => {
    await authManager.register(data);
  }, []);

  const logout = useCallback(async () => {
    await authManager.logout();
  }, []);

  const refreshUser = useCallback(async () => {
    // Re-initialize auth to refresh user data
    const currentState = authManager.getAuthState();
    if (currentState.isAuthenticated && currentState.token) {
      try {
        const { apiClient } = await import('../lib/api-client');
        const user = await apiClient.getCurrentUser();
        // This will trigger an auth state update
      } catch (error) {
        console.warn('Failed to refresh user:', error);
        await logout();
      }
    }
  }, [logout]);

  const redirectToElectron = useCallback(() => {
    authManager.redirectToElectron();
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
    redirectToElectron,
  };
}