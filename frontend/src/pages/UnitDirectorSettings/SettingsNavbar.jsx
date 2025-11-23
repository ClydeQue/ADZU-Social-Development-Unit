import { Search as SearchIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

export default function SettingsNavbar({ searchQuery, onSearchChange, showSearch = true, title }) {
  return (
    <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
      {showSearch ? (
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
      ) : title ? (
        <div className="ml-3 text-[#040195] font-bold text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </div>
      ) : null}

      <div className={`text-[#4D49FC] font-semibold text-sm ${showSearch || title ? 'mr-6' : 'ml-3'}`}>
        Unit Director Settings
      </div>
    </div>
  );
}

SettingsNavbar.propTypes = {
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  showSearch: PropTypes.bool,
  title: PropTypes.string,
};
