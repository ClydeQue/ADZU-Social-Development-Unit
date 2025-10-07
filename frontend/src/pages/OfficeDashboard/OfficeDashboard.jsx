import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Folder } from '@mui/icons-material';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';

const SDG_OPTIONS = [
  { value: 1, label: 'SDG 1: No Poverty' },
  { value: 2, label: 'SDG 2: Zero Hunger' },
  { value: 3, label: 'SDG 3: Good Health and Well-being' },
  { value: 4, label: 'SDG 4: Quality Education' },
  { value: 5, label: 'SDG 5: Gender Equality' },
  { value: 6, label: 'SDG 6: Clean Water and Sanitation' },
  { value: 7, label: 'SDG 7: Affordable and Clean Energy' },
  { value: 8, label: 'SDG 8: Decent Work and Economic Growth' },
  { value: 9, label: 'SDG 9: Industry, Innovation and Infrastructure' },
  { value: 10, label: 'SDG 10: Reduced Inequalities' },
  { value: 11, label: 'SDG 11: Sustainable Cities and Communities' },
  { value: 12, label: 'SDG 12: Responsible Consumption and Production' },
  { value: 13, label: 'SDG 13: Climate Action' },
  { value: 14, label: 'SDG 14: Life Below Water' },
  { value: 15, label: 'SDG 15: Life on Land' },
  { value: 16, label: 'SDG 16: Peace, Justice and Strong Institutions' },
  { value: 17, label: 'SDG 17: Partnerships for the Goals' },
];

export default function OfficeDashboard() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activityDialog, setActivityDialog] = useState(false);
  const [formData, setFormData] = useState({
    activity_name: '',
    start_date: '',
    end_date: '',
    implementing_partners: '',
    objectives: '',
    participants_count: 0,
    venue: '',
    budget: '',
    sdg_number: '',
    status: 'planned',
    notes: '',
  });

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch activities when program is selected
  useEffect(() => {
    if (selectedProgram) {
      fetchActivities(selectedProgram.id);
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching programs for office:', user?.office?.acronym);
      console.log('👤 Current user:', user);
      
      const response = await authService.apiCall('programs');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      
      console.log('📦 Programs response:', data);
      
      if (data.success) {
        setPrograms(data.data);
        console.log('✅ Programs loaded:', data.data.length, 'programs');
        
        // Auto-select first program if available
        if (data.data.length > 0) {
          setSelectedProgram(data.data[0]);
          console.log('📌 Auto-selected program:', data.data[0].title);
        }
      } else {
        console.error('❌ Programs fetch failed:', data.message);
        setError(data.message || 'Failed to load programs');
      }
    } catch (error) {
      console.error('❌ Error fetching programs:', error);
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (programId) => {
    try {
      setLoading(true);
      const response = await authService.apiCall(`programs/${programId}/activities`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActivityDialog = () => {
    setFormData({
      activity_name: '',
      start_date: '',
      end_date: '',
      implementing_partners: '',
      objectives: '',
      participants_count: 0,
      venue: '',
      budget: '',
      sdg_number: '',
      status: 'planned',
      notes: '',
    });
    setActivityDialog(true);
  };

  const handleCloseActivityDialog = () => {
    setActivityDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitActivity = async () => {
    try {
      setLoading(true);
      const response = await authService.apiCall(
        `programs/${selectedProgram.id}/activities`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setActivityDialog(false);
        fetchActivities(selectedProgram.id);
      } else {
        setError(data.message || 'Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      setError('Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: 'default',
      ongoing: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {user?.office?.name || 'Office Dashboard'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your programs and activities
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {loading && !programs.length ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Programs List */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Programs
                  </Typography>
                  {programs.map((program) => (
                    <Card
                      key={program.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedProgram?.id === program.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        '&:hover': { borderColor: '#3b82f6' },
                      }}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Folder color="primary" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {program.title}
                          </Typography>
                        </Box>
                        {program.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {program.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              </Grid>

              {/* Activities List */}
              <Grid item xs={12} md={8}>
                {selectedProgram ? (
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedProgram.title} - Activities
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenActivityDialog}
                      >
                        Add Activity
                      </Button>
                    </Box>

                    {activities.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No activities yet. Click &quot;Add Activity&quot; to get started.
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {activities.map((activity) => (
                          <Grid item xs={12} key={activity.id}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                      {activity.activity_name}
                                    </Typography>
                                    
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Date:</strong> {activity.start_date} to {activity.end_date}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Venue:</strong> {activity.venue || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Partners:</strong> {activity.implementing_partners || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Participants:</strong> {activity.participants_count}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Budget:</strong> ₱{activity.budget?.toLocaleString() || '0'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>SDG:</strong> {activity.sdg_number ? `SDG ${activity.sdg_number}` : 'N/A'}
                                        </Typography>
                                      </Grid>
                                      {activity.objectives && (
                                        <Grid item xs={12}>
                                          <Typography variant="body2" color="text.secondary">
                                            <strong>Objectives:</strong> {activity.objectives}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Box sx={{ mt: 2 }}>
                                      <Chip
                                        label={activity.status}
                                        color={getStatusColor(activity.status)}
                                        size="small"
                                      />
                                    </Box>
                                  </Box>

                                  <Box>
                                    <IconButton size="small">
                                      <Edit />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Paper>
                ) : (
                  <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Select a program to view activities
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>
          )}

          {/* Add Activity Dialog */}
          <Dialog open={activityDialog} onClose={handleCloseActivityDialog} maxWidth="md" fullWidth>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Activity Name"
                    name="activity_name"
                    value={formData.activity_name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Implementing Partners (Organic)"
                    name="implementing_partners"
                    value={formData.implementing_partners}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Participants"
                    name="participants_count"
                    type="number"
                    value={formData.participants_count}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget (Overall)"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="SDG"
                    name="sdg_number"
                    value={formData.sdg_number}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {SDG_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="planned">Planned</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseActivityDialog}>Cancel</Button>
              <Button onClick={handleSubmitActivity} variant="contained" disabled={loading}>
                {loading ? 'Creating...' : 'Create Activity'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}
