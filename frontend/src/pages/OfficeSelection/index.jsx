import React from 'react';
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

const OfficeSelectionPage = () => {
  const navigate = useNavigate();
  
  // Fixed list of 6 Ateneo offices
  const offices = [
    {
      id: 'sdo',
      name: 'Social Development Office',
      description: 'Community development and social welfare programs'
    },
    {
      id: 'cces',
      name: 'Center for Community Extension Services (CCES)',
      description: 'Community outreach and extension programs'
    },
    {
      id: 'api',
      name: 'Ateneo Peace Institute (API)',
      description: 'Peace building and conflict resolution initiatives'
    },
    {
      id: 'sacsi',
      name: 'Social Awareness and Community Service Involvement (SACSI)',
      description: 'Student community service and social awareness programs'
    },
    {
      id: 'aclg',
      name: 'Ateneo Center for Leadership and Governance (ACLG)',
      description: 'Leadership development and governance training'
    },
    {
      id: 'acca',
      name: 'Ateneo Center for Culture and the Arts (ACCA)',
      description: 'Cultural and arts programs for community development'
    }
  ];

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
          {offices.map((office) => (
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
