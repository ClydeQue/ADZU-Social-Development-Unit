import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Container, 
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

// Constant offices data - using simple integer IDs that match database
const OFFICES = [
  {
    id: 1,
    name: 'Social Development Office (SDO)',
    description: 'Student welfare and development programs'
  },
  {
    id: 2,
    name: 'Center for Community Extension Services (CCES)',
    description: 'Community outreach and extension services'
  },
  {
    id: 3,
    name: 'Ateneo Peace Institute (API)',
    description: 'Peace building and intervention programs'
  },
  {
    id: 4,
    name: 'Social Awareness and Community Service Involvement (SACSI)',
    description: 'Social action and community involvement initiatives'
  },
  {
    id: 5,
    name: 'Ateneo Center for Leadership and Governance (ACLG)',
    description: 'Leadership development and governance programs'
  },
  {
    id: 6,
    name: 'Ateneo Center for Culture and the Arts (ACCA)',
    description: 'Cultural and artistic development programs'
  }
];

const OfficeSelectionPage = () => {
  const navigate = useNavigate();

  const handleOfficeClick = (officeId, officeName) => {
    navigate(`/office/login/${officeId}`, { state: { officeName } });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            variant="outlined"
          >
            Back to Home
          </Button>
        </Box>

        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}
        >
          Select Your Office
        </Typography>

        <Grid container spacing={3}>
          {OFFICES.map((office) => (
            <Grid item xs={12} md={6} lg={4} key={office.id}>
              <Paper
                elevation={3}
                sx={{ 
                  p: 4, 
                  cursor: 'pointer',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    bgcolor: 'primary.50'
                  },
                  border: '1px solid',
                  borderColor: 'divider'
                }}
                onClick={() => handleOfficeClick(office.id, office.name)}
              >
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom 
                  align="center"
                  sx={{ 
                    fontWeight: 'semibold', 
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  {office.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  align="center" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.5 }}
                >
                  {office.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default OfficeSelectionPage;
