import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import unitDirectorSettings from "@/services/unitDirectorSettings";
import UnitDirectorService from "@/services/unitDirectorService";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";

export default function EditOfficeDialog({ office, onClose }) {
  const [activeSection, setActiveSection] = useState("program"); // 'program' or 'password'
  const [showAddProgramForm, setShowAddProgramForm] = useState(false);
  const [showEditProgramForm, setShowEditProgramForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    is_fixed: false,
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  // Fetch programs for this specific office
  const {
    data: programsData,
    isLoading: programsLoading,
    error: programsError,
  } = useQuery({
    queryKey: ["office-programs", office?.id],
    queryFn: async () => {
      const response = await UnitDirectorService.getOfficePrograms(office.id);
      return response.programs || [];
    },
    enabled: !!office?.id,
    staleTime: 1 * 60 * 1000,
  });

  // Add program mutation
  const addProgramMutation = useMutation({
    mutationFn: (programData) =>
      unitDirectorSettings.addProgram(office.id, programData),
    onSuccess: () => {
      queryClient.invalidateQueries(["office-programs", office.id]);
      queryClient.invalidateQueries(["unit-director-settings"]);
      setNewProgram({ title: "", description: "", is_fixed: false });
      setShowAddProgramForm(false);
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: ({ programId, programData }) =>
      unitDirectorSettings.updateProgram(programId, programData),
    onSuccess: () => {
      queryClient.invalidateQueries(["office-programs", office.id]);
      queryClient.invalidateQueries(["unit-director-settings"]);
      setShowEditProgramForm(false);
      setSelectedProgram(null);
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: (programId) => unitDirectorSettings.deleteProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries(["office-programs", office.id]);
      queryClient.invalidateQueries(["unit-director-settings"]);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (newPassword) =>
      unitDirectorSettings.changeOfficePassword(office.id, newPassword),
    onSuccess: () => {
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setSuccessMessage("Password changed successfully!");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to change password: ${error.message || "Unknown error"}`
      );
      setShowErrorModal(true);
    },
  });

  const handleAddProgram = () => {
    if (!newProgram.title.trim()) return;
    addProgramMutation.mutate(newProgram);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowEditProgramForm(true);
  };

  const handleUpdateProgram = () => {
    if (!selectedProgram || !selectedProgram.title.trim()) return;
    setShowSaveConfirm(true);
  };

  const confirmUpdateProgram = () => {
    updateProgramMutation.mutate({
      programId: selectedProgram.id,
      programData: {
        title: selectedProgram.title,
        description: selectedProgram.description,
        is_fixed: selectedProgram.is_fixed,
      },
    });
    setShowSaveConfirm(false);
  };

  const handleDeleteProgram = (programId) => {
    setProgramToDelete(programId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProgram = () => {
    if (programToDelete) {
      deleteProgramMutation.mutate(programToDelete);
    }
    setShowDeleteConfirm(false);
    setProgramToDelete(null);
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setShowErrorModal(true);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowErrorModal(true);
      return;
    }
    setShowPasswordConfirm(true);
  };

  const confirmChangePassword = () => {
    changePasswordMutation.mutate(passwordData.newPassword);
    setShowPasswordConfirm(false);
  };

  if (!office) return null;

  const programs = programsData || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#1E22AA] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={office.logo} alt={office.acronym} className="w-8 h-8" />
            <div>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Edit Office
              </h2>
              <p
                className="text-sm opacity-90"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {office.acronym} - {office.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection("program")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeSection === "program"
                ? "text-[#4D49FC] border-b-2 border-[#4D49FC] bg-[#F4F4F4]"
                : "text-gray-500 hover:text-[#4D49FC] hover:bg-gray-50"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Add & Edit Program
          </button>
          <button
            onClick={() => setActiveSection("password")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeSection === "password"
                ? "text-[#4D49FC] border-b-2 border-[#4D49FC] bg-[#F4F4F4]"
                : "text-gray-500 hover:text-[#4D49FC] hover:bg-gray-50"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Change Account Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeSection === "program" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-bold text-[#1E22AA]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Programs List
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddProgramForm(!showAddProgramForm)}
                    className="px-4 py-2 bg-[#4D49FC] text-white rounded-lg text-sm font-semibold hover:bg-[#3D39EC] transition-colors flex items-center gap-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Add Program
                  </button>
                </div>
              </div>

              {/* Add Program Form */}
              {showAddProgramForm && (
                <div className="bg-[#F4F4F4] rounded-lg p-4 mb-4 border-2 border-[#4D49FC]">
                  <h4
                    className="text-sm font-bold text-[#1E22AA] mb-3"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Add New Program
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-xs font-semibold text-[#040195] mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Program Title *
                      </label>
                      <input
                        type="text"
                        value={newProgram.title}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D49FC]"
                        placeholder="Enter program title"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold text-[#040195] mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Description
                      </label>
                      <textarea
                        value={newProgram.description}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D49FC] resize-none"
                        rows="2"
                        placeholder="Enter program description"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowAddProgramForm(false);
                          setNewProgram({
                            title: "",
                            description: "",
                            is_fixed: false,
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-300"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddProgram}
                        disabled={
                          !newProgram.title.trim() ||
                          addProgramMutation.isPending
                        }
                        className="px-3 py-1.5 bg-[#4D49FC] text-white rounded-md text-xs font-semibold hover:bg-[#3D39EC] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {addProgramMutation.isPending ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Program Form */}
              {showEditProgramForm && selectedProgram && (
                <div className="bg-[#FFF9E6] rounded-lg p-4 mb-4 border-2 border-[#FFA500]">
                  <h4
                    className="text-sm font-bold text-[#1E22AA] mb-3"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Edit Program
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-xs font-semibold text-[#040195] mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Program Title *
                      </label>
                      <input
                        type="text"
                        value={selectedProgram.title}
                        onChange={(e) =>
                          setSelectedProgram({
                            ...selectedProgram,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D49FC]"
                        placeholder="Enter program title"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold text-[#040195] mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Description
                      </label>
                      <textarea
                        value={selectedProgram.description || ""}
                        onChange={(e) =>
                          setSelectedProgram({
                            ...selectedProgram,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D49FC] resize-none"
                        rows="2"
                        placeholder="Enter program description"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowEditProgramForm(false);
                          setSelectedProgram(null);
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-300"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProgram}
                        disabled={
                          !selectedProgram.title.trim() ||
                          updateProgramMutation.isPending
                        }
                        className="px-3 py-1.5 bg-[#4D49FC] text-white rounded-md text-xs font-semibold hover:bg-[#3D39EC] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {updateProgramMutation.isPending
                          ? "Updating..."
                          : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Programs Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <style>{`
                  .programs-scroll::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                  }
                  .programs-scroll::-webkit-scrollbar-thumb {
                    background-color: #040195;
                    border-radius: 42px;
                  }
                `}</style>

                {/* Table Header */}
                <div className="bg-[#1E22AA] text-white px-4 py-3 grid grid-cols-[40px_1fr_100px] gap-3 items-center">
                  <div className="text-xs font-semibold">#</div>
                  <div className="text-xs font-semibold">Program Title</div>
                  <div className="text-xs font-semibold text-right">
                    Actions
                  </div>
                </div>

                {/* Table Body */}
                <div className="max-h-[300px] overflow-y-auto programs-scroll">
                  {programsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-[#4D49FC] text-sm font-semibold">
                        Loading programs...
                      </div>
                    </div>
                  ) : programsError ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 text-sm">
                        Error loading programs
                      </div>
                    </div>
                  ) : programs && programs.length > 0 ? (
                    programs.map((program, idx) => (
                      <div
                        key={program.id}
                        className="bg-white hover:bg-[#F4F4F4] transition-colors border-b border-gray-100 last:border-b-0 px-4 py-3 grid grid-cols-[40px_1fr_100px] gap-3 items-center"
                      >
                        <div className="text-[#4D49FC] text-xs font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-[#4D49FC] text-sm font-semibold">
                            {program.title}
                          </div>
                          {program.description && (
                            <div className="text-gray-500 text-xs mt-1 line-clamp-1">
                              {program.description}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            disabled={
                              updateProgramMutation.isPending ||
                              deleteProgramMutation.isPending
                            }
                            className="px-3 py-1 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50"
                            title="Edit program"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(program.id)}
                            disabled={
                              updateProgramMutation.isPending ||
                              deleteProgramMutation.isPending
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-[0.65rem] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Delete program"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="text-center py-8 text-gray-500 text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No programs found for this office
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3
                className="text-lg font-bold text-[#1E22AA] mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Change Password for {office.acronym}
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p
                  className="text-sm text-blue-800"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <strong>Note:</strong> You are changing the password for the
                  office account: <strong>{office.email}</strong>
                </p>
              </div>

              {/* New Password */}
              <div>
                <label
                  className="block text-sm font-semibold text-[#040195] mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#4D49FC]"
                  >
                    {showPassword.new ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 3L21 21M10.5 10.5C10.0353 10.9646 9.75 11.6022 9.75 12.3C9.75 13.7912 10.9588 15 12.45 15C13.1478 15 13.7854 14.7147 14.25 14.25M19.5 19.5C17.7 21 15 21.75 12 21.75C7.5 21.75 3.75 18.75 1.5 12.3C2.55 9.9 3.975 7.95 5.7 6.45M9.75 4.65C10.4625 4.425 11.2125 4.3125 12 4.3125C16.5 4.3125 20.25 7.3125 22.5 13.7625C21.975 15.0375 21.3375 16.2 20.5875 17.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 5.25C7.5 5.25 3.75 8.25 1.5 14.25C3.75 20.25 7.5 23.25 12 23.25C16.5 23.25 20.25 20.25 22.5 14.25C20.25 8.25 16.5 5.25 12 5.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 17.25C14.4853 17.25 16.5 15.2353 16.5 12.75C16.5 10.2647 14.4853 8.25 12 8.25C9.51472 8.25 7.5 10.2647 7.5 12.75C7.5 15.2353 9.51472 17.25 12 17.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p
                  className="text-xs text-gray-500 mt-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm font-semibold text-[#040195] mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#4D49FC]"
                  >
                    {showPassword.confirm ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 3L21 21M10.5 10.5C10.0353 10.9646 9.75 11.6022 9.75 12.3C9.75 13.7912 10.9588 15 12.45 15C13.1478 15 13.7854 14.7147 14.25 14.25M19.5 19.5C17.7 21 15 21.75 12 21.75C7.5 21.75 3.75 18.75 1.5 12.3C2.55 9.9 3.975 7.95 5.7 6.45M9.75 4.65C10.4625 4.425 11.2125 4.3125 12 4.3125C16.5 4.3125 20.25 7.3125 22.5 13.7625C21.975 15.0375 21.3375 16.2 20.5875 17.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 5.25C7.5 5.25 3.75 8.25 1.5 14.25C3.75 20.25 7.5 23.25 12 23.25C16.5 23.25 20.25 20.25 22.5 14.25C20.25 8.25 16.5 5.25 12 5.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 17.25C14.4853 17.25 16.5 15.2353 16.5 12.75C16.5 10.2647 14.4853 8.25 12 8.25C9.51472 8.25 7.5 10.2647 7.5 12.75C7.5 15.2353 9.51472 17.25 12 17.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password match indicator */}
              {passwordData.newPassword && passwordData.confirmPassword && (
                <div
                  className={`text-sm font-medium ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {passwordData.newPassword === passwordData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </div>
              )}

              {/* Change Password Button */}
              <div className="mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    passwordData.newPassword.length < 6 ||
                    changePasswordMutation.isPending
                  }
                  className="w-full px-6 py-3 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {changePasswordMutation.isPending
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p
                className="text-gray-700 mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to delete this program? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setProgramToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProgram}
                  disabled={deleteProgramMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {deleteProgramMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Changes Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="bg-[#4D49FC] text-white px-6 py-4 rounded-t-xl">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Save Changes
              </h3>
            </div>
            <div className="p-6">
              <p
                className="text-gray-700 mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to save these changes to the program?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdateProgram}
                  disabled={updateProgramMutation.isPending}
                  className="px-4 py-2 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {updateProgramMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Confirmation Modal */}
      {showPasswordConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="bg-[#4D49FC] text-white px-6 py-4 rounded-t-xl">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Password Change
              </h3>
            </div>
            <div className="p-6">
              <p
                className="text-gray-700 mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to change the password for this office
                account?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="px-4 py-2 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {changePasswordMutation.isPending
                    ? "Changing..."
                    : "Confirm Change"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}

EditOfficeDialog.propTypes = {
  office: PropTypes.shape({
    id: PropTypes.number,
    acronym: PropTypes.string,
    name: PropTypes.string,
    director: PropTypes.string,
    email: PropTypes.string,
    logo: PropTypes.string,
    programs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        is_fixed: PropTypes.bool,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
};
