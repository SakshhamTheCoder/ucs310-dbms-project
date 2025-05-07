import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const Layout = () => {
  const { loading } = useSelector(state => state.auth);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Navbar />
        
        <Container 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            py: 4,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}
            >
              Loading...
            </Box>
          ) : (
            <Outlet />
          )}
        </Container>
        
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 