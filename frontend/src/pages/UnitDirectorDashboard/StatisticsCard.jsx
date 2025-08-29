import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box
} from '@mui/material';

const StatisticsCard = ({ title, value, icon: Icon, color = 'primary', description }) => {
  return (
    <Card className={`bg-${color === 'success' ? 'green' : color === 'warning' ? 'yellow' : color === 'error' ? 'red' : 'blue'}-50 border-l-4 border-${color === 'success' ? 'green' : color === 'warning' ? 'yellow' : color === 'error' ? 'red' : 'blue'}-500`}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="div" className="font-bold">
              {value || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {description && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Icon 
              sx={{ 
                fontSize: 40, 
                color: color === 'success' ? 'success.main' : 
                       color === 'warning' ? 'warning.main' : 
                       color === 'error' ? 'error.main' : 'primary.main' 
              }} 
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
