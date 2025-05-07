import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking } from '../store/slices/flightSlice';
import { 
  fetchServices, 
  fetchBookingServices, 
  addServiceToBooking,
  removeServiceFromBooking,
  clearError as clearServicesError
} from '../store/slices/servicesSlice';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import FlightIcon from '@mui/icons-material/Flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import AlertMessage from '../components/UI/AlertMessage';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get the tab from the URL query param
  const query = new URLSearchParams(location.search);
  const initialTab = query.get('tab') === 'services' ? 1 : 0;
  
  const { bookings, loading: bookingsLoading, error: bookingsError } = useSelector(state => state.flights);
  const { 
    services, 
    bookingServices, 
    loading: servicesLoading, 
    error: servicesError 
  } = useSelector(state => state.services);
  
  const [tabValue, setTabValue] = useState(initialTab);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });
  
  const booking = bookings.find(b => b.booking_id === Number(id));
  
  useEffect(() => {
    if (!bookings.length) {
      dispatch(fetchUserBookings());
    }
    
    dispatch(fetchServices());
    dispatch(fetchBookingServices(Number(id)));
  }, [dispatch, id, bookings.length]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };
  
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };
  
  const handleCancelBooking = () => {
    dispatch(cancelBooking(Number(id)))
      .unwrap()
      .then(() => {
        navigate('/bookings', { state: { success: true, message: 'Booking cancelled successfully' } });
      })
      .catch(err => {
        setAlertState({
          open: true,
          message: err || 'Failed to cancel booking',
          severity: 'error'
        });
        handleCloseCancelDialog();
      });
  };
  
  const handleOpenAddServiceDialog = () => {
    setAddServiceDialogOpen(true);
  };
  
  const handleCloseAddServiceDialog = () => {
    setAddServiceDialogOpen(false);
    setSelectedService('');
    setServiceQuantity(1);
  };
  
  const handleAddService = () => {
    if (!selectedService) {
      setAlertState({
        open: true,
        message: 'Please select a service',
        severity: 'error'
      });
      return;
    }
    
    dispatch(addServiceToBooking({
      bookingId: Number(id),
      serviceId: Number(selectedService),
      quantity: Number(serviceQuantity)
    }))
      .unwrap()
      .then(() => {
        setAlertState({
          open: true,
          message: 'Service added successfully',
          severity: 'success'
        });
        handleCloseAddServiceDialog();
        dispatch(fetchBookingServices(Number(id)));
      })
      .catch(err => {
        setAlertState({
          open: true,
          message: err || 'Failed to add service',
          severity: 'error'
        });
      });
  };
  
  const handleRemoveService = (bookingServiceId) => {
    dispatch(removeServiceFromBooking({
      bookingId: Number(id),
      bookingServiceId
    }))
      .unwrap()
      .then(() => {
        setAlertState({
          open: true,
          message: 'Service removed successfully',
          severity: 'success'
        });
      })
      .catch(err => {
        setAlertState({
          open: true,
          message: err || 'Failed to remove service',
          severity: 'error'
        });
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
  
  const calculateTotal = () => {
    const flightPrice = booking?.total_price || 0;
    const servicesTotal = bookingServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
    
    return flightPrice + servicesTotal;
  };
  
  const handleCloseAlert = () => {
    setAlertState({ ...alertState, open: false });
    dispatch(clearServicesError());
  };
  
  if (bookingsLoading && !booking) {
    return <LoadingSpinner message="Loading booking details..." />;
  }
  
  if (!booking) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Booking not found. The booking may have been cancelled or the ID is invalid.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/bookings')}
          sx={{ mt: 2 }}
        >
          Back to My Bookings
        </Button>
      </Container>
    );
  }
  
  return (
    <Container sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/bookings')}
        sx={{ mb: 3 }}
      >
        Back to My Bookings
      </Button>
      
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab label="Booking Details" id="booking-tab-0" />
            <Tab label="Add-on Services" id="booking-tab-1" />
          </Tabs>
        </Box>
        
        {/* Booking Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Booking #{booking.booking_id}
            </Typography>
            <Chip 
              label={`Booked on ${new Date(booking.booking_date).toLocaleDateString()}`} 
              color="primary" 
              variant="outlined"
              icon={<EventIcon />}
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Flight Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FlightIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          {booking.airline_name} - Flight #{booking.flight_id}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FlightTakeoffIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1" fontWeight="500">
                            Departure
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 4, mt: 1 }}>
                          {booking.departure_airport}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ pl: 4 }}>
                          {formatDateTime(booking.departure_time)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FlightLandIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1" fontWeight="500">
                            Arrival
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 4, mt: 1 }}>
                          {booking.arrival_airport}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ pl: 4 }}>
                          {formatDateTime(booking.arrival_time)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Gate: {booking.gate_number || 'To be announced'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Important:</strong> Please arrive at the airport at least 2 hours before departure time.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom>
                    Price Summary
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Flight Fare</Typography>
                      <Typography variant="body2">${booking.total_price}</Typography>
                    </Box>
                    
                    {bookingServices.length > 0 && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        {bookingServices.map(service => (
                          <Box 
                            key={service.booking_service_id} 
                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                          >
                            <Typography variant="body2">
                              {service.name} (x{service.quantity})
                            </Typography>
                            <Typography variant="body2">
                              ${service.price * service.quantity}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight="bold">Total</Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        ${calculateTotal()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    color="error"
                    fullWidth
                    onClick={handleOpenCancelDialog}
                    startIcon={<DeleteIcon />}
                    sx={{ mt: 2 }}
                  >
                    Cancel Booking
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Services Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Add-on Services
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddServiceDialog}
                >
                  Add Service
                </Button>
              </Box>
              
              {servicesLoading ? (
                <LoadingSpinner message="Loading services..." />
              ) : bookingServices.length > 0 ? (
                <List>
                  {bookingServices.map(service => (
                    <Paper key={service.booking_service_id} elevation={1} sx={{ mb: 2 }}>
                      <ListItem
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleRemoveService(service.booking_service_id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">{service.name}</Typography>
                              <Typography variant="subtitle1" color="primary">
                                ${service.price * service.quantity}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                {service.description || 'No description available'}
                              </Typography>
                              <Chip 
                                label={`Quantity: ${service.quantity}`} 
                                size="small" 
                                variant="outlined"
                                sx={{ mt: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <ShoppingCartIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="subtitle1" paragraph>
                    No services added to this booking yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Enhance your flight experience with our range of services
                  </Typography>
                </Paper>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Available Services
                </Typography>
                {servicesLoading ? (
                  <Box sx={{ py: 2 }}>Loading...</Box>
                ) : services.length > 0 ? (
                  <List>
                    {services.map(service => (
                      <Box key={service.service_id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">{service.name}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            ${service.price} each
                          </Typography>
                          <Chip 
                            label={`${service.available_quantity} available`}
                            size="small"
                            color={service.available_quantity > 10 ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2">No services available</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Cancel Booking Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Service Dialog */}
      <Dialog
        open={addServiceDialogOpen}
        onClose={handleCloseAddServiceDialog}
      >
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="service-select-label">Service</InputLabel>
              <Select
                labelId="service-select-label"
                value={selectedService}
                label="Service"
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a service</em>
                </MenuItem>
                {services.map(service => (
                  <MenuItem 
                    key={service.service_id} 
                    value={service.service_id}
                    disabled={service.available_quantity <= 0}
                  >
                    {service.name} - ${service.price} ({service.available_quantity} available)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={serviceQuantity}
              onChange={(e) => setServiceQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              helperText="How many of this service would you like?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddServiceDialog}>Cancel</Button>
          <Button onClick={handleAddService} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Message */}
      <AlertMessage
        open={alertState.open || !!bookingsError || !!servicesError}
        message={bookingsError || servicesError || alertState.message}
        severity={alertState.severity}
        onClose={handleCloseAlert}
      />
    </Container>
  );
};

export default BookingDetails; 