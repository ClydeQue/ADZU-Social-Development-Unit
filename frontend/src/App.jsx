import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/components/Loader";

// Pages
import WelcomePage from "@/pages/Welcome";
import UnitDirectorDashboard from "@/pages/UnitDirectorDashboard";
import UnitDirectorReports from "@/pages/UnitDirectorReports";
import UnitDirectorCalendar from "@/pages/UnitDirectorCalendar";
import UnitDirectorHelp from "@/pages/UnitDirectorHelp";
import UnitDirectorSettings from "@/pages/UnitDirectorSettings";
import MainSettings from "@/pages/UnitDirectorSettings/MainSettings";
import ProgramsManagement from "@/pages/UnitDirectorSettings/Programs";
import UsersManagement from "@/pages/UnitDirectorSettings/Users";
import MessagesManagement from "@/pages/UnitDirectorSettings/Messages";

// Office Dashboards (6 offices)
import CCESDashboard from "@/pages/CCESDashboard";
import CCESReports from "@/pages/CCESDashboard/Reports";
import CCESAddActivity from "@/pages/CCESDashboard/AddActivity";
import CCESEditActivity from "@/pages/CCESDashboard/EditActivity";
import CCESSettings from "@/pages/CCESDashboard/Settings";

import ACCADashboard from "@/pages/ACCADashboard";
import ACCAReports from "@/pages/ACCADashboard/Reports";
import ACCAAddActivity from "@/pages/ACCADashboard/AddActivity";
import ACCAEditActivity from "@/pages/ACCADashboard/EditActivity";
import ACCASettings from "@/pages/ACCADashboard/Settings";

import ACESDashboard from "@/pages/ACESDashboard";
import ACESReports from "@/pages/ACESDashboard/Reports";
import ACESAddActivity from "@/pages/ACESDashboard/AddActivity";
import ACESEditActivity from "@/pages/ACESDashboard/EditActivity";
import ACESSettings from "@/pages/ACESDashboard/Settings";

import ALTECDashboard from "@/pages/ALTECDashboard";
import ALTECReports from "@/pages/ALTECDashboard/Reports";
import ALTECAddActivity from "@/pages/ALTECDashboard/AddActivity";
import ALTECEditActivity from "@/pages/ALTECDashboard/EditActivity";
import ALTECSettings from "@/pages/ALTECDashboard/Settings";

import APCDashboard from "@/pages/APCDashboard";
import APCReports from "@/pages/APCDashboard/Reports";
import APCAddActivity from "@/pages/APCDashboard/AddActivity";
import APCEditActivity from "@/pages/APCDashboard/EditActivity";
import APCSettings from "@/pages/APCDashboard/Settings";

import ACLGDashboard from "@/pages/ACLGDashboard";
import ACLGReports from "@/pages/ACLGDashboard/Reports";
import ACLGAddActivity from "@/pages/ACLGDashboard/AddActivity";
import ACLGEditActivity from "@/pages/ACLGDashboard/EditActivity";
import ACLGSettings from "@/pages/ACLGDashboard/Settings";

import OfficeHelp from "@/pages/OfficeHelp";

import "./App.css";

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
        <Route
          path="/unit-director/help"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <UnitDirectorHelp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-director/settings"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <UnitDirectorSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-director/settings/main"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <MainSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-director/settings/programs"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <ProgramsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-director/settings/users"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <UsersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/unit-director/settings/messages"
          element={
            <ProtectedRoute requiredRole="unit_director">
              <MessagesManagement />
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
          path="/office/cces/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/cces"
                officeId="cces"
                officeName="Center for Community Engagement and Service"
              />
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
          path="/office/acca/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCAReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/acca/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCAAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/acca/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCAEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/acca/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCASettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/acca/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACCASettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/acca/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/acca"
                officeId="acca"
                officeName="AdZu Center for Culture and Arts"
              />
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
          path="/office/aces/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aces/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aces/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aces/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aces/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACESSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aces/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/aces"
                officeId="aces"
                officeName="AdZu Center for Extension Services"
              />
            </ProtectedRoute>
          }
        />
        {/* CCES Routes */}
        <Route
          path="/office/cces/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <CCESSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/cces/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/cces"
                officeId="cces"
                officeName="Community and Civic Engagement Services"
              />
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
          path="/office/altec/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/altec/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/altec/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/altec/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/altec/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ALTECSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/altec/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/altec"
                officeId="altec"
                officeName="AdZu Language and Technology Center"
              />
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
          path="/office/apc/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/apc/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/apc/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/apc/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/apc/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <APCSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/apc/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/apc"
                officeId="apc"
                officeName="AdZu Peace Center"
              />
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
          path="/office/aclg/projects"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aclg/add-activity"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGAddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aclg/edit-activity/:activityId"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGEditActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aclg/settings"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aclg/settings/programs"
          element={
            <ProtectedRoute requiredRole="office_user">
              <ACLGSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/aclg/help"
          element={
            <ProtectedRoute requiredRole="office_user">
              <OfficeHelp
                basePath="/office/aclg"
                officeId="aclg"
                officeName="AdZu Center for Local Governance"
              />
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
            style={{ pointerEvents: "none" }}
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
