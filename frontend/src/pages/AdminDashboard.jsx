import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights, fetchAirports, fetchAirlines, fetchRoutes } from '../store/slices/flightSlice';
import { fetchServices } from '../store/slices/servicesSlice';
import { fetchGates, fetchLounges, fetchNotifications, fetchPayments } from '../store/slices/adminSlice';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import AirlinesIcon from '@mui/icons-material/Airlines';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RouteIcon from '@mui/icons-material/AltRoute';
import NotificationsIcon from '@mui/icons-material/Notifications';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import AddFlightModal from '../components/Admin/AddFlightModal';
import AddAirportModal from '../components/Admin/AddAirportModal';
import AddAirlineModal from '../components/Admin/AddAirlineModal';
import AddServiceModal from '../components/Admin/AddServiceModal';
import AddRouteModal from '../components/Admin/AddRouteModal';
import AddLoungeModal from '../components/Admin/AddLoungeModal';
import { listAllPayments, updatePaymentStatus } from '../store/slices/paymentsSlice';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flights, airports, airlines, routes, loading: flightsLoading } = useSelector(state => state.flights);
  const { services, loading: servicesLoading } = useSelector(state => state.services);
  const { gates, lounges, notifications, loading: adminLoading } = useSelector(state => state.admin);
  const { user } = useSelector(state => state.auth);
  const { payments, loading: loadingPayments } = useSelector(state => state.payments);

  const [tabValue, setTabValue] = useState(0);

  const [openFlightModal, setOpenFlightModal] = useState(false);
  const [openAirportModal, setOpenAirportModal] = useState(false);
  const [openAirlineModal, setOpenAirlineModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [openRouteModal, setOpenRouteModal] = useState(false);
  const [openGateModal, setOpenGateModal] = useState(false);
  const [openLoungeModal, setOpenLoungeModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState('');

  const handleOpenFlightModal = () => setOpenFlightModal(true);
  const handleCloseFlightModal = () => setOpenFlightModal(false);

  const handleOpenAirportModal = () => setOpenAirportModal(true);
  const handleCloseAirportModal = () => setOpenAirportModal(false);

  const handleOpenAirlineModal = () => setOpenAirlineModal(true);
  const handleCloseAirlineModal = () => setOpenAirlineModal(false);

  const handleOpenServiceModal = () => setOpenServiceModal(true);
  const handleCloseServiceModal = () => setOpenServiceModal(false);

  const handleOpenRouteModal = () => setOpenRouteModal(true);
  const handleCloseRouteModal = () => setOpenRouteModal(false);

  const handleOpenLoungeModal = () => setOpenLoungeModal(true);
  const handleCloseLoungeModal = () => setOpenLoungeModal(false);

  const handleOpenPaymentDialog = (payment) => {
    setSelectedPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleUpdatePaymentStatus = async (status) => {
    if (!selectedPayment) return;
    try {
      await dispatch(updatePaymentStatus({ id: selectedPayment.id, status })).unwrap();
      handleClosePaymentDialog();
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleCreateNotification = () => {
    // Logic to create a new notification
    setDialogOpen(false);
  };

  const handleDeleteNotification = (id) => {
    // Logic to delete a notification
  };

  useEffect(() => {
    dispatch(fetchFlights());
    dispatch(fetchAirports());
    dispatch(fetchAirlines());
    dispatch(fetchRoutes());
    dispatch(fetchServices());
    dispatch(fetchGates());
    dispatch(fetchLounges());
    dispatch(fetchNotifications());
    dispatch(listAllPayments());
    fetchPayments();
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
              bgcolor: '#e3f2fd',
            }}
          >
            <FlightIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{flights.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Total Flights
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: '#e8f5e9',
            }}
          >
            <AirlinesIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">{airlines.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Airlines
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: '#fff8e1',
            }}
          >
            <LocalAirportIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5">{airports.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Airports
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: '#ffebee',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h5">{services.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Services
            </Typography>
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
          <Tab label="Routes" icon={<RouteIcon />} iconPosition="start" />
          <Tab label="Gates" icon={<LocalAirportIcon />} iconPosition="start" />
          <Tab label="Lounges" icon={<LocalAirportIcon />} iconPosition="start" />
          <Tab label="Payments" icon={<ShoppingCartIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        </Tabs>

        <Box p={3}>
          {/* Flights Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Flights</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleOpenFlightModal}>
                  Add New Flight
                </Button>
              </Box>
              <Grid container spacing={2}>
                {flights.map(flight => (
                  <Grid item xs={12} sm={6} md={4} key={flight.flight_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Flight ID: {flight.flight_id}</Typography>
                      <Typography variant="body2">Departure: {flight.departure_time}</Typography>
                      <Typography variant="body2">Arrival: {flight.arrival_time}</Typography>
                      <Typography variant="body2">Price: Rs. {flight.price}</Typography>
                      <Typography variant="body2">Airline: {flight.airline_name}</Typography>
                      <Typography variant="body2">Gate: {flight.gate_number}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Airports Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Airports</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleOpenAirportModal}>
                  Add New Airport
                </Button>
              </Box>
              <Grid container spacing={2}>
                {airports.map(airport => (
                  <Grid item xs={12} sm={6} md={4} key={airport.airport_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Airport Name: {airport.airport_name}</Typography>
                      <Typography variant="body2">City: {airport.city}</Typography>
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
                <Button variant="contained" color="primary" size="small" onClick={handleOpenAirlineModal}>
                  Add New Airline
                </Button>
              </Box>
              <Grid container spacing={2}>
                {airlines.map(airline => (
                  <Grid item xs={12} sm={6} md={4} key={airline.airline_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Airline Name: {airline.airline_name}</Typography>
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
                <Button variant="contained" color="primary" size="small" onClick={handleOpenServiceModal}>
                  Add New Service
                </Button>
              </Box>
              <Grid container spacing={2}>
                {services.map(service => (
                  <Grid item xs={12} sm={6} md={4} key={service.service_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Service Name: {service.name}</Typography>
                      <Typography variant="body2">Description: {service.description}</Typography>
                      <Typography variant="body2">Price: Rs. {service.price}</Typography>
                      <Typography variant="body2">Available Quantity: {service.available_quantity}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Routes Tab */}
          {tabValue === 4 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Routes</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleOpenRouteModal}>
                  Add New Route
                </Button>
              </Box>
              <Grid container spacing={2}>
                {routes.map(route => (
                  <Grid item xs={12} sm={6} md={4} key={route.route_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Route ID: {route.route_id}</Typography>
                      <Typography variant="subtitle1">From: {route.departure_airport}</Typography>
                      <Typography variant="subtitle1">To: {route.arrival_airport}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Gates Tab */}
          {tabValue === 5 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Gates</Typography>

              </Box>
              <Grid container spacing={2}>
                {gates.map(gate => (
                  <Grid item xs={12} sm={6} md={4} key={gate.gate_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Gate Number: {gate.gate_number}</Typography>
                      <Typography variant="body2">Status: {gate.status}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Lounges Tab */}
          {tabValue === 6 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">All Lounges</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleOpenLoungeModal}>
                  Add New Lounge
                </Button>
              </Box>
              <Grid container spacing={2}>
                {lounges.map(lounge => (
                  <Grid item xs={12} sm={6} md={4} key={lounge.lounge_id}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">Lounge Name: {lounge.name}</Typography>
                      <Typography variant="body2">Capacity: {lounge.capacity}</Typography>
                      <Typography variant="body2">Airport: {lounge.airport_name}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Payments Tab */}
          {tabValue === 7 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                All Payments
              </Typography>
              {loadingPayments ? (
                <LoadingSpinner message="Loading payments..." />
              ) : (
                <Grid container spacing={2}>
                  {payments.map((payment) => (
                    <Grid item xs={12} sm={6} md={4} key={payment.payment_id}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Payment ID: {payment.payment_id}</Typography>
                        <Typography variant="body2">Amount: Rs. {payment.amount}</Typography>
                        <Typography variant="body2">Status: {payment.status_name}</Typography>
                        <Typography variant="body2">Status: {payment.method_name}</Typography>
                        <Typography variant="body2">Payment By: {payment.username}</Typography>
                        <Typography variant="body2">Payment Date: {payment.payment_date}</Typography>
                        {/* <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenPaymentDialog(payment)}
                        >
                          Update Status
                        </Button> */}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Payment Status Dialog */}
              <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog}>
                <DialogTitle>Update Payment Status</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Update the status of payment ID: {selectedPayment?.id}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePaymentDialog}>Cancel</Button>
                  <Button
                    onClick={() => handleUpdatePaymentStatus('Completed')}
                    color="success"
                    variant="contained"
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleUpdatePaymentStatus('Failed')}
                    color="error"
                    variant="contained"
                  >
                    Mark as Failed
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}

          {/* Notifications Tab */}
          {tabValue === 8 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Manage Notifications
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDialogOpen(true)}
              >
                Create Notification
              </Button>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {notifications.map(notification => (
                  <Grid item xs={12} key={notification.id}>
                    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{notification.message}</Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        Delete
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the message for the new notification.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Notification Message"
                    fullWidth
                    value={newNotification}
                    onChange={(e) => setNewNotification(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateNotification} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Modals */}
      <AddFlightModal open={openFlightModal} onClose={handleCloseFlightModal} />
      <AddAirportModal open={openAirportModal} onClose={handleCloseAirportModal} />
      <AddAirlineModal open={openAirlineModal} onClose={handleCloseAirlineModal} />
      <AddServiceModal open={openServiceModal} onClose={handleCloseServiceModal} />
      <AddRouteModal open={openRouteModal} onClose={handleCloseRouteModal} />
      <AddLoungeModal open={openLoungeModal} onClose={handleCloseLoungeModal} />
    </Container>
  );
};

export default AdminDashboard;