/**
 * AdZU Strategic Goals Data
 * The 4 strategic goals of Ateneo de Zamboanga University
 * Ordered as A-D-Z-U
 */

export const ADZU_STRATEGIC_GOALS = [
  {
    id: 1,
    letter: "A",
    title: "Advancing Ignatian Spirituality",
    shortTitle: "Ignatian Spirituality",
    description: "Promoting and deepening Ignatian spiritual values and practices",
    color: "#8B5CF6", // Purple
    icon: "🙏"
  },
  {
    id: 3,
    letter: "D",
    title: "Dedicated to holistic growth and human flourishing",
    shortTitle: "Holistic Growth",
    description: "Supporting comprehensive development - intellectually, emotionally, spiritually, and physically",
    color: "#10B981", // Green
    icon: "🌱"
  },
  {
    id: 4,
    letter: "Z",
    title: "Zealous in charting global paths",
    shortTitle: "Global Paths",
    description: "Pursuing excellence and innovation in global engagement and outreach",
    color: "#3B82F6", // Blue
    icon: "🌍"
  },
  {
    id: 2,
    letter: "U",
    title: "United in purpose and action",
    shortTitle: "United in Purpose",
    description: "Fostering collaboration, unity, and collective action towards shared goals",
    color: "#F59E0B", // Amber
    icon: "🤝"
  }
];

/**
 * Get strategic goal by ID
 * @param {number} id - Strategic goal ID (1-4)
 * @returns {Object|null} - Strategic goal object or null if not found
 */
export const getStrategicGoal = (id) => {
  return ADZU_STRATEGIC_GOALS.find(goal => goal.id === parseInt(id)) || null;
};

/**
 * Get strategic goal icon by ID
 * @param {number} id - Strategic goal ID (1-4)
 * @returns {string} - Icon emoji or empty string
 */
export const getStrategicGoalIcon = (id) => {
  const goal = getStrategicGoal(id);
  return goal ? goal.icon : "";
};

/**
 * Get strategic goal color by ID
 * @param {number} id - Strategic goal ID (1-4)
 * @returns {string} - Color hex code
 */
export const getStrategicGoalColor = (id) => {
  const goal = getStrategicGoal(id);
  return goal ? goal.color : "#6B7280";
};

export default ADZU_STRATEGIC_GOALS;
