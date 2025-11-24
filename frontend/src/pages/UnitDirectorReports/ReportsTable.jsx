import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import UnitDirectorService from '@/services/unitDirectorService';
import ReportDetailModal from './ReportDetailModal';
import ReportModalSkeleton from '@/components/ReportModalSkeleton';
import ActivityPrintView from '@/components/ActivityPrintView';
 
const ReportsTable = ({ reports }) => {
  const [viewedReports, setViewedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const markAsViewed = (id) => {
    if (!viewedReports.includes(id)) {
      setViewedReports(prev => [...prev, id]);
    }
  };

  // Fetch full activity details when a report is selected for viewing
  const { data: activityData, isLoading: isLoadingActivity, error: activityError } = useQuery({
    queryKey: ['activity', selectedReport],
    queryFn: async () => {
      if (!selectedReport) return null;
      console.log('Fetching activity:', selectedReport);
      const response = await UnitDirectorService.getActivityById(selectedReport);
      console.log('Activity response:', response);
      // Backend returns { activity: {...} }
      return response.activity || response;
    },
    enabled: !!selectedReport,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleViewReport = (reportId) => {
    console.log('View report clicked:', reportId);
    markAsViewed(reportId);
    setSelectedReport(reportId);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const handlePrintReport = async (reportId) => {
    try {
      // Fetch the activity data first
      const response = await UnitDirectorService.getActivityById(reportId);
      const activity = response.activity || response;
      
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
    } catch (error) {
      console.error('Error printing report:', error);
      alert('Failed to load report for printing. Please try again.');
    }
  };

  const currentReport = reports.find(r => r.id === selectedReport);

  return (
    <div 
      className="h-full flex flex-col" 
      style={{ 
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{`
        .reports-scroll-container::-webkit-scrollbar {
          width: 5px;
        }
        .reports-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .reports-scroll-container::-webkit-scrollbar-thumb {
          background-color: #040195;
          border-radius: 42px;
        }
        .reports-scroll-container::-webkit-scrollbar-thumb:hover {
          background-color: #030174;
        }
      `}</style>
      
      {/* Header Row */}
      <div className="bg-[#1E22AA] text-white rounded-xl px-3 py-2.5 mb-1 grid grid-cols-[180px_1.2fr_1.2fr_180px_160px] gap-3 items-center flex-shrink-0 flex-grow-0">
        <div className="text-xs font-semibold">Office</div>
        <div className="text-xs font-semibold">Program</div>
        <div className="text-xs font-semibold">Project / Activity</div>
        <div className="text-xs font-semibold">Submitted</div>
        <div></div>
      </div>

      {/* Data Rows - Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 reports-scroll-container min-h-0">
        <div className="space-y-1.5">
        {reports.map((report) => {
          const isNew = report.isNew && !viewedReports.includes(report.id);
          
          return (
            <div 
              key={report.id}
              className={`${
                isNew ? 'bg-[#C7D2FE]' : 'bg-white'
              } hover:bg-[#D4D1FF] transition-colors rounded-lg px-3 py-1 grid grid-cols-[180px_1.2fr_1.2fr_180px_160px] gap-3 items-center`}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <img src={report.logo} alt={report.office} className="w-5 h-5 object-contain flex-shrink-0" />
                <span className="text-[#4D49FC] font-semibold text-[0.7rem] whitespace-nowrap">{report.office}</span>
                {isNew && (
                  <span className="bg-red-500 text-white text-[0.55rem] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                    New
                  </span>
                )}
              </div>
              <div className="text-[#4D49FC] text-[0.7rem] truncate">{report.program}</div>
              <div className="text-[#4D49FC] text-[0.7rem] truncate">{report.activity}</div>
              <div className="text-[#4D49FC] text-[0.7rem] whitespace-nowrap">{report.submitted}</div>
              <div className="flex justify-end gap-1.5">
                <button 
                  onClick={() => handleViewReport(report.id)}
                  className="px-3 py-0.5 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#201f65] hover:cursor-pointer transition-colors duration-200 whitespace-nowrap"
                >
                  View
                </button>
                <button 
                  onClick={() => handlePrintReport(report.id)}
                  className="px-3 py-0.5 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#201f65] hover:cursor-pointer transition-colors whitespace-nowrap"
                >
                  Print
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && currentReport && (
        isLoadingActivity ? (
          <ReportModalSkeleton onClose={handleCloseModal} />
        ) : activityError ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(4, 1, 149, 0.4)' }} onClick={handleCloseModal}>
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-md">
              <div className="text-red-600 text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Error Loading Report
              </div>
              <p className="text-gray-700 mb-4">
                {activityError?.message || 'Failed to load activity details'}
              </p>
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[#4D49FC] text-white rounded-md hover:bg-[#3D39EC] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : activityData ? (
          <ReportDetailModal
            report={currentReport}
            activity={activityData}
            onClose={handleCloseModal}
          />
        ) : null
      )}
    </div>
  );
};

ReportsTable.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      office: PropTypes.string.isRequired,
      program: PropTypes.string.isRequired,
      activity: PropTypes.string.isRequired,
      due: PropTypes.string.isRequired,
      submitted: PropTypes.string.isRequired,
      isNew: PropTypes.bool.isRequired,
      logo: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ReportsTable;
