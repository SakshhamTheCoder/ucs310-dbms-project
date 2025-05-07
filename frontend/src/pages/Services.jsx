import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../store/slices/servicesSlice';
import { fetchUserBookings } from '../store/slices/flightSlice';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HotelIcon from '@mui/icons-material/Hotel';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import WifiIcon from '@mui/icons-material/Wifi';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CheckIcon from '@mui/icons-material/Check';

import LoadingSpinner from '../components/UI/LoadingSpinner';

// Helper function to assign icons based on service name
const getServiceIcon = (serviceName) => {
  const nameLower = serviceName.toLowerCase();
  if (nameLower.includes('meal') || nameLower.includes('food') || nameLower.includes('drink')) {
    return <FastfoodIcon fontSize="large" />;
  } else if (nameLower.includes('seat') || nameLower.includes('leg') || nameLower.includes('upgrade')) {
    return <AirlineSeatReclineExtraIcon fontSize="large" />;
  } else if (nameLower.includes('wifi') || nameLower.includes('internet')) {
    return <WifiIcon fontSize="large" />;
  } else if (nameLower.includes('lounge') || nameLower.includes('rest') || nameLower.includes('sleep')) {
    return <HotelIcon fontSize="large" />;
  } else {
    return <LocalOfferIcon fontSize="large" />;
  }
};

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, loading } = useSelector(state => state.services);
  const { bookings } = useSelector(state => state.flights);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleAddToBooking = (serviceId) => {
    if (bookings.length === 0) {
      navigate('/flights');
      return;
    }

    if (bookings.length === 1) {
      navigate(`/bookings/${bookings[0].booking_id}?tab=services`);
    } else {
      navigate('/bookings');
    }
  };

  if (loading && !services.length) {
    return <LoadingSpinner message="Loading available services..." />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Services
      </Typography>

      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Enhance your flight experience with our premium add-on services
      </Typography>

      {bookings.length === 0 && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#fff9c4' }}>
          <Typography variant="subtitle1">
            Note: You need an active booking to add these services
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/flights')}
            sx={{ mt: 1 }}
          >
            Browse Flights
          </Button>
        </Paper>
      )}

      {services.length > 0 ? (
        <Grid container spacing={3}>
          {services.map(service => (
            <Grid item xs={12} sm={6} md={4} key={service.service_id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  {service.available_quantity <= 5 && (
                    <Chip
                      label="Limited Availability"
                      color="warning"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}

                  <Box sx={{ textAlign: 'center', color: 'primary.main', mb: 2 }}>
                    {getServiceIcon(service.name)}
                  </Box>

                  <Typography variant="h5" component="h2" gutterBottom>
                    {service.name}
                  </Typography>

                  <Typography color="textSecondary" paragraph>
                    {service.description || 'Enhance your flight experience with this premium service.'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      Rs. {service.price}
                    </Typography>
                    <Chip
                      label={`${service.available_quantity} available`}
                      size="small"
                      color={service.available_quantity > 10 ? 'success' : 'warning'}
                    />
                  </Box>
                </CardContent>

                <Divider />

                <CardActions>
                  <Button
                    size="small"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    variant="contained"
                    disabled={service.available_quantity <= 0}
                    onClick={() => handleAddToBooking(service.service_id)}
                  >
                    Add to Booking
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No services available at the moment</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Please check back later for new services
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Why Choose Our Services?
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1">Premium Quality</Typography>
              <Typography variant="body2" color="textSecondary">
                All services meet our high quality standards
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1">Easy Booking</Typography>
              <Typography variant="body2" color="textSecondary">
                Add services to your booking in just a few clicks
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1">Flexible Options</Typography>
              <Typography variant="body2" color="textSecondary">
                Choose only what you need for your journey
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1">Customer Support</Typography>
              <Typography variant="body2" color="textSecondary">
                24/7 assistance for all your service needs
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Services; 