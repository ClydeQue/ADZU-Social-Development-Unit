import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Alert Component - Display success, error, warning, or info messages
 * @param {string} type - Type of alert: 'success', 'error', 'warning', 'info'
 * @param {string} message - Message to display
 * @param {function} onClose - Optional callback when alert is closed
 */
const Alert = ({ type = "info", message, onClose }) => {
  const alertStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`flex items-start justify-between p-4 rounded-lg border-2 ${style.bg} ${style.border} ${style.text} animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{style.icon}</div>
        <p
          className="text-sm font-medium"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Alert;
