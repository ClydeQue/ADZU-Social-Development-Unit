import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactDOM from 'react-dom/client';
import UnitDirectorService from "@/services/unitDirectorService";
import { getOfficeLogo } from "@/utils/officeLogos";
import { getSDGIcons } from "@/utils/sdgData";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import ActivityPrintView from "@/components/ActivityPrintView";

/**
 * Report Detail Modal Component
 * Displays detailed information about a submitted report in a centered floating modal
 * Uses the same design as ActivityDetailModal but with report-specific data
 */
export default function ReportDetailModal({ report, activity, onClose }) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(
    activity?.status || "pending"
  );
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Parse venue from JSON string
  let venueData = { street: "", barangay: "", city: "", province: "" };
  if (activity?.venue) {
    try {
      venueData =
        typeof activity.venue === "string"
          ? JSON.parse(activity.venue)
          : activity.venue;
    } catch (e) {
      console.error("Error parsing venue:", e);
    }
  }

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) =>
      UnitDirectorService.updateActivityStatus(activity.id, newStatus),
    onSuccess: () => {
      // Invalidate queries to refresh data across all views
      queryClient.invalidateQueries(["activity", activity.id]);
      queryClient.invalidateQueries(["unit-director-reports"]);
      queryClient.invalidateQueries(["unit-director-activities"]);
      queryClient.invalidateQueries(["office-activities"]);
      queryClient.invalidateQueries(["office-reports"]);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("Update status error:", error);
      setErrorMessage(
        `Failed to update status: ${
          error.response?.data?.error || error.message
        }`
      );
      setShowErrorModal(true);
      // Reset to original status on error
      setSelectedStatus(activity?.status || "pending");
    },
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus === selectedStatus) return;

    if (confirm(`Change activity status to "${newStatus}"?`)) {
      setSelectedStatus(newStatus);
      updateStatusMutation.mutate(newStatus);
    }
  };

  // Handle Print PDF
  const handlePrint = () => {
    // Open new window for print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print this document.');
      return;
    }

    // Write the HTML structure
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Activity Report</title>
        <link rel="stylesheet" href="/ActivityPrintView.css">
        <style>
          body { margin: 0; padding: 0; }
          @media print {
            @page { margin: 0.4in 0.6in; }
          }
        </style>
      </head>
      <body>
        <div id="print-root"></div>
      </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for styles to load
    setTimeout(() => {
      const root = ReactDOM.createRoot(printWindow.document.getElementById('print-root'));
      root.render(<ActivityPrintView activity={activity} />);
      
      // Trigger print after rendering
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 800);
    }, 200);
  };

  // Listen for escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!report || !activity) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge colors
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();

    switch (statusLower) {
      case "pending":
        return {
          bg: "bg-[#4D49FC]",
          text: "text-white",
          border: "border-2 border-[#4D49FC]",
        };
      case "in progress":
      case "in-progress":
        return {
          bg: "bg-[#FFAE00]",
          text: "text-white",
          border: "border-2 border-[#4D49FC]",
        };
      case "completed":
        return {
          bg: "bg-[#18B703]",
          text: "text-white",
          border: "border-2 border-[#4D49FC]",
        };
      case "cancelled":
        return {
          bg: "bg-[#FF0022]",
          text: "text-white",
          border: "border-2 border-[#4D49FC]",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-[#040195]",
          border: "border-2 border-[#4D49FC]",
        };
    }
  };

  // Format budget
  const formatBudget = (amount) => {
    if (!amount && amount !== 0) return "₱ 0.00";
    return `₱ ${parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Parse SDG numbers from sdg_number column (stores JSON array)
  let sdgNumbers = [];
  try {
    if (activity.sdg_number) {
      // sdg_number now stores JSON array of SDG numbers
      sdgNumbers =
        typeof activity.sdg_number === "string"
          ? JSON.parse(activity.sdg_number)
          : Array.isArray(activity.sdg_number)
          ? activity.sdg_number
          : [activity.sdg_number];
    }
  } catch (e) {
    console.error("Error parsing SDG numbers:", e);
    // Fallback if parsing fails
    if (activity.sdg_number && !isNaN(activity.sdg_number)) {
      sdgNumbers = [parseInt(activity.sdg_number)];
    }
  }

  // Get icons for all SDGs
  const sdgs = sdgNumbers.flatMap((num) => getSDGIcons(num));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: "rgba(4, 1, 149, 0.4)", overflow: "hidden" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div
        className="bg-[#fafafa] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto modal-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "Inter, sans-serif",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .modal-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Action Buttons at Top */}
        <div className="flex flex-wrap items-center justify-end gap-2 mb-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center rounded-xl hover:opacity-90 hover:cursor-pointer transition-opacity
            bg-[#4D49FC] text-white text-xs sm:text-sm font-bold"
            title="Print Report"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            PRINT
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex ml-1 sm:ml-2 items-center justify-center rounded-full 
            bg-white ring-3 ring-[#4D49FC] hover:cursor-pointer hover:bg-gray-300 transition-colors"
            title="Close"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#4D49FC]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header Section with Program Logo/Image */}
        <div className="relative sm:p-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
            {/* Logo/Icon Container with Phase Pill */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                <img
                  src={activity.image_url || "/reports/default.webp"}
                  alt={activity.activity_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/reports/default.webp";
                  }}
                />
              </div>
              {/* Phase Pill - Split Design */}
              {activity.phase && (
                <div className="w-20 sm:w-32 flex rounded-full overflow-hidden border-2 border-[#4D49FC] shadow-sm">
                  <span className="flex-1 bg-[#4D49FC] text-white text-[7px] sm:text-[9px] font-bold py-0.5 text-center">
                    PHASE
                  </span>
                  <span className="flex-1 bg-white text-[#4D49FC] text-[7px] sm:text-[9px] font-bold py-0.5 text-center uppercase">
                    {activity.phase}
                  </span>
                </div>
              )}
            </div>

            {/* Program Title and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {getOfficeLogo(report.office) && (
                  <img
                    src={getOfficeLogo(report.office)}
                    alt={report.office}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="text-[#4D49FC] text-sm font-bold uppercase tracking-wider">
                  {report.office}
                </span>
              </div>
              <h2 className="text-[#4D49FC] w-full sm:w-80 lg:w-100 text-lg sm:text-xl md:text-3xl font-black mb-2 leading-tight uppercase">
                {activity.activity_name}
              </h2>
              <div className="text-[#040195] text-xs sm:text-sm font-semibold mb-1">
                {report.program}
              </div>
              <p className="text-[#040195] text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                {activity.description || "Activity description"}
              </p>
            </div>
          </div>

          {/* Status Badge and Dates */}
          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            {/* Custom Status Badge Dropdown */}
            <div className="mb-2 relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={updateStatusMutation.isPending}
                className={`w-full sm:w-56 px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-full text-center mb-2 ${
                  getStatusStyle(selectedStatus).bg
                } ${getStatusStyle(selectedStatus).border}
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:opacity-90 transition-opacity
                flex items-center justify-center gap-2`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    getStatusStyle(selectedStatus).text
                  }`}
                >
                  {selectedStatus === "in-progress"
                    ? "IN PROGRESS"
                    : selectedStatus.toUpperCase()}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showStatusDropdown ? "rotate-180" : ""
                  } ${getStatusStyle(selectedStatus).text}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showStatusDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10 overflow-hidden">
                  {[
                    { value: "pending", label: "Pending" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        handleStatusChange(status.value);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-gray-100 transition-colors
                      ${selectedStatus === status.value ? "bg-blue-50" : ""}`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}

              {updateStatusMutation.isPending && (
                <div className="text-center mt-1">
                  <span className="text-xs text-gray-500">Updating...</span>
                </div>
              )}
            </div>
            <div className="text-[#040195] text-xs w-full sm:w-56">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold">INCEPTION</span>
                  <span className="flex-1 text-center">:</span>
                  <span>{formatDate(activity.start_date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">IMPLEMENTATION</span>
                  <span className="flex-1 text-center">:</span>
                  <span>{formatDate(activity.end_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thick Rounded Divider */}
        <div className="mx-3 sm:mx-6 my-3 sm:my-2 h-1 bg-[#040195] rounded-full"></div>

        {/* Content Section */}
        <div className="p-3 sm:p-6 pt-0">
          {/* Row 1: Objectives (Left) and SDG Goals (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="sm:col-span-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
                OBJECTIVES
              </h3>
              <p className="text-[#040195] text-xs sm:text-sm leading-relaxed">
                {activity.objectives || "No objectives specified"}
              </p>
            </div>

            {/* SDG Goals - Right Side */}
            {sdgs.length > 0 && (
              <div className="sm:border-l-2 border-t-2 sm:border-t-0 border-[#040195] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-3 uppercase">
                  SDG Goals
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {sdgs.map((sdg) => (
                    <div
                      key={sdg.id}
                      className="w-12 h-12 rounded-lg overflow-hidden shadow-lg"
                      title={sdg.label}
                    >
                      <img
                        src={sdg.icon}
                        alt={sdg.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 2: Three Columns - Venue, Participant Demographics, Sex */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Column 1: Venue */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
                VENUE
              </h3>
              <div className="text-[#040195] text-xs leading-relaxed">
                {venueData.street && <div>{venueData.street}</div>}
                {venueData.barangay && <div>Zone {venueData.barangay}</div>}
                {venueData.city && <div>{venueData.city}</div>}
                {venueData.province && <div>{venueData.province}</div>}
                {!venueData.street &&
                  !venueData.barangay &&
                  !venueData.city &&
                  !venueData.province && (
                    <div className="text-gray-400">No venue information</div>
                  )}
              </div>
            </div>

            {/* Column 2: Participant Demographics */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
                PARTICIPANT DEMOGRAPHICS
              </h3>
              <div className="text-[#040195] text-xs leading-relaxed space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">TOTAL</span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {report.participants ||
                      activity.participants_count ||
                      (activity.male_participants || 0) +
                        (activity.female_participants || 0)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">
                    CLASSIFICATION
                  </span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {activity.partner_type || "General Participants"}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Sex */}
            <div className="sm:border-l-2 border-t-2 sm:border-t-0 border-[#040195] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
                SEX COUNT
              </h3>
              <div className="text-[#040195] text-xs leading-relaxed space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">MALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-2 text-left">
                    {activity.male_participants || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">FEMALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-2 text-left">
                    {activity.female_participants || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 3: Partners */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
              PARTNERS
            </h3>
            {activity.partner_name || activity.implementing_partners ? (
              <div className="space-y-2">
                {activity.partner_name ? (
                  (() => {
                    const names = activity.partner_name
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const types = activity.partner_type
                      ? activity.partner_type
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];
                    const natures = activity.partner_nature
                      ? activity.partner_nature
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];

                    return names.map((name, index) => (
                      <div
                        key={index}
                        className="text-[#040195] text-xs leading-relaxed"
                      >
                        <span className="font-semibold">{name}</span>
                        {types[index] && (
                          <span className="italic text-gray-600 ml-2">
                            {types[index]}
                          </span>
                        )}
                        {natures[index] && (
                          <span className="text-gray-600 ml-2">
                            {natures[index]}
                          </span>
                        )}
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-[#040195] text-xs leading-relaxed">
                    {activity.implementing_partners}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-xs">
                No partner information
              </div>
            )}
          </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 4: Budget Overview */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
              BUDGET OVERVIEW
            </h3>
            {(() => {
              // Parse budgets from budget_amount and budget_type JSON arrays
              let budgets = [];
              try {
                if (activity.budget_amount && activity.budget_type) {
                  const amounts =
                    typeof activity.budget_amount === "string"
                      ? JSON.parse(activity.budget_amount)
                      : [activity.budget_amount];
                  const types =
                    typeof activity.budget_type === "string"
                      ? JSON.parse(activity.budget_type)
                      : [activity.budget_type];
                  budgets = amounts.map((amount, index) => ({
                    amount: amount,
                    type: types[index] || "external",
                  }));
                } else if (activity.budget_amount) {
                  // Single value fallback
                  budgets = [
                    {
                      amount: activity.budget_amount,
                      type: activity.budget_type || "external",
                    },
                  ];
                }
              } catch (e) {
                console.error("Error parsing budgets:", e);
                // Fallback for non-JSON values
                if (activity.budget_amount) {
                  budgets = [
                    {
                      amount: activity.budget_amount,
                      type: activity.budget_type || "external",
                    },
                  ];
                }
              }

              return budgets.length > 0 ? (
                <div className="space-y-2">
                  {budgets.map((budget, index) => (
                    <div
                      key={index}
                      className="text-[#040195] text-xs leading-relaxed"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-semibold min-w-[100px]">
                          {formatBudget(budget.amount)}
                        </span>
                        <span className="italic text-gray-600">
                          {budget.type === "external"
                            ? "External Fund"
                            : "Internal Fund"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-xs">
                  No budget information
                </div>
              );
            })()}
          </div>

          {/* Notes - Optional Row */}
          {activity.notes && (
            <>
              <hr className="my-4 sm:my-6 border-[#040195]" />
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">
                  NOTES
                </h3>
                <p className="text-[#040195] text-xs leading-relaxed">
                  {activity.notes}
                </p>
              </div>
            </>
          )}

          {/* View Full Report Button(s) */}
          {(() => {
            // Parse report URLs - could be JSON array or single string
            let reportUrls = [];
            if (activity.report_url) {
              try {
                const parsed = JSON.parse(activity.report_url);
                reportUrls = Array.isArray(parsed) ? parsed.filter(url => url && url.trim()) : [activity.report_url];
              } catch {
                // If not valid JSON, treat as single URL
                if (activity.report_url.trim()) {
                  reportUrls = [activity.report_url];
                }
              }
            }
            
            if (reportUrls.length > 0) {
              return (
                <div className="flex flex-wrap justify-end gap-2 mt-6">
                  {reportUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => window.open(url, "_blank")}
                      className="px-6 py-2.5 bg-[#4D49FC] text-white text-sm font-bold rounded-xl hover:bg-[#3d39cc] cursor-pointer transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      {reportUrls.length > 1 ? `REPORT ${index + 1}` : 'VIEW FULL REPORT'}
                    </button>
                  ))}
                </div>
              );
            }
            return (
              <div className="flex justify-end mt-6">
                <span className="text-gray-500 text-sm italic">
                  No link provided
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        action="updated"
        itemName="Status"
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
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

ReportDetailModal.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    office: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    due: PropTypes.string.isRequired,
    submitted: PropTypes.string.isRequired,
    participants: PropTypes.number,
    budget: PropTypes.number,
  }).isRequired,
  activity: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  officeColor: PropTypes.string,
};
