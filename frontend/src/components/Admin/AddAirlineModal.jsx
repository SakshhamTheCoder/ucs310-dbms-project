import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addAirline } from '../../store/slices/flightSlice';

const AddAirlineModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        airlineName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        dispatch(addAirline(formData));
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                <Typography variant="h6" gutterBottom>
                    Add New Airline
                </Typography>
                <TextField
                    label="Airline Name"
                    name="airlineName"
                    value={formData.airlineName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Airline
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddAirlineModal;