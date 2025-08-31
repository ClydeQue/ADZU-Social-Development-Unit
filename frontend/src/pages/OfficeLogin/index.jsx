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
import { useNavigate, useLocation } from 'react-router-dom';
import { Business, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext.jsx';

const OfficeLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, loading } = useAuth();
  const officeName = location.state?.officeName || 'Office';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('� Office Login Attempt:', formData.email);
      
      await login(formData.email, formData.password, 'office');
      
      console.log('✅ Office login successful - navigating to dashboard');
      navigate('/office/dashboard');
      
    } catch (err) {
      console.error('❌ Office login error:', err);
      setError(err.message || 'Login failed');
    }
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

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              disabled={loading}
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
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
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
