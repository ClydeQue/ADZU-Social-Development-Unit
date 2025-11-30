import PropTypes from 'prop-types';

const OfficeSidebarLogo = ({ officeId, officeName }) => {
  // Convert officeId to string to ensure consistent mapping
  // Handle undefined/null values
  const id = officeId ? String(officeId) : '';
  
  // Map office IDs to logo paths - using the logos in the officeLogo folder
  const logoMap = {
    '1': '/logos/officeLogo/acca_logo_big.webp',
    '2': '/logos/officeLogo/aces_logo_big.webp',
    '3': '/logos/officeLogo/aclg_logo_big.webp',
    '4': '/logos/officeLogo/altec_logo_big.webp',
    '5': '/logos/officeLogo/apc_logo_big.webp',
    '6': '/logos/officeLogo/cces_logo_big.webp',
  };

  const logoPath = logoMap[id] || '/logos/officeLogo/acca_logo_big.webp'; // Default fallback
  
  // Use the officeName prop if provided, otherwise use a fallback
  const displayName = officeName || 'Office';

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <div className="w-28 h-28 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
        <img 
          src={logoPath} 
          alt="Office Logo" 
          className="w-20 h-20 object-contain"
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