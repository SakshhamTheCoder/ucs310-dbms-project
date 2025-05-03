import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

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

                // Fetch notifications
                const notifResponse = await axios.get("http://localhost:3000/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(notifResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingNotifications(false);
            }
        };

        fetchData();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === notificationId ? { ...n, is_read: 1 } : n
                )
            );
        } catch (err) {
            // ignore
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Notification Center */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                {loadingNotifications ? (
                    <div>Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-gray-500">No notifications.</div>
                ) : (
                    <ul className="space-y-2">
                        {notifications.map((notif) => (
                            <li key={notif.notification_id} className={`p-3 rounded shadow flex items-center justify-between ${notif.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                <div>
                                    <span className={notif.is_read ? 'text-gray-600' : 'font-semibold text-blue-900'}>{notif.message}</span>
                                    <span className="ml-2 text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</span>
                                </div>
                                {!notif.is_read && (
                                    <button className="ml-4 px-2 py-1 bg-blue-500 text-white rounded" onClick={() => markAsRead(notif.notification_id)}>
                                        Mark as Read
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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