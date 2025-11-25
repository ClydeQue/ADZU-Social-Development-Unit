import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import OfficeSidebarLogo from '@/components/officeSidebarLogo';
import ActivityService from '@/services/activityService';
import NotificationService from '@/services/notificationService';

/**
 * Office Sidebar Component
 * Reusable sidebar for all office dashboards
 * @param {Object} props - Component props
 * @param {string} props.basePath - Base route path for the office (e.g., '/acca')
 * @param {string} props.officeId - Office ID for mapping to logo
 * @param {string} props.officeName - Office name for display
 */
export default function OfficeSidebar({ basePath, officeId, officeName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const officeColor = '#4D49FC'; // Single color for all offices

  // Fetch activities to count new ones (projects badge)
  const { data: activitiesData } = useQuery({
    queryKey: ['office-activities-count', officeId],
    queryFn: () => ActivityService.getActivitiesByOffice(officeId),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  });

  // Fetch notifications for overview badge
  const { data: notificationsData } = useQuery({
    queryKey: ['office-notifications-count'],
    queryFn: () => NotificationService.getNotifications(),
    staleTime: 60000,
    refetchInterval: 60000,
  });

  const newActivitiesCount = activitiesData?.activities?.filter(a => a.isNew)?.length || 0;
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
    if (!path) return false;
    // For Projects menu, also match edit-activity and add-activity routes
    if (path.endsWith('/projects')) {
      return location.pathname === path || 
             location.pathname.includes('/edit-activity') || 
             location.pathname.includes('/add-activity');
    }
    return location.pathname === path;
  };

  const isSettingsActive = () => {
    return location.pathname === `${basePath}/settings` || 
           location.pathname === `${basePath}/settings/programs`;
  };

  // Menu items - customized per office
  const menuItems = [
    { 
      text: 'Overview', 
      path: `${basePath}/dashboard`,
      badgeCount: unreadNotificationsCount,
      iconComponent: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M14 9C13.7167 9 13.4793 8.904 13.288 8.712C13.0967 8.52 13.0007 8.28267 13 8V4C13 3.71667 13.096 3.47933 13.288 3.288C13.48 3.09667 13.7173 3.00067 14 3H20C20.2833 3 20.521 3.096 20.713 3.288C20.905 3.48 21.0007 3.71733 21 4V8C21 8.28333 20.904 8.521 20.712 8.713C20.52 8.905 20.2827 9.00067 20 9H14ZM4 13C3.71667 13 3.47933 12.904 3.288 12.712C3.09667 12.52 3.00067 12.2827 3 12V4C3 3.71667 3.096 3.47933 3.288 3.288C3.48 3.09667 3.71733 3.00067 4 3H10C10.2833 3 10.521 3.096 10.713 3.288C10.905 3.48 11.0007 3.71733 11 4V12C11 12.2833 10.904 12.521 10.712 12.713C10.52 12.905 10.2827 13.0007 10 13H4ZM14 21C13.7167 21 13.4793 20.904 13.288 20.712C13.0967 20.52 13.0007 20.2827 13 20V12C13 11.7167 13.096 11.4793 13.288 11.288C13.48 11.0967 13.7173 11.0007 14 11H20C20.2833 11 20.521 11.096 20.713 11.288C20.905 11.48 21.0007 11.7173 21 12V20C21 20.2833 20.904 20.521 20.712 20.713C20.52 20.905 20.2827 21.0007 20 21H14ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V16C3 15.7167 3.096 15.4793 3.288 15.288C3.48 15.0967 3.71733 15.0007 4 15H10C10.2833 15 10.521 15.096 10.713 15.288C10.905 15.48 11.0007 15.7173 11 16V20C11 20.2833 10.904 20.521 10.712 20.713C10.52 20.905 10.2827 21.0007 10 21H4Z" fill={color}/>
        </svg>
      )
    },
    { 
      text: 'Projects', 
      path: `${basePath}/projects`,
      badgeCount: newActivitiesCount,
      iconComponent: (color) => (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M16.625 2.625H15.75C14.7835 2.625 14 3.4085 14 4.375V16.625C14 17.5915 14.7835 18.375 15.75 18.375H16.625C17.5915 18.375 18.375 17.5915 18.375 16.625V4.375C18.375 3.4085 17.5915 2.625 16.625 2.625Z" fill={color}/>
          <path d="M10.9375 7.875H10.0625C9.096 7.875 8.3125 8.6585 8.3125 9.625V16.625C8.3125 17.5915 9.096 18.375 10.0625 18.375H10.9375C11.904 18.375 12.6875 17.5915 12.6875 16.625V9.625C12.6875 8.6585 11.904 7.875 10.9375 7.875Z" fill={color}/>
          <path d="M5.25 14H4.375C3.4085 14 2.625 14.7835 2.625 15.75V16.625C2.625 17.5915 3.4085 18.375 4.375 18.375H5.25C6.2165 18.375 7 17.5915 7 16.625V15.75C7 14.7835 6.2165 14 5.25 14Z" fill={color}/>
        </svg>
      )
    },
  ];

  // General items
  const generalItems = [
    { 
      text: 'Settings', 
      icon: (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M9.47192 19.25C9.07817 19.25 8.73925 19.1187 8.45517 18.8562C8.17109 18.5938 7.99959 18.2729 7.94067 17.8938L7.74379 16.45C7.55421 16.3771 7.37571 16.2896 7.20829 16.1875C7.04088 16.0854 6.87667 15.976 6.71567 15.8594L5.35942 16.4281C4.99484 16.5885 4.63025 16.6031 4.26567 16.4719C3.90109 16.3406 3.61671 16.1073 3.41254 15.7719L2.38442 13.9781C2.18025 13.6427 2.12192 13.2854 2.20942 12.9062C2.29692 12.5271 2.49379 12.2135 2.80004 11.9656L3.95942 11.0906C3.94484 10.9885 3.93754 10.89 3.93754 10.7949V10.2042C3.93754 10.1097 3.94484 10.0115 3.95942 9.90938L2.80004 9.03437C2.49379 8.78646 2.29692 8.47292 2.20942 8.09375C2.12192 7.71458 2.18025 7.35729 2.38442 7.02187L3.41254 5.22812C3.61671 4.89271 3.90109 4.65938 4.26567 4.52813C4.63025 4.39688 4.99484 4.41146 5.35942 4.57187L6.71567 5.14062C6.87609 5.02396 7.04379 4.91458 7.21879 4.8125C7.39379 4.71042 7.56879 4.62292 7.74379 4.55L7.94067 3.10625C7.999 2.72708 8.1705 2.40625 8.45517 2.14375C8.73984 1.88125 9.07875 1.75 9.47192 1.75H11.5282C11.9219 1.75 12.2611 1.88125 12.5458 2.14375C12.8305 2.40625 13.0017 2.72708 13.0594 3.10625L13.2563 4.55C13.4459 4.62292 13.6247 4.71042 13.7927 4.8125C13.9607 4.91458 14.1246 5.02396 14.2844 5.14062L15.6407 4.57187C16.0053 4.41146 16.3698 4.39688 16.7344 4.52813C17.099 4.65938 17.3834 4.89271 17.5875 5.22812L18.6157 7.02187C18.8198 7.35729 18.8782 7.71458 18.7907 8.09375C18.7032 8.47292 18.5063 8.78646 18.2 9.03437L17.0407 9.90938C17.0553 10.0115 17.0625 10.11 17.0625 10.2051V10.7949C17.0625 10.89 17.048 10.9885 17.0188 11.0906L18.1782 11.9656C18.4844 12.2135 18.6813 12.5271 18.7688 12.9062C18.8563 13.2854 18.798 13.6427 18.5938 13.9781L17.5438 15.7719C17.3396 16.1073 17.0553 16.3406 16.6907 16.4719C16.3261 16.6031 15.9615 16.5885 15.5969 16.4281L14.2844 15.8594C14.124 15.976 13.9563 16.0854 13.7813 16.1875C13.6063 16.2896 13.4313 16.3771 13.2563 16.45L13.0594 17.8938C13.0011 18.2729 12.8299 18.5938 12.5458 18.8562C12.2617 19.1187 11.9225 19.25 11.5282 19.25H9.47192ZM10.5438 13.5625C11.3896 13.5625 12.1115 13.2635 12.7094 12.6656C13.3073 12.0677 13.6063 11.3458 13.6063 10.5C13.6063 9.65417 13.3073 8.93229 12.7094 8.33437C12.1115 7.73646 11.3896 7.4375 10.5438 7.4375C9.68338 7.4375 8.95771 7.73646 8.36679 8.33437C7.77588 8.93229 7.48071 9.65417 7.48129 10.5C7.48188 11.3458 7.77734 12.0677 8.36767 12.6656C8.958 13.2635 9.68338 13.5625 10.5438 13.5625Z" fill="currentColor"/>
        </svg>
      ), 
      path: `${basePath}/settings`
    },
    { 
      text: 'Help', 
      icon: (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M10.4563 15.75C10.7625 15.75 11.0215 15.6441 11.2333 15.4324C11.445 15.2206 11.5506 14.9619 11.55 14.6562C11.5494 14.3506 11.4438 14.0916 11.2333 13.8792C11.0227 13.6669 10.7637 13.5613 10.4563 13.5625C10.1488 13.5637 9.89013 13.6695 9.68013 13.8801C9.47013 14.0907 9.36425 14.3494 9.3625 14.6562C9.36075 14.9631 9.46663 15.2221 9.68013 15.4332C9.89363 15.6444 10.1523 15.75 10.4563 15.75ZM10.5 19.25C9.28958 19.25 8.15208 19.0202 7.0875 18.5605C6.02292 18.1008 5.09688 17.4775 4.30938 16.6906C3.52188 15.9037 2.89858 14.9777 2.4395 13.9125C1.98042 12.8473 1.75058 11.7098 1.75 10.5C1.74942 9.29017 1.97925 8.15267 2.4395 7.0875C2.89975 6.02233 3.52304 5.09629 4.30938 4.30938C5.09571 3.52246 6.02175 2.89917 7.0875 2.4395C8.15325 1.97983 9.29075 1.75 10.5 1.75C11.7093 1.75 12.8468 1.97983 13.9125 2.4395C14.9783 2.89917 15.9043 3.52246 16.6906 4.30938C17.477 5.09629 18.1005 6.02233 18.5614 7.0875C19.0222 8.15267 19.2518 9.29017 19.25 10.5C19.2483 11.7098 19.0184 12.8473 18.5605 13.9125C18.1026 14.9777 17.4793 15.9037 16.6906 16.6906C15.902 17.4775 14.9759 18.1011 13.9125 18.5614C12.8491 19.0216 11.7116 19.2512 10.5 19.25ZM10.5875 6.7375C10.9521 6.7375 11.2694 6.85417 11.5395 7.0875C11.8096 7.32083 11.9443 7.6125 11.9438 7.9625C11.9438 8.28333 11.8455 8.56771 11.6489 8.81562C11.4523 9.06354 11.2298 9.29687 10.9813 9.51562C10.6458 9.80729 10.3507 10.1281 10.0958 10.4781C9.84083 10.8281 9.71308 11.2219 9.7125 11.6594C9.7125 11.8635 9.78921 12.035 9.94263 12.1739C10.096 12.3127 10.2745 12.3818 10.4781 12.3812C10.6969 12.3812 10.883 12.3083 11.0364 12.1625C11.1898 12.0167 11.2881 11.8344 11.3313 11.6156C11.3896 11.3094 11.5208 11.0361 11.725 10.7957C11.9292 10.5554 12.1479 10.3256 12.3813 10.1062C12.7167 9.78542 13.0048 9.43542 13.2458 9.05625C13.4867 8.67708 13.6068 8.25417 13.6063 7.7875C13.6063 7.04375 13.3038 6.43504 12.6989 5.96137C12.094 5.48771 11.3902 5.25058 10.5875 5.25C10.0333 5.25 9.50483 5.36667 9.002 5.6C8.49917 5.83333 8.11621 6.19062 7.85313 6.67187C7.75104 6.84687 7.71838 7.03296 7.75513 7.23012C7.79188 7.42729 7.89017 7.57662 8.05 7.67812C8.25417 7.79479 8.46563 7.83125 8.68438 7.7875C8.90313 7.74375 9.08542 7.61979 9.23125 7.41563C9.39167 7.19688 9.59233 7.02917 9.83325 6.9125C10.0742 6.79583 10.3256 6.7375 10.5875 6.7375Z" fill="currentColor"/>
        </svg>
      ), 
      path: `${basePath}/help` 
    },
    { 
      text: 'Log out', 
      icon: (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.0625 8.372V12.628C3.0625 14.6353 3.0625 15.638 3.69425 16.2619C4.26738 16.828 5.159 16.8796 6.84075 16.8849C6.75237 16.2943 6.734 15.5899 6.72875 14.7604C6.72875 14.676 6.74539 14.5924 6.77772 14.5144C6.81005 14.4364 6.85744 14.3656 6.91717 14.3059C6.9769 14.2463 7.04781 14.199 7.12583 14.1668C7.20385 14.1345 7.28746 14.118 7.37188 14.1181C7.45633 14.1171 7.54017 14.1327 7.61859 14.1641C7.69702 14.1954 7.7685 14.2419 7.82895 14.3009C7.88941 14.3599 7.93765 14.4302 7.97092 14.5079C8.00419 14.5855 8.02185 14.6689 8.02287 14.7534C8.02812 15.6844 8.05175 16.3441 8.14538 16.8446C8.2355 17.3276 8.379 17.6059 8.589 17.8141C8.82788 18.0504 9.163 18.2035 9.7965 18.2866C10.4475 18.3741 11.3102 18.375 12.5484 18.375H13.4102C14.6484 18.375 15.5111 18.3733 16.163 18.2875C16.7956 18.2035 17.1308 18.0495 17.3688 17.8141C17.6076 17.5779 17.7634 17.2471 17.8483 16.6224C17.9358 15.9801 17.9375 15.127 17.9375 13.9055V7.0945C17.9375 5.87212 17.9358 5.02075 17.8483 4.37762C17.7634 3.75287 17.6076 3.42125 17.3696 3.18588C17.1307 2.94963 16.7956 2.7965 16.1621 2.71338C15.512 2.625 14.6493 2.625 13.4111 2.625H12.5492C11.3111 2.625 10.4484 2.62675 9.7965 2.7125C9.16388 2.7965 8.82875 2.9505 8.58988 3.18588C8.37988 3.39325 8.23638 3.67238 8.14625 4.15538C8.05263 4.65588 8.029 5.31562 8.02375 6.24662C8.02272 6.33108 8.00507 6.41451 7.97179 6.49215C7.93852 6.56978 7.89028 6.6401 7.82983 6.69909C7.76938 6.75808 7.6979 6.80458 7.61947 6.83595C7.54104 6.86731 7.45721 6.88292 7.37275 6.88188C7.28833 6.88199 7.20473 6.86546 7.1267 6.83324C7.04868 6.80101 6.97778 6.75372 6.91805 6.69407C6.85831 6.63442 6.81093 6.56358 6.7786 6.48561C6.74627 6.40763 6.72962 6.32404 6.72962 6.23962C6.73487 5.41013 6.75325 4.70575 6.84162 4.11513C5.15987 4.12038 4.26913 4.172 3.69513 4.73812C3.06338 5.362 3.0625 6.36562 3.0625 8.372ZM5.19313 10.9515C5.13312 10.8926 5.08546 10.8223 5.05292 10.7448C5.02039 10.6673 5.00363 10.5841 5.00363 10.5C5.00363 10.4159 5.02039 10.3327 5.05292 10.2552C5.08546 10.1777 5.13312 10.1074 5.19313 10.0485L6.91688 8.34575C7.03896 8.22573 7.2033 8.15847 7.3745 8.15847C7.5457 8.15847 7.71004 8.22573 7.83213 8.34575C7.89213 8.40464 7.93979 8.4749 7.97233 8.55242C8.00486 8.62995 8.02162 8.71318 8.02162 8.79725C8.02162 8.88132 8.00486 8.96455 7.97233 9.04208C7.93979 9.1196 7.89213 9.18986 7.83213 9.24875L7.21088 9.86125H13.4111C13.7681 9.86125 14.0586 10.1474 14.0586 10.5C14.0586 10.8526 13.7681 11.1388 13.4111 11.1388H7.21L7.83125 11.7513C7.89125 11.8101 7.93892 11.8804 7.97145 11.9579C8.00399 12.0354 8.02075 12.1187 8.02075 12.2028C8.02075 12.2868 8.00399 12.3701 7.97145 12.4476C7.93892 12.5251 7.89125 12.5954 7.83125 12.6543C7.70917 12.7743 7.54482 12.8415 7.37362 12.8415C7.20243 12.8415 7.03808 12.7743 6.916 12.6543L5.19313 10.9515Z" fill="currentColor"/>
        </svg>
      ), 
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
                isActive(item.path) ? 'bg-[#e6e1e1]' : 'bg-transparent hover:bg-[#E8EAFF]'
              }`}
            >
              {item.badgeCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] max-w-[28px] h-[15px] bg-[#4D49FC] text-white text-[0.55rem] font-semibold rounded-full flex items-center justify-center px-1">
                  {item.badgeCount > 99 ? '99+' : item.badgeCount}
                </span>
              )}
              <div className="mb-0.5">
                {item.iconComponent(isActive(item.path) ? officeColor : '#6B7280')}
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
      <div className="hidden md:block  pl-6 pt-6 pb-6 w-[15rem] flex-shrink-0  h-full overflow-hidden">


        <div className="w-full flex-shrink-0 h-full  relative">

          <div className="relative w-full box-border bg-[#F4F4F4] border-r-0 rounded-[15px] h-full flex flex-col">
            {/* Logo */}
            <div className="p-3 py-6 flex items-center justify-center flex-shrink-0">
              <OfficeSidebarLogo officeId={officeId} officeName={officeName} /> 
            </div>
          
            {/* MENU Section */}
            <div className="flex-shrink-0">
              {/* MENU Label */}
              <div className="px-8 pt-2 text-[#9CA3AF] font-semibold text-[0.7rem] tracking-[0.5px]">
                MENU
              </div>

              {/* Menu Items */}
              {menuItems.map((item) => (
                <div key={item.text} className="mb-0.5">
                  <div className="px-6 relative hover:bg-[#b9b6d9] transition-all duration-200">
                    {/* Active highlight bar */}
                    {(isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) && (
                      <div 
                        className="absolute left-0 top-0  bottom-0 w-3.5 rounded-r-lg"
                        style={{ backgroundColor: '#4D49FC' }}
                      />
                    )}
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full rounded-xl py-[9.6px]  cursor-pointer flex items-center transition-all duration-200 ${
                        (isActive(item.path) || (item.text === 'Settings' && isSettingsActive()))
                          ? 'bg-transparent cursor-pointer ' 
                          : 'bg-transparent text-[#040195] '
                      }`}
                      style={{ color: (isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? officeColor : undefined }}
                    >
                      <div className="min-w-[36px]">
                        {item.iconComponent((isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? '#4D49FC' : '#040195')}
                      </div>
                      <span className={`text-[0.9rem] ${(isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? 'font-semibold' : 'font-medium'} flex-1`}
                        style={{ color: (isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? officeColor : '#040195' }}
                      >
                        {item.text}
                      </span>
                      {item.badgeCount > 0 && (
                        <span className="ml-auto min-w-[20px] max-w-[32px] h-5 bg-[#4D49FC] text-white text-[0.65rem] font-semibold rounded-full flex items-center justify-center px-1.5 flex-shrink-0">
                          {item.badgeCount > 99 ? '99+' : item.badgeCount}
                        </span>
                      )}
                    </button>
                  </div>
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
                  <div className="mb-0.5 px-6 hover:bg-[#b9b6d9] transition-all duration-200 relative">
                    {/* Active highlight bar for Settings when any settings page is active */}
                    {(isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-3.5 rounded-r-lg"
                        style={{ backgroundColor: '#4D49FC' }}
                      />
                    )}
                    <button
                      onClick={item.action === 'logout' ? handleLogout : () => handleNavigation(item.path)}
                      className={`w-full rounded-xl py-[9.6px] cursor-pointer flex items-center transition-all duration-200 ${
                        (isActive(item.path) || (item.text === 'Settings' && isSettingsActive()))
                          ? 'text-[#4D49FC]'
                          : 'text-[#040195]'
                      }`}
                      style={{ color: (isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? officeColor : '#040195' }}
                    >
                      <div className="min-w-[36px]" style={{ color: 'inherit' }}>
                        {item.icon}
                      </div>
                      <span className={`text-[0.9rem] ${(isActive(item.path) || (item.text === 'Settings' && isSettingsActive())) ? 'font-semibold' : 'font-medium'}`}>
                        {item.text}
                      </span>
                    </button>
                  </div>

                  {/* Settings Subcategories - Only show when Settings is active */}
                  {item.text === 'Settings' && isSettingsActive() && (
                    <div className="ml-6 mb-2 space-y-1">
                      <button
                        onClick={() => handleNavigation(`${basePath}/settings/programs`)}
                        className={`w-full rounded-lg py-2 px-4 flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                          location.pathname === `${basePath}/settings/programs`
                            ? 'bg-[#E8EAFF] text-[#4D49FC]'
                            : 'text-[#6B7280] hover:bg-[#E8EAFF] hover:text-[#4D49FC]'
                        }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={`text-sm ${location.pathname === `${basePath}/settings/programs` ? 'font-semibold' : 'font-medium'}`}>
                          Manage Programs
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

OfficeSidebar.propTypes = {
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.string.isRequired,
  officeName: PropTypes.string,
};
