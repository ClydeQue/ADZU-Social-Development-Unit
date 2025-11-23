import PropTypes from 'prop-types';
import './ConsolidatedReportPrintView.css';

/**
 * ConsolidatedReportPrintView Component
 * Generates a printable consolidated report for all monthly activities
 */
const ConsolidatedReportPrintView = ({ reportData, month, year }) => {
  // Format month/year
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const monthName = monthNames[month - 1] || 'UNKNOWN';

  // SDG names mapping
  const sdgNames = {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health and Well-Being',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water and Sanitation',
    7: 'Affordable and Clean Energy',
    8: 'Decent Work and Economic Growth',
    9: 'Industry, Innovation & Infrastructure',
    10: 'Reduced Inequalities',
    11: 'Sustainable Cities & Communities',
    12: 'Responsible Consumption & Production',
    13: 'Climate Action',
    14: 'Life Below Water',
    15: 'Life on Land',
    16: 'Peace, Justice & Strong Institutions',
    17: 'Partnerships for the Goals'
  };

  return (
    <div className="consolidated-print-view">
      {/* Header - Same as ActivityPrintView */}
      <div className="print-header">
        <div className="print-header-logos">
          <img
            src="/logos/pdflogo/adzu_logo_print.webp"
            alt="AdZU Logo"
            className="print-logo-left"
          />
          <div className="print-header-text">
            <h1 className="print-university-name">Ateneo de Zamboanga University</h1>
            <p className="print-university-subtitle">The Jesuit University in Western Mindanao, Philippines</p>
            <p className="print-unit-name">SOCIAL DEVELOPMENT UNIT</p>
          </div>
          <img
            src="/logos/pdflogo/sdu_logo_pdf.webp"
            alt="SDU Logo"
            className="print-logo-right"
          />
        </div>
      </div>

      {/* Title */}
      <div className="consolidated-title">
        <h2>CONSOLIDATED REPORT</h2>
        <p className="report-period">Month of {monthName} {year}</p>
      </div>

      {/* Description */}
      <div className="consolidated-description">
        <p>
          This consolidated report captures all projects implemented under the Social Development Unit (SDU) for
          the month of <strong>{monthName} {year}</strong>, covering office-specific accomplishments, partner engagements,
          beneficiaries served, SDG alignment, and financial utilization.
        </p>
      </div>

      {/* Summary Section */}
      <div className="consolidated-section">
        <div className="summary-container">
          <div className="summary-title-container">
            <h3 className="summary-main-header">SUMMARY</h3>
          </div>
          <div className="summary-table-wrapper">
          <table className="summary-table">
            <thead>
              <tr>
                <th>OFFICE</th>
                <th>PROJECTS<br/>IMPLEMENTED</th>
                <th>PARTICIPANTS/<br/>BENEFICIARIES</th>
                <th>INT. FUNDS<br/>UTILIZED</th>
                <th>EXT. FUNDS<br/>GENERATED</th>
                <th>SDG FOCUS</th>
              </tr>
            </thead>
            <tbody>
              {reportData.summary.map((office, index) => (
                <tr key={index}>
                  <td className="text-center font-bold">{office.name}</td>
                  <td className="text-center">{office.projects}</td>
                  <td className="text-center">{office.participants.toLocaleString()}</td>
                  <td className="text-center">₱ {office.internalFunds.toLocaleString()}</td>
                  <td className="text-center">₱ {office.externalFunds.toLocaleString()}</td>
                  <td className="text-center">
                    <div className="sdg-focus">
                      <strong>{office.sdgNumber.toString().padStart(2, '0')}</strong>
                      <span>{office.sdgName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Three Column Layout - Project Statuses, Partnerships, SDG Alignment */}
      <div className="three-column-section">
        {/* Project Statuses */}
        <div className="column-box">
          <h4 className="column-header">PROJECT STATUSES</h4>
          <table className="status-table">
            <tbody>
              {reportData.projectStatuses.map((status, index) => (
                <tr key={index}>
                  <td className="status-label">{status.label}</td>
                  <td className="status-value">{status.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Partnerships */}
        <div className="column-box">
          <h4 className="column-header">PARTNERSHIPS</h4>
          <table className="status-table">
            <tbody>
              {reportData.partnerships.map((partner, index) => (
                <tr key={index}>
                  <td className="status-label">{partner.label}</td>
                  <td className="status-value">{partner.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SDG Alignment */}
        <div className="column-box sdg-column">
          <h4 className="column-header">SDG Alignment</h4>
          <table className="sdg-table">
            <tbody>
              {reportData.sdgAlignment.map((sdg, index) => (
                <tr key={index}>
                  <td className="sdg-number">{sdg.number}</td>
                  <td className="sdg-name">{sdgNames[sdg.number]}</td>
                  <td className="sdg-count">{sdg.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ConsolidatedReportPrintView.propTypes = {
  reportData: PropTypes.shape({
    summary: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        projects: PropTypes.number.isRequired,
        participants: PropTypes.number.isRequired,
        internalFunds: PropTypes.number.isRequired,
        externalFunds: PropTypes.number.isRequired,
        sdgNumber: PropTypes.string.isRequired,
        sdgName: PropTypes.string.isRequired,
      })
    ).isRequired,
    projectStatuses: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    partnerships: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    sdgAlignment: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

export default ConsolidatedReportPrintView;
