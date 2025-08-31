import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box 
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ADZU Social Development Unit
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Welcome, {user.name}
            </Typography>
            <LogoutButton 
              variant="outlined" 
              size="small" 
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
