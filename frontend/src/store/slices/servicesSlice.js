import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


const initialState = {
  services: [],
  bookingServices: [],
  loading: false,
  error: null,
};

// Async thunks for services
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchBookingServices = createAsyncThunk(
  'services/fetchBookingServices',
  async (bookingId, { getState, rejectWithValue }) => {
    try {

      const response = await api.get(`/bookings/${bookingId}/services`, {
      });

      return { bookingId, services: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking services');
    }
  }
);

export const addServiceToBooking = createAsyncThunk(
  'services/addServiceToBooking',
  async ({ bookingId, serviceId, quantity }, { getState, rejectWithValue }) => {
    try {

      const response = await api.post(
        `/bookings/${bookingId}/services`,
        { serviceId, quantity },
      );

      return { bookingId, serviceData: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service to booking');
    }
  }
);

export const removeServiceFromBooking = createAsyncThunk(
  'services/removeServiceFromBooking',
  async ({ bookingId, bookingServiceId }, { getState, rejectWithValue }) => {
    try {

      await api.delete(`/bookings/${bookingId}/services/${bookingServiceId}`, {
      });

      return { bookingId, bookingServiceId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove service from booking');
    }
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/services/add', serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service');
    }
  }
);

// Services slice
const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearBookingServices: (state) => {
      state.bookingServices = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch booking services
      .addCase(fetchBookingServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingServices.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingServices = action.payload.services;
      })
      .addCase(fetchBookingServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add service to booking
      .addCase(addServiceToBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceToBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addServiceToBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove service from booking
      .addCase(removeServiceFromBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeServiceFromBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingServices = state.bookingServices.filter(
          service => service.booking_service_id !== action.payload.bookingServiceId
        );
      })
      .addCase(removeServiceFromBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add service
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBookingServices, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;