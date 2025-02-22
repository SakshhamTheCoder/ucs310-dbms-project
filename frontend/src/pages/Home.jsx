import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');

                // Fetch user info using /api/auth/me (GET request)
                const userResponse = await axios.get("http://localhost:3000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
                    },
                });
                setUser(userResponse.data.user); // Access the user object from the response

                // Fetch user bookings
                const bookingsResponse = await axios.get("http://localhost:3000/api/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
                    },
                });
                setBookings(bookingsResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user ? user.username : "Guest"}!</h1>

            {/* User Info Section */}
            {user && (
                <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
                    <h2 className="text-xl font-semibold">Your Details</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
            )}

            {/* User Bookings Section */}
            <h2 className="text-2xl font-bold mb-2">Your Bookings</h2>
            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="border p-4 rounded-md shadow-md bg-white">
                            <h3 className="text-xl font-semibold">{booking.airline_name} - {booking.flight_id}</h3>
                            <p>From: {booking.departure_airport} → To: {booking.arrival_airport}</p>
                            <p>Departure: {new Date(booking.departure_time).toLocaleString()}</p>
                            <p>Arrival: {new Date(booking.arrival_time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>
                    No bookings found. 
                    {/* Book a flight from the <a href="/flights" className="text-blue-500">Flights page</a>. */}
                </p>
            )}
        </div>
    );
};

export default Home;