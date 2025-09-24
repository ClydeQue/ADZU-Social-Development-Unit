import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OfficeSelectionPage = () => {
  const navigate = useNavigate();
  
  // Inarray ko nalang para clean - clyde
  const offices = [
    {
      id: 'sdo',
      acronym: 'SDO',
      name: 'Social Development Office',
    },
    {
      id: 'cces',
      acronym: 'CCES',
      name: 'Center for Community Extension Services ',
    },
    {
      id: 'api',
      acronym: 'API',
      name: 'Ateneo Peace Institute ',
    },
    {
      id: 'sacsi',
      acronym: 'SACSI',
      name: 'Social Awareness and Community Service Involvement ',
    },
    {
      id: 'aclg',
      acronym: 'ACLG',
      name: 'Ateneo Center for Leadership and Governance ',
    },
    {
      id: 'acca',
      acronym: 'ACCA',
      name: 'Ateneo Center for Culture and the Arts',
    }
  ];

  const handleOfficeClick = (officeId, officeName) => {
    navigate(`/office/login/${officeId}`, { state: { officeName } });
  };

  return (
    <div>
      <Box
        sx={{
          minHeight: '100vh',
          maxHeight: '100vh',
          width: '100%',
          px: { xs: 2, sm: 25 },
          py: { xs: 2 },
          overflow: 'auto',
          backgroundImage: {
            xs: 'url(/images/office-phone-bg.png)',
            md: 'url(/images/office-login-bg.png)',
          },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Header w */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={10}
          sx={{ p: 2 }}
        >
          {/* Left arrow */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              '&:hover': {
                opacity: 0.7,
              }
            }}
          >
            <img 
              src="/icons/arrow left.svg" 
              alt="Back" 
              style={{
                width: '24px',
                height: '24px',

              }}
            />
          </Box>

          {/* ADZU left logo upper right conrer*/}
          <Box
            sx={{
              height: { xs: '35px', md: '45px' },
            }}
          >
            <img 
              src="/logos/logoLeftHeader.webp" 
              alt="ADZU Logo" 
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Box>
        </Box>



        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: '60vh' }}
        >
          {offices.map((office) => (
            <Grid item xs={11} sm={12} md={6} lg={4} key={office.id}>
              <Paper
                elevation={4}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    bgcolor: 'primary.50'
                  },
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: 'Inter',
                      color: '#4D49FC',
                      mb: 1
                    }}
                  >
                    {office.acronym}
                  </Typography>
                  <Typography 
                    variant="h6"

                    component="h1" 
                    fontFamily={"Inter"}
                    align="start"
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#040195',
                      mb: 2,
                      lineHeight: 1.3
                    }}
                  >
                    {office.name}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  onClick={() => handleOfficeClick(office.id, office.name)}
                  sx={{
                    backgroundColor: '#4D49FC',
                    color: 'white',
                    borderRadius: 3,
                    paddingX: 3,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#030180'
                    },
                    alignSelf: 'flex-start'
                  }}
                >
                  Login
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default OfficeSelectionPage;
