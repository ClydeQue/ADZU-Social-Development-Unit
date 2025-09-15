import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { 
  titleVariants, 
  buttonVariants, 
  letterVariants, 
  imageVariants, 
  containerVariants, 
  layoutVariants 
} from "../../utils/animations";


const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <LazyMotion features={domAnimation}>
      <Suspense fallback={<div className="fixed inset-0 bg-[#040195] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>}>
        {/* background of the page */}
        <div className="fixed inset-0 w-full h-full overflow-hidden z-10 bg-[#040195]">
      {/* Header with logo */}
      <div className="absolute top-15  left-20 z-20">
        <div className="flex items-center text-white">
          <img src="/logos/logoLeftHeader.webp" alt="Logo Header" className="w-40 mr-3" />
        </div>
      </div>

      {/* Main content container */}
      <div className="absolute inset-0 w-full h-full">
            <div data-layer="Gradient_Blue" className="GradientBlue -bottom-80 z-30 w-full  absolute 
            h-full bg-linear-360 from-[#020052] up to-[blue-900/0]" />

        
        {/* Desktop layout: flex row, hidden on mobile */}
        <m.div 
          className="hidden md:flex w-full h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          transition={layoutVariants.desktop.transition}
        >
           {/* Gradient overlay */}

          {/* Left Side: Image Section */}
          <m.div 
            className="w-1/2 h-full flex items-center justify-center relative overflow-visible"
            variants={containerVariants}
            layout
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
           
            
            {/* Image */}
            <m.div 
              className="relative z-20 md:-bottom-50 lg:-bottom-35 -left-2 flex items-end justify-center h-full"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <LazyLoadImage
                src="/images/high.png"
                alt="Students working"
                className="w-auto object-contain max-w-none md:h-[80%] lg:h-[90%]"
                effect="blur"
                wrapperProps={{
                  style: { display: 'inline-block', width: '100%', height: '100%' }
                }}
                onLoad={() => console.log('Desktop image loaded')}
              />
            </m.div>
          </m.div>

          {/* Right Side: Content Section */}
          <m.div 
            className="w-1/2 h-full flex flex-col relative z-30 px-8 md:items-center md:justify-center xl:items-start"
            variants={containerVariants}
            layout
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* SDU Title */}
            <m.div 
              className="mb-8 md:mt-25 lg:mt-0"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              <m.h1 
                className="text-white leading-none font-inter text-[10rem] font-black 
                   lg:text-[14rem] xl:text-[15rem] 2xl:text-[14rem]"
                style={{ letterSpacing: "-0.5rem" }}
              >
                <m.span variants={letterVariants}>SD</m.span>
                <m.span
                  variants={letterVariants}
                  className="font-extrabold text-[8rem] ml-3 font-poppins italic tracking-widest text-transparent
                  lg:text-[9.5rem] xl:text-[11rem] 2xl:text-[10.5rem]"
                  style={{ WebkitTextStroke: "3px white" }}>
                  u
                </m.span>
              </m.h1>
            </m.div>
            
            {/* Action Buttons */}
            <m.div 
              className="flex flex-row space-x-4 ml-12 lg:ml-35 xl:ml-40"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <m.button 
                onClick={()=> {navigate("/office-selection")}}
                className="border-2 border-white text-white px-4 py-1 text-sm font-bold rounded-full text-[8px] 
                md:text-[12px] cursor-pointer bg-transparent hover:bg-white hover:text-[#040195]
                 active:bg-gray-200 active:text-[#040195] transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
              >
                OFFICE LOGIN
              </m.button>
              <m.button 
                onClick={()=> navigate('/unit-director/login')}
                className="border-2 border-white text-white px-4 py-1 text-sm font-bold 
                rounded-full text-[8px] md:text-[12px]  cursor-pointer bg-transparent 
                hover:bg-white hover:text-[#040195] active:bg-gray-200 active:text-[#040195] transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
              >
                UNIT DIRECTOR
              </m.button>
            </m.div>
          </m.div>
        </m.div>

        {/* ------------------------- Mobile layout to ------------------------- */}
        <m.div 
          className="md:hidden absolute inset-0 w-full h-full flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          transition={layoutVariants.mobile.transition}
        >
          {/* Mobile content box */}
          <m.div 
            className="absolute inset-0 max-h-90 flex justify-center items-end"
            variants={containerVariants}
            layout
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <m.div 
              className="flex flex-col items-center"
              variants={containerVariants}
            >
              {/* SDu Title */}
              <m.div 
                className="flex-5"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                <m.h1 
                  className="text-white leading-none font-inter widest text-[11rem] font-black"
                  style={{ letterSpacing: "-0.7rem" }}
                >
                  <m.span variants={letterVariants}>SD</m.span>
                  <m.span
                    variants={letterVariants}
                    className="font-extrabold text-[8rem] ml-2 font-poppins italic tracking-widest text-transparent"
                    style={{ WebkitTextStroke: "3px white" }}>
                    u
                  </m.span>
                </m.h1>
              </m.div>

              {/* Action Buttons d2 */}
              <m.div 
                className="inline-flex self-end text-center flex-row space-x-3 max-w-[20rem]"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
              >
                <m.button 
                  onClick={()=> navigate('/unit-director/login')}
                  className="px-4 py-1 max-h-8 border-2 border-white text-white text-sm font-medium rounded-full hover:cursor-pointer bg-transparent hover:bg-white hover:text-[#040195] active:bg-gray-200 active:text-[#040195] transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial="rest"
                  animate="rest"
                >
                  <p className="text-[12px] font-bold">UNIT DIRECTOR</p>
                </m.button>
                <m.button 
                  onClick={()=> {navigate("/office-selection")}}
                  className="px-4 py-1 max-h-8 border-2 border-white text-white text-sm font-medium rounded-full hover:cursor-pointer bg-transparent hover:bg-white hover:text-[#040195] active:bg-gray-200 active:text-[#040195] transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial="rest"
                  animate="rest"
                >
                  <p className="text-[12px] font-bold">OFFICE LOGIN</p>
                </m.button>
              </m.div>
            </m.div>
          </m.div>
          
          {/* Mobile image section */}
          <m.div 
            className="absolute -bottom-25 left-0 right-0 flex justify-center items-end"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div data-layer="Gradient_Blue" className="GradientBlue z-10 w-full -bottom-[3000px] absolute 
            h-full bg-linear-360 from-[#020052] up to-[blue-900/0]" />
            <LazyLoadImage
              src="/images/high.png" 
              alt="Students working" 
              className="max-h-120 scale-110 w-full object-contain"
              effect="blur"
              wrapperProps={{
                style: { display: 'inline-block', width: '100%', height: '100%' }
              }}
            />
          </m.div>
        </m.div>
      </div>
        </div>
      </Suspense>
    </LazyMotion>
  );
};

export default WelcomePage;
