import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'primary.main', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} AirBooking - DBMS Project
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link href="https://github.com/ujjwaldalal7" color="inherit" sx={{ mx: 1 }}>
            Ujjwal Dalal
          </Link>
          |
          <Link href="https://github.com/SakshhamTheCoder/" color="inherit" sx={{ mx: 1 }}>
            Sakshham Bhagat
          </Link>
          |
          <Link href="https://github.com/DhruvGoyal404" color="inherit" sx={{ mx: 1 }}>
            Dhruv Goyal
          </Link>
          |
          <Link href="https://github.com/JeevantVerma" color="inherit" sx={{ mx: 1 }}>
            Jeevant Verma
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 
