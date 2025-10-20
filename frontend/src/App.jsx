
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/Loader';

// Pages
import WelcomePage from '@/pages/Welcome';
import UnitDirectorDashboard from '@/pages/UnitDirectorDashboard';
import UnitDirectorReports from '@/pages/UnitDirectorReports';
import UnitDirectorCalendar from '@/pages/UnitDirectorCalendar';

// Office Dashboards (6 offices)
import CCESDashboard from '@/pages/CCESDashboard';
import CCESReports from '@/pages/CCESDashboard/Reports';
import CCESCalendar from '@/pages/CCESDashboard/Calendar';

import ACCADashboard from '@/pages/ACCADashboard';
import ACCAReports from '@/pages/ACCADashboard/Reports';
import ACCACalendar from '@/pages/ACCADashboard/Calendar';

import ACESDashboard from '@/pages/ACESDashboard';
import ACESReports from '@/pages/ACESDashboard/Reports';
import ACESCalendar from '@/pages/ACESDashboard/Calendar';

import ALTECDashboard from '@/pages/ALTECDashboard';
import ALTECReports from '@/pages/ALTECDashboard/Reports';
import ALTECCalendar from '@/pages/ALTECDashboard/Calendar';

import APCDashboard from '@/pages/APCDashboard';
import APCReports from '@/pages/APCDashboard/Reports';
import APCCalendar from '@/pages/APCDashboard/Calendar';

import ACLGDashboard from '@/pages/ACLGDashboard';
import ACLGReports from '@/pages/ACLGDashboard/Reports';
import ACLGCalendar from '@/pages/ACLGDashboard/Calendar';

import './App.css';

// Simple app content without navigation guard
const AppContent = () => {
  const { showTransitionLoader } = useAuth();
  
  return (
    <>
      <Routes>
        {/* Public Routes - Only Welcome page with centralized login */}
        <Route path="/" element={<WelcomePage />} />

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
        {/* CCES Routes */}
        <Route 
          path="/office/cces/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/cces/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/cces/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESCalendar />
            </ProtectedRoute>
          } 
        />

        {/* ACCA Routes */}
        <Route 
          path="/office/acca/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCADashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/acca/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCAReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/acca/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCACalendar />
            </ProtectedRoute>
          } 
        />

        {/* ACES Routes */}
        <Route 
          path="/office/aces/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/aces/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/aces/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESCalendar />
            </ProtectedRoute>
          } 
        />

        {/* ALTEC Routes */}
        <Route 
          path="/office/altec/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/altec/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/altec/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECCalendar />
            </ProtectedRoute>
          } 
        />

        {/* APC Routes */}
        <Route 
          path="/office/apc/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/apc/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/apc/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCCalendar />
            </ProtectedRoute>
          } 
        />

        {/* ACLG Routes */}
        <Route 
          path="/office/aclg/dashboard" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/aclg/reports" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/office/aclg/calendar" 
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGCalendar />
            </ProtectedRoute>
          } 
        />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Transition Loader with Crossfade */}
      <AnimatePresence>
        {showTransitionLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#040195] z-[9999] flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
