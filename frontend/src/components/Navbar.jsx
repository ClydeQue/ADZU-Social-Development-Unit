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
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';
import NotificationService from '@/services/notificationService';

const Navbar = () => {
  const { user } = useAuth();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const openNotifications = Boolean(notificationAnchor);

  // Fetch real notifications from API
  const { data: notificationsData } = useQuery({
    queryKey: ['navbar-notifications'],
    queryFn: NotificationService.getNotifications,
    staleTime: 10 * 60 * 1000, // Consider fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchInterval: false, // Don't auto-refetch
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    enabled: !!user, // Only fetch if user is logged in
  });

  // Debug: Log notification data
  console.log('Navbar - Notifications Data:', notificationsData);
  console.log('Navbar - Notifications Items:', notificationsData?.items);

  // Memoize notifications and unread count
  const notifications = useMemo(() => notificationsData?.items || [], [notificationsData]);
  const unreadCount = useMemo(() => notificationsData?.unread || 0, [notificationsData]);

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
                  width: 280,
                  maxHeight: 350,
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Header */}
              <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Inbox
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Typography
                    sx={{
                      px: 1,
                      py: 0.25,
                      backgroundColor: '#040195',
                      color: 'white',
                      borderRadius: 3,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    All
                  </Typography>
                  <Typography
                    sx={{
                      px: 1,
                      py: 0.25,
                      color: '#040195',
                      borderRadius: 3,
                      fontSize: '0.65rem',
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

              {/* Notifications List - Scrollable Container */}
              <Box sx={{ maxHeight: 280, overflowY: 'auto', overflowX: 'hidden' }}>
                {notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notification, index) => {
                    // Debug: Log each notification
                    console.log(`Notification ${index}:`, {
                      type: notification.type,
                      updatedTime: notification.updatedTime,
                      updatedAt: notification.updatedAt,
                      indicatorColor: notification.indicatorColor,
                      unread: notification.unread
                    });

                    // Determine date label and value based on type
                    let dateInfo = '';
                    if (notification.type === 'Reminder' && notification.dueDate) {
                      dateInfo = `Due: ${notification.dueDate}`;
                    } else if (notification.type === 'Report' && notification.submittedDate) {
                      dateInfo = `Submitted: ${notification.submittedDate}`;
                    } else if (notification.type === 'Updated' && notification.updatedTime) {
                      dateInfo = `Updated: ${notification.updatedTime}`;
                    }

                    console.log(`Notification ${index} dateInfo:`, dateInfo);

                    return (
                      <Box key={notification.id}>
                        <MenuItem
                          onClick={handleNotificationClose}
                          sx={{
                            py: 0.75,
                            px: 1.5,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            minHeight: 'auto',
                            '&:hover': {
                              backgroundColor: 'rgba(4,1,149,0.05)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 'auto', mt: 0.25 }}>
                            <Box
                              component="img"
                              src={notification.logo}
                              alt={`${notification.officeAcronym} logo`}
                              sx={{
                                width: 24,
                                height: 24,
                                objectFit: 'contain',
                                borderRadius: '3px'
                              }}
                              onError={(e) => {
                                // Fallback to mail icon if image fails to load
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<svg class="MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" style="color: #040195; font-size: 1rem;"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path></svg>';
                              }}
                            />
                          </ListItemIcon>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                  <Typography
                                    sx={{
                                      fontSize: '0.75rem',
                                      fontWeight: notification.unread ? 600 : 400,
                                      color: notification.unread ? '#000' : '#666',
                                      lineHeight: 1.3,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical'
                                    }}
                                  >
                                    {notification.officeAcronym || notification.office} - {notification.activity}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: '0.6rem',
                                      px: 0.75,
                                      py: 0.125,
                                      borderRadius: '8px',
                                      backgroundColor: 
                                        notification.type === 'Reminder' ? '#ef4444' : 
                                        notification.type === 'Report' ? '#22c55e' : 
                                        notification.type === 'Updated' ? '#3b82f6' : '#8988CD',
                                      color: 'white',
                                      fontWeight: 600,
                                      flexShrink: 0
                                    }}
                                  >
                                    {notification.type}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.25 }}>
                                  <Typography component="span" sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>
                                    {dateInfo || notification.time}
                                  </Typography>
                                </Box>
                              }
                              primaryTypographyProps={{
                                component: 'div'
                              }}
                              secondaryTypographyProps={{
                                component: 'div'
                              }}
                              sx={{ m: 0 }}
                            />
                          </Box>
                          {notification.unread && (
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: notification.indicatorColor || '#040195',
                                alignSelf: 'center',
                                flexShrink: 0,
                                ml: 0.5,
                                boxShadow: `0 0 6px ${notification.indicatorColor || '#040195'}40`,
                                border: '2px solid white'
                              }}
                            />
                          )}
                        </MenuItem>
                        {index < Math.min(10, notifications.length) - 1 && <Divider sx={{ my: 0 }} />}
                      </Box>
                    );
                  })
                ) : (
                  <MenuItem disabled>
                    <ListItemText
                      primary="No notifications"
                      primaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: '#999',
                        textAlign: 'center'
                      }}
                    />
                  </MenuItem>
                )}
              </Box>
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
