import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Assessment } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { useUnitDirectorReports } from '@/hooks/useApi';

const UnitDirectorReports = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filters = {
    month: selectedMonth,
    year: selectedYear
  };

  const { 
    data: reports = [], 
    isLoading, 
    error 
  } = useUnitDirectorReports(filters);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom className="flex items-center gap-2">
          <Assessment /> Reports
        </Typography>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" gap={3} alignItems="center">
            <FormControl minWidth={150}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="">All Months</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl minWidth={120}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Reports Table */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error.message || 'Failed to load reports'}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell><strong>Program Title</strong></TableCell>
                  <TableCell><strong>Office</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Participants</strong></TableCell>
                  <TableCell><strong>Funding Source</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">
                        No programs found for the selected period
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((program) => (
                    <TableRow key={program.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {program.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {program.description?.substring(0, 100)}...
                        </Typography>
                      </TableCell>
                      <TableCell>{program.office_name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={program.status} 
                          color={getStatusColor(program.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{program.participants_count || 'N/A'}</TableCell>
                      <TableCell>{program.funding_source || 'N/A'}</TableCell>
                      <TableCell>
                        {program.start_date ? new Date(program.start_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default UnitDirectorReports;
