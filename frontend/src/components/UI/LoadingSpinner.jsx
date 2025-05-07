import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        minHeight: '200px'
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner; 