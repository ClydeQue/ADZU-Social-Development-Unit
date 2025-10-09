import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
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

const UnitDirectorLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login, loading = false } = useAuth();

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
        <Suspense fallback={<div className="h-16 w-24 bg-white/20 rounded animate-pulse" />}>
          <LazyImage src="/logos/logoRightHeader.webp" alt="AdZU" className="h-16 object-contain" />
        </Suspense>
      </div>

      {/* Bug fix Login Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-white ml-20 
        rounded-tl-3xl rounded-tr-3xl shadow-2xl lg:p-15 2xl:p-40 flex flex-col items-center relative"
      >
        {/* Back Button  */}
        <div className="absolute top-6 left-6 xl:top-10 xl:left-10">
          <Button
            onClick={() => navigate('/')}
            sx={{ 
              minWidth: 'auto',
              padding: 0,
              '&:hover': { opacity: 0.7 }
            }}
          >
            <Suspense fallback={<div className="w-10 h-10 bg-blue-100 rounded animate-pulse" />}>
              <LazyImage src="/icons/arrow_left_blue.svg" alt="Back" className=" w-6 h-6 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12" />
            </Suspense>
          </Button>
        </div>

        {/* Unit Director Picture */}
        <div className="lg:mb-6 2xl:mb-10 2xl:-mt-14">
          <div className="xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 rounded-full bg-white flex items-center justify-center shadow-xl">
            <div className="xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 rounded-full bg-[#040195] flex items-center justify-center">
              <Suspense fallback={<div className="w-28 h-28 rounded-full bg-blue-200 animate-pulse" />}>
                <LazyImage src="/images/pic.webp" alt="Profile" className="xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 rounded-full object-cover"/>
              </Suspense>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="lg:text-3xl 2xl:text-4xl font-poppins font-bold text-[#040195] text-center mb-8 xl:pb-6">
          UNIT DIRECTOR
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4">
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:w-full 2xl:w-[24rem]">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-base font-semibold font-inter text-[#040195] mb-2">
              AdZU Address
            </label>
            <div className="relative">
              <Suspense fallback={<div className="absolute left-4 top-1/2 transform -translate-y-1/2 
              w-5 h-5 bg-gray-200 rounded" />}>
                <LazyImage
                  src="/icons/person.svg"
                  alt="person icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
                />
              </Suspense>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border-2 border-[#040195] font-poppins rounded-xl px-12 py-3 
                text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] 
                placeholder-[#CACACA]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-base  font-inter font-semibold text-[#040195] mb-2">
              Password
            </label>
            <div className="relative">
              <Suspense fallback={<div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-200 rounded" />}>
                <LazyImage
                  src="/icons/password.svg"
                  alt="password icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
                />
              </Suspense>
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