import { createContext, useContext, useState, useEffect } from 'react';
import SecureAuth from '../auth/SecureAuth.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    console.log('🚀 Checking for existing session...');
    const existingSession = SecureAuth.getSession();
    setSession(existingSession);
    setLoading(false);
    console.log('✅ Session check complete:', existingSession ? 'Authenticated' : 'Not authenticated');
  }, []);

  const login = async (email, password, userType) => {
    setLoading(true);
    try {
      let newSession;
      
      if (userType === 'office') {
        newSession = await SecureAuth.loginOffice(email, password);
      } else if (userType === 'unit_director') {
        newSession = await SecureAuth.loginUnitDirector(email, password);
      } else {
        throw new Error('Invalid user type');
      }
      
      setSession(newSession);
      return newSession;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    SecureAuth.logout();
    setSession(null);
  };

  const value = {
    // Session data
    user: session?.user || null,
    userType: session?.userType || null,
    token: session?.token || null,
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
