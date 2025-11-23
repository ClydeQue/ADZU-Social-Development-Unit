import { 
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import NotificationDropdown from '@/components/NotificationDropdown';
import InboxDropdown from '@/components/InboxDropdown';
import PropTypes from 'prop-types';

export default function ReportsNavbar({ searchQuery, onSearchChange }) {
  const { user } = useAuth();

  return (
    <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
      {/* Search Bar */}
      <div className="relative ml-3 w-[500px]">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 bg-white text-[#040195] rounded-full pl-14
           text-xs outline-none border 
           border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <SearchIcon className="text-[#040195]" sx={{ fontSize: 30 }} />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Inbox Dropdown */}
        <InboxDropdown />

        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* Avatar and User Info */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-[rgba(0,0,0,0.87)]">
              {user?.name || 'Unit Director'}
            </div>
            <div className="text-xs text-[rgba(0,0,0,0.6)]">
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportsNavbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
