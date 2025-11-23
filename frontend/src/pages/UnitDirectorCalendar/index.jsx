import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import UnitDirectorService from '@/services/unitDirectorService';
import NotificationDropdown from '@/components/NotificationDropdown';
import InboxDropdown from '@/components/InboxDropdown';
import CalendarSkeleton from '@/components/CalendarSkeleton';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

// Office color mapping - using single color
const OFFICE_COLOR = '#4D49FC';

// Office logo mapping
const OFFICE_LOGOS = {
  'CCES': '/logos/officeLogoTransparent/ccesLogo.webp',
  'ACCA': '/logos/officeLogoTransparent/accaLogo.webp',
  'ACES': '/logos/officeLogoTransparent/acesLogo.webp',
  'ALTEC': '/logos/officeLogoTransparent/altecLogo.webp',
  'APC': '/logos/officeLogoTransparent/apcLogo.webp',
  'ACLG': '/logos/officeLogoTransparent/aclgLogo.webp',
};

// Status color mapping
const STATUS_COLORS = {
  'completed': '#4CAF50',
  'in progress': '#FFB300',
  'ongoing': '#FFB300',
  'pending': '#9E9E9E',
  'planned': '#9E9E9E',
  'cancelled': '#F44336',
};

export default function UnitDirectorCalendar() {
  const { user } = useAuth();
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch all activities
  const { data: activitiesData, isLoading, error } = useQuery({
    queryKey: ['unit-director-activities'],
    queryFn: () => UnitDirectorService.getAllActivities(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Transform activities to FullCalendar events
  const events = activitiesData?.activities?.map((activity) => {
    const statusColor = STATUS_COLORS[activity.status?.toLowerCase()] || '#9E9E9E';
    
    // Ensure proper date formatting
    const startDate = activity.start || activity.start_date;
    let endDate = activity.end || activity.end_date;
    
    // FullCalendar needs end date to be exclusive (next day) for all-day events
    if (endDate && !endDate.includes('T')) {
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      endDate = endDateObj.toISOString().split('T')[0];
    }
    
    return {
      id: activity.id,
      title: activity.title || activity.activity_name,
      start: startDate,
      end: endDate,
      allDay: true, // All-day events for horizontal spanning across days
      backgroundColor: OFFICE_COLOR,
      borderColor: '#040195',
      textColor: '#FFFFFF',
      extendedProps: {
        status: activity.status,
        office_name: activity.office_name,
        office_acronym: activity.office_acronym,
        office_logo: OFFICE_LOGOS[activity.office_acronym] || OFFICE_LOGOS['CCES'],
        program_title: activity.program_title,
        venue: activity.venue,
        participants_count: activity.participants_count,
        objectives: activity.objectives,
        notes: activity.notes,
        statusColor: statusColor,
      }
    };
  }) || [];

  // Handle event click
  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      ...clickInfo.event.extendedProps,
    });
  };

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
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric' 
  }).toUpperCase();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
        <main className="flex-grow p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Single Container for Header and Calendar */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 sm:p-3 xl:p-4 mx-2 sm:mx-3 xl:mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 mb-2 xl:mb-3 flex-shrink-0">
                {/* Month and Navigation */}
                <div className="flex items-center gap-3">
                  <h1 className="text-[#040195] text-lg sm:text-xl xl:text-2xl font-bold tracking-wide">
                    {monthYear.split(' ')[0]}
                  </h1>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevious}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded transition-colors"
                    >
                      <ChevronLeftIcon className="text-[#040195]" fontSize="small" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded transition-colors"
                    >
                      <ChevronRightIcon className="text-[#040195]" fontSize="small" />
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
                    <div className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium text-xs sm:text-sm xl:text-base">
                      {user?.name?.charAt(0) || "U"}
                    </div>
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
                    <div className="text-red-500 text-sm mb-1">Error loading calendar</div>
                    <div className="text-gray-600 text-xs">{error.message}</div>
                  </div>
                ) : !events || events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-500 text-sm mb-1">No activities found</div>
                    <div className="text-gray-400 text-xs">There are currently no activities to display</div>
                  </div>
                ) : (
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
                    dayMaxEvents={2}
                    weekends={true}
                    fixedWeekCount={false}
                    showNonCurrentDates={true}
                    eventDisplay="block"
                    dayCellContent={(arg) => arg.dayNumberText}
                    eventContent={(eventInfo) => {
                      const event = eventInfo.event;
                      const logo = event.extendedProps.office_logo;
                      const programTitle = event.extendedProps.program_title;
                      
                      return (
                        <div className="h-full w-full flex items-center gap-1.5 px-2 py-1 overflow-hidden cursor-pointer">
                          {/* Office Logo - White filtered */}
                          {logo && (
                            <img 
                              src={logo} 
                              alt={event.extendedProps.office_acronym}
                              className="w-4 h-4 flex-shrink-0 object-contain"
                              style={{ filter: 'brightness(0) invert(1)' }}
                            />
                          )}
                          
                          {/* Two-line text layout */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {/* Program name - super small text above */}
                            <div className="text-[8px] text-white/80 truncate leading-tight uppercase">
                              {programTitle || 'Program'}
                            </div>
                            {/* Activity name - bigger bold text below */}
                            <div className="font-bold text-[11px] text-white truncate leading-tight">
                              {event.title}
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#040195] mb-2">
                  {selectedEvent.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedEvent.statusColor }}
                  >
                    {selectedEvent.status?.toUpperCase() || 'PENDING'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedEvent.office_name} ({selectedEvent.office_acronym})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <CloseIcon className="text-gray-600" fontSize="small" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Program</h3>
                <p className="text-gray-600">{selectedEvent.program_title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Start Date</h3>
                  <p className="text-gray-600">
                    {new Date(selectedEvent.start).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">End Date</h3>
                  <p className="text-gray-600">
                    {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedEvent.venue && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Venue</h3>
                  <p className="text-gray-600">{selectedEvent.venue}</p>
                </div>
              )}

              {selectedEvent.participants_count && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Participants</h3>
                  <p className="text-gray-600">{selectedEvent.participants_count} people</p>
                </div>
              )}

              {selectedEvent.objectives && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Objectives</h3>
                  <p className="text-gray-600">{selectedEvent.objectives}</p>
                </div>
              )}

              {selectedEvent.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
                  <p className="text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          min-height: 80px;
        }

        .calendar-container .fc-daygrid-day-frame {
          min-height: 80px;
        }

        .calendar-container .fc-daygrid-day-events {
          margin: 0 !important;
        }

        .calendar-container .fc-daygrid-event-harness {
          margin: 1px 2px !important;
        }

        .calendar-container .fc-event {
          border-radius: 9999px !important;
          border: none !important;
          margin-bottom: 1px !important;
          padding: 0 !important;
          font-size: 10px !important;
          min-height: 28px !important;
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
          font-size: 9px !important;
          padding: 1px 3px !important;
          margin: 1px 2px !important;
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
