import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

/**
 * Main Settings Page for Unit Director
 * Shows password/username change forms and quick access to Programs/Users management
 */
export default function MainSettings() {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null); // null, 'password', 'username'
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Username change state
  const [usernameForm, setUsernameForm] = useState({
    newUsername: '',
    currentPassword: ''
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    usernameConfirm: false
  });

  // Handle password change (TODO: integrate with API)
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Password change submitted:', passwordForm);
    // TODO: Call API to update password
    alert('Password change functionality will be implemented with API');
  };

  // Handle username change (TODO: integrate with API)
  const handleUsernameChange = (e) => {
    e.preventDefault();
    console.log('Username change submitted:', usernameForm);
    // TODO: Call API to update username
    alert('Username change functionality will be implemented with API');
  };

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
        
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 sm:p-8 xl:p-10 mx-2 sm:mx-3 xl:mx-4 flex-1 overflow-y-auto">
              {/* Professional Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
                    Settings
                  </h1>
                  <p className="text-gray-500 text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Configure your account preferences and system management
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#F0F4FF] rounded-lg border border-[#040195]/20">
                  <div className="w-10 h-10 bg-[#040195] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    UD
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#040195]">Unit Director</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main View */}
            {!activeForm && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Account Settings */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Account Security Card */}
                  <div className="bg-white rounded-2xl shadow-sm border-2 border-[#7E7DC5] overflow-hidden">
                    <div className="bg-[#040195] px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        Account Security
                      </h2>
                      <p className="text-white/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Manage your authentication credentials
                      </p>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {/* Change Password Option */}
                      <button
                        onClick={() => setActiveForm('password')}
                        className="w-full group hover:bg-[#F8F9FF] border-2 border-[#7E7DC5] cursor-pointer hover:border-[#040195] rounded-xl p-5 transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F0F4FF] group-hover:bg-[#040195] rounded-xl flex items-center justify-center transition-colors">
                              <svg className="w-6 h-6 text-[#040195] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-[#040195] text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Change Password
                              </h3>
                              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Update your account password to enhance security
                              </p>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-gray-400 group-hover:text-[#040195] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>

                      {/* Change Username Option */}
                      <button
                        onClick={() => setActiveForm('username')}
                        className="w-full group hover:bg-[#F8F9FF] border-2 border-[#7E7DC5] cursor-pointer hover:border-[#040195] rounded-xl p-5 transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F0F4FF] group-hover:bg-[#040195] rounded-xl flex items-center justify-center transition-colors">
                              <svg className="w-6 h-6 text-[#040195] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-[#040195] text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Change Username
                              </h3>
                              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Modify your account display name
                              </p>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-gray-400 group-hover:text-[#040195] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - System Management */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border-2 border-[#7E7DC5] overflow-hidden">
                    <div className="bg-[#040195] px-6 py-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Management
                      </h2>
                    </div>
                    
                    <div className="p-5 space-y-3">
                      {/* Programs Management */}
                      <button
                        onClick={() => navigate('/unit-director/settings/programs')}
                        className="w-full bg-[#040195] hover:bg-[#3d39cc] cursor-pointer text-white rounded-xl p-4 transition-all shadow-md hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Programs
                              </h3>
                              <p className="text-xs text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Manage office programs
                              </p>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>

                      {/* Users Management */}
                      <button
                        onClick={() => navigate('/unit-director/settings/users')}
                        className="w-full bg-[#040195] hover:bg-[#3d39cc] cursor-pointer text-white rounded-xl p-4 transition-all shadow-md hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Users
                              </h3>
                              <p className="text-xs text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                                User & password resets
                              </p>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-gradient-to-br from-[#F0F4FF] to-[#E8EAFF] rounded-2xl p-6 border-2 border-[#7E7DC5]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#040195] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#040195] text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Quick Tip
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Regularly update your password and review user permissions to maintain system security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Change Form */}
            {activeForm === 'password' && (
              <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                  onClick={() => setActiveForm(null)}
                  className="flex items-center gap-2 text-white bg-[#040195] hover:bg-[#3d39cc] px-4 py-2 rounded-full mb-4 font-semibold transition-all text-xs cursor-pointer shadow-sm hover:shadow-md"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Settings
                </button>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username (read-only display) */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value="Social Development Unit"
                        readOnly
                        className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Current Password */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full focus:border-[#4D49FC] focus:ring-4 focus:ring-[#4D49FC]/20 outline-none transition-all text-gray-600 text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="**************"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195] transition-colors"
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* New Password */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full focus:border-[#4D49FC] focus:ring-4 focus:ring-[#4D49FC]/20 outline-none transition-all text-gray-600 text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="**************"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195] transition-colors"
                        >
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Retype Password */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Retype Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full focus:border-[#4D49FC] focus:ring-4 focus:ring-[#4D49FC]/20 outline-none transition-all text-gray-600 text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="**************"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195] transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-[#4D49FC] hover:bg-[#3d39cc] text-white font-bold py-2.5 px-6 rounded-full hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setShowPasswords({ current: false, new: false, confirm: false, usernameConfirm: false });
                      }}
                      className="bg-[#4D49FC] hover:bg-[#3d39cc] text-white font-bold p-2.5 rounded-full hover:shadow-lg transition-all"
                      title="Reset form"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Username Change Form */}
            {activeForm === 'username' && (
              <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                  onClick={() => setActiveForm(null)}
                  className="flex items-center gap-2 text-white bg-[#040195] hover:bg-[#3d39cc] px-4 py-2 rounded-full mb-4 font-semibold transition-all text-xs cursor-pointer shadow-sm hover:shadow-md"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Settings
                </button>

                <form onSubmit={handleUsernameChange} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Username (read-only) */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value="Social Development Unit"
                        readOnly
                        className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Current Password for Confirmation */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.usernameConfirm ? "text" : "password"}
                          value={usernameForm.currentPassword}
                          onChange={(e) => setUsernameForm({ ...usernameForm, currentPassword: e.target.value })}
                          className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full focus:border-[#4D49FC] focus:ring-4 focus:ring-[#4D49FC]/20 outline-none transition-all text-gray-600 text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="**************"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, usernameConfirm: !showPasswords.usernameConfirm })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195] transition-colors"
                        >
                          {showPasswords.usernameConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* New Username */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        New Username
                      </label>
                      <input
                        type="text"
                        value={usernameForm.newUsername}
                        onChange={(e) => setUsernameForm({ ...usernameForm, newUsername: e.target.value })}
                        className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full focus:border-[#4D49FC] focus:ring-4 focus:ring-[#4D49FC]/20 outline-none transition-all text-gray-600 text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        placeholder="Enter new username"
                        required
                      />
                    </div>

                    {/* Retype Password */}
                    <div>
                      <label className="block text-base font-bold text-[#040195] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Retype Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.usernameConfirm ? "text" : "password"}
                          value={usernameForm.currentPassword}
                          readOnly
                          className="w-full px-5 py-3 border-[3px] border-[#040195] rounded-full bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="**************"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, usernameConfirm: !showPasswords.usernameConfirm })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#040195] transition-colors"
                        >
                          {showPasswords.usernameConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-[#4D49FC] hover:bg-[#3d39cc] text-white font-bold py-2.5 px-6 rounded-full hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsernameForm({ newUsername: '', currentPassword: '' });
                        setShowPasswords({ ...showPasswords, usernameConfirm: false });
                      }}
                      className="bg-[#4D49FC] hover:bg-[#3d39cc] text-white font-bold p-2.5 rounded-full hover:shadow-lg transition-all"
                      title="Reset form"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
