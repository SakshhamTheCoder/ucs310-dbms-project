import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

// This component will handle role-based route protection
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, isAdmin, loading } = useAuth();
    
    // Show nothing while auth is being checked
    if (loading) {
        return null;
    }
    
    // If not logged in, redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    
    // For admin-only routes
    if (requiredRole === 'admin' && !isAdmin) {
        return <Navigate to="/" />;
    }
    
    // For user-only routes
    if (requiredRole === 'user' && isAdmin) {
        return <Navigate to="/admin" />;
    }
    
    // If all checks pass, render the children
    return children;
};

export default ProtectedRoute; 