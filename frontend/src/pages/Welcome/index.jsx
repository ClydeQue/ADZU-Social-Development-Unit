import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (  
    <div 
      className='w-screen h-screen flex justify-center items-center bg-no-repeat bg-cover bg-center p-4 sm:p-6'
        style={{
          backgroundImage: "linear-gradient(to top, rgba(1,0,60,0.9), transparent), linear-gradient(rgba(0,0,50,0.6), rgba(0,0,80,0.1)), url('/images/login.webp')",
          backgroundSize: 'cover',
          backgroundPosition: "center top",
        }}
    >
      {/* Logo */ }
        <div className="absolute top-6 left-4">
          <img 
            src="/logos/adzu-header.webp" 
            alt="AdZU Seal" 
            className="h-14 w-auto drop-shadow-lg"  
          />
        </div>

    <div className="flex flex-col items-center justify-center text-center space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-wide uppercase font-display drop-shadow-lg ">
            SOCIAL DEVELOPMENT UNIT
          </h1>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide uppercase font-display drop-shadow-sm">
            MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Login Buttons */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-10 mt-6">
          {/* Unit Director Button */}
          <div 
            data-layer="Unit Director_Button" 
            className="UnitDirectorButton w-full max-w-64 sm:w-64 h-10 sm:h-12 relative rounded-[16px] sm:rounded-[20px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
            onClick={() => navigate('/unit-director/login')}
          >
            <div 
              data-layer="Button_01" 
              className="Button01 w-full h-full left-0 top-0 absolute bg-gradient-to-r from-blue-900 from-[41%] to-indigo-300 rounded-[16px] sm:rounded-[20px] group-hover:from-blue-800 group-hover:to-indigo-200 transition-all duration-300 shadow-lg group-hover:shadow-xl"
            ></div>
            <div 
              data-layer="Unit Director" 
              className="UnitDirector w-full h-full left-0 top-0 absolute flex items-center justify-center text-white text-base sm:text-lg font-bold font-sans drop-shadow-sm group-hover:drop-shadow-md transition-all duration-200 px-4"
            >
              Unit Director
            </div>
          </div>

          {/* Office Login Button */}
          <div 
            data-layer="Office Login_Button" 
            className="OfficeLoginButton w-full max-w-64 sm:w-64 h-10 sm:h-12 relative rounded-[16px] sm:rounded-[20px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
            onClick={() => navigate('/office-selection')}
          >
            <div 
              data-layer="Button_02" 
              className="Button02 w-full h-full left-0 top-0 absolute bg-gradient-to-r from-blue-900 from-[41%] to-indigo-300 rounded-[16px] sm:rounded-[20px] group-hover:from-blue-800 group-hover:to-indigo-200 transition-all duration-300 shadow-lg group-hover:shadow-xl"
            ></div>
            <div 
              data-layer="Office Login" 
              className="OfficeLogin w-full h-full left-0 top-0 absolute flex items-center justify-center text-white text-base sm:text-lg font-bold font-sans drop-shadow-sm group-hover:drop-shadow-md transition-all duration-200 px-4"
            >
              Office Login
            </div>
          </div>
        </div>
      </div>

      </div>
  );
};

export default WelcomePage;
