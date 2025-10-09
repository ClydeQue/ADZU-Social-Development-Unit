import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import ProgramService from '@/services/programService';
import ActivityService from '@/services/activityService';

/**
 * CCES Dashboard
 * Center for Community Engagement and Service
 * Focus: Community outreach, volunteer programs, social development
 */
export default function CCESDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Fetch CCES programs
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['my-programs'],
    queryFn: () => ProgramService.getMyPrograms(),
    staleTime: 2 * 60 * 1000,
  });

  // Fetch activities for selected program
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['program-activities', selectedProgram?.id],
    queryFn: () => ActivityService.getActivitiesByProgram(selectedProgram.id),
    enabled: !!selectedProgram?.id,
    staleTime: 1 * 60 * 1000,
  });

  // Auto-select first program
  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0]);
    }
  }, [programs, selectedProgram]);

  if (programsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              CCES Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Center for Community Engagement and Service
            </Typography>
          </Box>

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
                      <Typography variant="subtitle1" fontWeight={600}>
                        {program.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {program.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>

            {/* Activities */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Activities - {selectedProgram?.title || 'Select a program'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    disabled={!selectedProgram}
                  >
                    Add Activity
                  </Button>
                </Box>

                {activitiesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : activities.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No activities yet. Click "Add Activity" to get started.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {activities.map((activity) => (
                      <Grid item xs={12} key={activity.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{activity.activity_name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {activity.objectives}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Chip label={activity.status} size="small" />
                              {activity.participants_count && (
                                <Chip label={`${activity.participants_count} participants`} size="small" variant="outlined" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
