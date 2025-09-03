import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (  
    <div 
      className='w-screen h-screen flex justify-center items-center bg-no-repeat bg-cover bg-center'
      style={{
        backgroundImage: "url('/images/login.webp')", 
        backgroundSize: 'cover',
      }}
    >
      {/* Center Container */}
      <div 
        data-layer="Container" 
        className="Container w-96 h-[569px] bg-white/50 rounded-[30px] shadow-[0px_4px_35.70000076293945px_16px_rgba(0,0,0,0.11)] border border-white backdrop-blur-lg flex flex-col p-4"
      >
        
        {/* Logo */}
        <div className="flex justify-center bg-amber-400 ">
          <img 
            src="/logos/adzuSeal.png" 
            alt="AdZU Seal" 
            className="w-auto h-45 aspect-auto object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-14">
          <h1 className="text-white text-sm font-bold mb-2 tracking-widest uppercase font-display drop-shadow-sm">
            SOCIAL DEVELOPMENT UNIT
          </h1>
          <h2 className="text-white text-xs font-medium tracking-wider uppercase font-display drop-shadow-sm">
            MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Login Title */}
        <h3 className="text-white text-5xl font-extralight text-center mb-12 tracking-wide font-bold drop-shadow-md">
          WELCOME
        </h3>

        {/* Login Buttons */}
        <div className="flex flex-col items-center space-y-4">
          {/* Unit Director Button */}
          <div 
            data-layer="Unit Director_Button" 
            className="UnitDirectorButton w-64 h-12 relative rounded-[20px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
            onClick={() => navigate('/unit-director/login')}
          >
            <div 
              data-layer="Button_01" 
              className="Button01 w-64 h-12 left-0 top-0 absolute bg-gradient-to-r from-blue-900 from-[41%] to-indigo-300 rounded-[20px] group-hover:from-blue-800 group-hover:to-indigo-200 transition-all duration-300 shadow-lg group-hover:shadow-xl"
            ></div>
            <div 
              data-layer="Unit Director" 
              className="UnitDirector w-40 h-10 left-[44px] top-[6px] absolute flex items-center justify-center text-white text-lg font-bold font-sans drop-shadow-sm group-hover:drop-shadow-md transition-all duration-200"
            >
              Unit Director
            </div>
          </div>

          {/* Office Login Button */}
          <div 
            data-layer="Office Login_Button" 
            className="OfficeLoginButton w-64 h-12 relative rounded-[20px] cursor-pointer group transform transition-transform duration-200 hover:scale-105"
            onClick={() => navigate('/office-selection')}
          >
            <div 
              data-layer="Button_02" 
              className="Button02 w-64 h-12 left-0 top-0 absolute bg-gradient-to-r from-blue-900 from-[41%] to-indigo-300 rounded-[20px] group-hover:from-blue-800 group-hover:to-indigo-200 transition-all duration-300 shadow-lg group-hover:shadow-xl"
            ></div>
            <div 
              data-layer="Office Login" 
              className="OfficeLogin w-40 h-10 left-[44px] top-[6px] absolute flex items-center justify-center text-white text-lg font-bold font-sans drop-shadow-sm group-hover:drop-shadow-md transition-all duration-200"
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
