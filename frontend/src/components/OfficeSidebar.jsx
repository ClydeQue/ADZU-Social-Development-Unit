import { 
  GridView as GridViewIcon, 
  Settings as SettingsIcon, 
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PropTypes from 'prop-types';
import OfficeSidebarLogo from '@/components/officeSidebarLogo';

/**
 * Office Sidebar Component
 * Reusable sidebar for all office dashboards
 * @param {Object} props - Component props
 * @param {string} props.officeColor - Primary color for the office branding
 * @param {string} props.basePath - Base route path for the office (e.g., '/acca')
 * @param {string} props.officeId - Office ID for mapping to logo
 * @param {string} props.officeName - Office name for display
 */
export default function OfficeSidebar({ officeColor = '#4D49FC', basePath, officeId, officeName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

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

  const isActive = (path) => location.pathname === path;

  // Menu items - customized per office
    const menuItems = [
    { icon: <GridViewIcon />, text: 'Overview', path: `${basePath}/dashboard` },
    { icon: <AssignmentIcon />, text: 'Projects', path: `${basePath}/projects` },
  ];

  // General items
  const generalItems = [
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: `${basePath}/settings` 
    },
    { 
      text: 'Help', 
      icon: <img src="/icons/help.svg" alt="Help" className="w-6 h-6" />, 
      path: `${basePath}/help` 
    },
    { 
      text: 'Log out', 
      icon: <img src="/icons/logout.svg" alt="Logout" className="w-6 h-6" />, 
      action: 'logout' 
    },
  ];

  return (
    <>
      {/* Mobile View: Bottom Nav */}
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
              <div className={`mb-0.5 ${isActive(item.path) ? 'text-[#1E22AA]' : 'text-[#6B7280]'}`}>
                {item.icon}
              </div>
              <span className={`text-[0.65rem] ${isActive(item.path) ? 'font-semibold text-[#1E22AA]' : 'font-medium text-[#6B7280]'}`}>
                {item.text}
              </span>
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

      {/* Desktop View: Sidebar */}
      <div className="hidden md:block overflow-hidden pl-6 pt-6 pb-6 w-[15rem] flex-shrink-0 bg-transparent h-full">
        <div className="w-full flex-shrink-0 h-full relative">
          <div className="relative w-full box-border bg-[#F4F4F4] border-r-0 rounded-[15px] h-full overflow-y-auto">
            {/* Logo */}
            <div className="p-3 py-6 flex items-center justify-center flex-shrink-0">
              <OfficeSidebarLogo officeId={officeId} officeName={officeName} /> 
            </div>
          

            <div className="my-10 space-y-2">
              {/* MENU Label */}
              <div className="px-8 py-1 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                MENU
              </div>

              {/* Menu Items */}
              {menuItems.map((item) => (
                <div key={item.text} className="mb-0.5 px-6 relative">
                  {/* Active highlight bar */}
                  {isActive(item.path) && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-3.5 rounded-r-lg" 
                      style={{ backgroundColor: officeColor }}
                    />
                  )}
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full rounded-xl py-[9.6px] flex items-center transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'bg-transparent cursor-pointer' 
                        : 'bg-transparent text-[#040195] hover:bg-[#F4F4F4] cursor-pointer'
                    }`}
                    style={{ color: isActive(item.path) ? officeColor : undefined }}
                  >
                    <div className={`min-w-[36px]`} style={{ color: isActive(item.path) ? officeColor : '#040195' }}>
                      {item.icon}
                    </div>
                    <span className={`text-[0.9rem] ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                      {item.text}
                    </span>
                  </button>
                </div>
              ))}

              {/* GENERAL Section */}
              <div className="px-8 mt-15 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                GENERAL
              </div>

              {generalItems.map((item) => (
                <div key={item.text} className="mb-0.5 px-6">
                  <button
                    onClick={item.action === 'logout' ? handleLogout : () => handleNavigation(item.path)}
                    className="w-full rounded-xl py-[9.6px] cursor-pointer flex items-center bg-transparent text-[#040195] hover:bg-[#F4F4F4] transition-all duration-200"
                  >
                    <div className="text-[#1E22AA] min-w-[36px]">
                      {item.icon}
                    </div>
                    <span className="text-[0.9rem] font-medium">
                      {item.text}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

OfficeSidebar.propTypes = {
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.string.isRequired,
  officeName: PropTypes.string,
};
