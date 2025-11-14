import { Search as SearchIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

export default function SettingsNavbar({ searchQuery, onSearchChange }) {
  return (
    <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
      <div className="relative ml-3 w-full max-w-[500px]">
        <input
          type="text"
          placeholder="Search offices..."
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

      <div className="text-[#4D49FC] font-semibold text-sm mr-6">
        Unit Director Settings
      </div>
    </div>
  );
}

SettingsNavbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
