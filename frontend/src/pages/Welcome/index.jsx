import React from 'react';
import { Box, Typography, Paper, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings, Business } from '@mui/icons-material';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">

      {/* Temporary muna */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 4,
        }}
        className="bg-gradient-to-br from-blue-600 to-purple-600"
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center"
          className="text-white font-bold mb-8"
        >
          Welcome to AdZU Social Development Unit System
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          className="text-white mb-12 max-w-2xl"
        >
          Manage and track programs across all offices efficiently
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: 800,
          }}
        >
          {/* Unit Director Login */}
          <Paper
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
          </Paper>

          {/* Office Login */}
          <Paper
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
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default WelcomePage;
