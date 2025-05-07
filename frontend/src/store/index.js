import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flightReducer from './slices/flightSlice';
import servicesReducer from './slices/servicesSlice';
import adminReducer from './slices/adminSlice';
import notificationsReducer from './slices/notificationsSlice';
import paymentsReducer from './slices/paymentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightReducer,
    services: servicesReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
    payments: paymentsReducer, // Added payments slice
  },
});