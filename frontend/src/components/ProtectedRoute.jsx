import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token } = useSelector(state => state.auth);
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute; 