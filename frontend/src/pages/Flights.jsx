import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]); // To store user's bookings
    const { user } = useAuth();
    const navigate = useNavigate();
    const [crewMap, setCrewMap] = useState({});

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

                // Fetch crew for each flight
                const crewPromises = flightsResponse.data.map((flight) =>
                    axios.get(`http://localhost:3000/api/flights/${flight.flight_id}/crew`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                );
                const crewResults = await Promise.allSettled(crewPromises);
                const map = {};
                flightsResponse.data.forEach((flight, idx) => {
                    if (crewResults[idx].status === 'fulfilled') {
                        map[flight.flight_id] = crewResults[idx].value.data || [];
                    } else {
                        map[flight.flight_id] = [];
                    }
                });
                setCrewMap(map);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter out flights that the user has already booked
    const availableFlights = flights.filter((flight) => {
        const isBooked = bookings.some((booking) => booking.flight_id === flight.flight_id);
        const departureTime = new Date(flight.departure_time); // Convert to Date object
        const currentTime = new Date(); // Get current time
        const fourHoursLater = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
    
        return !isBooked && departureTime > fourHoursLater; // Only include future flights
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

            toast.success('Booking successfull !');
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
                            {crewMap[flight.flight_id] && crewMap[flight.flight_id].length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold">Assigned Crew:</p>
                                    <ul className="list-disc ml-6">
                                        {crewMap[flight.flight_id].map((c) => (
                                            <li key={c.crew_id}>{c.name} ({c.assigned_role})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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

export default Flights
