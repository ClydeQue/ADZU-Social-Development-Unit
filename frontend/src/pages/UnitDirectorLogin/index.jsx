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
            <div className="w-full mb-4">
              <label className="block text-lg font-semibold text-[#040195] mb-1">
                AdZU Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border-2 border-[#040195] rounded-lg px-5 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            {/*Password Input*/}
            <div className="w-full mb-6">
              <label className="block text-lg font-semibold text-[#040195] mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border-2 border-[#040195] rounded-lg px-5 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/*Login Button*/}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-bold shadow-lg 
                        bg-[#4D49FC] text-white rounded-full 
                        hover:bg-[#2a2adc] transition cursor-pointer 
                        disabled:opacity-50">
              {loading ? 'Logging you in...' : 'LOGIN'}
            </button>
          </form>

          {/*Error Alert*/}          {error && (
            <Alert severity="error" className="w-full mt-4">
              {error}
            </Alert>
          )}

          {/*Back Button*/}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            className="mt-6"
          >
            Back to Home
          </Button>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default UnitDirectorLoginPage;