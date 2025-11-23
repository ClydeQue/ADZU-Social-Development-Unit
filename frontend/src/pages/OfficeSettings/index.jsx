import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext";
import OfficeDashboardLayout from "@/components/OfficeDashboardLayout";
import { Eye, EyeOff } from "lucide-react";
import UserService from "@/services/userService";
import Alert from "@/components/Alert";
import SuccessModal from "@/components/SuccessModal";

/**
 * Office Settings Page
 * Provides password and username change for office users
 */
export default function OfficeSettings({ officeColor, basePath, officeId }) {
  const { user } = useAuth();
  const [activeForm, setActiveForm] = useState(null); // null, 'password', 'username'
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAction, setSuccessAction] = useState({
    action: "updated",
    itemName: "Password",
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Username change state
  const [usernameForm, setUsernameForm] = useState({
    newUsername: "",
    currentPassword: "",
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    usernameConfirm: false,
  });

  // Show alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showAlert("error", "All fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("error", "Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showAlert("error", "New password must be at least 6 characters");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      showAlert(
        "error",
        "New password must be different from current password"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        userType: "office_user",
      });

      if (response && response.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
          usernameConfirm: false,
        });
        setSuccessAction({ action: "updated", itemName: "Password" });
        setShowSuccessModal(true);
      } else {
        showAlert("error", "Unexpected response from server");
      }
    } catch (error) {
      console.error("Password change error:", error);
      let errorMessage = "Failed to change password";

      if (error.message === "Session expired. Please login again.") {
        errorMessage = error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle username change
  const handleUsernameChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!usernameForm.newUsername) {
      showAlert("error", "New username is required");
      return;
    }

    if (usernameForm.newUsername.length < 3) {
      showAlert("error", "Username must be at least 3 characters");
      return;
    }

    if (!usernameForm.currentPassword) {
      showAlert("error", "Current password is required for verification");
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.changeUsername({
        newUsername: usernameForm.newUsername,
        currentPassword: usernameForm.currentPassword,
        userType: "office_user",
      });

      if (response && response.success) {
        setUsernameForm({
          newUsername: "",
          currentPassword: "",
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
          usernameConfirm: false,
        });
        setSuccessAction({ action: "updated", itemName: "Username" });
        setShowSuccessModal(true);
      } else {
        showAlert("error", "Unexpected response from server");
      }
    } catch (error) {
      console.error("Username change error:", error);
      let errorMessage = "Failed to change username";

      if (error.message === "Session expired. Please login again.") {
        errorMessage = error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OfficeDashboardLayout
      officeColor={officeColor}
      basePath={basePath}
      officeId={officeId}
    >
      <div className="flex-1 flex flex-col md:overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
          {/* Alert */}
          {alert.show && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ show: false, type: "", message: "" })}
              />
            </div>
          )}

          {/* Main View */}
          {!activeForm && (
            <div>
              {/* Header */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <h2
                  className="text-3xl font-bold text-[#040195] mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Settings
                </h2>
                <p
                  className="text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Configure your account preferences
                </p>
              </div>

              {/* Account Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Change Password Card */}
                <button
                  onClick={() => setActiveForm("password")}
                  className="bg-white hover:bg-gray-50 border-2 border-[#7E7DC5] rounded-2xl p-6 text-left transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#040195] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold text-[#040195] mb-2 group-hover:text-[#3d39cc]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Change Password
                      </h3>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Update your password to keep your account secure
                      </p>
                    </div>
                  </div>
                </button>

                {/* Change Username Card */}
                <button
                  onClick={() => setActiveForm("username")}
                  className="bg-white hover:bg-gray-50 border-2 border-[#7E7DC5] rounded-2xl p-6 text-left transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#040195] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold text-[#040195] mb-2 group-hover:text-[#3d39cc]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Change Username
                      </h3>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Update your login username
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Password Change Form */}
          {activeForm === "password" && (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setActiveForm(null)}
                className="mb-6 flex items-center gap-2 text-[#040195] hover:text-[#3d39cc] font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Settings
              </button>

              {/* Form Card */}
              <div className="bg-white rounded-2xl border-2 border-[#7E7DC5] p-6">
                <h3
                  className="text-2xl font-bold text-[#040195] mb-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195]"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
                        placeholder="Enter new password (min. 6 characters)"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195]"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
                        placeholder="Re-enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195]"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#040195] hover:bg-[#3d39cc] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {isLoading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Username Change Form */}
          {activeForm === "username" && (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setActiveForm(null)}
                className="mb-6 flex items-center gap-2 text-[#040195] hover:text-[#3d39cc] font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Settings
              </button>

              {/* Form Card */}
              <div className="bg-white rounded-2xl border-2 border-[#7E7DC5] p-6">
                <h3
                  className="text-2xl font-bold text-[#040195] mb-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Change Username
                </h3>

                <form onSubmit={handleUsernameChange} className="space-y-4">
                  {/* New Username */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      New Username
                    </label>
                    <input
                      type="text"
                      value={usernameForm.newUsername}
                      onChange={(e) =>
                        setUsernameForm({
                          ...usernameForm,
                          newUsername: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
                      placeholder="Enter new username (min. 3 characters)"
                      required
                    />
                  </div>

                  {/* Current Password */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showPasswords.usernameConfirm ? "text" : "password"
                        }
                        value={usernameForm.currentPassword}
                        onChange={(e) =>
                          setUsernameForm({
                            ...usernameForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
                        placeholder="Enter password to confirm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            usernameConfirm: !showPasswords.usernameConfirm,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195]"
                      >
                        {showPasswords.usernameConfirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#040195] hover:bg-[#3d39cc] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {isLoading ? "Changing Username..." : "Change Username"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setActiveForm(null);
        }}
        action={successAction.action}
        itemName={successAction.itemName}
      />
    </OfficeDashboardLayout>
  );
}

OfficeSettings.propTypes = {
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.string,
};
