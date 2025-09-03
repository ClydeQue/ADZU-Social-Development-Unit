import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
const WelcomePage = () => {



  const Navigate = useNavigate();

  return (  
    <div className='w-screen h-screen flex bg-amber-500 bg-no-repeat bg-cover'> 
      <div className='w-screen h-screen justify-center flex items-center bg-no-repeat bg-cover bg-center'
       style={{
        backgroundImage: "url('/images/login.webp')",
        backgroundSize: 'cover',
              }}>
       {/* Center Container */}
        <div data-layer="Container" 
        className="Container flex flex-col sm:w-[240px] sm:h-[400px] md:w-[420px] md:h-[550px] 2xl:w-[630px] 
        2xl:h-[750px] bg-white/50 rounded-[30px] 
        shadow-[0px_4px_35.70000076293945px_16px_rgba(0,0,0,0.11)] 
        border border-white backdrop-blur-lg"> 
      {/* Placeholder logo - top center */}
      <div className="mt-6 flex justify-center">
        <img src="/logos/adzuSeal.png" alt="AdZU Seal"  className="w-24 sm:w-20 md:w-28 xl:w-50 h-auto object-contain"  />

      </div>


              
        <p className="text-white text-[1.75rem] text-center font-bold mb-8"
        >
          SOCIAL DEVELOPMENT UNIT
        </p>

        <Typography 
          variant="h5" 
          align="center" 
          className="text-white mb-12 max-w-2xl"
        >
          Manage and track programs across all offices efficiently
        </Typography>

       
          {/* Unit Director Login */}
          {/* <Paper
            elevation={8}
            sx={{ 
              p: 4, 
              flex: 1, 
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
            className="hover:shadow-2xl"
            onClick={() => navigate('/unit-director/login')}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <AdminPanelSettings 
                sx={{ fontSize: 80, color: '#1976d2', mb: 2 }}
              />
              <Typography variant="h4" component="h2" gutterBottom align="center">
                Unit Director
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                Access comprehensive overview of all offices and their programs
              </Typography>
            </Box>
          </Paper> */}

          {/* Office Login */}
          {/* <Paper
            elevation={8}
            sx={{ 
              p: 4, 
              flex: 1, 
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}
            className="hover:shadow-2xl"
            onClick={() => navigate('/office-selection')}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Business 
                sx={{ fontSize: 80, color: '#388e3c', mb: 2 }}
              />
              <Typography variant="h4" component="h2" gutterBottom align="center">
                Office Login
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                Access your office dashboard to manage programs and activities
              </Typography>
            </Box>
          </Paper> */}


       </div> 
    </div>
    </div>
    
  );
};

export default WelcomePage;
