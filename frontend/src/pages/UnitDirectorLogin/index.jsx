import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Alert, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion } from "framer-motion";

const UnitDirectorLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('� Unit Director Login Attempt:', formData.email);
      
      await login(formData.email, formData.password, 'unit_director');
      
      console.log('✅ Unit Director login successful - navigating to dashboard');
      navigate('/unit-director/dashboard');
      
    } catch (err) {
      console.error('❌ Unit Director login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-start items-end bg-no-repeat bg-cover bg-center p-4 sm:p-6 overflow-hidden"
      style={{
        backgroundImage: `url('/images/Unit Director (Log-in).png')`,
        backgroundSize: 'cover',
      }}
    >
      {/*Login Box Animation*/}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-24 right-0 flex"
      >
      {/*Login Box*/}
      <div className="absolute bottom-0 left-24 right-0 flex">
        <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-lg p-10 flex flex-col items-center">
      
      {/*Back Icon*/}
      <div className="absolute" style={{ top: 20, left: 20 }}>
        <Button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <img src="/icons/back_icon.svg" alt="Back" className="w-10 h-10"/>
        </Button>
      </div>
    
          {/*Office Logo/Unit Director Picture*/}
          <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center shadow-xl">
            <div className="w-40 h-40 rounded-full bg-[#040195] flex items-center justify-center">
              <img src="/images/pic.jpg" alt="Profile" className="w-36 h-36 rounded-full object-cover"/>
            </div>
          </div>

          {/*Name*/}
          <h2 className="text-3xl font-bold text-blue-800 font-poppins p-5 mb-6">
            UNIT DIRECTOR
          </h2>

          {/*Form inputs*/}
          <form onSubmit={handleSubmit} className="w-full">

            {/*Email Input*/}
            <div className="flex justify-center">
              <div className="w-85 mb-4 ">
                <label className="block text-lg font-semibold text-[#040195] mb-1">
                  AdZU Address
                </label>
                  <div className="relative">
                    <img
                      src="/icons/person.svg"
                      alt="person icon"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#040195]"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full border-2 border-[#040195] rounded-lg px-10 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#040195] placeholder-[#CACACA]"
                    />
                  </div>
              </div>
            </div>
            {/*Password Input*/}
            <div className="flex justify-center">
              <div className="w-85 mb-6">
                <label className="block text-lg font-semibold text-[#040195] mb-1">
                  Password
                </label>
                <div className="relative">
                  <img
                      src="/icons/password.svg"
                      alt="person icon"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#040195]"
                    />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full border-2 border-[#040195] rounded-lg px-10 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#040195] placeholder-[#CACACA]"
                  />
                  </div>
              </div>
            </div>

            {/*Login Button*/}
            <div className="flex justify-center mb-7 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-50 py-2 text-lg font-bold shadow-lg 
                          bg-[#4D49FC] text-white rounded-full 
                          hover:bg-[#2a2adc] transition cursor-pointer 
                          disabled:opacity-50">
                {loading ? 'Logging you in...' : 'LOGIN'}
              </button>
            </div>
          </form>

          {/*Error Alert*/}          {error && (
            <Alert severity="error" className="w-full mt-4">
              {error}
            </Alert>
          )}
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default UnitDirectorLoginPage;