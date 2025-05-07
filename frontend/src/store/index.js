import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flightReducer from './slices/flightSlice';
import servicesReducer from './slices/servicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightReducer,
    services: servicesReducer,
  },
}); 