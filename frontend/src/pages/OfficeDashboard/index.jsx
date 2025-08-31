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

export default function OfficeDashboard() {
  const { user, logout } = useAuth();

  // Database structure reference for office users
  const databaseStructure = {
    // Main table they work with
    programs: {
      description: 'Programs and projects for your office',
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'program.id' },
        { name: 'office_id', type: 'UUID', call: 'program.office_id', note: 'Always your office ID' },
        { name: 'title', type: 'TEXT', call: 'program.title', required: true },
        { name: 'description', type: 'TEXT', call: 'program.description' },
        { name: 'status', type: 'TEXT', call: 'program.status', options: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
        { name: 'sustainable_development_goals', type: 'ARRAY', call: 'program.sustainable_development_goals', note: '17 SDG options' },
        { name: 'adzu_goals', type: 'ARRAY', call: 'program.adzu_goals', note: '4 ADZU goals' },
        { name: 'funding_source', type: 'TEXT', call: 'program.funding_source' },
        { name: 'program_heads', type: 'ARRAY', call: 'program.program_heads', note: 'Multiple leaders' },
        { name: 'participants_count', type: 'INTEGER', call: 'program.participants_count' },
        { name: 'target_beneficiaries', type: 'INTEGER', call: 'program.target_beneficiaries' },
        { name: 'actual_beneficiaries', type: 'INTEGER', call: 'program.actual_beneficiaries' },
        { name: 'proposed_date', type: 'DATE', call: 'program.proposed_date' },
        { name: 'actual_start_date', type: 'DATE', call: 'program.actual_start_date' },
        { name: 'start_date', type: 'DATE', call: 'program.start_date' },
        { name: 'end_date', type: 'DATE', call: 'program.end_date' },
        { name: 'created_by', type: 'UUID', call: 'program.created_by', note: 'Your user ID' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'program.created_at', note: 'Auto-generated' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'program.updated_at', note: 'Auto-generated' }
      ]
    },
    
    // Office users table
    office_users: {
      description: 'Staff members in your office',
      operations: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
      columns: [
        { name: 'id', type: 'UUID', call: 'user.id' },
        { name: 'office_id', type: 'UUID', call: 'user.office_id', note: 'Your office ID' },
        { name: 'name', type: 'TEXT', call: 'user.name', required: true },
        { name: 'email', type: 'TEXT', call: 'user.email', required: true },
        { name: 'password', type: 'TEXT', call: 'user.password', note: 'Hashed with bcrypt' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'user.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'user.updated_at' }
      ]
    },

    // Office info (read only)
    offices: {
      description: 'Your office information',
      operations: ['READ'],
      columns: [
        { name: 'id', type: 'UUID', call: 'office.id' },
        { name: 'name', type: 'TEXT', call: 'office.name' },
        { name: 'description', type: 'TEXT', call: 'office.description' },
        { name: 'created_at', type: 'TIMESTAMP', call: 'office.created_at' },
        { name: 'updated_at', type: 'TIMESTAMP', call: 'office.updated_at' }
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
                Office Dashboard - Database Structure
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {user?.office?.name || 'Your Office'}
              </Typography>
              <Chip 
                label={`Office ID: ${user?.office_id || 'your-office-id'}`} 
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
              📝 Common Database Queries for Your Office
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Get all your office programs:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT * FROM programs WHERE office_id = &apos;{user?.office_id || 'your-office-id'}&apos;
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Get ongoing programs only:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT * FROM programs WHERE office_id = &apos;{user?.office_id || 'your-office-id'}&apos; AND status = &apos;ongoing&apos;
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Count programs by status:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT status, COUNT(*) FROM programs WHERE office_id = &apos;{user?.office_id || 'your-office-id'}&apos; GROUP BY status
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="Get your office users:"
                  secondary={
                    <Typography variant="body2" fontFamily="monospace" color="primary">
                      SELECT id, name, email FROM office_users WHERE office_id = &apos;{user?.office_id || 'your-office-id'}&apos;
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
                  primary="User ID" 
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
                  primary="Office ID" 
                  secondary={user?.office_id || 'Not available'} 
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