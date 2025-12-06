import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function UnitDirectorHelp() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'capabilities', label: 'Your Capabilities', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'navigation', label: 'System Navigation', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'management', label: 'Management Tools', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'support', label: 'Support & Contact', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

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
            <div className="bg-[#F4F4F4] rounded-[15px] mx-2 sm:mx-3 xl:mx-4 flex-1 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#040195] to-[#3d39cc] px-6 sm:px-8 py-6 rounded-t-[15px]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Help & Documentation
                    </h1>
                    <p className="text-white/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Unit Director&apos;s Complete Guide to the SDU Monitoring System
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Section Navigation */}
                <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden lg:block flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Quick Navigation
                  </p>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          activeSection === section.id
                            ? 'bg-[#040195] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                        </svg>
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{section.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden p-4 bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
                  <div className="flex gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeSection === section.id
                            ? 'bg-[#040195] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                  {/* Overview Section */}
                  {activeSection === 'overview' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#040195] mb-4 flex items-center gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <div className="w-10 h-10 bg-[#F0F4FF] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#040195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Welcome, Unit Director
                        </h2>
                        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                          As the Unit Director, you have <strong>full administrative control</strong> over the SDU Project Monitoring System. 
                          This platform empowers you to oversee all six SDU offices, monitor their activities, manage programs, 
                          coordinate communications, and generate comprehensive reports for strategic decision-making.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>6 SDU Offices</h3>
                          </div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Oversee CCES, ACCA, ACES, ALTEC, APC, and ACLG offices with complete visibility into their projects and activities.
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Real-time Analytics</h3>
                          </div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Access comprehensive dashboards with SDG coverage, project metrics, and performance analytics across all offices.
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Direct Communication</h3>
                          </div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Communicate directly with all office staff through the built-in messaging system for seamless coordination.
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Report Generation</h3>
                          </div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Generate consolidated reports, export data in multiple formats, and print activity summaries for documentation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Capabilities Section */}
                  {activeSection === 'capabilities' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Unit Director Capabilities
                        </h2>
                        <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Your administrative privileges and what you can accomplish in the system
                        </p>

                        <div className="space-y-4">
                          <div className="border-l-4 border-[#040195] bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Full Project Oversight
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              View, edit, update, or delete any project from all six SDU offices. Monitor project progress, 
                              review submissions, and ensure quality standards are maintained across the entire network.
                            </p>
                          </div>

                          <div className="border-l-4 border-green-500 bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Program Management
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Create, approve, edit, or remove programs that offices can use for their activities. 
                              Review and process program requests submitted by offices, ensuring proper categorization and alignment.
                            </p>
                          </div>

                          <div className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              User Administration
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Manage all user accounts including creating new office users, resetting passwords, 
                              and maintaining access control across the system to ensure security and proper authorization.
                            </p>
                          </div>

                          <div className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Communication Hub
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Send and receive messages from all office staff. All inter-office communications are 
                              routed through you, allowing centralized coordination and ensuring nothing falls through the cracks.
                            </p>
                          </div>

                          <div className="border-l-4 border-orange-500 bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Analytics & Reporting
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Access comprehensive analytics dashboards showing SDG coverage, project distribution, 
                              participant demographics, and performance metrics. Generate and export consolidated reports for stakeholders.
                            </p>
                          </div>

                          <div className="border-l-4 border-red-500 bg-gray-50 p-4 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Calendar Overview
                            </h3>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                              View all scheduled activities across all offices in a unified calendar view. 
                              Track upcoming events, identify scheduling conflicts, and plan resource allocation effectively.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Section */}
                  {activeSection === 'navigation' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          System Navigation Guide
                        </h2>
                        <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Understanding the different pages and how to navigate the system efficiently
                        </p>

                        <div className="grid gap-4">
                          <div className="bg-gradient-to-r from-[#040195] to-[#3d39cc] rounded-xl p-5 text-white">
                            <div className="flex items-center gap-3 mb-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <h3 className="font-bold text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>Overview Dashboard</h3>
                            </div>
                            <p className="text-white/90 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Your command center displaying total projects, SDG coverage percentages, upcoming activities, 
                              recent submissions, and key performance indicators across all offices at a glance.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#040195] rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Reports</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Browse all projects from every office. Filter by office, program, SDG, or date range. 
                                Click any project to view details, edit, or generate printable reports.
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#040195] rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Calendar</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Visual calendar showing all scheduled activities. Color-coded by office for easy identification. 
                                Click events to view details or navigate to the full project report.
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#040195] rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Settings</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Manage your account security (password/username), programs, users, and messages 
                                from one centralized location with easy-to-use management tools.
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#040195] rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Search</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Quickly find any project, activity, or keyword across the entire system. 
                                Use the search bar in the header for instant results.
                              </p>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Header Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="bg-white rounded-lg p-3">
                                <p className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Search</p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Find projects instantly</p>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <p className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Inbox</p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>View office messages</p>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <p className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Activity updates</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Management Section */}
                  {activeSection === 'management' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Management Tools
                        </h2>
                        <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Access these tools through Settings → Management section
                        </p>

                        <div className="space-y-6">
                          <div className="border rounded-xl overflow-hidden">
                            <div className="bg-[#040195] px-5 py-3">
                              <h3 className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Program Management
                              </h3>
                            </div>
                            <div className="p-5 space-y-3">
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Programs are categories that offices use to classify their activities. As Unit Director, you control the master list.
                              </p>
                              <ul className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Add Programs:</strong> Create new program categories with names, descriptions, and thumbnail images</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Edit Programs:</strong> Update program details, including images and descriptions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Delete Programs:</strong> Remove obsolete programs (affects future activities only)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-0.5">●</span>
                                  <span><strong>Program Requests:</strong> Review and approve/reject program requests from offices</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="border rounded-xl overflow-hidden">
                            <div className="bg-[#040195] px-5 py-3">
                              <h3 className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                User Management
                              </h3>
                            </div>
                            <div className="p-5 space-y-3">
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Control access to the system by managing user accounts for all six offices.
                              </p>
                              <ul className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Create Users:</strong> Add new office user accounts with secure credentials</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Reset Passwords:</strong> Help offices regain access by resetting their passwords</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>View All Users:</strong> See complete list of registered users and their offices</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="border rounded-xl overflow-hidden">
                            <div className="bg-[#040195] px-5 py-3">
                              <h3 className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Message Center
                              </h3>
                            </div>
                            <div className="p-5 space-y-3">
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Centralized communication hub for all office correspondence.
                              </p>
                              <ul className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>View Messages:</strong> Read all incoming messages from offices</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Compose:</strong> Send messages to any office or broadcast to all</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span><strong>Thread Management:</strong> Organize conversations by office</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Support Section */}
                  {activeSection === 'support' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Support & Contact
                        </h2>
                        <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Need help? Encounter a bug? Have suggestions? We&apos;re here to help.
                        </p>

                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-[#040195] rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Contact the Developer
                                </h3>
                                <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  For technical issues, bug reports, feature requests, or any questions about the system, 
                                  please reach out to the developer directly.
                                </p>
                                <div
                                  className="inline-flex items-center gap-2 bg-[#040195] text-white px-4 py-2 rounded-lg text-sm font-medium"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  0969 091 9791
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Report a Bug</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Found something not working correctly? Please include steps to reproduce, 
                                screenshots if possible, and the browser you&apos;re using.
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Feature Request</h3>
                              </div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Have an idea that could improve the system? We welcome suggestions to make 
                                the platform more useful for SDU operations.
                              </p>
                            </div>
                          </div>

                          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                            <div className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h3 className="font-bold text-amber-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Quick Tips</h3>
                                <ul className="text-sm text-amber-700 space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  <li>• Try refreshing the page if something seems stuck</li>
                                  <li>• Clear browser cache if experiencing display issues</li>
                                  <li>• Use Chrome or Firefox for best compatibility</li>
                                  <li>• Ensure stable internet connection for file uploads</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Credits */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            SDU Project Monitoring System
                          </p>
                          <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Developed for the Social Development Unit of Ateneo de Zamboanga University
                          </p>
                          <div className="flex items-center justify-center gap-2 text-gray-400">
                            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Crafted with</span>
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>by</span>
                            <a
                              href="https://kc-que-portfolio.vercel.app"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#040195] hover:underline font-medium"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              KC Que and Team
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}