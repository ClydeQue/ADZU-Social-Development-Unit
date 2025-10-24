import Sidebar from '@/components/Sidebar';

export default function UnitDirectorHelp() {
  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-2 sm:p-4 xl:p-[35px] overflow-hidden">
      {/* Container */}
      <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow pt-2 sm:pt-4 xl:pt-4 pb-2 sm:pb-6 xl:pb-4 p-1 sm:p-2 flex flex-col overflow-hidden">
          {/* XL Container */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Main Content Area */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 sm:p-8 xl:p-10 mx-2 sm:mx-3 xl:mx-4 flex-1 overflow-y-auto">
              {/* User Guide Content */}
              <div className="max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#040195] mb-6">User Guide</h1>
                
                <p className="text-[#040195] mb-8 leading-relaxed">
                  Welcome to the SDU Project Monitoring System — your platform for efficient project tracking, reporting, 
                  and communication within the Social Development Unit (SDU).
                </p>

                {/* Purpose Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#040195] mb-4">Purpose</h2>
                  <p className="text-[#040195] leading-relaxed">
                    The system enables SDU Office Users to monitor, evaluate, and support all projects across the SDU network. 
                    It centralizes reporting and analytics to improve coordination and decision-making.
                  </p>
                </section>

                {/* Roles and Access Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#040195] mb-4">Roles and Access</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">View and oversee all projects from every SDU Office</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">Edit, update, or delete any office&apos;s project details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">Access analytics and dashboards for overall monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">Review SDG coverage and project performance across the network</span>
                    </li>
                  </ul>
                </section>

                {/* Pages and Functions Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#040195] mb-4">Pages and Functions</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Overview Page:</strong> Displays summaries of all ongoing and completed projects, SDG coverage, and upcoming activities.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Reports Page:</strong> View, edit, or delete project submissions from any SDU Office.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Calendar Page:</strong> View all project schedules, including start and end dates.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Edit Project Details:</strong> Modify project entries with options to undo, save, or print project summaries.
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Navigation Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#040195] mb-4">Navigation</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Search Tab</strong> – Search for projects, offices, or keywords
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Inbox</strong> – Access messages from offices and announcements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Notifications</strong> – View recent project updates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-[#040195]">
                        <strong>Account</strong> – Manage personal account details
                      </span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
