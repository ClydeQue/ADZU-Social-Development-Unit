import { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion } from "framer-motion";
import ThreeCircles from '../../utils/ThreeCircles';

// Lazy load image component with Suspense support
// eslint-disable-next-line react/prop-types
const LazyImage = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

const OfficeLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
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

  // Live countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutSeconds(prev => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lockoutSeconds]);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Don't allow login if locked out
    if (lockoutSeconds > 0) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
        userType: 'office'
      });
      
      // Route to office-specific dashboard based on officeId (ACRONYM)
      navigate(`/office/${officeId}/dashboard`);
    } catch (err) {
      console.error('Office login error:', err);
      
      // Handle account lockout eto 
      if (err.locked) {
        const seconds = err.remainingSeconds || 60;
        setLockoutSeconds(seconds);
        setError(`Too many failed attempts. Try again in ${seconds} seconds.`);
      }
      // Handle request throttling (spam prevention) - only if NOT locked
      else if (err.throttled) {
        const seconds = err.waitSeconds || 2;
        setError(`Too fast! Please wait ${seconds} second${seconds > 1 ? 's' : ''}.`);
      }
      // Show remaining attempts
      else if (err.remainingAttempts !== undefined) {
        const attempts = err.remainingAttempts;
        setError(` ${err.message}. ${attempts} attempt${attempts !== 1 ? 's' : ''} remaining.`);
      } 
      else {
        setError(err.message || 'Login failed');
      }
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
        <Suspense fallback={<div className="h-15 w-20 bg-white/20 rounded animate-pulse" />}>
          <LazyImage src="/logos/logoRightHeader.webp" alt="AdZU" className="h-15 object-contain" />
        </Suspense>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-white ml-20 
        rounded-tl-3xl rounded-tr-3xl shadow-2xl lg:p-15 2xl:p-40 flex flex-col items-center relative"
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6 xl:top-10 xl:left-10">
          <Button
            onClick={() => navigate('/office-selection')}
            sx={{ 
              minWidth: 'auto',
              padding: 0,
              '&:hover': { opacity: 0.7 }
            }}
          >
            <Suspense fallback={<div className="w-10 h-10 bg-blue-100 rounded animate-pulse" />}>
              <LazyImage src="/icons/arrow_left_blue.svg" alt="Back" className="w-10 h-10 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12" />
            </Suspense>
          </Button>
        </div>

        {/* Office Loooogo */}
        <div className="lg:mb-6 2xl:mb-10 2xl:-mt-14">
          <Suspense fallback={<div className="h-32 w-32 bg-gray-200 rounded animate-pulse" />}>
            <LazyImage 
              src={officeLogo} 
              alt={officeName} 
              className="h-32 w-auto object-contain"
            />
          </Suspense>
        </div>

        {/* Office Titleeeeeeeeee */}
        <h2 className="2xl:w-[28rem] text-2xl font-bold font-poppins text-[#040195] text-center mb-8 px-4 xl:pb-6 ">
          {officeName}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:w-full 2xl:w-[24rem]">
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
                disabled={loading || lockoutSeconds > 0}
                className="w-full border-2 font-poppins border-[#040195] rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA] disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                disabled={loading || lockoutSeconds > 0}
                className="w-full border-2 font-poppins border-[#040195] rounded-xl px-12 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center relative">
            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className="w-48 py-3 text-lg font-poppins font-bold shadow-lg 
                        bg-[#4D49FC] text-white rounded-full 
                        hover:bg-[#3d39dc] transition cursor-pointer 
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : lockoutSeconds > 0 ? 'LOCKED' : 'LOGIN'}
            </button>

            {/* Error Message - Absolute Below Button */}
            {error && (
              <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 w-max">
                {lockoutSeconds > 0 ? (
                  <div className="text-red-600 text-sm font-medium text-center">
                    <div>Too many failed attempts</div>
                    <div className="mt-1">Try again in <span className="font-bold">{lockoutSeconds}</span>s</div>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm font-medium text-center">{error}</div>
                )}
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OfficeLoginPage;
