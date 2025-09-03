import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService.js'; // Professional JWT auth

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    console.log('🚀 Checking for existing session...');
    const existingSession = AuthService.getSession();
    setSession(existingSession);
    setLoading(false);
    console.log('✅ Session check complete:', existingSession ? 'Authenticated' : 'Not authenticated');
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
      const newSession = {
        user: result.user,
        accessToken: result.accessToken
      };
      
      setSession(newSession);
      return newSession;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setSession(null);
  };

  const value = {
    // Session data
    user: session?.user || null,
    userType: session?.user?.userType || null,
    accessToken: session?.accessToken || null,
    isAuthenticated: !!session,
    
    // Loading state
    loading,
    
    // Actions
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
