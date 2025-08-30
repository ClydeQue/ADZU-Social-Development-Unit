import { Box, Typography } from '@mui/material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" color="primary">
        Test Component is Working!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        If you can see this, the basic React setup is working.
      </Typography>
    </Box>
  );
};

export default TestComponent;
