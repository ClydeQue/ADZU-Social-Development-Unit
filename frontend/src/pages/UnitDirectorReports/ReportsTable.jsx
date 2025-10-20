import { useState } from 'react';
import PropTypes from 'prop-types';
 
const ReportsTable = ({ reports }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewedReports, setViewedReports] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows(prev => 
      prev.length === reports.length ? [] : reports.map(r => r.id)
    );
  };

  const markAsViewed = (id) => {
    if (!viewedReports.includes(id)) {
      setViewedReports(prev => [...prev, id]);
    }
  };

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
      <div className="bg-[#1E22AA] text-white rounded-xl px-3 py-2.5 mb-1 grid grid-cols-[35px_180px_1.2fr_1.2fr_140px_180px_160px] gap-3 items-center flex-shrink-0 flex-grow-0">
        <input 
          type="checkbox" 
          checked={selectedRows.length === reports.length}
          onChange={toggleAll}
          className="w-3 h-3 accent-[#4D49FC]"
        />
        <div className="text-xs font-semibold">Office</div>
        <div className="text-xs font-semibold">Program</div>
        <div className="text-xs font-semibold">Project / Activity</div>
        <div className="text-xs font-semibold">Due</div>
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
              } hover:bg-[#D4D1FF] transition-colors rounded-lg px-3 py-1 grid grid-cols-[35px_180px_1.2fr_1.2fr_140px_180px_160px] gap-3 items-center`}
            >
              <input 
                type="checkbox"
                checked={selectedRows.includes(report.id)}
                onChange={() => {
                  toggleRow(report.id);
                  markAsViewed(report.id);
                }}
                className="w-3 h-3 accent-[#4D49FC]"
              />
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
              <div className="text-[#4D49FC] font-semibold text-[0.7rem] whitespace-nowrap">{report.due}</div>
              <div className="text-[#4D49FC] text-[0.7rem] whitespace-nowrap">{report.submitted}</div>
              <div className="flex justify-end gap-1.5">
                <button 
                  onClick={() => markAsViewed(report.id)}
                  className="px-3 py-0.5 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#3D39EC] transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
                <button 
                  onClick={() => markAsViewed(report.id)}
                  className="px-3 py-0.5 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#3D39EC] transition-colors whitespace-nowrap"
                >
                  Print
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
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
