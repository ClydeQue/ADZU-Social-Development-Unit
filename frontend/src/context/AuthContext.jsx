import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../services/authService.js'; // Professional JWT auth

const AuthContext = createContext();

// Session storage utilities (only user data, NO TOKENS)
const SESSION_STORAGE_KEY = 'adzu_sdu_user_session';

const saveUserToStorage = (user) => {
  try {
    // Only save user data, never tokens
    const userData = {
      user,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Failed to load user data from localStorage:', error);
  }
  return null;
};

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user data from localStorage:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null); // { user, accessToken }
  const [loading, setLoading] = useState(true);

  // Refresh access token using secure cookie
  const refreshAccessToken = async () => {
    try {
      console.log('� Attempting to refresh access token...');
      const result = await AuthService.refreshToken();
      
      if (result.accessToken && result.user) {
        const newSession = {
          user: result.user,
          accessToken: result.accessToken,
          loginTime: new Date().toISOString()
        };
        
        setSession(newSession);
        saveUserToStorage(result.user); // Save only user data
        console.log('✅ Access token refreshed successfully');
        return newSession;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Clear any stale data
      setSession(null);
      clearUserFromStorage();
    }
    return null;
  };

  // Check for existing session on app start
  useEffect(() => {
    console.log('🚀 Checking for existing session...');
    
    const initializeSession = async () => {
      // First check if AuthService has an access token (from localStorage)
      const existingToken = AuthService.getAccessToken();
      
      if (existingToken) {
        console.log('� Found existing access token, attempting to refresh...');
        
        // Try to refresh token to get fresh user data
        try {
          const refreshedSession = await AuthService.refreshToken();
          
          if (refreshedSession?.accessToken && refreshedSession?.user) {
            const newSession = {
              user: refreshedSession.user,
              accessToken: refreshedSession.accessToken,
              loginTime: new Date().toISOString()
            };
            
            setSession(newSession);
            saveUserToStorage(refreshedSession.user);
            console.log('✅ Session restored successfully');
            setLoading(false);
            return;
          }
        } catch (refreshError) {
          console.log('❌ Token refresh failed:', refreshError.message);
          AuthService.setAccessToken(null);
          clearUserFromStorage();
        }
      }
      
      // If no token or refresh failed, check for stored user data
      const userData = loadUserFromStorage();
      
      if (userData?.user) {
        console.log('👤 Found user data in storage, but no valid token');
        // Clear stale data
        clearUserFromStorage();
      }
      
      setLoading(false);
      console.log('✅ Session initialization complete');
    };

    initializeSession();
  }, []);

  const login = async (email, password, userType) => {
    setLoading(true);
    try {
      let result;
      
      if (userType === 'office') {
        result = await AuthService.loginOffice(email, password);
      } else if (userType === 'unit_director') {
        result = await AuthService.loginUnitDirector(email, password);
      } else {
        throw new Error('Invalid user type');
      }
      
      // Create session object from API response
      // Access token is in memory only
      const newSession = {
        user: result.user,
        accessToken: result.accessToken, // Memory only!
        loginTime: new Date().toISOString(),
        userType: result.user?.userType || userType
      };
      
      setSession(newSession);
      saveUserToStorage(result.user); // Save only user data, no tokens
      console.log('✅ User logged in, access token in memory, refresh token in cookie');
      
      return newSession;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout(); // This clears the HttpOnly cookie and localStorage token
      console.log('🍪 HttpOnly refresh cookie and access token cleared');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSession(null); // Clear session from memory
      clearUserFromStorage(); // Clear user data from storage
      console.log('🗑️ Session cleared from memory and storage');
    }
  };

  // Auto-logout on storage events (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SESSION_STORAGE_KEY && !e.newValue) {
        // User data was cleared in another tab
        console.log('🔄 User data cleared in another tab, logging out...');
        setSession(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!session?.accessToken) return;

    // Set up token refresh interval (refresh every 10 minutes)
    const refreshInterval = setInterval(async () => {
      console.log('⏰ Auto-refreshing access token...');
      await refreshAccessToken();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [session?.accessToken]);

  const value = {
    // Session data (access token in memory only!)
    user: session?.user || null,
    userType: session?.user?.userType || session?.userType || null,
    isAuthenticated: !!session?.accessToken, // Check access token specifically
    loginTime: session?.loginTime || null,
    
    // Loading state
    loading,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    
    // Memory-only access token
    getAccessToken: () => session?.accessToken || null,
    
    // Utility functions
    getUserType: () => session?.user?.userType,
    isOfficeUser: () => session?.user?.userType === 'office',
    isUnitDirector: () => session?.user?.userType === 'unit_director',
    
    // Manual session management (no token storage!)
    clearSession: () => {
      setSession(null);
      clearUserFromStorage();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
