import { apiClient } from './api-client';

// Global state for authentication
let authState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

let listeners = [];
let isInitializing = false;

// Initialize auth when module loads (client-side only)  
if (typeof window !== 'undefined') {
  console.log('🔄 Starting immediate auth initialization');
  initializeAuth();
}

// Initialize authentication
async function initializeAuth() {
  if (isInitializing) return;
  isInitializing = true;
  
  console.log('🔄 Starting auth initialization...');
  
  try {
    const token = localStorage.getItem('auth_token');
    console.log('📝 Token from storage:', token ? 'Present' : 'Missing');
    
    if (token) {
      console.log('📝 Token found, validating with backend...');
      apiClient.setToken(token);
      
      const isValid = await apiClient.isTokenValidWithBackend();
      if (isValid) {
        try {
          const user = await apiClient.getCurrentUser();
          console.log('👤 User fetched:', user.email);
          updateAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
          console.log('✅ Auth state updated - user authenticated');
        } catch (error) {
          console.warn('❌ Failed to fetch user data:', error);
          clearAuth();
        }
      } else {
        console.log('❌ Token validation failed, clearing auth');
        clearAuth();
      }
    } else {
      console.log('❌ No token found, clearing auth');
      clearAuth();
    }
  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
    clearAuth();
  } finally {
    isInitializing = false;
    console.log('🏁 Auth initialization complete');
  }
}

// Update authentication state and notify listeners
function updateAuthState(newState) {
  const oldState = { ...authState };
  authState = { ...authState, ...newState };
  
  console.log('🔄 Auth state change:', {
    from: { isAuthenticated: oldState.isAuthenticated, isLoading: oldState.isLoading },
    to: { isAuthenticated: authState.isAuthenticated, isLoading: authState.isLoading },
    listeners: listeners.length
  });
  
  listeners.forEach(listener => listener(authState));
}

// Subscribe to auth state changes
function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

// Get current auth state
function getAuthState() {
  return authState;
}

// Login function
async function login(email, password) {
  updateAuthState({ isLoading: true });
  
  try {
    const response = await apiClient.login(email, password);
    const user = await apiClient.getCurrentUser();
    
    updateAuthState({
      user,
      token: response.token,
      isLoading: false,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error('Login failed:', error);
    updateAuthState({ isLoading: false });
    throw error;
  }
}

// Register function
async function register(data) {
  updateAuthState({ isLoading: true });
  
  try {
    const response = await apiClient.register({
      email: data.email,
      password: data.password,
      name: data.name,
    });
    const user = await apiClient.getCurrentUser();
    
    updateAuthState({
      user,
      token: response.token,
      isLoading: false,
      isAuthenticated: true,
    });
  } catch (error) {
    updateAuthState({ isLoading: false });
    throw error;
  }
}

// Logout function
async function logout() {
  updateAuthState({ isLoading: true });
  
  try {
    await apiClient.logout();
  } catch (error) {
    console.warn('Logout failed:', error);
  } finally {
    clearAuth();
  }
}

// Clear authentication
function clearAuth() {
  apiClient.setToken(null);
  updateAuthState({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  });
}

// Handle OAuth callback (for Google login)
async function handleOAuthCallback(token) {
  try {
    apiClient.setToken(token);
    const user = await apiClient.getCurrentUser();
    
    updateAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  } catch (error) {
    clearAuth();
    throw error;
  }
}

// Prepare data for Electron app
function getElectronAuthData() {
  if (!authState.isAuthenticated || !authState.user || !authState.token) {
    return null;
  }

  return {
    token: authState.token,
    user: authState.user,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };
}

// Handle Electron protocol redirect
function redirectToElectron() {
  const authData = getElectronAuthData();
  if (!authData) return;

  const callbackUrl = process.env.NEXT_PUBLIC_ELECTRON_CALLBACK_URL || 'browsermanager://callback';
  const redirectUrl = `${callbackUrl}?token=${authData.token}`;
  
  try {
    window.location.href = redirectUrl;
  } catch (error) {
    console.warn('Electron redirect failed:', error);
  }
}

// Export the authManager object with all functions
export const authManager = {
  getAuthState,
  subscribe,
  login,
  register,
  logout,
  handleOAuthCallback,
  getElectronAuthData,
  redirectToElectron,
};