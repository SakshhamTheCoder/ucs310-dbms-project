import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFlights, 
  bookFlight, 
  clearError as clearFlightError 
} from '../store/slices/flightSlice';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import FlightIcon from '@mui/icons-material/Flight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import PaymentIcon from '@mui/icons-material/Payment';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import AlertMessage from '../components/UI/AlertMessage';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { flights, selectedFlight, loading, error } = useSelector(state => state.flights);
  const { token } = useSelector(state => state.auth);
  
  const [bookingStatus, setBookingStatus] = useState({ success: false, error: null });
  
  useEffect(() => {
    if (!flights.length) {
      dispatch(fetchFlights());
    }
  }, [dispatch, id, flights.length]);
  
  const flight = selectedFlight || flights.find(f => f.flight_id === Number(id));
  
  const handleBookFlight = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    dispatch(bookFlight(Number(id)))
      .unwrap()
      .then(() => {
        setBookingStatus({ success: true, error: null });
      })
      .catch(err => {
        setBookingStatus({ success: false, error: err });
      });
  };
  
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateTimeStr;
    }
  };
  
  const handleCloseAlert = () => {
    setBookingStatus({ success: false, error: null });
    dispatch(clearFlightError());
  };
  
  if (loading && !flight) {
    return <LoadingSpinner message="Loading flight details..." />;
  }
  
  if (!flight) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Flight not found. The flight may have been removed or the ID is invalid.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/flights')}
          sx={{ mt: 2 }}
        >
          Back to Flights
        </Button>
      </Container>
    );
  }
  
  const flightDuration = new Date(flight.arrival_time) - new Date(flight.departure_time);
  const hours = Math.floor(flightDuration / (1000 * 60 * 60));
  const minutes = Math.floor((flightDuration % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Container sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      {/* Flight Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Flight #{flight.flight_id}
              </Typography>
              <Chip 
                color="primary"
                icon={<AirlineSeatReclineNormalIcon />}
                label={`Gate ${flight.gate_number || 'TBA'}`}
                sx={{ height: 32 }}
              />
            </Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {flight.airline_name}
            </Typography>
          </Grid>
          
          {/* Flight Route */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Departure
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {flight.departure_airport}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatDateTime(flight.departure_time)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Divider orientation="horizontal" sx={{ width: '100%', mb: 1 }} />
                      <FlightIcon sx={{ transform: 'rotate(90deg)' }} />
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={5}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Arrival
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {flight.arrival_airport}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatDateTime(flight.arrival_time)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Flight Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Flight Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {new Date(flight.departure_time).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FlightIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {flight.airline_name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AirlineSeatReclineNormalIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Gate: {flight.gate_number || 'To be announced'}
              </Typography>
            </Box>
          </Grid>
          
          {/* Pricing & Booking */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Base Fare</Typography>
                <Typography variant="body1">${flight.price}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Taxes & Fees</Typography>
                <Typography variant="body1">Included</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">${flight.price}</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleBookFlight}
                startIcon={<PaymentIcon />}
              >
                Book Now
              </Button>
              {!token && (
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  You need to be logged in to book
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Alerts */}
      <AlertMessage
        open={!!error || !!bookingStatus.error}
        message={error || bookingStatus.error || ''}
        severity="error"
        onClose={handleCloseAlert}
      />
      
      <AlertMessage
        open={bookingStatus.success}
        message="Flight booked successfully! Go to My Bookings to view details."
        severity="success"
        onClose={handleCloseAlert}
      />
    </Container>
  );
};

export default FlightDetails; 