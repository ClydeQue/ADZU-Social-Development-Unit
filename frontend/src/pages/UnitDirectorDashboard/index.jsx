import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { useUnitDirectorDashboard } from '@/hooks/useApi';

const UnitDirectorDashboard = () => {
  const { data: dashboardData, isLoading, error } = useUnitDirectorDashboard();

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Error loading dashboard: {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Unit Director Dashboard
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {dashboardData?.statistics?.total_programs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Programs
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {dashboardData?.statistics?.ongoing_programs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ongoing Programs
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {dashboardData?.statistics?.completed_programs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Programs
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {dashboardData?.statistics?.upcoming_programs || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Programs
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Offices Overview
          </Typography>
          <Grid container spacing={2}>
            {dashboardData?.offices?.map((office) => (
              <Grid item xs={12} md={6} lg={4} key={office.id}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {office.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Programs: {office.program_count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {office.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UnitDirectorDashboard;
