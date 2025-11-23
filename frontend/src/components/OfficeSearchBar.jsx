import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Assessment as ProjectsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import OfficeService from "@/services/officeService";
import ActivityDetailModal from "./ActivityDetailModal";

/**
 * Office Search Bar Component
 * Search bar with dropdown results that opens modal on click
 * Also includes navigation pages
 */
export default function OfficeSearchBar({ basePath, officeColor = "#4D49FC" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const officeId = user?.office_id || user?.office?.id;

  // Define searchable pages
  const pages = [
    { name: "Overview", path: `${basePath}/dashboard`, icon: DashboardIcon },
    { name: "Projects", path: `${basePath}/projects`, icon: ProjectsIcon },
    { name: "Settings", path: `${basePath}/settings`, icon: SettingsIcon },
    { name: "Help", path: `${basePath}/help`, icon: HelpIcon },
  ];

  // Fetch office projects data
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["office-projects", officeId],
    queryFn: () => OfficeService.getOfficeReports(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch detailed activity data when an activity is selected
  const { data: selectedActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activity", selectedActivityId],
    queryFn: () => OfficeService.getActivity(selectedActivityId),
    enabled: !!selectedActivityId,
  });

  // Transform data into projects format
  const projects =
    projectsData?.recent_activities?.map((activity) => {
      const program = activity.programs;

      return {
        id: activity.id,
        type: "activity",
        programId: program?.id,
        programTitle: program?.title || "Program",
        activityName: activity.activity_name || "Activity",
        image: activity.image_url || "/reports/default.webp",
        status: activity.status,
        startDate: activity.start_date,
        endDate: activity.end_date,
      };
    }) || [];

  // Filter all searchable items
  const query = searchQuery.toLowerCase().trim();

  const filteredPages = query
    ? pages.filter((page) => page.name.toLowerCase().includes(query))
    : [];

  const filteredProjects = query
    ? projects.filter(
        (project) =>
          project.activityName?.toLowerCase().includes(query) ||
          project.programTitle?.toLowerCase().includes(query)
      )
    : [];

  const hasResults = filteredPages.length > 0 || filteredProjects.length > 0;

  const isLoading = isLoadingProjects;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when there's a search query
  useEffect(() => {
    setShowDropdown(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const handleViewProject = (projectId) => {
    setSelectedActivityId(projectId);
    setShowDropdown(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleCloseModal = () => {
    setSelectedActivityId(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <>
      <div className="relative" ref={searchRef}>
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities, pages..."
          className="w-full h-8 xl:h-9 bg-white text-[#040195] rounded-full pl-9 sm:pl-12 pr-8
           text-xs outline-none border 
           border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
        />
        <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <SearchIcon
            className="text-[#040195]"
            sx={{ fontSize: { xs: 20, sm: 24, xl: 26 } }}
          />
        </div>

        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#040195] hover:text-[#5B6FED]"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        )}

        {/* Dropdown Results */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-center text-[#040195] text-sm">
                Loading...
              </div>
            ) : hasResults ? (
              <div className="py-2">
                {/* Pages Section */}
                {filteredPages.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Pages
                    </div>
                    {filteredPages.map((page) => {
                      const IconComponent = page.icon;
                      return (
                        <button
                          key={page.path}
                          onClick={() => handleNavigate(page.path)}
                          className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <IconComponent
                              className="text-[#5B6FED]"
                              sx={{ fontSize: 24 }}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#040195]">
                              {page.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Navigate to {page.name}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Projects Section */}
                {filteredProjects.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Activities
                    </div>
                    {filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleViewProject(project.id)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={project.image}
                              alt={project.activityName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/reports/default.webp";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-[#040195] truncate">
                              {project.activityName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">
                                {project.programTitle}
                              </span>
                            </div>
                            {project.status && (
                              <div className="mt-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    project.status.toLowerCase() === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : project.status.toLowerCase() ===
                                          "in progress" ||
                                        project.status.toLowerCase() ===
                                          "in-progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {project.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal - Same pattern as OfficeReports */}
      {selectedActivityId && selectedActivity && !isLoadingActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={handleCloseModal}
          officeColor={officeColor}
          basePath={basePath}
        />
      )}
    </>
  );
}
