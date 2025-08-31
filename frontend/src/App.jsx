
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import WelcomePage from '@/pages/Welcome';
import OfficeSelectionPage from '@/pages/OfficeSelection';
import UnitDirectorLoginPage from '@/pages/UnitDirectorLogin';
import OfficeLoginPage from '@/pages/OfficeLogin';
import UnitDirectorDashboard from '@/pages/UnitDirectorDashboard';
import UnitDirectorReports from '@/pages/UnitDirectorReports';
import OfficeDashboard from '@/pages/OfficeDashboard';

import './App.css';

// Simple app content without navigation guard
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/office-selection" element={<OfficeSelectionPage />} />
      <Route path="/unit-director/login" element={<UnitDirectorLoginPage />} />
      <Route path="/office/login/:officeId" element={<OfficeLoginPage />} />

      {/* Protected Unit Director Routes */}
      <Route 
        path="/unit-director/dashboard" 
        element={
          <ProtectedRoute requiredRole="unit_director">
            <UnitDirectorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/unit-director/reports" 
        element={
          <ProtectedRoute requiredRole="unit_director">
            <UnitDirectorReports />
          </ProtectedRoute>
        } 
      />

      {/* Protected Office Routes */}
      <Route 
        path="/office/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <OfficeDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch all unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


function App() {
  return (
    <>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
