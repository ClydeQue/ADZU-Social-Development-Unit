import PropTypes from 'prop-types';

const OfficeSidebarLogo = ({ officeId, officeName }) => {
  // Convert officeId to string to ensure consistent mapping
  // Handle undefined/null values
  const id = officeId ? String(officeId) : '';
  
  // Map office IDs to logo paths
  const logoMap = {
    '1': '/images/acca_logo_small.webp',
    '2': '/images/aces_logo_small.webp',
    '3': '/images/aclg_logo_small.webp',
    '4': '/images/altec_logo_small.webp',
    '5': '/images/apc_logo_small.webp',
    '6': '/images/cces_logo_small.webp',
  };

  const logoPath = logoMap[id] || '/images/acca_logo_small.webp'; // Default fallback
  
  // Use the officeName prop if provided, otherwise use a fallback
  const displayName = officeName || 'Office';

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <div className="w-25 h-25 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
        <img 
          src={logoPath} 
          alt="Office Logo" 
          className="w-15 h-20 object-contain"
        />
      </div>
      <div className="mt-3 text-[#040195] font-bold text-[0.85rem] text-center leading-tight">
        {displayName}
      </div>
    </div>
  );
};

OfficeSidebarLogo.propTypes = {
  officeId: PropTypes.string.isRequired,
  officeName: PropTypes.string,
};

export default OfficeSidebarLogo;