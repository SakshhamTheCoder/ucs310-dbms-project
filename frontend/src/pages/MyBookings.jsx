import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import toast from "react-hot-toast";
const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    const handleDeleteBooking = async (bookingId, flightId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted booking from the list
            setBookings(bookings.filter((booking) => booking.booking_id !== bookingId));

            toast.success('Booking deleted successfully!');
        } catch (error) {
            console.error('Delete booking error:', error);
            alert('Failed to delete booking. Try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Your Bookings</h2>

            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="border p-4 rounded-md shadow-md bg-white">
                            <h3 className="text-xl font-semibold">{booking.airline_name} - {booking.flight_id}</h3>
                            <p>From: {booking.departure_airport} → To: {booking.arrival_airport}</p>
                            <p>Departure: {new Date(booking.departure_time).toLocaleString()}</p>
                            <p>Arrival: {new Date(booking.arrival_time).toLocaleString()}</p>
                            <button
                                onClick={() => handleDeleteBooking(booking.booking_id, booking.flight_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Delete Booking
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No bookings found. Book a flight from the 
                    <Link to="/flights" className="text-blue-500"> Flights page</Link>.</p>
            )}
        </div>
    );
};

export default MyBookings;