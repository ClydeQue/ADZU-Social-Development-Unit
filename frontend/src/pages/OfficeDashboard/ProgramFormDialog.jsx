import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';

const ProgramFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  editingProgram, 
  formData, 
  onFormDataChange 
}) => {
  const handleInputChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingProgram ? 'Edit Program' : 'Add New Program'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Program Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange('description')}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange('status')}
                  label="Status"
                  required
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Funding Source"
                fullWidth
                variant="outlined"
                value={formData.funding_source}
                onChange={handleInputChange('funding_source')}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Expected Participants"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.participants_count}
                onChange={handleInputChange('participants_count')}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              {/* Empty grid item for spacing */}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.start_date}
                onChange={handleInputChange('start_date')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.end_date}
                onChange={handleInputChange('end_date')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {editingProgram ? 'Update Program' : 'Create Program'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProgramFormDialog;
