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
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext.jsx';

const UnitDirectorLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login, loading } = useAuth();

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
      console.log('� Unit Director Login Attempt:', formData.email);
      
      await login(formData.email, formData.password, 'unit_director');
      
      console.log('✅ Unit Director login successful - navigating to dashboard');
      navigate('/unit-director/dashboard');
      
    } catch (err) {
      console.error('❌ Unit Director login error:', err);
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
          onClick={() => navigate('/')}
          sx={{ 
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white'
          }}
        >
          Back to Home
        </Button>

        <Paper elevation={8} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <AdminPanelSettings 
              sx={{ fontSize: 60, color: '#1976d2', mb: 1 }}
            />
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Unit Director Login
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
            Default credentials: director@adzu.edu.ph / admin123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnitDirectorLoginPage;
