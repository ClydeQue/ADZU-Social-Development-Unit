import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import ProgramService from '@/services/programService';
import ActivityService from '@/services/activityService';

/**
 * ACCA Dashboard
 * AdZU Center for Culture and the Arts
 * Focus: Cultural events, arts programs, performances
 */
export default function ACCADashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['my-programs'],
    queryFn: () => ProgramService.getMyPrograms(),
    staleTime: 2 * 60 * 1000,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['program-activities', selectedProgram?.id],
    queryFn: () => ActivityService.getActivitiesByProgram(selectedProgram.id),
    enabled: !!selectedProgram?.id,
    staleTime: 1 * 60 * 1000,
  });

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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              ACCA Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AdZU Center for Culture and the Arts
            </Typography>
          </Box>

          <Grid container spacing={3}>
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

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Activities - {selectedProgram?.title || 'Select a program'}
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} disabled={!selectedProgram}>
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
                      No activities yet
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {activities.map((activity) => (
                      <Grid item xs={12} key={activity.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">{activity.activity_name}</Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Chip label={activity.status} size="small" />
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
