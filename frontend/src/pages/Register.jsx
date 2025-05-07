import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AlertMessage from '../components/UI/AlertMessage';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    passport: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };
  
  const handleCloseAlert = () => {
    dispatch(clearError());
  };
  
  if (loading) return <LoadingSpinner message="Creating your account..." />;
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mt: 4,
          mb: 4
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                helperText="Password must be at least 8 characters long"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number (Optional)"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="passport"
                label="Passport Number (Optional)"
                id="passport"
                value={formData.passport}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <AlertMessage
        open={!!error}
        message={error || ''}
        severity="error"
        onClose={handleCloseAlert}
      />
    </Container>
  );
};

export default Register; 