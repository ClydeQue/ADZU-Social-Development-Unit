import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import UnitDirectorService from "@/services/unitDirectorService";
import NotificationDropdown from "@/components/NotificationDropdown";
import InboxDropdown from "@/components/InboxDropdown";
import CalendarSkeleton from "@/components/CalendarSkeleton";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { getOfficeLogo } from "@/utils/officeLogos";
import { getSDGIcons } from "@/utils/sdgData";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

// Office color mapping - using single color
const OFFICE_COLOR = "#4D49FC";

// Office logo mapping
const OFFICE_LOGOS = {
  CCES: "/logos/officeLogoTransparent/ccesLogo.webp",
  ACCA: "/logos/officeLogoTransparent/accaLogo.webp",
  ACES: "/logos/officeLogoTransparent/acesLogo.webp",
  ALTEC: "/logos/officeLogoTransparent/altecLogo.webp",
  APC: "/logos/officeLogoTransparent/apcLogo.webp",
  ACLG: "/logos/officeLogoTransparent/aclgLogo.webp",
};

// Status color mapping
const STATUS_COLORS = {
  completed: "#4CAF50",
  "in progress": "#FFB300",
  ongoing: "#FFB300",
  pending: "#9E9E9E",
  planned: "#9E9E9E",
  cancelled: "#F44336",
};

