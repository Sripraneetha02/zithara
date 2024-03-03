import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Box,
         FormControl,
         InputLabel, 
         MenuItem, 
         Select, 
         Table, 
         TableBody, 
         TableCell, 
         TableContainer, 
         TableHead, 
         TableRow, 
         TextField, 
         TablePagination } from '@mui/material';
import moment from 'moment';
import 'typeface-poppins';

const bodyStyles = {
  body: {
    fontFamily: 'Poppins, sans-serif',
    padding: '40px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3f51b5', // Purple color for heading text
    margin: '0' // Remove default margin
  },
  headingBox: {
    backgroundColor: '#f0f0f0', // Light gray background color for heading box
    padding: '20px', // Padding
    marginBottom: '20px', // Margin bottom
    borderRadius: '10px' // Rounded corners
  },
  searchSortBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px', // Padding
    marginBottom: '20px' // Margin bottom
  },
  searchBox: {
    backgroundColor: 'white', // White background color for search box
    borderRadius: '5px', // Rounded corners
    padding: '10px', // Padding
    minWidth: '300px', // Minimum width
    border: '1px solid #ccc' // Border
  },
  sortBox: {
    backgroundColor: 'white', // White background color for sort box
    borderRadius: '5px', // Rounded corners
    padding: '10px', // Padding
    minWidth: '170px' // Minimum width
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: '#3f51b5', // Purple color for table header cells
    color: 'white' // White text color for table header cells
  },
  tableCell: {
    backgroundColor: '#f5f5f5' // Lighter gray color for table cells
  }
}

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    };

    fetchData();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.Location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    if (sortCriteria === 'date') {
      return new Date(a.Date) - new Date(b.Date);
    } else if (sortCriteria === 'time') {
      return moment(a.Time, "HH:mm:ssZ").diff(moment(b.Time, "HH:mm:ssZ"));
    }
    return 0;
  });

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentCustomers = sortedCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="App" style={bodyStyles.body}>
      <Box sx={bodyStyles.headingBox}>
        <h1 style={bodyStyles.heading}>Customers List</h1>
      </Box>
      <div style={bodyStyles.searchSortBox}>
        <Box sx={bodyStyles.searchBox}>
          <TextField
            id="standard-basic"
            label="Search by Name or Location"
            variant="standard"
            onChange={handleSearchChange}
          />
        </Box>
        <Box sx={bodyStyles.sortBox}>
          <FormControl
            fullWidth
          >
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortCriteria}
              label="Sort"
              onChange={handleSortChange}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="time">Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <TableContainer style={{ boxShadow: '0px 0px 20px 0px rgba(65, 92, 224, 0.2)' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={bodyStyles.tableHeaderCell}>SNo</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Name</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Age</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Phone</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Location</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Date</TableCell>
              <TableCell style={bodyStyles.tableHeaderCell}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow key={customer.Sno}>
                <TableCell style={bodyStyles.tableCell}>{customer.Sno}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{customer.Name}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{customer.Age}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{customer.Phone}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{customer.Location}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{moment(customer.Date).format('DD/MM/YYYY')}</TableCell>
                <TableCell style={bodyStyles.tableCell}>{moment(customer.Time, "HH:mm:ssZ").format('HH:mm:ss')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default App;








