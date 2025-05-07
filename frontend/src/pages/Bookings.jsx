import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking } from '../store/slices/flightSlice';
import { initiatePayment } from '../store/slices/paymentsSlice';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import FlightIcon from '@mui/icons-material/Flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import AlertMessage from '../components/UI/AlertMessage';

const Bookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(state => state.flights);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleOpenCancelDialog = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleCancelBooking = () => {
    dispatch(cancelBooking(selectedBookingId))
      .unwrap()
      .then(() => {
        setAlertState({
          open: true,
          message: 'Booking cancelled successfully',
          severity: 'success'
        });
        handleCloseCancelDialog();
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

  const handleOpenPaymentDialog = (booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedBookingForPayment(null);
  };

  const handleInitiatePayment = () => {
    if (!selectedBookingForPayment) return;

    const paymentData = {
      bookingId: selectedBookingForPayment.booking_id,
      amount: selectedBookingForPayment.total_price, // Assuming total_price is available in booking data
      method: 'Card', // Default method; can be updated based on user input
    };

    dispatch(initiatePayment(paymentData))
      .unwrap()
      .then((response) => {
        setAlertState({
          open: true,
          message: 'Payment initiated successfully',
          severity: 'success',
        });
        handleClosePaymentDialog();
      })
      .catch((err) => {
        setAlertState({
          open: true,
          message: err || 'Failed to initiate payment',
          severity: 'error',
        });
        handleClosePaymentDialog();
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
    setAlertState({ ...alertState, open: false });
  };

  if (loading && !bookings.length) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length > 0 ? (
        <Grid container spacing={3}>
          {bookings.map(booking => (
            <Grid item xs={12} key={booking.booking_id}>
              <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box textAlign="center">
                        <FlightIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" color="primary">
                          {booking.airline_name}
                        </Typography>
                        <Chip
                          label={`Rs. ${booking.total_price}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="textSecondary">
                            Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <FlightTakeoffIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            From: {booking.departure_airport} ({formatDateTime(booking.departure_time)})
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FlightLandIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            To: {booking.arrival_airport} ({formatDateTime(booking.arrival_time)})
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          fullWidth
                          onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                        >
                          View Details
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          fullWidth
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenCancelDialog(booking.booking_id)}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          fullWidth
                          startIcon={<AddCircleIcon />}
                          onClick={() => navigate(`/bookings/${booking.booking_id}?tab=services`)}
                        >
                          Add Services
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          fullWidth
                          onClick={() => handleOpenPaymentDialog(booking)}
                        >
                          Pay Now
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No bookings found</Typography>
          <Typography variant="body1" paragraph>
            You haven't made any flight bookings yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/flights')}
          >
            Browse Flights
          </Button>
        </Paper>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep It</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle>Initiate Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to initiate payment for this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button onClick={handleInitiatePayment} color="success" variant="contained">
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Message */}
      <AlertMessage
        open={alertState.open || !!error}
        message={error || alertState.message}
        severity={alertState.severity}
        onClose={handleCloseAlert}
      />
    </Container>
  );
};

export default Bookings;