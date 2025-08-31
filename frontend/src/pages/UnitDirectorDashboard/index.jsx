import { 
  Box, 
  Typography, 
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function UnitDirectorDashboard() {
  const { user, logout } = useAuth();

  // Database structure reference for unit director
  const databaseStructure = {
    // All offices table
    offices: {
      description: 'All offices in the Social Development Unit',
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'office.id' },
        { name: 'name', type: 'TEXT', call: 'office.name', required: true },
        { name: 'description', type: 'TEXT', call: 'office.description' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'office.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'office.updated_at' }
      ]
    },

    // All programs across all offices
    programs: {
      description: 'All programs from all offices - complete overview',
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'program.id' },
        { name: 'office_id', type: 'UUID', call: 'program.office_id', note: 'Links to offices table' },
        { name: 'title', type: 'TEXT', call: 'program.title', required: true },
        { name: 'description', type: 'TEXT', call: 'program.description' },
        { name: 'status', type: 'TEXT', call: 'program.status', options: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
        { name: 'sustainable_development_goals', type: 'ARRAY', call: 'program.sustainable_development_goals', note: '17 SDG options' },
        { name: 'adzu_goals', type: 'ARRAY', call: 'program.adzu_goals', note: '4 ADZU goals' },
        { name: 'funding_source', type: 'TEXT', call: 'program.funding_source' },
        { name: 'program_heads', type: 'ARRAY', call: 'program.program_heads' },
        { name: 'participants_count', type: 'INTEGER', call: 'program.participants_count' },
        { name: 'target_beneficiaries', type: 'INTEGER', call: 'program.target_beneficiaries' },
        { name: 'actual_beneficiaries', type: 'INTEGER', call: 'program.actual_beneficiaries' },
        { name: 'proposed_date', type: 'DATE', call: 'program.proposed_date' },
        { name: 'actual_start_date', type: 'DATE', call: 'program.actual_start_date' },
        { name: 'start_date', type: 'DATE', call: 'program.start_date' },
        { name: 'end_date', type: 'DATE', call: 'program.end_date' },
        { name: 'created_by', type: 'UUID', call: 'program.created_by', note: 'User who created' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'program.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'program.updated_at' }
      ]
    },
    
    // All office users across all offices
    office_users: {
      description: 'All staff members across all offices',
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'user.id' },
        { name: 'office_id', type: 'UUID', call: 'user.office_id', note: 'Links to offices table' },
        { name: 'name', type: 'TEXT', call: 'user.name', required: true },
        { name: 'email', type: 'TEXT', call: 'user.email', required: true },
        { name: 'password', type: 'TEXT', call: 'user.password', note: 'Hashed with bcrypt' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'user.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'user.updated_at' }
      ]
    },

    // Unit director users
    unit_directors: {
      description: 'Unit Director accounts',
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'director.id' },
        { name: 'name', type: 'TEXT', call: 'director.name', required: true },
        { name: 'email', type: 'TEXT', call: 'director.email', required: true },
        { name: 'password', type: 'TEXT', call: 'director.password', note: 'Hashed with bcrypt' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'director.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'director.updated_at' }
      ]
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Unit Director Dashboard - Database Structure
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Complete System Overview
              </Typography>
              <Chip 
                label={`Director ID: ${user?.id || 'your-director-id'}`} 
                variant="outlined" 
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>
            
            <Button 
              variant="contained" 
              color="error" 
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{ mb: 2 }}
            >
              Logout
            </Button>
          </Box>

          {Object.entries(databaseStructure).map(([tableName, tableInfo]) => (
            <Paper key={tableName} elevation={2} sx={{ mb: 4, p: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                📊 {tableName.toUpperCase()} Table
              </Typography>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {tableInfo.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" display="inline">Operations: </Typography>
                {tableInfo.operations.map((op) => (
                  <Chip key={op} label={op} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Columns and How to Call Them:
              </Typography>

              <List dense>
                {tableInfo.columns.map((column, index) => (
                  <Box key={column.name}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                              {column.name}
                            </Typography>
                            <Chip 
                              label={column.type} 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                            {column.required && (
                              <Chip 
                                label="REQUIRED" 
                                size="small" 
                                color="error" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="primary" fontFamily="monospace" component="span" display="block">
                              Backend Call: {column.call}
                            </Typography>
                            {column.note && (
                              <Typography variant="caption" color="text.secondary" component="span" display="block">
                                Note: {column.note}
                              </Typography>
                            )}
                            {column.options && (
                              <Typography variant="caption" color="text.secondary" component="span" display="block" sx={{ mt: 0.5 }}>
                                Options: {column.options.join(', ')}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < tableInfo.columns.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          ))}

          {/* Quick reference for common queries */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="secondary">
              📝 Common Database Queries for Unit Director
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Get all offices:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT * FROM offices
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Get all programs across all offices:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT p.*, o.name as office_name FROM programs p JOIN offices o ON p.office_id = o.id
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Count programs by office:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT o.name, COUNT(p.id) as program_count FROM offices o LEFT JOIN programs p ON o.id = p.office_id GROUP BY o.id, o.name
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Get all users by office:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT u.*, o.name as office_name FROM office_users u JOIN offices o ON u.office_id = o.id
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Programs by status across all offices:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT status, COUNT(*) as count FROM programs GROUP BY status
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>

          {/* Current user info */}
          <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              👤 Your Current Session Info:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Director ID" 
                  secondary={user?.id || 'Not available'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Name" 
                  secondary={user?.name || 'Not available'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={user?.email || 'Not available'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Role" 
                  secondary={user?.role || 'Not available'} 
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};
