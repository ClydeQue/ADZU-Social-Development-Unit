import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';

export default function UnitDirectorReports() {
  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
     
    {/* Wrapper sample */}
      <WhiteContainer>
        <Sidebar />
        {/* Right content after ng sidebar */}
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
            {/*  content cards here */}
        
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-x-hidden overflow-y-auto md:overflow-hidden flex flex-col min-h-0">
              <h1 className="text-2xl font-bold">Reports</h1>
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
