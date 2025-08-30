import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './Context';
import { useAuthSession, useLogout } from '../hooks/useAuthQuery';

const initialState = {
  user: null,
  userType: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const logoutMutation = useLogout();
  
  // Use React Query for session management - this replaces useEffect
  const { data: session, isLoading, error } = useAuthSession();

  // Compute auth state from React Query data instead of using useEffect
  const value = useMemo(() => {
    if (isLoading) {
      return { ...initialState, loading: true };
    }
    
    if (error) {
      return { 
        ...initialState, 
        loading: false, 
        error: error.message,
        isAuthenticated: false,
        logout: () => logoutMutation.mutate()
      };
    }
    
    if (session) {
      return {
        user: session.user,
        userType: session.userType,
        token: session.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        logout: () => logoutMutation.mutate()
      };
    }
    
    // No session
    return {
      user: null,
      userType: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      logout: () => logoutMutation.mutate()
    };
  }, [session, isLoading, error, logoutMutation]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
