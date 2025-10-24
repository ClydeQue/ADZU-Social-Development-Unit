import { useNavigate } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useAuth } from "@/context/AuthContext.jsx";
import { 
  titleVariants, 
  letterVariants, 
  imageVariants, 
  containerVariants, 
  layoutVariants,
  textScaleVariants
} from "../../utils/animations";

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

const WelcomePage = () => {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated, user, userType, setShowTransitionLoader } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Navigate immediately, loader is already showing
      setTimeout(() => {
        if (userType === 'unit_director') {
          navigate('/unit-director/dashboard');
        } else if (userType === 'office_user') {
          // Use office acronym (lowercase) for navigation
          const officeAcronym = user.office?.acronym?.toLowerCase();
          if (officeAcronym) {
            navigate(`/office/${officeAcronym}/dashboard`);
          } else {
            console.error('Office acronym not found for user:', user);
            setError('Office information not available. Please contact support.');
            setShowTransitionLoader(false);
          }
        }
        
        // Hide loader after navigation
        setTimeout(() => {
          setShowTransitionLoader(false);
        }, 500);
      }, 2000); // Show loader for 2 seconds before navigating
    }
  }, [isAuthenticated, user, userType, navigate, setShowTransitionLoader]);

  // Lockout countdown timer
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

    if (lockoutSeconds > 0) {
      return;
    }

    try {
      let result;
      let loginError = null;
      
      try {
        result = await login({
          email: formData.email,
          password: formData.password,
          userType: 'office'
        });
      } catch (officeError) {
        loginError = officeError;
        
        // Add small delay before trying unit_director to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1100));
        
        try {
          result = await login({
            email: formData.email,
            password: formData.password,
            userType: 'unit_director'
          });
        } catch {
          throw loginError;
        }
      }

      console.log('Login successful:', result);
      // Loader is managed by AuthContext now
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.isNetworkError) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.locked) {
        const seconds = err.remainingSeconds || 60;
        setLockoutSeconds(seconds);
        setError(`Too many failed attempts. Try again in ${seconds} seconds.`);
      } else if (err.throttled) {
        const seconds = err.waitSeconds || 2;
        setError(`Too fast! Please wait ${seconds} second${seconds > 1 ? 's' : ''}.`);
      } else if (err.remainingAttempts !== undefined) {
        const attempts = err.remainingAttempts;
        setError(`${err.message}. ${attempts} attempt${attempts !== 1 ? 's' : ''} remaining.`);
      } else {
        setError(err.message || 'Invalid credentials');
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <Suspense fallback={<div className="fixed inset-0 bg-[#040195] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>}>
        <div className="fixed inset-0 w-full h-full overflow-hidden z-10 bg-[#040195]">
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-15 md:left-20 z-40">
            <div className="flex items-center text-white">
              <img src="/logos/logoLeftHeader.webp" alt="Logo Header" className="w-24 sm:w-28 md:w-40 md:mr-3" />
            </div>
          </div>

          <div className="absolute inset-0 w-full h-full">
            <m.div 
              className="hidden md:flex w-full h-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              layout
              transition={layoutVariants.desktop.transition}
            >
              <m.div 
                className="w-1/2 h-full flex items-center justify-center relative overflow-visible"
                variants={containerVariants}
                layout
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                <m.div 
                  className="relative z-20 md:-bottom-50 lg:-bottom-20 left-12 flex items-end justify-center h-full"
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-pulse bg-white/20 w-full h-[80%] rounded-lg"></div>
                    </div>
                  }>
                    <LazyImage
                      src="/images/high.webp"
                      alt="Students working"
                      className="w-auto object-contain max-w-none md:h-[80%] lg:h-[99%]"
                    />
                  </Suspense>
                </m.div>
              </m.div>

              <m.div 
                className="w-1/2 h-full flex flex-col relative px-4 lg:px-8 items-center justify-end z-200"
                variants={containerVariants}
                layout
                transition={{ duration: 0.3, ease: "linear" }}
              >
                <m.div 
                  className="w-full max-w-md lg:max-w-lg"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bg-white rounded-t-3xl shadow-2xl p-12 lg:p-20 pt-20 lg:pt-30 pb-0 flex flex-col items-center relative overflow-hidden min-h-[550px] lg:min-h-[650px] 2xl:min-h-[800px]">
                    {/* SDU Background */}
                    <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
                      <a href="https://beeg.com">
                      <h1 
                        className="text-[#1E22AA] font-inter text-[12rem] lg:text-[18rem] font-black w-full text-center"
                        style={{ 
                          letterSpacing: "-0.5rem", 
                          margin: "0", 
                          padding: "0",
                          lineHeight: "0.7",
                          display: "block"
                        }}
                      >
                        <span>SD</span>
                        <span
                          className="font-extrabold text-[6rem] lg:text-[9.5rem] ml-1 font-poppins italic tracking-widest text-transparent"
                          style={{ WebkitTextStroke: "2px #1E22AA" }}
                        >
                          u
                        </span>
                      </h1>
                      </a>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-5xl font-normal font-poppins mb-1 relative z-10 w-full text-left" style={{ color: '#040195' }}>
                      Hello,
                    </h2>
                    <h2 className="text-3xl lg:text-5xl font-bold font-poppins text-[#040195] mb-6 lg:mb-10 relative z-10 w-full text-left">
                      Welcome!
                    </h2>

                    <form onSubmit={handleSubmit} className="w-full space-y-4 lg:space-y-5 relative z-10">
                      {/* Email Field */}
                      <div>
                        <label className="block text-xs lg:text-sm font-inter font-semibold text-[#040195] mb-2">
                          AdZU Email
                        </label>
                        <div className="relative">
                          <img
                            src="/icons/person.svg"
                            alt="person icon"
                            className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-3.5 lg:w-4 h-3.5 lg:h-4 z-10"
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading || lockoutSeconds > 0}
                            className="w-full border-[1.5px] font-poppins border-[#040195] rounded-full px-10 lg:px-12 py-3 lg:py-4 text-xs lg:text-sm shadow-xl focus:outline-none focus:ring-1 focus:ring-[#040195] placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-xs lg:text-sm font-inter font-semibold text-[#040195] mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <img
                            src="/icons/password.svg"
                            alt="password icon"
                            className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-3.5 lg:w-4 h-3.5 lg:h-4 z-10"
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading || lockoutSeconds > 0}
                            className="w-full border-[1.5px] font-poppins border-[#040195] rounded-full px-10 lg:px-12 py-3 lg:py-4 pr-10 lg:pr-12 text-xs lg:text-sm shadow-xl focus:outline-none focus:ring-1 focus:ring-[#040195] placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 lg:right-4 top-1/2 transform translate-y-[-40%] z-10 hover:opacity-70 transition-opacity"
                            disabled={loading || lockoutSeconds > 0}
                          >
                            <img
                              src={showPassword ? "/icons/eye_open_blue.svg" : "/icons/eye_closed_blue.svg"}
                              alt={showPassword ? "Hide password" : "Show password"}
                              className="w-5 lg:w-6 h-5 lg:h-8"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Login Button with Google Icon */}
                      <div className="flex items-center justify-center gap-2 lg:gap-3 pt-1 lg:pt-2">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 bg-[#4D49FC] rounded-full flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer">
                          <span className="text-white text-lg lg:text-xl font-bold">G</span>
                        </div>
                        <button
                          type="submit"
                          disabled={loading || lockoutSeconds > 0}
                          className="flex-1 max-w-[160px] lg:max-w-[200px] py-2.5 lg:py-3 text-sm lg:text-base hover:cursor-pointer font-poppins font-bold shadow-md bg-[#4D49FC] text-white rounded-full hover:shadow-lg hover:bg-[#3d39dc] active:scale-95 active:shadow-sm transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                          {loading ? 'Logging in...' : lockoutSeconds > 0 ? 'LOCKED' : 'LOGIN'}
                        </button>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="mt-3 lg:mt-4">
                          {lockoutSeconds > 0 ? (
                            <div className="text-red-600 text-xs lg:text-sm font-medium text-center">
                              <div>Too many failed attempts</div>
                              <div className="mt-1">Try again in <span className="font-bold">{lockoutSeconds}</span>s</div>
                            </div>
                          ) : (
                            <div className="text-red-600 text-xs lg:text-sm font-medium text-center">{error}</div>
                          )}
                        </div>
                      )}
                    </form>
                  </div>
                </m.div>
              </m.div>
            </m.div>

            <m.div 
              className="md:hidden absolute inset-0 w-full h-full flex flex-col"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              layout
              transition={layoutVariants.mobile.transition}
            >
              <m.div 
                className="absolute top-0 left-0 right-0 h-auto flex justify-center items-center z-50 pt-20 sm:pt-24"
                variants={containerVariants}
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <m.div 
                  className="flex flex-col items-center w-full px-4 sm:px-6"
                  variants={containerVariants}
                >
                  <m.div 
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-6 sm:mb-8"
                  >
                    <m.h1 
                      className="text-white leading-none font-inter widest text-[5rem] sm:text-[7rem] font-black"
                      style={{ letterSpacing: "-0.4rem" }}
                      variants={textScaleVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <m.span 
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                      >SD</m.span>
                      <m.span
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className="font-extrabold text-[4rem] sm:text-[5.5rem] ml-1 sm:ml-2 font-poppins italic tracking-widest text-transparent"
                        style={{ WebkitTextStroke: "2px white" }}>
                        u
                      </m.span>
                    </m.h1>
                  </m.div>

                  <m.div 
                    className="w-full max-w-[440px]  sm:max-w-sm z-60 relative px-3 sm:px-4"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col items-center relative">
                      {/* SDU Logo - Only on sm and up */}
                      <div className="hidden sm:block mb-5 -mt-4">
                        <img 
                          src="/logos/adzuSeal.webp" 
                          alt="AdZU Seal" 
                          className="h-20 w-auto object-contain" 
                        />
                      </div>

                      {/* Title å */}
                      <div className="w-full mb-3 sm:mb-5">
                        <h2 className="hidden sm:block text-lg font-bold font-poppins text-[#040195] text-center">
                          SDU Login
                        </h2>
                        <div className="block sm:hidden">
                          <h2 className="text-xl font-normal font-poppins mb-0.5 text-left" style={{ color: '#040195' }}>
                            Hello,
                          </h2>
                          <h2 className="text-xl font-bold font-poppins text-[#040195] text-left">
                            Welcome!
                          </h2>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="w-full space-y-2.5 sm:space-y-3 relative">
                        {/* Email Field */}
                        <div className="mb-2.5 sm:mb-3">
                          <label className="block text-[0.65rem] sm:text-xs font-inter font-semibold text-[#040195] mb-1 sm:mb-1.5">
                            AdZU Email
                          </label>
                          <div className="relative">
                            <img
                              src="/icons/person.svg"
                              alt="person"
                              className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 sm:w-3.5 h-3 sm:h-3.5 z-10"
                            />
                            <input
                              type="email"
                              name="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled={loading || lockoutSeconds > 0}
                              className="w-full border-2 font-poppins border-[#040195] rounded-xl px-8 sm:px-9 py-1.5 sm:py-2 text-[0.7rem] sm:text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA] disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-2.5 sm:mb-3">
                          <label className="block text-[0.65rem] sm:text-xs font-inter font-semibold text-[#040195] mb-1 sm:mb-1.5">
                            Password
                          </label>
                          <div className="relative">
                            <img
                              src="/icons/password.svg"
                              alt="password"
                              className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 sm:w-3.5 h-3 sm:h-3.5 z-10"
                            />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              disabled={loading || lockoutSeconds > 0}
                              className="w-full border-2 font-poppins border-[#040195] rounded-xl px-8 sm:px-9 py-1.5 sm:py-2 pr-8 sm:pr-9 text-[0.7rem] sm:text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-[#667eea] placeholder-[#CACACA] disabled:bg-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 sm:right-3 top-1/2 transform translate-y-[-40%] z-10 hover:opacity-70 transition-opacity"
                              disabled={loading || lockoutSeconds > 0}
                            >
                              <img
                                src={showPassword ? "/icons/eyeOpenBlue.svg" : "/icons/eyeClosedBlue.svg"}
                                alt={showPassword ? "Hide password" : "Show password"}
                                className="w-4 sm:w-4.5 h-4 sm:h-4.5"
                              />
                            </button>
                          </div>
                        </div>

                        {/* Login Button */}
                        <div className="flex justify-center mb-2 sm:mb-3 pt-1 sm:pt-1.5">
                          <button
                            type="submit"
                            disabled={loading || lockoutSeconds > 0}
                            className="w-32 sm:w-36 py-1.5 sm:py-2 text-xs sm:text-sm font-poppins font-bold shadow-lg bg-[#4D49FC] text-white rounded-full hover:bg-[#3d39dc] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                          >
                            {loading ? 'Logging in...' : lockoutSeconds > 0 ? 'LOCKED' : 'LOGIN'}
                          </button>
                        </div>

                        {/* Error Message (positioned absolutely below button) */}
                        {error && (
                          <div className="absolute top-full mt-1.5 sm:mt-2 left-1/2 transform -translate-x-1/2 w-max max-w-[260px] sm:max-w-[280px] px-2">
                            {lockoutSeconds > 0 ? (
                              <div className="text-red-600 text-[0.65rem] sm:text-[0.7rem] font-medium text-center">
                                <div>Too many failed attempts</div>
                                <div className="mt-0.5">Try again in <span className="font-bold">{lockoutSeconds}</span>s</div>
                              </div>
                            ) : (
                              <div className="text-red-600 text-[0.65rem] sm:text-[0.7rem] font-medium text-center break-words">{error}</div>
                            )}
                          </div>
                        )}
                      </form>
                    </div>
                  </m.div>
                </m.div>
              </m.div>
              
              <m.div 
                className="absolute -bottom-24 sm:-bottom-32 md:-bottom-40 w-full z-10 h-[100%] max-h-[22rem] sm:max-h-[28rem]"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Suspense fallback={
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="animate-pulse bg-white/20 w-full h-full rounded-lg"></div>
                  </div>
                }>
                  <LazyImage
                    src="/images/high.webp" 
                    alt="Students working" 
                    draggable="false"
                    className="h-full w-full object-center object-contain scale-100 sm:scale-110"
                  />
                </Suspense>
              </m.div>
            </m.div>
            
            <div data-layer="Gradient_Blue" className="GradientBlue z-[100] w-full fixed bottom-0 left-0 right-0 h-[12vh] sm:h-[15vh] bg-gradient-to-t from-[#020052] via-[#020052]/60 to-transparent pointer-events-none" />
          </div>
        </div>
      </Suspense>
    </LazyMotion>
  );
};

export default WelcomePage;
