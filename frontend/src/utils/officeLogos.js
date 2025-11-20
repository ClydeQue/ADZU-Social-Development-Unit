/**
 * Office Logos Utility
 * Maps office acronyms to their corresponding logo images
 */

// Office logo mapping
const officeLogos = {
  ACCA: '/images/acca_logo_small.webp',
  ACES: '/images/aces_logo_small.webp',
  ACLG: '/images/aclg_logo_small.webp',
  ALTEC: '/images/altec_logo_small.webp',
  APC: '/images/apc_logo_small.webp',
  CCES: '/images/cces_logo_small.webp',
};

/**
 * Get office logo path by acronym
 * @param {string} acronym - Office acronym (e.g., 'ACCA', 'ACES')
 * @returns {string} - Path to the office logo image
 */
export const getOfficeLogo = (acronym) => {
  if (!acronym) return null;
  return officeLogos[acronym.toUpperCase()] || null;
};

/**
 * Get all office logos
 * @returns {Object} - Object mapping all office acronyms to their logo paths
 */
export const getAllOfficeLogos = () => {
  return { ...officeLogos };
};

export default officeLogos;
