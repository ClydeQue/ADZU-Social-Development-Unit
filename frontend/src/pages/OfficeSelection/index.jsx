import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SDUTitle from '../../utils/SDUTitle';

const OfficeSelectionPage = () => {
  const navigate = useNavigate();
  
  // arrayed na sya para cleaner
  const offices = [
    {
      id: 'sdo',
      acronym: 'SDO',
      name: 'Social Development Office',
      logo: null, // lagyan niyo lang logo here if meron na change niyo lang si "null"
    },
    {
      id: 'cces',
      acronym: 'CCES',
      name: 'Center for Community Extension Services',
      logo: null, // lagyan niyo lang logo here if meron na change niyo lang si "null"
    },
    {
      id: 'apc',
      acronym: 'APC',
      name: 'Ateneo Peace Institute',
      logo: '/logos/apcLogo.png',
    },
    {
      id: 'sacsi',
      acronym: 'SACSI',
      name: 'Social Awareness and Community Service Involvement',
      logo: null, // lagyan niyo lang logo here if meron na change niyo lang si "null"
    },
    {
      id: 'aclg',
      acronym: 'ACLG',
      name: 'Ateneo Center for Leadership and Governance',
      logo: null, // lagyan niyo lang logo here if meron na change niyo lang si "null"
    },
    {
      id: 'acca',
      acronym: 'ACCA',
      name: 'Ateneo Center for Culture and the Arts',
      logo: null, // lagyan niyo lang logo here if meron na change niyo lang si "null"
    }
  ];

  const handleOfficeClick = (officeId, officeName) => {
    navigate(`/office/login/${officeId}`, { state: { officeName } });
  };

  return (
    <div className='relative overflow-hidden'>
      <Box
        sx={{
          minHeight: '100vh',
          maxHeight: '100vh',
          width: '100%',
          px: { xs: 2, sm: 10 },
          py: { xs: 2 },
          overflow: 'auto',
          position: 'relative',
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
        {/* SDU Title to inexport ko galing utils   */}
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: '-60px', md: '-100px' },
            left: '-100px',
            opacity: 0.05,
            zIndex: 0,
            pointerEvents: 'none', 
          }}
        >
          <SDUTitle />
        </Box>

        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={10}
          sx={{ p: 2 }}
        >
          {/* Mobile: Arrow button | Desktop: Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* visible lang sa xs and sm */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                display: { xs: 'flex', md: 'none' },
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

            {/* visible lng on md and above */}
            <Breadcrumbs
              aria-label="breadcrumb"
              separator=""
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Link
                underline="hover"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'medium',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
                onClick={() => navigate('/')}
              >
                Home 
              </Link>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                Offices
              </Typography>
            </Breadcrumbs>
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
            <Grid item xs={10} sm={10} md={6} lg={4} xl={4} key={office.id}>
              <Paper
                elevation={3}
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
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
                {/* Dynamic Logo Background This */}
                {office.logo && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: { xs: -10, sm: -15, md: -20, lg: -25, xl: -20 },
                      width: { 
                        xs: '300px', 
                        sm: '250px', 
                        md: '250px', 
                        lg: '280px', 
                        xl: '300px' 
                      },
                      height: { 
                        xs: '200px', 
                        sm: '160px', 
                        md: '150px', 
                        lg: '180px', 
                        xl: '160px' 
                      },
                      backgroundImage: `url(${office.logo})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center right',
                      opacity: '80%',
                      zIndex: 0,
                    }}
                  />
                )}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: 'Inter',
                      color: '#4D49FC',
                      mb: 1,
                      fontSize: { xs: '0.875rem', xl: '1.125rem' } // Larger on lg screens
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
                      lineHeight: 1.3,
                      fontSize: { xs: '1.3rem', sm: '1.3rem', md: '1.4rem', lg: '1.40rem', xl: '1.50rem' } // Larger on lg screens
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
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '0.675rem', md: '0.875rem', lg: '0.8rem' }, // Larger on lg screens
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
