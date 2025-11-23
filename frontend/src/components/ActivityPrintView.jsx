import PropTypes from 'prop-types';
import './ActivityPrintView.css';

/**
 * ActivityPrintView Component
 * Generates a printable HTML view for activity/report details
 */
const ActivityPrintView = ({ activity }) => {
  // Parse venue
  let venueData = { street: '', barangay: '', city: '', province: '' };
  if (activity?.venue) {
    try {
      venueData = typeof activity.venue === 'string' ? JSON.parse(activity.venue) : activity.venue;
    } catch (e) {
      console.error('Error parsing venue:', e);
    }
  }

  // Parse SDG numbers
  let sdgNumbers = [];
  if (activity?.sdg_number) {
    try {
      const parsed = typeof activity.sdg_number === 'string' 
        ? JSON.parse(activity.sdg_number) 
        : Array.isArray(activity.sdg_number) 
        ? activity.sdg_number 
        : [activity.sdg_number];
      // Filter to only include valid numbers 1-17
      sdgNumbers = parsed.filter(num => {
        const n = parseInt(num);
        return !isNaN(n) && n >= 1 && n <= 17;
      });
    } catch (e) {
      console.error('Error parsing SDG numbers:', e);
    }
  }

  // Parse partners
  let partnersData = [];
  if (activity?.partners) {
    try {
      const partnersStr = typeof activity.partners === 'string' ? activity.partners : '';
      partnersData = partnersStr.split(',').map(p => p.trim()).filter(Boolean);
    } catch (e) {
      console.error('Error parsing partners:', e);
    }
  }

  // Format date
  const formatDateShort = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  // Get office acronym
  const officeAcronym = activity?.programs?.offices?.acronym || 'OFFICE';

  // Get SDG name
  const getSdgName = (sdgNum) => {
    const sdgNames = {
      1: 'No Poverty',
      2: 'Zero Hunger',
      3: 'Good Health and Well-being',
      4: 'Quality Education',
      5: 'Gender Equality',
      6: 'Clean Water and Sanitation',
      7: 'Affordable and Clean Energy',
      8: 'Decent Work and Economic Growth',
      9: 'Industry, Innovation and Infrastructure',
      10: 'Reduced Inequalities',
      11: 'Sustainable Cities and Communities',
      12: 'Responsible Consumption and Production',
      13: 'Climate Action',
      14: 'Life Below Water',
      15: 'Life on Land',
      16: 'Peace, Justice and Strong Institutions',
      17: 'Partnerships for the Goals'
    };
    return sdgNames[parseInt(sdgNum)] || '';
  };

  return (
    <div className="print-view">
      {/* Header with Logos */}
      <div className="print-header">
        <div className="print-header-left">
          <img src="/logos/pdflogo/adzu_logo_print.webp" alt="AdZU Logo" className="print-logo" />
        </div>
        <div className="print-header-center">
          <h1 className="print-university-name">Ateneo de Zamboanga University</h1>
          <p className="print-university-subtitle">The Jesuit University in Western Mindanao, Philippines</p>
          <p className="print-unit-name">SOCIAL DEVELOPMENT UNIT</p>
        </div>
        <div className="print-header-right">
          <img src="/logos/pdflogo/sdu_logo_pdf.webp" alt="SDU Logo" className="print-logo" />
        </div>
      </div>

      {/* Office Header with Logo, Status, and Dates */}
      <div className="print-office-section">
        <div className="print-office-header">
          {officeAcronym && (
            <img 
              src={`/images/${officeAcronym.toLowerCase()}_logo_small.webp`} 
              alt={`${officeAcronym} Logo`}
              className="print-office-logo"
            />
          )}
          <span className="print-office-name">{officeAcronym}</span>
        </div>
        <div className="print-status-dates">
          <div className="print-status-badge">
            {activity?.status?.toUpperCase() || 'NO STATUS'}
          </div>
          <div className="print-dates-stack">
            <div className="print-date-row">
              <span className="print-date-label">INCEPTION</span>
              <span className="print-date-value">: {formatDateShort(activity?.start_date)}</span>
            </div>
            <div className="print-date-row">
              <span className="print-date-label">IMPLEMENTATION</span>
              <span className="print-date-value">: {formatDateShort(activity?.end_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Title */}
      <h2 className="print-activity-title">{activity?.activity_name || 'Untitled Activity'}</h2>

      {/* Description */}
      <p className="print-description">
        {activity?.description || 'No description available.'}
      </p>

      <div className="print-divider-thick"></div>

      {/* Objectives */}
      <h3 className="print-section-title">OBJECTIVES</h3>
      <p className="print-section-content">
        {activity?.objectives || 'No objectives specified.'}
      </p>

      <div className="print-divider"></div>

      {/* SDG Goals */}
      <h3 className="print-section-title">SDG GOALS</h3>
      <div className="print-sdg-grid">
        {sdgNumbers.map((sdg, index) => {
          const sdgNumber = parseInt(sdg);
          const sdgName = getSdgName(sdgNumber);
          // Only render if we have a valid SDG number and name
          if (!sdgNumber || isNaN(sdgNumber) || !sdgName) return null;
          return (
            <div key={index} className="print-sdg-item">
              SDG {sdgNumber}: {sdgName}
            </div>
          );
        })}
      </div>

      <div className="print-divider"></div>

      {/* Three Column Section */}
      <div className="print-three-column">
        {/* Venue */}
        <div className="print-column">
          <h4 className="print-column-title">VENUE</h4>
          <p className="print-column-content">
            {venueData.street && `${venueData.street}, `}
            {venueData.barangay && `${venueData.barangay}, `}
            {venueData.city && `${venueData.city}, `}
            {venueData.province || 'Not specified'}
          </p>
        </div>

        {/* Demographics */}
        <div className="print-column">
          <h4 className="print-column-title">DEMOGRAPHICS</h4>
          <div className="print-demographics">
            <div className="print-demo-row">
              <span className="print-demo-label">TOTAL</span>
              <span className="print-demo-value">{activity?.participants_count || (activity?.male_participants || 0) + (activity?.female_participants || 0)}</span>
            </div>
            <div className="print-demo-row">
              <span className="print-demo-label">CLASSIFICATION</span>
              <span className="print-demo-value">{activity?.partner_type || 'General Participants'}</span>
            </div>
          </div>
        </div>

        {/* Sex Count */}
        <div className="print-column">
          <h4 className="print-column-title">SEX COUNT</h4>
          <div className="print-demographics">
            <div className="print-demo-row">
              <span className="print-demo-label">MALE</span>
              <span className="print-demo-value">{activity?.male_participants || 0}</span>
            </div>
            <div className="print-demo-row">
              <span className="print-demo-label">FEMALE</span>
              <span className="print-demo-value">{activity?.female_participants || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="print-divider"></div>

      {/* Partners */}
      <h3 className="print-section-title">PARTNERS</h3>
      {(activity?.partner_name || activity?.implementing_partners) ? (
        <div className="print-partners-list">
          {activity?.partner_name ? (
            (() => {
              const names = activity.partner_name.split(',').map(s => s.trim()).filter(Boolean);
              const types = activity.partner_type ? activity.partner_type.split(',').map(s => s.trim()).filter(Boolean) : [];
              const natures = activity.partner_nature ? activity.partner_nature.split(',').map(s => s.trim()).filter(Boolean) : [];
              
              return names.map((name, index) => (
                <div key={index} className="print-partner-item">
                  <p className="print-partner-name">{name}</p>
                  {types[index] && (
                    <p className="print-partner-type">{types[index]}</p>
                  )}
                  {natures[index] && (
                    <p className="print-partner-nature">{natures[index]}</p>
                  )}
                </div>
              ));
            })()
          ) : (
            <p className="print-section-content">{activity.implementing_partners}</p>
          )}
        </div>
      ) : (
        <p className="print-section-content">No partner information</p>
      )}

      <div className="print-divider"></div>

      {/* Budget Overview */}
      <h3 className="print-section-title">BUDGET OVERVIEW</h3>
      {(() => {
        let budgets = [];
        try {
          if (activity?.budget_amount && activity?.budget_type) {
            const amounts = typeof activity.budget_amount === 'string' ? JSON.parse(activity.budget_amount) : [activity.budget_amount];
            const types = typeof activity.budget_type === 'string' ? JSON.parse(activity.budget_type) : [activity.budget_type];
            budgets = amounts.map((amount, index) => ({
              amount: amount,
              type: types[index] || 'external'
            }));
          } else if (activity?.budget_amount) {
            budgets = [{ amount: activity.budget_amount, type: activity.budget_type || 'external' }];
          }
        } catch (e) {
          console.error('Error parsing budgets:', e);
          if (activity?.budget_amount) {
            budgets = [{ amount: activity.budget_amount, type: activity.budget_type || 'external' }];
          }
        }
        
        return budgets.length > 0 ? (
          <div className="print-budgets-list">
            {budgets.map((budget, index) => (
              <div key={index} className="print-budget">
                <span className="print-budget-amount">
                  ₱ {parseFloat(budget.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="print-budget-type">
                  {budget.type === 'external' ? 'External Fund' : 'Internal Fund'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="print-section-content">No budget information</p>
        );
      })()}
    </div>
  );
};

ActivityPrintView.propTypes = {
  activity: PropTypes.object,
};

export default ActivityPrintView;
