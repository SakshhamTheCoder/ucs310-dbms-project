import React, { useState } from 'react';
import { Modal, Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addFlight } from '../../store/slices/flightSlice';

const AddFlightModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { routes, airlines } = useSelector(state => state.flights); // Access routes and airlines from Redux store

    const [formData, setFormData] = useState({
        routeId: '',
        departureTime: '',
        arrivalTime: '',
        gateNumber: '',
        airlineId: '',
        price: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        // Ensure the times are in MySQL DATETIME format
        const formattedData = {
            ...formData,
            departureTime: formData.departureTime.replace('T', ' ') + ':00',
            arrivalTime: formData.arrivalTime.replace('T', ' ') + ':00',
        };
        dispatch(addFlight(formattedData));
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                <Typography variant="h6" gutterBottom>
                    Add New Flight
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Route</InputLabel>
                    <Select
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleChange}
                    >
                        {routes.map(route => (
                            <MenuItem key={route.route_id} value={route.route_id}>
                                {route.departure_airport} → {route.arrival_airport}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Gate Number"
                    name="gateNumber"
                    value={formData.gateNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Airline</InputLabel>
                    <Select
                        name="airlineId"
                        value={formData.airlineId}
                        onChange={handleChange}
                    >
                        {airlines.map(airline => (
                            <MenuItem key={airline.airline_id} value={airline.airline_id}>
                                {airline.airline_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Flight
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddFlightModal;