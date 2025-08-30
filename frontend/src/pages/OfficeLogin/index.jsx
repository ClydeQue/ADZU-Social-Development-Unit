import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Container,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Business, ArrowBack } from '@mui/icons-material';
import { useOfficeLogin } from '../../hooks/useAuthQuery';

const OfficeLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { officeId } = useParams();
  const location = useLocation();
  const officeLoginMutation = useOfficeLogin();
  
  const officeName = location.state?.officeName || 'Office';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    officeLoginMutation.mutate({
      office: officeId,
      email: formData.email,
      password: formData.password
    }, {
      onSuccess: () => {
        navigate('/office/dashboard');
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        className="bg-gradient-to-br from-blue-600 to-purple-600 px-4"
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/office-selection')}
          sx={{ 
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white'
          }}
        >
          Back to Office Selection
        </Button>

        <Paper elevation={8} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Business 
              sx={{ fontSize: 60, color: '#388e3c', mb: 1 }}
            />
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {officeName}
            </Typography>
            <Typography variant="h6" color="textSecondary" align="center">
              Login
            </Typography>
          </Box>

          {officeLoginMutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {officeLoginMutation.error.message || 'Login failed'}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              disabled={officeLoginMutation.isPending}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              disabled={officeLoginMutation.isPending}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={officeLoginMutation.isPending}
              size="large"
            >
              {officeLoginMutation.isPending ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
            Use your office credentials to access the dashboard
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default OfficeLoginPage;
