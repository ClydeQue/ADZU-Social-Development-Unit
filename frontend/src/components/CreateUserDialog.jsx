import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Alert,
  Box,
  MenuItem,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOffices } from '../hooks/useApi';
import PropTypes from 'prop-types';

// API helper
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("auth_token");
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(error.error || error.message || "API call failed");
  }

  return response.json();
};

const CreateUserDialog = ({ open, onClose, userType = 'office_user' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    officeId: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  // Fetch offices for dropdown
  const { data: offices = [] } = useOffices();

  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      return await apiCall("/auth/create-user", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      onClose();
      setFormData({ name: '', email: '', password: '', confirmPassword: '', officeId: '' });
      setErrors({});
      // Invalidate related queries
      queryClient.invalidateQueries(['office_users']);
      queryClient.invalidateQueries(['unit_directors']);
    },
    onError: (error) => {
      setErrors({ general: error.message });
    }
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (userType === 'office_user' && !formData.officeId) {
      newErrors.officeId = 'Please select an office';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        userType,
        ...(userType === 'office_user' && { officeId: formData.officeId })
      };
      
      createUserMutation.mutate(userData);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New {userType === 'unit_director' ? 'Unit Director' : 'Office User'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />

            <TextField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />

            {userType === 'office_user' && (
              <TextField
                label="Office"
                select
                value={formData.officeId}
                onChange={handleInputChange('officeId')}
                error={!!errors.officeId}
                helperText={errors.officeId}
                fullWidth
                required
              >
                {offices.map((office) => (
                  <MenuItem key={office.id} value={office.id}>
                    {office.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Password"
                type={showPasswords.password ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 6 characters'}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('password')}
                        edge="end"
                      >
                        {showPasswords.password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={generatePassword}
                sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
              >
                Generate
              </Button>
            </Box>

            <TextField
              label="Confirm Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={createUserMutation.isPending}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CreateUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userType: PropTypes.oneOf(['office_user', 'unit_director'])
};

export default CreateUserDialog;
