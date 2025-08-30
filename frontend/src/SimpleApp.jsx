import { CssBaseline, Box, Typography } from '@mui/material';
import TestComponent from './components/TestComponent.jsx';

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography variant="h2" color="primary" gutterBottom>
          Simple Test App
        </Typography>
        <TestComponent />
      </Box>
    </>
  );
}

export default App;
