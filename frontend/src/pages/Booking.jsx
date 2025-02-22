import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/apiClient";

const Booking = ({ flight }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [seats, setSeats] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await api.post("/api/bookings", {
                flightId: flight.id,
                seats,
            });
    
            alert("Booking successful!");
            navigate("/my-bookings");
        } catch (error) {
            alert("Booking failed. Try again.");
            console.error("Booking error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-bold mb-2">{flight.airline} - {flight.flightNumber}</h2>
                <p>From: {flight.origin} → To: {flight.destination}</p>
                <p>Departure: {flight.departureTime}</p>
                <p>Price: ₹{flight.price} per seat</p>

                <form onSubmit={handleBooking} className="mt-4">
                    <label className="block">Seats:</label>
                    <input
                        type="number"
                        min="1"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                    
                    <button
                        type="submit"
                        className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md w-full"
                        disabled={loading}
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Booking;
