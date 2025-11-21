import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Temporary Alert Component
 * A placeholder floating alert/notification container
 * To be implemented later with actual functionality
 */
export default function TemporaryAlert({ isVisible, onClose, type = 'info', message }) {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: '✓' };
      case 'error':
        return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: '✕' };
      case 'warning':
        return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', icon: '⚠' };
      default:
        return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: 'ℹ' };
    }
  };

  const style = getAlertStyle();

  return (
    <div 
      className="fixed top-4 right-4 z-50 animate-slide-in"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Alert Container */}
      <div 
        className={`${style.bg} ${style.text} rounded-lg shadow-lg border-l-4 ${style.border} p-4 max-w-md flex items-start gap-3`}
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold">
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {message || 'This is a temporary alert. To be implemented later.'}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-white/50 transition-colors"
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

TemporaryAlert.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string,
};
