import { GridView as GridViewIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import UnitDirectorService from '@/services/unitDirectorService';
import NotificationService from '@/services/notificationService';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Fetch reports count
  const { data: reportsData } = useQuery({
    queryKey: ['sidebar-reports-count'],
    queryFn: () => UnitDirectorService.getReports(),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fetch notifications count
  const { data: notificationsData } = useQuery({
    queryKey: ['sidebar-notifications-count'],
    queryFn: () => NotificationService.getNotifications(),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!user, // Only fetch if user is logged in
  });

  // Calculate unread counts
  const unreadReportsCount = reportsData?.reports?.filter(r => r.isNew)?.length || 0;
  const unreadNotificationsCount = notificationsData?.unread || 0;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    // For settings, match if current path starts with /unit-director/settings
    if (path === '/unit-director/settings/main') {
      return location.pathname.startsWith('/unit-director/settings');
    }
    return location.pathname === path;
  };

  const isSettingsActive = () => location.pathname.startsWith('/unit-director/settings');

  // Menu items with dynamic badges
  const menuItems = [
    { 
      text: 'Overview', 
      icon: <GridViewIcon />, 
      path: '/unit-director/dashboard',
      badgeCount: unreadNotificationsCount
    },
    { 
      text: 'Reports', 
      icon: <img src="/icons/report.svg" alt="Reports" className="w-6 h-6" />, 
      path: '/unit-director/reports', 
      badgeCount: unreadReportsCount
    },
    { 
      text: 'Calendar', 
      icon: <img src="/icons/calendar.svg" alt="Calendar" className="w-6 h-6" />, 
      path: '/unit-director/calendar' 
    },
  ];

  // General items
  const generalItems = [
    { 
      text: 'Settings', 
      icon: <img src="/icons/settings.svg" alt="Settings" className="w-6 h-6" />, 
      path: '/unit-director/settings/main' 
    },
    { 
      text: 'Help', 
      icon: <img src="/icons/help.svg" alt="Help" className="w-6 h-6" />, 
      path: '/unit-director/help' 
    },
    { 
      text: 'Log out', 
      icon: <img src="/icons/logout.svg" alt="Logout" className="w-6 h-6" />, 
      action: 'logout' 
    },
  ];

  return (
    <>
      {/* Mobile View: Bottom Nav (md breakpoint lang to revealed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-[1000] p-1">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex flex-col rounded-lg p-1 transition-colors ${
                isActive(item.path) ? 'bg-[#E8EAFF]' : 'bg-transparent hover:bg-[#E8EAFF]'
              }`}
            >
              <div className={`mb-0.5 ${isActive(item.path) ? 'text-[#4D49FC]' : 'text-[#6B7280]'}`}>
                {item.icon}
              </div>
              <span className={`text-[0.65rem] ${isActive(item.path) ? 'font-semibold text-[#4D49FC]' : 'font-medium text-[#6B7280]'}`}>
                {item.text}
              </span>
              {item.badgeCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#EF4444] text-white text-[0.6rem] h-4 min-w-[16px] rounded-full flex items-center justify-center px-1">
                  {item.badgeCount > 99 ? '99+' : item.badgeCount}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col rounded-lg p-1 hover:bg-[#FEE2E2] transition-colors"
          >
            <div className="text-[#EF4444] mb-0.5 flex items-center justify-center">
              <img src="/icons/logout.svg" alt="Logout" className="w-6 h-6" />
            </div>
            <span className="text-[0.65rem] text-[#EF4444]">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop View: Sidebar (md above breakpoint) */}
      <div className="hidden md:block pl-6 pt-6 pb-6 w-[15rem] flex-shrink-0 bg-transparent h-full">
        <div className="w-full flex-shrink-0 h-full relative">
          <div className="relative w-full box-border bg-[#F4F4F4] border-r-0 rounded-[15px] h-full flex flex-col">
            {/* Logo */}
            <div className="p-1 flex items-center justify-center flex-shrink-0">
              <img 
                src="/logos/sdu-logo-colored.webp" 
                alt="SDU Logo" 
                className="h-35 w-auto object-contain"
              />
            </div>

            {/* MENU Section */}
            <div className="flex-shrink-0">
              {/* MENU Label */}
              <div className="px-8 py-1 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                MENU
              </div>

              {/* Menu Items */}
              {menuItems.map((item) => (
                <div key={item.text} className="mb-0.5 hover:bg-[#d6d2f1] transition-all duration-200 px-6 relative ">
                  {/* Active highlight bar on the left logic */}
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-0 bottom-0 w-3.5  bg-[#4D49FC]  rounded-r-lg" />
                  )}

                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full rounded-xl py-[9.6px]    flex items-center transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'bg-transparent text-[#4D49FC] cursor-pointer' 
                        : 'bg-transparent text-[#040195] cursor-pointer'
                    }`}
                  >
                    <div className={`min-w-[36px] ${isActive(item.path) ? 'text-[#4D49FC]' : 'text-[#040195]'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[0.9rem] ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                      {item.text}
                    </span>
                    {item.badgeCount > 0 && (
                      <span className="ml-auto bg-[#EF4444] text-white text-[0.65rem] h-[18px] min-w-[18px] rounded-[9px] flex items-center justify-center px-1">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Spacer to push GENERAL to bottom */}
            <div className="flex-1"></div>

            {/* GENERAL Section */}
            <div className="flex-shrink-0 pb-4">
              <div className="px-8 py-1 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                GENERAL
              </div>

              {generalItems.map((item) => (
                <div key={item.text}>
                  <div className="mb-0.5 px-6 hover:bg-[#d6d2f1] transition-all duration-200 relative">
                    {/* Active highlight bar on the left for general items */}
                    {item.path && isActive(item.path) && (
                      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-[#4D49FC] rounded-r-lg" />
                    )}
                    
                    <button
                      onClick={item.action === 'logout' ? handleLogout : () => handleNavigation(item.path)}
                      className={`w-full rounded-xl py-[9.6px] cursor-pointer flex items-center transition-all duration-200 ${
                        item.path && isActive(item.path)
                          ? 'bg-transparent text-[#4D49FC]'
                          : 'bg-transparent text-[#040195]'
                      }`}
                    >
                      <div className={`min-w-[34px] ${item.path && isActive(item.path) ? 'text-[#4D49FC]' : 'text-[#1E22AA]'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-[0.9rem] ${item.path && isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                        {item.text}
                      </span>
                    </button>
                  </div>

                  {/* Settings Subcategories */}
                  {item.text === 'Settings' && isSettingsActive() && (
                    <div className="ml-6 mb-2 space-y-1">
                      <button
                        onClick={() => handleNavigation('/unit-director/settings/users')}
                        className={`w-full rounded-lg py-2 px-4 flex items-center gap-2 transition-all duration-200 ${
                          location.pathname === '/unit-director/settings/users'
                            ? 'bg-[#E8EAFF] text-[#4D49FC]'
                            : 'text-[#6B7280] hover:bg-[#E8EAFF] hover:text-[#4D49FC]'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className={`text-sm ${location.pathname === '/unit-director/settings/users' ? 'font-semibold' : 'font-medium'}`}>
                          Users
                        </span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/unit-director/settings/programs')}
                        className={`w-full rounded-lg py-2 px-4 flex items-center gap-2 transition-all duration-200 ${
                          location.pathname === '/unit-director/settings/programs'
                            ? 'bg-[#E8EAFF] text-[#4D49FC]'
                            : 'text-[#6B7280] hover:bg-[#E8EAFF] hover:text-[#4D49FC]'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className={`text-sm ${location.pathname === '/unit-director/settings/programs' ? 'font-semibold' : 'font-medium'}`}>
                          Programs
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
