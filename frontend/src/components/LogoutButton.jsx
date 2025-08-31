import React from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExitToApp } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext.jsx';

const LogoutButton = ({ 
  variant = "contained", 
  color = "error", 
  size = "small",
  fullWidth = false,
  sx = {},
  showIcon = true,
  children 
}) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
        sx={sx}
        onClick={() => setOpen(true)}
        startIcon={showIcon ? <ExitToApp /> : null}
      >
        {children || 'Logout'}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
