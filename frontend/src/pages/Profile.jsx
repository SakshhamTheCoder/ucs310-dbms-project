import { useSelector } from 'react-redux';
import { Container, Typography, Paper, Box, Avatar } from '@mui/material';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Typography variant="h5" color="error" align="center">
                    You need to log in to view your profile.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                }}
            >
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                    }}
                >
                    {user.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="h4" gutterBottom>
                    {user.username}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Email: {user.email}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Phone: {user.phone || 'Not provided'}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Role: {user.role}
                </Typography>
            </Paper>
        </Container>
    );
};

export default Profile;