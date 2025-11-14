import { GridView as GridViewIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
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

  // Menu items
  const menuItems = [
    { 
      text: 'Overview', 
      icon: <GridViewIcon />, 
      path: '/unit-director/dashboard' 
    },
    { 
      text: 'Reports', 
      icon: <img src="/icons/report.svg" alt="Reports" className="w-6 h-6" />, 
      path: '/unit-director/reports', 
      badge: '20+' 
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
      path: '/unit-director/settings' 
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
              <div className={`mb-0.5 ${isActive(item.path) ? 'text-[#1E22AA]' : 'text-[#6B7280]'}`}>
                {item.icon}
              </div>
              <span className={`text-[0.65rem] ${isActive(item.path) ? 'font-semibold text-[#1E22AA]' : 'font-medium text-[#6B7280]'}`}>
                {item.text}
              </span>
              {item.badge && (
                <span className="absolute top-1 right-1 bg-[#EF4444] text-white text-[0.6rem] h-4 min-w-[16px] rounded-full flex items-center justify-center px-1">
                  {item.badge}
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
          <div className="relative w-full box-border  bg-[#F4F4F4] border-r-0 rounded-[15px] h-full">
            {/* Logo */}
            <div className="p-1 flex items-center justify-center">
              <img 
                src="/logos/sdu-logo-colored.webp" 
                alt="SDU Logo" 
                className="h-35 w-auto object-contain"
              />
            </div>

            <div className=" my-10 space-y-2 ">
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
                    {item.badge && (
                      <span className="ml-auto bg-[#EF4444] text-white text-[0.65rem] h-[18px] min-w-[18px] rounded-[9px] flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </div>
              ))}

              {/* GENERAL Section */}
              <div className="px-8  mt-15 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                GENERAL
              </div>

              {generalItems.map((item) => (
                <div key={item.text} className="mb-0.5 px-6 hover:bg-[#d6d2f1] transition-all duration-200  ">
                  <button
                    onClick={item.action === 'logout' ? handleLogout : () => handleNavigation(item.path)}
                    className="w-full rounded-xl py-[9.6px] cursor-pointer  flex items-center bg-transparent text-[#040195] "
                  >
                    <div className="text-[#1E22AA] min-w-[34px]">
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
