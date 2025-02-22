import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]); // To store user's bookings
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch all flights and user's bookings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token being sent:', token); // Debug log

                // Fetch all flights
                const flightsResponse = await axios.get('http://localhost:3000/api/flights', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Fetched Flights:', flightsResponse.data); // Debug log

                // Fetch user's bookings
                const bookingsResponse = await axios.get('http://localhost:3000/api/bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Fetched Bookings:', bookingsResponse.data); // Debug log

                // Set flights and bookings
                setFlights(flightsResponse.data);
                setBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter out flights that the user has already booked
    const availableFlights = flights.filter((flight) => {
        const isBooked = bookings.some((booking) => booking.flight_id === flight.flight_id);
        return !isBooked; // Only include flights that are not booked
    });

    const handleBookNow = async (flightId) => {
        try {
            const token = localStorage.getItem('token');
            const payload = { flightId }; // Ensure this matches the backend expectation
            console.log('Payload:', payload); // Debug log

            const response = await axios.post(
                'http://localhost:3000/api/bookings',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the booked flight from the list
            setFlights((prevFlights) => prevFlights.filter((flight) => flight.flight_id !== flightId));

            alert('Booking successful!');
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed. Try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Available Flights</h1>

            {availableFlights.length === 0 ? (
                <p>No flights available</p>
            ) : (
                <div className="w-full max-w-4xl">
                    {availableFlights.map((flight) => (
                        <div key={flight.flight_id} className="border p-4 mb-4 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold">
                                {flight.departure_airport} → {flight.arrival_airport}
                            </h2>
                            <p className="text-gray-600">
                                Departure: {new Date(flight.departure_time).toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                                Arrival: {new Date(flight.arrival_time).toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                                Airline: {flight.airline_name}
                            </p>
                            <p className="text-gray-600">
                                Terminal: {flight.terminal || 'N/A'}
                            </p>
                            <button
                                onClick={() => handleBookNow(flight.flight_id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Flights;