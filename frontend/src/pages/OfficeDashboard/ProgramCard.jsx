import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box,
  IconButton 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ProgramCard = ({ program, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'primary';
      case 'upcoming':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" className="flex-1 mr-2">
            {program.title}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(program)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(program.id)}
              className="text-red-600 hover:bg-red-50"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {program.description}
        </Typography>

        <Box mb={2}>
          <Chip 
            label={program.status?.charAt(0).toUpperCase() + program.status?.slice(1) || 'Unknown'}
            color={getStatusColor(program.status)} 
            size="small" 
          />
        </Box>

        <Box className="space-y-1 text-sm text-gray-600">
          <Typography variant="body2">
            <strong>Funding:</strong> {program.funding_source || 'Not specified'}
          </Typography>
          <Typography variant="body2">
            <strong>Participants:</strong> {program.participants_count || 'TBD'}
          </Typography>
          <Typography variant="body2">
            <strong>Start Date:</strong> {formatDate(program.start_date)}
          </Typography>
          <Typography variant="body2">
            <strong>End Date:</strong> {formatDate(program.end_date)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
