import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Paper
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const HeroSection = () => (
  <Box
    sx={{
      bgcolor: 'primary.main',
      color: 'white',
      py: 8,
      mb: 6,
      borderRadius: 2,
      backgroundImage: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)',
    }}
  >
    <Container>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Book Your Next Flight Adventure
          </Typography>
          <Typography variant="h6" paragraph>
            Easy booking, great deals, and hassle-free travel experience with our airline booking system.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/flights"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            Browse Flights
          </Button>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box 
            component="img"
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600"
            alt="Airplane"
            sx={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3
            }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const FeatureCard = ({ icon, title, description }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Box sx={{ mb: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Typography>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const FeaturesSection = () => (
  <Container sx={{ py: 6 }}>
    <Typography variant="h4" component="h2" align="center" gutterBottom>
      Why Choose Us
    </Typography>
    <Grid container spacing={4} sx={{ mt: 3 }}>
      <Grid item xs={12} md={4}>
        <FeatureCard 
          icon={<FlightTakeoffIcon sx={{ fontSize: 60 }} />}
          title="Extensive Flight Options"
          description="Browse through hundreds of flights from major airlines to find the perfect one for your journey."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FeatureCard 
          icon={<AirplaneTicketIcon sx={{ fontSize: 60 }} />}
          title="Easy Booking"
          description="Book your flights with just a few clicks. Simple, fast, and secure payment process."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FeatureCard 
          icon={<SupportAgentIcon sx={{ fontSize: 60 }} />}
          title="Additional Services"
          description="Enhance your journey with a variety of add-on services to make your travel more comfortable."
        />
      </Grid>
    </Grid>
  </Container>
);

const Home = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
    </Box>
  );
};

export default Home; 