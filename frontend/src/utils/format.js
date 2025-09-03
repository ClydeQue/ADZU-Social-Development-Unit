/**
 * Frontend Formatting Utilities
 * Reusable formatting helpers for dates, numbers, strings, etc.
 */

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long', 'full'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = "medium") => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  const options = {
    short: { month: "short", day: "numeric", year: "numeric" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    full: {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return dateObj.toLocaleDateString("en-US", options[format] || options.medium);
};

/**
 * Format date to Philippine locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date in PH format
 */
export const formatDatePH = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  return dateObj.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format time to readable string
 * @param {Date|string} date - Date/time to format
 * @param {boolean} includeSeconds - Include seconds in output
 * @returns {string} Formatted time
 */
export const formatTime = (date, includeSeconds = false) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Time";

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (includeSeconds) {
    options.second = "2-digit";
  }

  return dateObj.toLocaleTimeString("en-US", options);
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (Math.abs(diffInMinutes) < 1) return "just now";
  if (Math.abs(diffInMinutes) < 60)
    return `${Math.abs(diffInMinutes)} minute${
      Math.abs(diffInMinutes) === 1 ? "" : "s"
    } ${diffInMinutes > 0 ? "from now" : "ago"}`;
  if (Math.abs(diffInHours) < 24)
    return `${Math.abs(diffInHours)} hour${
      Math.abs(diffInHours) === 1 ? "" : "s"
    } ${diffInHours > 0 ? "from now" : "ago"}`;
  if (Math.abs(diffInDays) < 7)
    return `${Math.abs(diffInDays)} day${
      Math.abs(diffInDays) === 1 ? "" : "s"
    } ${diffInDays > 0 ? "from now" : "ago"}`;

  return formatDate(date, "short");
};

// =============================================================================
// NUMBER FORMATTING
// =============================================================================

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format as Philippine Peso currency
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Show peso symbol
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount))
    return showSymbol ? "₱0.00" : "0.00";

  const formatted = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `₱${formatted}` : formatted;
};

/**
 * Format as percentage
 * @param {number} num - Number to format as percentage
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return "0%";

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
};

/**
 * Format file size in bytes to human readable
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// =============================================================================
// STRING FORMATTING
// =============================================================================

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title cased string
 */
export const formatTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";

  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Convert to sentence case (first letter capitalized)
 * @param {string} str - String to format
 * @returns {string} Sentence cased string
 */
export const formatSentenceCase = (str) => {
  if (!str || typeof str !== "string") return "";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const formatTruncate = (str, maxLength = 100) => {
  if (!str || typeof str !== "string") return "";

  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Format phone number (Philippine format)
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Philippine mobile format: +63 XXX XXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith("09")) {
    const formatted = cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{3})/,
      "$1 $2 $3 $4"
    );
    return `+63 ${formatted.substring(1)}`;
  }

  // Philippine landline format: +63 X XXX XXXX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{4})/, "+63 $1 $2 $3");
  }

  return phone; // Return original if format not recognized
};

/**
 * Format email display name
 * @param {string} email - Email address
 * @returns {string} Display name from email
 */
export const formatEmailDisplayName = (email) => {
  if (!email || typeof email !== "string") return "";

  const localPart = email.split("@")[0];
  return formatTitleCase(localPart.replace(/[._-]/g, " "));
};

// =============================================================================
// SPECIALIZED ADZU FORMATTING
// =============================================================================

/**
 * Format office names consistently
 * @param {string} officeName - Office name to format
 * @returns {string} Formatted office name
 */
export const formatOfficeName = (officeName) => {
  if (!officeName) return "";

  // Handle specific AdZU office acronyms
  const acronyms = {
    SDO: "Social Development Office",
    CCES: "Center for Culture and the Performing Arts",
    API: "Ateneo Public Intellectuals",
    SACSI: "Student Affairs and Campus Service Integration",
    ACLG: "Ateneo Center for Local Governance",
    ACCA: "Ateneo Center for Creative Arts",
  };

  return acronyms[officeName.toUpperCase()] || formatTitleCase(officeName);
};

/**
 * Format user role for display
 * @param {string} role - User role
 * @returns {string} Formatted role name
 */
export const formatUserRole = (role) => {
  if (!role) return "";

  const roleMap = {
    office_user: "Office Staff",
    unit_director: "Unit Director",
    admin: "Administrator",
  };

  return roleMap[role] || formatTitleCase(role.replace(/_/g, " "));
};

/**
 * Format program status
 * @param {string} status - Program status
 * @returns {string} Formatted status
 */
export const formatProgramStatus = (status) => {
  if (!status) return "";

  const statusMap = {
    draft: "Draft",
    pending: "Pending Approval",
    approved: "Approved",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return statusMap[status] || formatTitleCase(status.replace(/_/g, " "));
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clean and format text input
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export const formatCleanText = (text) => {
  if (!text || typeof text !== "string") return "";

  return text.trim().replace(/\s+/g, " "); // Remove extra whitespace
};

/**
 * Format array as comma-separated list
 * @param {Array} items - Array of items
 * @param {string} conjunction - Final conjunction ('and', 'or')
 * @returns {string} Formatted list
 */
export const formatList = (items, conjunction = "and") => {
  if (!Array.isArray(items) || items.length === 0) return "";

  if (items.length === 1) return items[0].toString();
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items.pop();
  return `${items.join(", ")}, ${conjunction} ${lastItem}`;
};

/**
 * Format boolean as Yes/No
 * @param {boolean} value - Boolean value
 * @returns {string} 'Yes' or 'No'
 */
export const formatYesNo = (value) => {
  return value ? "Yes" : "No";
};
