import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/apiClient";
import toast from "react-hot-toast";
import SeatMap from '../components/SeatMap';

const Booking = ({ flight }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [seats, setSeats] = useState(1);
    const [loading, setLoading] = useState(false);
    const [availableServices, setAvailableServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setAvailableServices(response);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    const handleServiceChange = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (Number(seats) !== selectedSeats.length) {
            toast.error(`Please select exactly ${seats} seat(s).`);
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/api/bookings", {
                flightId: flight.id,
                seats,
                services: selectedServices,
                seatIds: selectedSeats,
            });
            toast.success("Booking successfull !");
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
                        onChange={(e) => {
                            setSeats(e.target.value);
                            setSelectedSeats([]); // Reset seat selection if seat count changes
                        }}
                        className="border p-2 rounded-md w-full"
                    />
                    <div className="mt-4">
                        <label className="block font-semibold mb-2">Select Your Seat(s):</label>
                        <SeatMap
                            flightId={flight.id}
                            selectedSeats={selectedSeats}
                            onSelectSeat={setSelectedSeats}
                            maxSelectable={Number(seats) || 1}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block font-semibold mb-2">Add Extra Services:</label>
                        {availableServices.length === 0 ? (
                            <p className="text-gray-500">No extra services available.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {availableServices.map((service) => (
                                    <label key={service.service_id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(service.service_id)}
                                            onChange={() => handleServiceChange(service.service_id)}
                                        />
                                        <span>{service.name} (₹{service.price})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
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
