import { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Key as KeyIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import ChangePasswordDialog from './ChangePasswordDialog';
import CreateUserDialog from './CreateUserDialog';
import LogoutButton from './LogoutButton';

const UserManagement = () => {
  const { user, userType } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createUserType, setCreateUserType] = useState('office_user');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isUnitDirector = userType === 'unit_director';

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateUser = (type) => {
    setCreateUserType(type);
    setCreateUserOpen(true);
    handleMenuClose();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Account Management
          </Typography>
          <Box>
            <Button
              startIcon={<KeyIcon />}
              variant="outlined"
              onClick={() => setChangePasswordOpen(true)}
              sx={{ mr: 1 }}
            >
              Change Password
            </Button>
            
            <LogoutButton variant="button" />
            
            {isUnitDirector && (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleCreateUser('office_user')}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Create Office User
                  </MenuItem>
                  <MenuItem onClick={() => handleCreateUser('unit_director')}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Create Unit Director
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current User:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user?.name}
            </Typography>
            <Chip 
              label={userType === 'unit_director' ? 'Unit Director' : 'Office User'} 
              color={userType === 'unit_director' ? 'primary' : 'secondary'}
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Email:
            </Typography>
            <Typography variant="body1">
              {user?.email}
            </Typography>
          </Box>

          {isUnitDirector && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">
                💡 As a Unit Director, you can create new office users and unit directors.
                Always ensure users change their default passwords after account creation.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        userType={userType}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        userType={createUserType}
      />
    </Card>
  );
};

export default UserManagement;
