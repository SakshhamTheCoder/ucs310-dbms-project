import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPayments } from '../store/slices/paymentsSlice';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const MyPayments = () => {
    const dispatch = useDispatch();
    const { myPayments, loading, error } = useSelector((state) => state.payments);

    useEffect(() => {
        dispatch(fetchMyPayments());
    }, [dispatch]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                My Payments
            </Typography>
            {myPayments.length === 0 ? (
                <Typography>No payments found.</Typography>
            ) : (
                myPayments.map((payment) => (
                    <Paper key={payment.id} sx={{ p: 2, mb: 2 }}>
                        <Typography>Payment ID: {payment.id}</Typography>
                        <Typography>Amount: {payment.amount}</Typography>
                        <Typography>Status: {payment.status}</Typography>
                    </Paper>
                ))
            )}
        </Box>
    );
};

export default MyPayments;