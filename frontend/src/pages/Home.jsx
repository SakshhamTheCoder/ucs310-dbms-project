import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState('');
  const [showReadNotifications, setShowReadNotifications] = useState(false); // <-- from Code B

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data.user);

        const bookingsResponse = await axios.get("http://localhost:3000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingsResponse.data);

        const notifResponse = await axios.get("http://localhost:3000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
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

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get("http://localhost:3000/api/reviews/recent");
        setRecentReviews(reviewsResponse.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchData();
    fetchReviews();
  }, []);

  const fetchPassengersForBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/bookings/${bookingId}/passengers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassengers(response.data);
      if (response.data.length > 0) {
        setSelectedPassenger(response.data[0].passenger_id);
      }
    } catch (error) {
      console.error('Error fetching passengers:', error);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    fetchPassengersForBooking(booking.booking_id);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/bookings/${selectedBooking.booking_id}/passengers/${selectedPassenger}/reviews`,
        { rating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewComment('');
      setRating(5);
      setSelectedPassenger('');
      setSelectedBooking(null);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Error submitting review:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Notifications */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <button
            onClick={() => setShowReadNotifications(!showReadNotifications)}
            className={`py-1 px-3 rounded text-sm ${showReadNotifications ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
          >
            {showReadNotifications ? 'Hide Read' : 'Show Read'}
          </button>
        </div>

        {loadingNotifications ? (
          <div>Loading notifications...</div>
        ) : notifications
            .filter(notif => showReadNotifications || !notif.is_read)
            .length === 0 ? (
          <div className="text-gray-500">No notifications.</div>
        ) : (
          <ul className="space-y-2">
            {notifications
              .filter(notif => showReadNotifications || !notif.is_read)
              .map((notif) => (
                <li key={notif.notification_id} className={`p-3 rounded shadow flex items-center justify-between ${notif.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                  <div>
                    <span className={notif.is_read ? 'text-gray-600' : 'font-semibold text-blue-900'}>{notif.message}</span>
                    <span className="ml-2 text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                  {!notif.is_read && (
                    <button
                      className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => markAsRead(notif.notification_id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Welcome Message */}
      <h1 className="text-3xl font-bold mb-4">Welcome, {user ? user.username : "Guest"}!</h1>

      {/* User Info */}
      {user && (
        <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold">Your Details</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>
      )}

      {/* Bookings */}
      <h2 className="text-2xl font-bold mb-2">Your Bookings</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="border p-4 rounded-md shadow-md bg-white">
              <h3 className="text-xl font-semibold">{booking.airline_name} - {booking.flight_id}</h3>
              <p>From: {booking.departure_airport} → To: {booking.arrival_airport}</p>
              <p>Departure: {new Date(booking.departure_time).toLocaleString()}</p>
              <p>Arrival: {new Date(booking.arrival_time).toLocaleString()}</p>
              <button 
                onClick={() => handleOpenReviewModal(booking)}
                className="mt-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Add Review
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Recent Reviews</h2>
        {loadingReviews ? (
          <div>Loading reviews...</div>
        ) : recentReviews.length === 0 ? (
          <div className="text-gray-500">No reviews yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReviews.map((review) => (
              <div key={review.review_id} className="p-4 border rounded shadow bg-white">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{review.passenger_name}</div>
                  <div className="text-yellow-500">{"⭐".repeat(review.rating)}</div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Passenger</label>
                <select 
                  value={selectedPassenger} 
                  onChange={(e) => setSelectedPassenger(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  {passengers.map(p => (
                    <option key={p.passenger_id} value={p.passenger_id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
