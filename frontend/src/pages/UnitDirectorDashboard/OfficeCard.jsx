import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { Business } from '@mui/icons-material';

const OfficeCard = ({ office }) => {
  const getProgressValue = () => {
    const total = office.program_count || 0;
    return total > 0 ? Math.min((total / 10) * 100, 100) : 0;
  };

  const getProgressColor = () => {
    const count = office.program_count || 0;
    if (count >= 8) return 'success';
    if (count >= 5) return 'warning';
    return 'primary';
  };

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Business color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3" className="flex-1">
            {office.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {office.description}
        </Typography>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Programs
            </Typography>
            <Chip 
              label={office.program_count || 0}
              color={getProgressColor()}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getProgressValue()} 
            color={getProgressColor()}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          {office.program_count || 0} active programs
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OfficeCard;
