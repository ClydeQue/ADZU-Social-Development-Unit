import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);

  // Initialize session on mount - DISABLED auto-refresh to prevent rate limiting
  useEffect(() => {
    // Just check if we have a token in localStorage
    const token = AuthService.getAccessToken();
    if (!token) {
      AuthService.clearAuth();
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const result = await AuthService.login(credentials);
      
      if (result?.accessToken && result?.user) {
        setSession({
          user: result.user,
          accessToken: result.accessToken,
        });
        setShowTransitionLoader(true); // Show loader on successful login
        return result;
      }
      
      throw new Error("Login failed");
    } catch (error) {
      // Ensure loader is hidden on error
      setShowTransitionLoader(false);
      throw error;
    }
  };

  const logout = async () => {
    // CRITICAL: Show loader first and wait for it to render
    setShowTransitionLoader(true);
    
    // Wait for React to render the loader (use RAF to ensure paint)
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 100); // Extra 100ms to ensure loader is visible
        });
      });
    });
    
    // Now keep loader visible while logging out
    setTimeout(async () => {
      try {
        await AuthService.logout();
      } finally {
        // Clear session (this triggers redirect to welcome page)
        setSession(null);
        AuthService.clearAuth();
        
        // Keep loader visible for additional time to cover the page transition
        setTimeout(() => {
          setShowTransitionLoader(false); // Fade out loader
        }, 1000); // Extra 1s to ensure welcome page is loaded before fade out
      }
    }, 1900); // Show loader for ~2 seconds total before clearing session
  };

  const value = {
    user: session?.user,
    userType: session?.user?.userType,
    isAuthenticated: !!session,
    loading,
    showTransitionLoader,
    setShowTransitionLoader,
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
