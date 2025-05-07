import React, { useState } from 'react';
import { Modal, Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addRoute } from '../../store/slices/flightSlice';

const AddRouteModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { airports } = useSelector(state => state.flights); // Access airports from Redux store

    const [formData, setFormData] = useState({
        departureStationName: '',
        arrivalStationName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        dispatch(addRoute(formData));
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                <Typography variant="h6" gutterBottom>
                    Add New Route
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Departure Station</InputLabel>
                    <Select
                        name="departureStationName"
                        value={formData.departureStationName}
                        onChange={handleChange}
                    >
                        {airports.map(airport => (
                            <MenuItem key={airport.airport_id} value={airport.airport_name}>
                                {airport.airport_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Arrival Station</InputLabel>
                    <Select
                        name="arrivalStationName"
                        value={formData.arrivalStationName}
                        onChange={handleChange}
                    >
                        {airports.map(airport => (
                            <MenuItem key={airport.airport_id} value={airport.airport_name}>
                                {airport.airport_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Route
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddRouteModal;