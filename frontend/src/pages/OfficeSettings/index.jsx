import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext";
import OfficeDashboardLayout from "@/components/OfficeDashboardLayout";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";

/**
 * Office Settings Page
 * Provides password change for office users
 */
export default function OfficeSettings({ officeColor, basePath, officeId }) {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <OfficeDashboardLayout
      officeColor={officeColor}
      basePath={basePath}
      officeId={officeId}
    >
      <div className="flex-1 flex flex-col md:overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#040195] mb-2">Settings</h2>
            <p className="text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Password Management */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-[#040195] mb-3">
              Password Management
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Keep your account secure by changing your password regularly.
            </p>
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-[#040195] text-white px-6 py-2.5 rounded-lg hover:bg-[#030175] transition-colors font-medium"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </OfficeDashboardLayout>
  );
}

OfficeSettings.propTypes = {
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.string,
};
