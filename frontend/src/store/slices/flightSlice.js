import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const initialState = {
  flights: [],
  airports: [],
  airlines: [],
  bookings: [],
  selectedFlight: null,
  loading: false,
  error: null,
};

// Async thunks for flights
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/flights`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch flights');
    }
  }
);

export const fetchAirports = createAsyncThunk(
  'flights/fetchAirports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/airports`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch airports');
    }
  }
);

export const fetchAirlines = createAsyncThunk(
  'flights/fetchAirlines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/airlines`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch airlines');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'flights/fetchUserBookings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const bookFlight = createAsyncThunk(
  'flights/bookFlight',
  async (flightId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      const response = await axios.post(
        `${API_URL}/bookings`,
        { flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book flight');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'flights/cancelBooking',
  async (bookingId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

// Flight slice
const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    clearSelectedFlight: (state) => {
      state.selectedFlight = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch flights
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch airports
      .addCase(fetchAirports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirports.fulfilled, (state, action) => {
        state.loading = false;
        state.airports = action.payload;
      })
      .addCase(fetchAirports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch airlines
      .addCase(fetchAirlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirlines.fulfilled, (state, action) => {
        state.loading = false;
        state.airlines = action.payload;
      })
      .addCase(fetchAirlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Book flight
      .addCase(bookFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookFlight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(booking => booking.booking_id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedFlight, clearSelectedFlight, clearError } = flightSlice.actions;
export default flightSlice.reducer; 