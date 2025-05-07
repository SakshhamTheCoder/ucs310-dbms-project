import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addAirport } from '../../store/slices/flightSlice';

const AddAirportModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        airportName: '',
        city: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        dispatch(addAirport(formData));
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                <Typography variant="h6" gutterBottom>
                    Add New Airport
                </Typography>
                <TextField
                    label="Airport Name"
                    name="airportName"
                    value={formData.airportName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Airport
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddAirportModal;