import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './store/slices/authSlice';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import FlightDetails from './pages/FlightDetails';
import Bookings from './pages/Bookings';
import BookingDetails from './pages/BookingDetails';
import Services from './pages/Services';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="flights" element={<Flights />} />
        <Route path="flights/:id" element={<FlightDetails />} />
        
        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
          <Route path="services" element={<Services />} />
        </Route>
        
        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin/*" element={<AdminDashboard />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
