import PropTypes from 'prop-types';

const OfficeSidebarLogo = ({ officeId, officeAcronym, officeName }) => {
  // Map office acronyms to logo paths (case-insensitive) - PRIMARY mapping
  const logoMapByAcronym = {
    'acca': '/logos/officeLogo/acca_logo_big.webp',
    'aces': '/logos/officeLogo/aces_logo_big.webp',
    'aclg': '/logos/officeLogo/aclg_logo_big.webp',
    'altec': '/logos/officeLogo/altec_logo_big.webp',
    'apc': '/logos/officeLogo/apc_logo_big.webp',
    'cces': '/logos/officeLogo/cces_logo_big.webp',
  };

  // Map office IDs to logo paths - FALLBACK mapping
  const logoMapById = {
    '1': '/logos/officeLogo/acca_logo_big.webp',
    '2': '/logos/officeLogo/aces_logo_big.webp',
    '3': '/logos/officeLogo/aclg_logo_big.webp',
    '4': '/logos/officeLogo/altec_logo_big.webp',
    '5': '/logos/officeLogo/apc_logo_big.webp',
    '6': '/logos/officeLogo/cces_logo_big.webp',
  };

  // Try to get logo by acronym first (preferred), then by ID
  let logoPath = '/logos/officeLogo/acca_logo_big.webp'; // default fallback
  
  if (officeAcronym) {
    const acronymLower = String(officeAcronym).toLowerCase();
    if (logoMapByAcronym[acronymLower]) {
      logoPath = logoMapByAcronym[acronymLower];
    }
  } else if (officeId) {
    const id = String(officeId);
    if (logoMapById[id]) {
      logoPath = logoMapById[id];
    } else {
      // Try as acronym fallback
      const idLower = id.toLowerCase();
      if (logoMapByAcronym[idLower]) {
        logoPath = logoMapByAcronym[idLower];
      }
    }
  }
  
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
  officeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  officeAcronym: PropTypes.string,
  officeName: PropTypes.string,
};

export default OfficeSidebarLogo;