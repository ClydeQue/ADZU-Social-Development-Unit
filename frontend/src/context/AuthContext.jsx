import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);

  // Initialize session on mount - restore from token if available
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getAccessToken();
        const storedUser = localStorage.getItem('sdu_user');
        
        if (token && storedUser) {
          try {
            // First, try to use stored user data for immediate access
            const user = JSON.parse(storedUser);
            setSession({
              user,
              accessToken: token,
            });
            
            // Then validate token in background by refreshing
            AuthService.refreshToken()
              .then((result) => {
                if (result?.user) {
                  // Update with fresh data
                  setSession({
                    user: result.user,
                    accessToken: result.accessToken,
                  });
                  localStorage.setItem('sdu_user', JSON.stringify(result.user));
                }
              })
              .catch((error) => {
                // If refresh fails silently, keep using cached data
                console.warn("Token refresh failed, using cached session:", error);
              });
          } catch (error) {
            // If parsing fails, clear auth
            console.error("Failed to parse stored user:", error);
            AuthService.clearAuth();
            localStorage.removeItem('sdu_user');
          }
        } else {
          AuthService.clearAuth();
          localStorage.removeItem('sdu_user');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        AuthService.clearAuth();
        localStorage.removeItem('sdu_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await AuthService.login(credentials);
      
      console.log('🔐 Login Result:', {
        hasAccessToken: !!result?.accessToken,
        hasUser: !!result?.user,
        user: result?.user,
        officeId: result?.user?.office_id,
      });
      
      if (result?.accessToken && result?.user) {
        // Store session in state and localStorage for persistence
        const newSession = {
          user: result.user,
          accessToken: result.accessToken,
        };
        setSession(newSession);
        
        console.log('✅ Session set:', newSession.user);
        
        // Also store user data in localStorage for page refresh
        localStorage.setItem('sdu_user', JSON.stringify(result.user));
        
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
        localStorage.removeItem('sdu_user'); // Remove stored user data
        
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