export default function UnitDirectorCalendar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const calendarRef = useRef(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all activities
  const {
    data: activitiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-activities"],
    queryFn: () => UnitDirectorService.getAllActivities(),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Fetch full activity details when an event is selected
  const {
    data: activityDetails,
    isLoading: isLoadingDetails,
  } = useQuery({
    queryKey: ["activity-details", selectedEventId],
    queryFn: () => UnitDirectorService.getActivityById(selectedEventId),
    enabled: !!selectedEventId,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });

  // Transform activities to FullCalendar events
  const events =
    activitiesData?.activities?.map((activity) => {
      const statusColor =
        STATUS_COLORS[activity.status?.toLowerCase()] || "#9E9E9E";

      // Ensure proper date formatting
      const startDate = activity.start || activity.start_date;
      let endDate = activity.end || activity.end_date;

      // FullCalendar needs end date to be exclusive (next day) for all-day events
      if (endDate && !endDate.includes("T")) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        endDate = endDateObj.toISOString().split("T")[0];
      }

      return {
        id: activity.id,
        title: activity.title || activity.activity_name,
        start: startDate,
        end: endDate,
        allDay: true, // All-day events for horizontal spanning across days
        backgroundColor: OFFICE_COLOR,
        borderColor: "#040195",
        textColor: "#FFFFFF",
        extendedProps: {
          status: activity.status,
          office_name: activity.office_name,
          office_acronym: activity.office_acronym,
          office_logo:
            OFFICE_LOGOS[activity.office_acronym] || OFFICE_LOGOS["CCES"],
          program_title: activity.program_title,
          venue: activity.venue,
          participants_count: activity.participants_count,
          objectives: activity.objectives,
          notes: activity.notes,
          statusColor: statusColor,
        },
      };
    }) || [];

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) =>
      UnitDirectorService.updateActivityStatus(selectedEventId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["activity-details", selectedEventId]);
      queryClient.invalidateQueries(["unit-director-activities"]);
      queryClient.invalidateQueries(["unit-director-reports"]);
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
      setSelectedStatus(activityDetails?.status || "pending");
    },
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus === selectedStatus) return;

    if (confirm(`Change activity status to "${newStatus}"?`)) {
      setSelectedStatus(newStatus);
      updateStatusMutation.mutate(newStatus);
    }
  };

  // Handle event click - store activity ID to fetch full details
  const handleEventClick = (clickInfo) => {
    const activityId = clickInfo.event.id;
    setSelectedEventId(activityId);
    setSelectedStatus(clickInfo.event.extendedProps.status || "pending");
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedEventId(null);
    setShowStatusDropdown(false);
  };

  // Listen for escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedEventId) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selectedEventId]);

  // Handle date change
  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  // Navigation handlers
  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  // Format month and year for display
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-2 sm:p-4 md:p-6 xl:p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
          <main className="flex-grow p-1 sm:p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Single Container for Header and Calendar */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 sm:p-3 xl:p-4 mx-1 sm:mx-2 xl:mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 mb-2 xl:mb-3 flex-shrink-0">
                {/* Month and Navigation */}
                <div className="flex items-center gap-3">
                  <h1 className="text-[#040195] text-lg sm:text-xl xl:text-2xl font-bold tracking-wide min-w-[280px] sm:min-w-[320px]">
                    {year} {month}
                  </h1>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={handlePrevious}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded transition-colors flex-shrink-0"
                    >
                      <ChevronLeftIcon
                        className="text-[#040195]"
                        fontSize="small"
                      />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded transition-colors flex-shrink-0"
                    >
                      <ChevronRightIcon
                        className="text-[#040195]"
                        fontSize="small"
                      />
                    </button>
                  </div>
                </div>

                {/* Icons - Using actual components */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                  {/* Inbox */}
                  <InboxDropdown />

                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Avatar - Same style as Overview */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/logos/sdu-logo-colored.webp"
                      alt="Unit Director"
                      className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default_logo.webp";
                      }}
                    />
                    <div className="hidden sm:block">
                      <div className="text-xs xl:text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                        {user?.name || "Unit Director"}
                      </div>
                      <div className="text-[10px] xl:text-xs text-[rgba(0,0,0,0.6)]">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FullCalendar */}
              <div className="flex-1 overflow-hidden calendar-container">
                {isLoading ? (
                  <CalendarSkeleton />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-red-500 text-sm mb-1">
                      Error loading calendar
                    </div>
                    <div className="text-gray-600 text-xs">{error.message}</div>
                  </div>
                ) : !events || events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-500 text-sm mb-1">
                      No activities found
                    </div>
                    <div className="text-gray-400 text-xs">
                      There are currently no activities to display
                    </div>
                  </div>
                ) : (
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin,
                    ]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    events={events}
                    eventClick={handleEventClick}
                    datesSet={handleDatesSet}
                    height="parent"
                    aspectRatio={1.5}
                    nowIndicator={true}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={3}
                    weekends={true}
                    fixedWeekCount={false}
                    showNonCurrentDates={true}
                    eventDisplay="block"
                    eventOrder="start,-duration,allDay,title"
                    dayCellContent={(arg) => arg.dayNumberText}
                    eventContent={(eventInfo) => {
                      const event = eventInfo.event;
                      const logo = event.extendedProps.office_logo;
                      const programTitle = event.extendedProps.program_title;

                      return (
                        <div className="h-full w-full flex items-center gap-1.5 px-2 py-1.5 overflow-hidden cursor-pointer rounded-lg border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                          {/* Office Logo */}
                          {logo && (
                            <img
                              src={logo}
                              alt={event.extendedProps.office_acronym}
                              className="w-5 h-5 flex-shrink-0 object-contain"
                              style={{ filter: "brightness(0) invert(1)" }}
                            />
                          )}

                          {/* Text content */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                            {/* Activity name - primary text */}
                            <div className="font-bold text-[11px] text-white truncate leading-tight">
                              {event.title}
                            </div>
                            {/* Program name - secondary text */}
                            <div className="text-[9px] text-white/70 truncate leading-tight">
                              {event.extendedProps.office_acronym} • {programTitle || "Program"}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </WhiteContainer>

      {/* Activity Details Modal - ReportDetailModal Style */}
      {selectedEventId && activityDetails && !isLoadingDetails && (() => {
        const activity = activityDetails.activity || activityDetails;
        
        // Add office info from nested programs if not at root
        if (activity.programs && !activity.office_acronym) {
          activity.office_acronym = activity.programs.offices?.acronym;
          activity.office_name = activity.programs.offices?.name;
          activity.office_id = activity.programs.offices?.id;
        }
        if (activity.programs && !activity.program_title) {
          activity.program_title = activity.programs.title;
        }
        
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

        // Parse SDG numbers
        let sdgNumbers = [];
        try {
          if (activity.sdg_number) {
            sdgNumbers =
              typeof activity.sdg_number === "string"
                ? JSON.parse(activity.sdg_number)
                : Array.isArray(activity.sdg_number)
                ? activity.sdg_number
                : [activity.sdg_number];
          }
        } catch (e) {
          console.error("Error parsing SDG numbers:", e);
          if (activity.sdg_number && !isNaN(activity.sdg_number)) {
            sdgNumbers = [parseInt(activity.sdg_number)];
          }
        }

        const sdgs = sdgNumbers.flatMap((num) => getSDGIcons(num));

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            style={{ backgroundColor: "rgba(4, 1, 149, 0.4)", overflow: "hidden" }}
            onClick={handleCloseModal}
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
              <div className="flex items-center justify-end gap-2 mb-2">
                {/* Print Button */}
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 flex items-center justify-center rounded-xl hover:opacity-90 hover:cursor-pointer transition-opacity
                  bg-[#4D49FC] text-white text-sm font-bold"
                  title="Print Report"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  onClick={handleCloseModal}
                  className="w-10 h-10 sm:w-8 sm:h-8 flex ml-2 items-center justify-center rounded-full 
                  bg-white ring-3 ring-[#4D49FC] hover:cursor-pointer hover:bg-gray-300 transition-colors"
                  title="Close"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#4D49FC]"
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
                  {/* Logo/Icon Container */}
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

                  {/* Program Title and Description */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      {getOfficeLogo(activity.office_acronym) && (
                        <img
                          src={getOfficeLogo(activity.office_acronym)}
                          alt={activity.office_acronym}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-[#4D49FC] text-sm font-bold uppercase tracking-wider">
                        {activity.office_acronym || activity.office_name}
                      </span>
                    </div>
                    <h2 className="text-[#4D49FC] w-80 lg:w-100 text-xl sm:text-3xl font-black mb-2 leading-tight uppercase">
                      {activity.activity_name}
                    </h2>
                    <div className="text-[#040195] text-xs sm:text-sm font-semibold mb-1">
                      {activity.program_title}
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
                          {activity.participants_count ||
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
                        budgets = [
                          {
                            amount: activity.budget_amount,
                            type: activity.budget_type || "external",
                          },
                        ];
                      }
                    } catch (e) {
                      console.error("Error parsing budgets:", e);
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

                {/* View Full Report Button */}
                {activity.report_url ? (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => window.open(activity.report_url, "_blank")}
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
                      VIEW FULL REPORT
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-6">
                    <span className="text-gray-500 text-sm italic">
                      No link provided
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        action="updated"
        itemName="Status"
        onClose={() => {
          setShowSuccessModal(false);
          handleCloseModal();
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      {/* Custom CSS for FullCalendar */}
      <style>{`
        .calendar-container {
          height: 100%;
          overflow: hidden;
        }

        .calendar-container .fc {
          font-family: inherit;
          height: 100% !important;
        }

        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: #E5E7EB;
        }

        .calendar-container .fc-col-header-cell {
          background-color: #040195;
          color: white;
          font-weight: 600;
          padding: 6px 2px;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.3px;
        }

        .calendar-container .fc-daygrid-day {
          min-height: 100px;
        }

        .calendar-container .fc-daygrid-day-frame {
          min-height: 100px;
          padding: 4px;
        }

        .calendar-container .fc-daygrid-day-events {
          margin: 2px 0 !important;
        }

        .calendar-container .fc-daygrid-event-harness {
          margin: 2px !important;
        }

        .calendar-container .fc-event {
          border-radius: 8px !important;
          border: none !important;
          margin-bottom: 3px !important;
          padding: 0 !important;
          font-size: 10px !important;
          min-height: 32px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }

        .calendar-container .fc-event:hover {
          box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }

        .calendar-container .fc-event-main {
          padding: 0 !important;
        }

        .calendar-container .fc-event img {
          filter: brightness(0) invert(1) !important;
        }

        .calendar-container .fc-daygrid-day-number {
          color: #040195;
          font-weight: 600;
          padding: 2px 4px;
          font-size: 0.75rem;
        }

        /* Today highlighting - Gold/yellow color */
        .calendar-container .fc-daygrid-day.fc-day-today {
          background-color: #FFF9E6 !important;
        }

        .calendar-container .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background-color: #FFB300;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px;
          font-weight: 700;
        }

        .calendar-container .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-container .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
          min-height: auto !important;
        }

        .calendar-container .fc-more-link {
          font-size: 10px !important;
          padding: 2px 6px !important;
          margin: 2px !important;
          background-color: #040195 !important;
          color: white !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
        }

        .calendar-container .fc-more-link:hover {
          background-color: #4D49FC !important;
        }

        /* Remove scrollbars from calendar */
        .calendar-container .fc-scroller {
          overflow: hidden !important;
        }

        .calendar-container .fc-scroller-liquid-absolute {
          overflow: hidden !important;
        }

        .calendar-container .fc-view-harness {
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
