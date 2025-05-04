import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Flights from "./pages/Flights";
import MyBookings from "./pages/MyBookings";
import { useAuth } from "./utils/AuthContext";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import AdminCrew from "./pages/AdminCrew";
import ProtectedRoute from "./components/ProtectedRoute";
import AddService from "./pages/AddService";
const App = () => {
    const { loading, isLoggedIn, isAdmin } = useAuth();

    if (loading) return <></>;

    return (
        <div className="flex flex-col min-h-screen md:h-screen p-4 md:p-8">
            <Router>
                <Navbar />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={isLoggedIn ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Login />} />
                    <Route path="/register" element={isLoggedIn ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Register />} />
                    
                    {/* Home route - accessible to logged in users, admins redirected to admin dashboard */}
                    <Route path="/" element={
                        isLoggedIn ? (
                            isAdmin ? <Navigate to="/admin" /> : <Home />
                        ) : <Register />
                    } />
                    
                    {/* User only routes */}
                    <Route path="/flights" element={
                        <ProtectedRoute requiredRole="user">
                            <Flights />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/my-bookings" element={
                        <ProtectedRoute requiredRole="user">
                            <MyBookings />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin only routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                            <Admin />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/admin/crew" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCrew />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/service" element={
                        <ProtectedRoute requiredRole="admin">
                            <AddService />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </div>
    );
};

export default App;