import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';

/**
 * Users Management Page
 * Allows Unit Director to manage users and approve password reset requests
 */
export default function UsersManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'reset-requests'
  
  // Mock data - TODO: Replace with actual API calls
  const mockUsers = useMemo(() => [
    { id: 1, username: 'acca_director', role: 'Office Director', office: 'ACCA', email: 'acca@adzu.edu.ph', status: 'active' },
    { id: 2, username: 'aces_director', role: 'Office Director', office: 'ACES', email: 'aces@adzu.edu.ph', status: 'active' },
    { id: 3, username: 'aclg_director', role: 'Office Director', office: 'ACLG', email: 'aclg@adzu.edu.ph', status: 'active' },
  ], []);

  const mockResetRequests = [
    { id: 1, username: 'acca_director', office: 'ACCA', requestDate: '2025-11-20', reason: 'Forgot password', status: 'pending' },
    { id: 2, username: 'aces_director', office: 'ACES', requestDate: '2025-11-22', reason: 'Security concern', status: 'pending' },
  ];

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockUsers;
    
    const query = searchQuery.toLowerCase();
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.office.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }, [searchQuery, mockUsers]);

  // Approve reset request mutation
  const approveResetMutation = useMutation({
    mutationFn: () => {
      // TODO: Implement actual API call
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['password-reset-requests']);
      alert('Password reset approved successfully!');
    },
  });

  const handleApproveReset = (request) => {
    if (confirm(`Approve password reset for ${request.username}?`)) {
      approveResetMutation.mutate(request.id);
    }
  };

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
        
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto px-4">
            {/* Header with Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/unit-director/settings/main')}
                className="flex items-center gap-2 text-[#4D49FC] hover:underline mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Settings
              </button>
              
              <h1 className="text-3xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                USER MANAGEMENT
              </h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md p-2 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === 'users'
                      ? 'bg-[#4D49FC] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    All Users ({mockUsers.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('reset-requests')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === 'reset-requests'
                      ? 'bg-[#FFAE00] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Reset Requests ({mockResetRequests.filter(r => r.status === 'pending').length})
                  </div>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users by username, office, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
            )}

            {/* Users List */}
            {activeTab === 'users' && (
              <div className="h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
                <style>{`
                  .users-scroll-container::-webkit-scrollbar {
                    width: 5px;
                  }
                  .users-scroll-container::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .users-scroll-container::-webkit-scrollbar-thumb {
                    background-color: #040195;
                    border-radius: 42px;
                  }
                  .users-scroll-container::-webkit-scrollbar-thumb:hover {
                    background-color: #030174;
                  }
                `}</style>
                
                {/* Table Header */}
                <div className="bg-[#040195] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[200px_1fr_200px] gap-4 items-center flex-shrink-0">
                  <div className="text-xs font-semibold uppercase">Username</div>
                  <div className="text-xs font-semibold uppercase">Active Status</div>
                  <div className="text-xs font-semibold uppercase text-right">Credential Update</div>
                </div>

                {/* Table Body - Scrollable Container */}
                {filteredUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                      No users found matching your search
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 users-scroll-container min-h-0">
                    <div className="space-y-1.5">
                      {filteredUsers.map((user) => (
                        <div 
                          key={user.id}
                          className="bg-[#F4F4F4] hover:bg-[#E5E5FF] transition-colors rounded-lg px-6 py-3 grid grid-cols-[200px_1fr_200px] gap-4 items-center"
                        >
                          <div className="flex items-center">
                            <span className="text-[#4D49FC] font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {user.office}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-gray-700 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {user.status === 'active' ? 'Active Now' : '5 hours ago'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end">
                            <button
                              className="px-4 py-1.5 bg-[#4D49FC] text-white font-semibold rounded-md hover:bg-[#201f65] transition-colors text-xs"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              Approve Change
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reset Requests List */}
            {activeTab === 'reset-requests' && (
              <div className="space-y-4">
                {mockResetRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                      No pending password reset requests
                    </p>
                  </div>
                ) : (
                  mockResetRequests
                    .filter(request => request.status === 'pending')
                    .map((request) => (
                      <div key={request.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-[#FFAE00] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {request.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-[#040195]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  {request.username}
                                </h3>
                                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  {request.office}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Requested on: <strong>{request.requestDate}</strong>
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-sm">
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Reason: <strong>{request.reason}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => handleApproveReset(request)}
                              disabled={approveResetMutation.isPending}
                              className="px-6 py-2 bg-[#18B703] text-white font-semibold rounded-lg hover:bg-[#159502] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Approve
                            </button>
                            <button
                              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Deny
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
