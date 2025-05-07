import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import FlightIcon from '@mui/icons-material/Flight';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: '#f8f9fa'
        }}
      >
        <ErrorOutlineIcon 
          color="error" 
          sx={{ fontSize: 80, mb: 2 }} 
        />
        
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="h6" color="textSecondary" paragraph>
          Oops! It seems like we've hit some turbulence.
        </Typography>
        
        <Typography variant="body1" paragraph>
          The page you're looking for has either been moved, deleted, or never existed.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FlightIcon />}
            onClick={() => navigate('/flights')}
          >
            Browse Flights
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound; 