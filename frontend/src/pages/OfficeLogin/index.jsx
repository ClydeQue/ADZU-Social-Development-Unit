import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion } from "framer-motion";
import ThreeCircles from '../../utils/ThreeCircles';

const OfficeLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const { login, loading } = useAuth();
  const officeName = location.state?.officeName || 'Office';
  const officeId = location.state?.officeId || 'office';
  
  // Map office IDs to their logos
  const officeLogos = {
    'acca': '/logos/officeLogo/acca_logo_big.webp',
    'aces': '/logos/officeLogo/aces_logo_big.webp',
    'aclg': '/logos/officeLogo/aclg_logo_big.webp',
    'altec': '/logos/officeLogo/altec_logo_big.webp',
    'apc': '/logos/officeLogo/apc_logo_big.webp',
    'cces': '/logos/officeLogo/cces_logo_big.webp'
  };
  
  const officeLogo = officeLogos[officeId] || '/logos/officeLogo/aclg_logo_big.webp';

  
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
      console.log('🏢 Office Login Attempt:', formData.email);
      
      await login(formData.email, formData.password, 'office');
      
      console.log('Office login successful - navigating to dashboard');
      navigate('/office/dashboard');
      
    } catch (err) {
      console.error('Office login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div 
      className="w-screen h-screen flex justify-center items-end bg-no-repeat bg-cover bg-center  relative overflow-hidden"
      style={{
        background: 'url(/images/office-login-bg.webp) center/cover no-repeat',
      }}
    >
      <ThreeCircles />
      {/* AdZU Branding Bottom Right */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        <img src="/logos/logoRightHeader.webp" alt="AdZU" className="h-15 object-contain" />

      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-white rounded-tr-3xl rounded-tl-3xl shadow-2xl p-15 flex flex-col items-center relative"
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Button
            onClick={() => navigate('/office-selection')}
            sx={{ 
              minWidth: 'auto',
              padding: 0,
              '&:hover': { opacity: 0.7 }
            }}
          >
            <img src="/icons/arrow_left_blue.svg" alt="Back" className="w-10 h-10" />
          </Button>
        </div>

        {/* Office Loooogo */}
        <div className="mb-6">
          <img 
            src={officeLogo} 
            alt={officeName} 
            className="h-32 w-auto object-contain"
          />
        </div>

        {/* Office Titleeeeeeeeee */}
        <h2 className="text-2xl font-bold font-poppins text-[#040195] text-center mb-8 px-4">
          {officeName}
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
            <label className="block text-base font-inter font-semibold text-[#040195] mb-2">
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
                className="w-full border-2 font-poppins border-[#040195] rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-base font-inter font-semibold text-[#040195] mb-2">
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
                className="w-full border-2 font-poppins border-[#040195] rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA]"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 py-3 text-lg font-poppins font-bold shadow-lg 
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

export default OfficeLoginPage;
