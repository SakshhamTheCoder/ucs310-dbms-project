import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights, fetchAirports, fetchAirlines } from '../store/slices/flightSlice';
import { fetchServices } from '../store/slices/servicesSlice';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import AirlinesIcon from '@mui/icons-material/Airlines';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

import LoadingSpinner from '../components/UI/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, airports, airlines, loading: flightsLoading } = useSelector(state => state.flights);
  const { services, loading: servicesLoading } = useSelector(state => state.services);
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(fetchFlights());
    dispatch(fetchAirports());
    dispatch(fetchAirlines());
    dispatch(fetchServices());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if ((flightsLoading && !flights.length) || (servicesLoading && !services.length)) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }
  
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Welcome back, {user?.username}
      </Typography>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              bgcolor: '#e3f2fd'
            }}
          >
            <FlightIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{flights.length}</Typography>
            <Typography variant="body2" color="textSecondary">Total Flights</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              bgcolor: '#e8f5e9'
            }}
          >
            <AirlinesIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">{airlines.length}</Typography>
            <Typography variant="body2" color="textSecondary">Airlines</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              bgcolor: '#fff8e1'
            }}
          >
            <LocalAirportIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5">{airports.length}</Typography>
            <Typography variant="body2" color="textSecondary">Airports</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              bgcolor: '#ffebee'
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h5">{services.length}</Typography>
            <Typography variant="body2" color="textSecondary">Services</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs for different admin sections */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Flights" icon={<FlightIcon />} iconPosition="start" />
          <Tab label="Airports" icon={<LocalAirportIcon />} iconPosition="start" />
          <Tab label="Airlines" icon={<AirlinesIcon />} iconPosition="start" />
          <Tab label="Services" icon={<ShoppingCartIcon />} iconPosition="start" />
        </Tabs>
        
        <Box p={3}>
          {/* Flights Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Flights</Typography>
                <Button variant="contained" color="primary" size="small">
                  Add New Flight
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {flights.slice(0, 6).map(flight => (
                  <Grid item xs={12} md={6} key={flight.flight_id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Flight #{flight.flight_id} - {flight.airline_name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            From: {flight.departure_airport}
                          </Typography>
                          <Typography variant="body2">
                            To: {flight.arrival_airport}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Gate: {flight.gate_number || 'TBA'}
                          </Typography>
                          <Chip label={`$${flight.price}`} size="small" color="primary" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {flights.length > 6 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="text" color="primary">
                    View All {flights.length} Flights
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {/* Airports Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Airports</Typography>
                <Button variant="contained" color="primary" size="small">
                  Add New Airport
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {airports.map(airport => (
                  <Grid item xs={12} sm={6} md={4} key={airport.airport_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">
                        {airport.airport_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {airport.city}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Airlines Tab */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Airlines</Typography>
                <Button variant="contained" color="primary" size="small">
                  Add New Airline
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {airlines.map(airline => (
                  <Grid item xs={12} sm={6} md={4} key={airline.airline_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">
                        {airline.airline_name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Services Tab */}
          {tabValue === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Services</Typography>
                <Button variant="contained" color="primary" size="small">
                  Add New Service
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {services.map(service => (
                  <Grid item xs={12} md={6} key={service.service_id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {service.description || 'No description available'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip label={`$${service.price}`} size="small" color="primary" />
                          <Chip 
                            label={`${service.available_quantity} available`} 
                            size="small" 
                            color={service.available_quantity > 10 ? 'success' : 'warning'}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
        This is a simplified admin dashboard for the DBMS project. In a real application, each section would have full CRUD functionality.
      </Typography>
    </Container>
  );
};

export default AdminDashboard; 