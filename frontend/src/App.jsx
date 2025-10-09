
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
import UnitDirectorCalendar from '@/pages/UnitDirectorCalendar';

// Office Dashboards (6 offices)
import CCESDashboard from '@/pages/CCESDashboard';
import ACCADashboard from '@/pages/ACCADashboard';
import ACESDashboard from '@/pages/ACESDashboard';
import ALTECDashboard from '@/pages/ALTECDashboard';
import APCDashboard from '@/pages/APCDashboard';
import ACLGDashboard from '@/pages/ACLGDashboard';

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
      <Route 
        path="/unit-director/calendar" 
        element={
          <ProtectedRoute requiredRole="unit_director">
            <UnitDirectorCalendar />
          </ProtectedRoute>
        } 
      />

      {/* Protected Office Routes - Each office has its own dashboard */}
      <Route 
        path="/office/cces/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <CCESDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/office/acca/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <ACCADashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/office/aces/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <ACESDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/office/altec/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <ALTECDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/office/apc/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <APCDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/office/aclg/dashboard" 
        element={
          <ProtectedRoute requiredRole="office_user">
            <ACLGDashboard />
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
