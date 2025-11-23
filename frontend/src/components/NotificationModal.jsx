import PropTypes from 'prop-types';
import { X as CloseIcon } from '@mui/icons-material';
import { formatDate } from '@/utils/timeFormat';

/**
 * Notification Detail Modal
 * Shows full details of a notification when clicked
 */
export default function NotificationModal({ notification, onClose }) {
  if (!notification) return null;

  // Get office logo based on acronym
  const getOfficeLogo = (acronym) => {
    const logoMap = {
      'ACCA': '/logos/officeLogoTransparent/accaLogo.webp',
      'ACES': '/logos/officeLogoTransparent/acesLogo.webp',
      'ACLG': '/logos/officeLogoTransparent/aclgLogo.webp',
      'ALTEC': '/logos/officeLogoTransparent/altecLogo.webp',
      'APC': '/logos/officeLogoTransparent/apcLogo.webp',
      'CCES': '/logos/officeLogoTransparent/ccesLogo.webp',
    };
    return logoMap[acronym?.toUpperCase()] || '/logos/officeLogoTransparent/ccesLogo.webp';
  };

  // Determine what date to display based on type
  let dateLabel = '';
  let dateValue = '';

  if (notification.type === 'Reminder') {
    dateLabel = 'Due Date';
    dateValue = notification.dueDate
      ? formatDate(notification.dueDate)
      : 'No due date';
  } else if (notification.type === 'Report') {
    dateLabel = 'Submitted Date';
    dateValue = notification.submittedDate
      ? formatDate(notification.submittedDate)
      : 'No submission date';
  } else if (notification.type === 'Updated') {
    dateLabel = 'Updated';
    dateValue = notification.updatedTime || notification.time || 'Recently';
  }

  const officeLogo = getOfficeLogo(notification.officeAcronym || notification.office);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(4, 1, 149, 0.4)' }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#4D49FC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={officeLogo}
              alt={notification.officeAcronym || notification.office}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logos/officeLogoTransparent/ccesLogo.webp';
              }}
            />
            <div>
              <h3 className="text-base font-bold text-white">
                {notification.officeAcronym || notification.office}
              </h3>
              <span
                style={{
                  backgroundColor:
                    notification.type === 'Reminder'
                      ? '#ef4444'
                      : notification.type === 'Report'
                      ? '#22c55e'
                      : notification.type === 'Updated'
                      ? '#3b82f6'
                      : '#8988CD',
                }}
                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              >
                {notification.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <CloseIcon className="text-white" sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Activity Name */}
          <h4 className="text-lg font-bold text-[#040195] mb-3">
            {notification.activity}
          </h4>

          {/* Details */}
          <div className="space-y-3 text-sm">
            {dateLabel && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">
                  {dateLabel}
                </p>
                <p className="text-[#4D49FC] font-semibold">{dateValue}</p>
              </div>
            )}

            {notification.program && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">
                  Program
                </p>
                <p className="text-gray-800">{notification.program}</p>
              </div>
            )}

            {notification.message && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">
                  Message
                </p>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {notification.message}
                </p>
              </div>
            )}

            {notification.changes && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Changes Made
                </p>
                <p className="text-xs text-blue-700 whitespace-pre-wrap">
                  {notification.changes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#4D49FC] text-white text-sm rounded-lg font-semibold hover:bg-[#3D39CC] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

NotificationModal.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    officeAcronym: PropTypes.string,
    office: PropTypes.string,
    activity: PropTypes.string,
    program: PropTypes.string,
    type: PropTypes.string,
    logo: PropTypes.string,
    dueDate: PropTypes.string,
    submittedDate: PropTypes.string,
    updatedTime: PropTypes.string,
    time: PropTypes.string,
    createdAt: PropTypes.string,
    message: PropTypes.string,
    changes: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
