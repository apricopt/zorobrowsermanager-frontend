const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Connection failed. Please check if the backend server is running on ${this.baseURL}`);
      }
      throw error;
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_timestamp', Date.now().toString());
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_timestamp');
      }
    }
  }

  getToken() {
    return this.token;
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.setToken(null);
    }
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/api/user');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // OAuth helper
  getGoogleOAuthURL() {
    return `${this.baseURL}/auth/google`;
  }

  // Profile endpoints (to be implemented with your existing profile system)
  async getProfiles() {
    return this.request('/api/profiles');
  }

  // Token validation
  async validateToken() {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      this.setToken(null);
      return false;
    }
  }

  // Check if token exists and is recent (for automatic authentication)
  isTokenValid() {
    console.log('ApiClient: Checking token validity', { hasToken: !!this.token });
    if (!this.token) return false;
    
    const timestamp = localStorage.getItem('auth_timestamp');
    console.log('ApiClient: Token timestamp', timestamp);
    if (!timestamp) return false;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const isValid = tokenAge < sevenDays;
    
    console.log('ApiClient: Token validity check', { tokenAge, isValid });
    return isValid;
  }

  // Validate token with backend (more thorough check)
  async isTokenValidWithBackend() {
    if (!this.isTokenValid()) return false;
    
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.warn('Token validation with backend failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default ApiClient;