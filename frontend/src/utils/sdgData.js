/**
 * SDG Data Utility
 * Provides consistent SDG information and icons across the application
 */

export const SDG_GOALS = [
  { id: 1, label: 'No Poverty', fullLabel: '1 - No Poverty' },
  { id: 2, label: 'Zero Hunger', fullLabel: '2 - Zero Hunger' },
  { id: 3, label: 'Good Health and Well Being', fullLabel: '3 - Good Health and Well Being' },
  { id: 4, label: 'Quality Education', fullLabel: '4 - Quality Education' },
  { id: 5, label: 'Gender Equality', fullLabel: '5 - Gender Equality' },
  { id: 6, label: 'Clean Water and Sanitation', fullLabel: '6 - Clean Water and Sanitation' },
  { id: 7, label: 'Affordable and Clean Energy', fullLabel: '7 - Affordable and Clean Energy' },
  { id: 8, label: 'Decent Work and Economic Growth', fullLabel: '8 - Decent Work and Economic Growth' },
  { id: 9, label: 'Industry, Innovation, and Infrastructure', fullLabel: '9 - Industry, Innovation, and Infrastructure' },
  { id: 10, label: 'Reduced Inequalities', fullLabel: '10 - Reduced Inequalities' },
  { id: 11, label: 'Sustainable Cities and Communities', fullLabel: '11 - Sustainable Cities and Communities' },
  { id: 12, label: 'Responsible Consumption and Production', fullLabel: '12 - Responsible Consumption and Production' },
  { id: 13, label: 'Climate Action', fullLabel: '13 - Climate Action' },
  { id: 14, label: 'Life Below Water', fullLabel: '14 - Life Below Water' },
  { id: 15, label: 'Life On Land', fullLabel: '15 - Life On Land' },
  { id: 16, label: 'Peace, Justice, and Strong Institutions', fullLabel: '16 - Peace, Justice, and Strong Institutions' },
  { id: 17, label: 'Partnership for the Goals', fullLabel: '17 - Partnership for the Goals' }
];

/**
 * Get SDG icon path by ID
 * @param {number} sdgId - The SDG number (1-17)
 * @returns {string} - Path to the SDG icon
 */
export const getSDGIcon = (sdgId) => {
  return `/images/SDG-images/SDG-${sdgId}.webp`;
};

/**
 * Get SDG icons for multiple IDs
 * @param {number|number[]} sdgNumber - Single ID or array of IDs
 * @returns {Array} - Array of objects with id and icon path
 */
export const getSDGIcons = (sdgNumber) => {
  if (!sdgNumber) return [];
  const sdgNumbers = Array.isArray(sdgNumber) ? sdgNumber : [sdgNumber];
  return sdgNumbers.map(num => ({
    id: num,
    icon: getSDGIcon(num),
    label: SDG_GOALS.find(g => g.id === num)?.label || `SDG ${num}`
  }));
};

/**
 * Get SDG label by ID
 * @param {number} sdgId - The SDG number (1-17)
 * @returns {string} - SDG label
 */
export const getSDGLabel = (sdgId) => {
  const goal = SDG_GOALS.find(g => g.id === sdgId);
  return goal ? goal.fullLabel : `SDG ${sdgId}`;
};
