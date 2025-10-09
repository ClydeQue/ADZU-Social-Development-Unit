import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Try to get new access token using refresh token cookie
      const result = await AuthService.refreshToken();
      
      if (result?.accessToken && result?.user) {
        setSession({
          user: result.user,
          accessToken: result.accessToken,
        });
      }
    } catch (error) {
      // Refresh failed, clear any stale data
      AuthService.clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const result = await AuthService.login(credentials);
    
    if (result?.accessToken && result?.user) {
      setSession({
        user: result.user,
        accessToken: result.accessToken,
      });
      return result;
    }
    
    throw new Error("Login failed");
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      setSession(null);
      AuthService.clearAuth();
    }
  };

  const value = {
    user: session?.user,
    userType: session?.user?.userType,
    isAuthenticated: !!session,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
