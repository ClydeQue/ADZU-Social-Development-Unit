import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion } from "framer-motion";
import ThreeCircles from '../../utils/ThreeCircles';

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
      console.log('Unit Director Login Attempt:', formData.email);
      
      await login(formData.email, formData.password, 'unit_director');
      
      console.log('Unit Director login successful - navigating to dashboard');
      navigate('/unit-director/dashboard');
      
    } catch (err) {
      console.error('Unit Director login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div 
      className="w-screen h-screen flex justify-start  items-end bg-no-repeat bg-cover bg-center relative overflow-hidden"
      style={{
        background: 'url(/images/unit-director-login-bg.webp) center/cover no-repeat',
      }}
    >

            <ThreeCircles />
      {/* AdZU lolgo right Branding Bottom Right */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        <img src="/logos/logoRightHeader.webp" alt="AdZU" className="h-16 object-contain" />
      </div>

      {/* BUg fix Login Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:max-w-lg bg-white ml-20 rounded-tl-3xl rounded-tr-3xl shadow-2xl p-15 flex flex-col items-center relative"
      >
        {/* Back Button  */}
        <div className="absolute top-6 left-6">
          <Button
            onClick={() => navigate('/')}
            sx={{ 
              minWidth: 'auto',
              padding: 0,
              '&:hover': { opacity: 0.7 }
            }}
          >
            <img src="/icons/arrow_left_blue.svg" alt="Back" className=" w-6 h-6 lg:w-10 lg:h-10" />
          </Button>
        </div>

        {/* Unit Director Picture */}
        <div className="mb-6">
          <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-xl">
            <div className="w-32 h-32 rounded-full bg-[#040195] flex items-center justify-center">
              <img src="/images/pic.jpg" alt="Profile" className="w-28 h-28 rounded-full object-cover"/>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-poppins font-bold text-[#040195] text-center mb-8">
          UNIT DIRECTOR
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4">
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-base font-semibold font-inter text-[#040195] mb-2">
              AdZU Address
            </label>
            <div className="relative">
              <img
                src="/icons/person.svg"
                alt="person icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border-2 border-[#040195] font-poppins rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-base  font-inter font-semibold text-[#040195] mb-2">
              Password
            </label>
            <div className="relative">
              <img
                src="/icons/password.svg"
                alt="password icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border-2 border-[#040195] font-poppins rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA]"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 py-3 text-lg font-bold shadow-lg 
                        bg-[#4D49FC] text-white rounded-full 
                        hover:bg-[#3d39dc] transition cursor-pointer 
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UnitDirectorLoginPage;