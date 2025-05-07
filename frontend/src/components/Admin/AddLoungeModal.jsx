import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchLounges, addLounge } from '../../store/slices/adminSlice';

const AddLoungeModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { airports } = useSelector(state => state.flights); // Access airports from Redux store
    const [loungeName, setLoungeName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [airportId, setAirportId] = useState('');

    const handleSubmit = () => {
        dispatch(addLounge({ name: loungeName, capacity, airport_id: airportId }));
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Add New Lounge
                </Typography>
                <TextField
                    fullWidth
                    label="Lounge Name"
                    value={loungeName}
                    onChange={(e) => setLoungeName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Airport</InputLabel>
                    <Select
                        value={airportId}
                        onChange={(e) => setAirportId(e.target.value)}
                    >
                        {airports.map(airport => (
                            <MenuItem key={airport.airport_id} value={airport.airport_id}>
                                {airport.airport_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default AddLoungeModal;