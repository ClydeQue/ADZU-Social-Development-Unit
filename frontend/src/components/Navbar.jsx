import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { user } = useAuth();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const openNotifications = Boolean(notificationAnchor);

  // Mock notifications data
  const notifications = [
    { id: 1, title: 'Inbox Tree Planting', date: 'Oct 8, 2025', unread: true },
    { id: 2, title: 'System Update', date: 'Oct 7, 2025', unread: true },
    { id: 3, title: 'New Message', date: 'Oct 6, 2025', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ADZU Social Development Unit
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notification Icon */}
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Notification Dropdown */}
            <Menu
              anchorEl={notificationAnchor}
              open={openNotifications}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Header */}
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Inbox
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: '#040195',
                      color: 'white',
                      borderRadius: 5,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    All
                  </Typography>
                  <Typography
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      color: '#040195',
                      borderRadius: 5,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(4,1,149,0.1)'
                      }
                    }}
                  >
                    Unread
                  </Typography>
                </Box>
              </Box>
              <Divider />

              {/* Notifications List */}
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <MenuItem
                      onClick={handleNotificationClose}
                      sx={{
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(4,1,149,0.05)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 'auto', mt: 0.5 }}>
                        <MailOutlineIcon sx={{ color: '#040195', fontSize: '1.2rem' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title}
                        secondary={notification.date}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: notification.unread ? 600 : 400,
                          color: notification.unread ? '#000' : '#666'
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem',
                          color: '#999'
                        }}
                      />
                      {notification.unread && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#040195',
                            mt: 1
                          }}
                        />
                      )}
                    </MenuItem>
                    {index < notifications.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <MenuItem disabled>
                  <ListItemText
                    primary="No notifications"
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      color: '#999',
                      textAlign: 'center'
                    }}
                  />
                </MenuItem>
              )}
            </Menu>

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
