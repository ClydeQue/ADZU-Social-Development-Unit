import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (  
    <div 
      className='w-screen h-screen flex justify-center items-center bg-no-repeat bg-cover bg-center p-4 sm:p-6'
      style={{
        backgroundImage: "url('/images/login.webp')", 
        backgroundSize: 'cover',
      }}
    >
      {/* Center Container */}
      <div 
        data-layer="Container" 
        className="Container w-full max-w-sm sm:max-w-md md:w-96 h-auto min-h-[500px] sm:h-[569px] bg-white/50 rounded-[20px] sm:rounded-[30px] shadow-[0px_4px_35.70000076293945px_16px_rgba(0,0,0,0.11)] border border-white backdrop-blur-lg flex flex-col p-4 sm:p-6"
      >
        
        {/* Logo */}
        <div className="flex justify-center mb-2 sm:mb-4">
          <img 
            src="/logos/adzuSeal.png" 
            alt="AdZU Seal" 
            className="w-24 h-24  sm:w-32 sm:h-32 md:w-auto md:h-40"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-white text-xs sm:text-sm font-bold mb-2 tracking-widest uppercase font-display drop-shadow-sm">
            SOCIAL DEVELOPMENT UNIT
          </h1>
          <h2 className="text-white text-[10px] sm:text-xs font-medium tracking-wider uppercase font-display drop-shadow-sm">
            MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Login Title */}
        <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 tracking-wide drop-shadow-md">
          WELCOME
        </h3>

        {/* Login Buttons */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
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
