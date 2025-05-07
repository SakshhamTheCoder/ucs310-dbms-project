import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMyNotifications,
    markNotificationAsRead,
    fetchAllNotifications,
    createNotification,
    deleteNotification
} from '../store/slices/notificationsSlice';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@mui/material';

const Notifications = ({ isAdmin }) => {
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector(state => state.notifications);

    const [newNotification, setNewNotification] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchAllNotifications());
        } else {
            dispatch(fetchMyNotifications());
        }
    }, [dispatch, isAdmin]);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleDeleteNotification = (id) => {
        dispatch(deleteNotification(id));
    };

    const handleCreateNotification = () => {
        dispatch(createNotification({ message: newNotification }))
            .unwrap()
            .then(() => {
                setNewNotification('');
                setDialogOpen(false);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {isAdmin ? 'All Notifications' : 'My Notifications'}
            </Typography>

            {isAdmin && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDialogOpen(true)}
                >
                    Create Notification
                </Button>
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {notifications.map(notification => (
                    <Grid item xs={12} key={notification.id}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{notification.message}</Typography>
                            <Box>
                                {!notification.read && !isAdmin && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Mark as Read
                                    </Button>
                                )}
                                {isAdmin && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteNotification(notification.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the message for the new notification.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Notification Message"
                        fullWidth
                        value={newNotification}
                        onChange={(e) => setNewNotification(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateNotification} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Notifications;