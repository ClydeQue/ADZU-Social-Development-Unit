import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import UnitDirectorService from '@/services/unitDirectorService';
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

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
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
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
              {/* Search Bar */}
              <div className="relative ml-3 w-[500px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-10 bg-white text-[#040195] rounded-full pl-14
                   text-xs outline-none border 
                   border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <SearchIcon className="text-[#040195]" sx={{ fontSize: 30 }} />
                </div>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <EmailIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <NotificationsIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                      {user?.name || 'Unit Director'}
                    </div>
                    <div className="text-xs text-[rgba(0,0,0,0.6)]">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="bg-white rounded-[20px] p-6 mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-[#040195] text-3xl font-bold tracking-wide">
                    {monthYear.split(' ')[0]}
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevious}
                      className="w-8 h-8 flex items-center justify-center bg-[#F4F4F4] hover:bg-[#E8EAFF] rounded transition-colors"
                    >
                      <ChevronLeftIcon className="text-[#040195]" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-8 h-8 flex items-center justify-center bg-[#F4F4F4] hover:bg-[#E8EAFF] rounded transition-colors"
                    >
                      <ChevronRightIcon className="text-[#040195]" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleToday}
                  className="px-4 py-2 bg-[#5B6FED] text-white rounded-lg hover:bg-[#4A5DD9] transition-colors text-sm font-medium"
                >
                  Today
                </button>
              </div>

              {/* FullCalendar */}
              <div className="flex-1 overflow-auto calendar-container">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#5B6FED] text-lg">Loading calendar...</div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-red-500 text-lg mb-2">Error loading calendar</div>
                    <div className="text-gray-600 text-sm">{error.message}</div>
                  </div>
                ) : !events || events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-500 text-lg mb-2">No activities found</div>
                    <div className="text-gray-400 text-sm">There are currently no activities to display</div>
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
                    height="100%"
                    nowIndicator={true}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={3}
                    weekends={true}
                    fixedWeekCount={false}
                    showNonCurrentDates={true}
                    eventDisplay="block"
                    eventContent={(eventInfo) => {
                      const event = eventInfo.event;
                      const logo = event.extendedProps.office_logo;
                      const programTitle = event.extendedProps.program_title;
                      
                      return (
                        <div className="h-full w-full flex items-center gap-1.5 px-2 py-1 overflow-hidden cursor-pointer">
                          {/* Office Logo */}
                          {logo && (
                            <img 
                              src={logo} 
                              alt={event.extendedProps.office_acronym}
                              className="w-5 h-5 flex-shrink-0 object-contain"
                            />
                          )}
                          
                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            {/* Program Title - Low Opacity */}
                            {programTitle && (
                              <div className="text-[10px] text-white opacity-60 truncate leading-tight">
                                {programTitle}
                              </div>
                            )}
                            {/* Activity Name - Bold White */}
                            <div className="font-semibold text-xs text-white truncate leading-tight">
                              {event.title}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
              </div>

              {/* Office Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-medium text-gray-600">Offices:</span>
                  {Object.entries(OFFICE_LOGOS).map(([acronym, logo]) => (
                    <div key={acronym} className="flex items-center gap-2">
                      <img 
                        src={logo} 
                        alt={acronym}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="text-xs text-gray-700">{acronym}</span>
                    </div>
                  ))}
                </div>
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
        .calendar-container .fc {
          font-family: inherit;
        }

        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: #E5E7EB;
        }

        .calendar-container .fc-col-header-cell {
          background-color: #040195;
          color: white;
          font-weight: 600;
          padding: 12px 8px;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        .calendar-container .fc-timegrid-slot {
          height: 3em;
        }

        .calendar-container .fc-timegrid-slot-label {
          color: #6B7280;
          font-size: 0.75rem;
          vertical-align: middle;
          padding: 0 8px;
        }

        .calendar-container .fc-timegrid-event {
          border-radius: 12px !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          margin-right: 2px;
        }

        .calendar-container .fc-timegrid-event .fc-event-main {
          padding: 0 !important;
          border-radius: 12px !important;
        }

        .calendar-container .fc-event {
          border-radius: 12px !important;
          border: none !important;
        }

        .calendar-container .fc-timegrid-event:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transform: translateX(-2px);
          transition: all 0.2s ease;
        }

        .calendar-container .fc-daygrid-day-number {
          color: #040195;
          font-weight: 600;
          padding: 8px;
        }

        .calendar-container .fc-daygrid-day.fc-day-today {
          background-color: #E8EAFF !important;
        }

        .calendar-container .fc-timegrid-now-indicator-line {
          border-color: #EF4444;
          border-width: 2px;
        }

        .calendar-container .fc-timegrid-now-indicator-arrow {
          border-color: #EF4444;
          border-top-color: #EF4444;
        }

        .calendar-container .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-container .fc-timegrid-col.fc-day-today {
          background-color: #F9FAFB;
        }

        .calendar-container .fc-timegrid-axis {
          background-color: #F9FAFB;
        }

        .calendar-container .fc-event-main-frame {
          border-radius: 12px !important;
        }

        .calendar-container .fc-v-event {
          border-radius: 12px !important;
        }

        /* Ensure event content fills the rounded container */
        .calendar-container .fc-timegrid-event-harness {
          border-radius: 12px !important;
        }

        .calendar-container .fc-timegrid-event-harness-inset {
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
}
