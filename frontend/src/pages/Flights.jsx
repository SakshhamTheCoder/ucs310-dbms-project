import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights, fetchAirports, setSelectedFlight } from '../store/slices/flightSlice';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Divider,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlightIcon from '@mui/icons-material/Flight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

import { format } from 'date-fns';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Flights = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, airports, loading } = useSelector(state => state.flights);

  const [filters, setFilters] = useState({
    departureAirport: '',
    arrivalAirport: '',
    airline: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: ''
  });

  useEffect(() => {
    dispatch(fetchFlights());
    dispatch(fetchAirports());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFlightSelect = (flight) => {
    dispatch(setSelectedFlight(flight));
    navigate(`/flights/${flight.flight_id}`);
  };

  const filteredFlights = flights.filter(flight => {
    if (filters.departureAirport && flight.departure_airport !== filters.departureAirport) {
      return false;
    }
    if (filters.arrivalAirport && flight.arrival_airport !== filters.arrivalAirport) {
      return false;
    }
    if (filters.airline && flight.airline_name !== filters.airline) {
      return false;
    }
    if (filters.minPrice && flight.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && flight.price > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        flight.departure_airport.toLowerCase().includes(searchLower) ||
        flight.arrival_airport.toLowerCase().includes(searchLower) ||
        flight.airline_name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Get unique values for filter dropdowns
  const uniqueAirports = [...new Set(flights.flatMap(flight => [flight.departure_airport, flight.arrival_airport]))];
  const uniqueAirlines = [...new Set(flights.map(flight => flight.airline_name))];

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateTimeStr;
    }
  };

  if (loading && !flights.length) {
    return <LoadingSpinner message="Loading flights..." />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Flights
      </Typography>

      {/* Filters Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: '#f9f9f9'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Flights
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="searchTerm"
              placeholder="Search by airport or airline..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Departure Airport</InputLabel>
              <Select
                name="departureAirport"
                value={filters.departureAirport}
                onChange={handleFilterChange}
                label="Departure Airport"
              >
                <MenuItem value="">All Airports</MenuItem>
                {uniqueAirports.map(airport => (
                  <MenuItem key={`dep-${airport}`} value={airport}>{airport}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Arrival Airport</InputLabel>
              <Select
                name="arrivalAirport"
                value={filters.arrivalAirport}
                onChange={handleFilterChange}
                label="Arrival Airport"
              >
                <MenuItem value="">All Airports</MenuItem>
                {uniqueAirports.map(airport => (
                  <MenuItem key={`arr-${airport}`} value={airport}>{airport}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Airline</InputLabel>
              <Select
                name="airline"
                value={filters.airline}
                onChange={handleFilterChange}
                label="Airline"
              >
                <MenuItem value="">All Airlines</MenuItem>
                {uniqueAirlines.map(airline => (
                  <MenuItem key={airline} value={airline}>{airline}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="minPrice"
                  label="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="maxPrice"
                  label="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                departureAirport: '',
                arrivalAirport: '',
                airline: '',
                minPrice: '',
                maxPrice: '',
                searchTerm: ''
              })}
              sx={{ mt: 1 }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Flights List */}
      {filteredFlights.length > 0 ? (
        <Grid container spacing={3}>
          {filteredFlights.map(flight => (
            <Grid item xs={12} key={flight.flight_id}>
              <Card sx={{ '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box textAlign="center">
                        <Typography variant="subtitle1" color="primary">
                          {flight.airline_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Flight #{flight.flight_id}
                        </Typography>
                        <Chip
                          icon={<AirlineSeatReclineNormalIcon />}
                          label={`Gate ${flight.gate_number || 'TBA'}`}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {flight.departure_airport}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            {formatDateTime(flight.departure_time)}
                          </Typography>
                        </Box>

                        <FlightIcon sx={{ transform: 'rotate(90deg)', mx: 2 }} />

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {flight.arrival_airport}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            {formatDateTime(flight.arrival_time)}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <EventIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime() > 0
                            ? `Flight Duration: ${Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60))} minutes`
                            : 'Duration: TBA'
                          }
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="h5" color="primary" gutterBottom>
                        Rs. {flight.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFlightSelect(flight)}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No flights found matching your criteria</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your filters to find available flights
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Flights; 