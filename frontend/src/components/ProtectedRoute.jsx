import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userType, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated) {
    console.log('🔒 Not authenticated - redirecting to home');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userType !== requiredRole) {
    console.log(`🔒 Wrong role: expected ${requiredRole}, got ${userType}`);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted:', { user: user?.email, userType });
  return children;
};

export default ProtectedRoute;
