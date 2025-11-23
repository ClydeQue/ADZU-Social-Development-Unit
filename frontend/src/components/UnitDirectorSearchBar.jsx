import PropTypes from "prop-types";
import { Search as SearchIcon } from "@mui/icons-material";

/**
 * Unit Director Search Bar Component
 * Search bar that filters activities in real-time
 */
export default function UnitDirectorSearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search activities, offices, programs..."
        className="w-full h-8 xl:h-9 bg-white text-[#040195] rounded-full pl-9 sm:pl-12
         text-xs outline-none border 
         border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
      />
      <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <SearchIcon
          className="text-[#040195]"
          sx={{ fontSize: { xs: 20, sm: 24, xl: 26 } }}
        />
      </div>
    </div>
  );
}

UnitDirectorSearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
