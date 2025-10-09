import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

export default function UnitDirectorCalendar() {
  const { user } = useAuth();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
              {/* Search Bar */}
              <div className="relative ml-3 w-[500px]">
                <input
                  type="text"
                  placeholder="Search"
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
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <EmailIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <NotificationsIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
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

            {/* Main Content */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Calendar content will go here */}
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
