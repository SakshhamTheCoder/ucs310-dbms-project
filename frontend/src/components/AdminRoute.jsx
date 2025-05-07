import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { token, user } = useSelector(state => state.auth);
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }
  
  // Render child routes if authenticated as admin
  return <Outlet />;
};

export default AdminRoute; 