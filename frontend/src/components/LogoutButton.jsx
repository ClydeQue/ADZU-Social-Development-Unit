import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle
} from '@mui/material';
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
  const { logout } = useAuth();

  const handleLogout = async () => {
    setOpen(false);
    await logout(); // AuthContext handles the loader and navigation
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

LogoutButton.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
  showIcon: PropTypes.bool,
  children: PropTypes.node,
};

export default LogoutButton;
