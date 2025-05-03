import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import toast from "react-hot-toast";
const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [servicesMap, setServicesMap] = useState({});
    const [seatsMap, setSeatsMap] = useState({});
    const [paymentsMap, setPaymentsMap] = useState({});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentBooking, setPaymentBooking] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [transactionRef, setTransactionRef] = useState('');
    const [passengersMap, setPassengersMap] = useState({});
    const [showPassengerModal, setShowPassengerModal] = useState(false);
    const [passengerBooking, setPassengerBooking] = useState(null);
    const [newPassengers, setNewPassengers] = useState([{ name: '', age: '', gender: 'M', passport_no: '' }]);
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

                // Fetch services for each booking
                const servicesPromises = response.data.map((booking) =>
                    axios.get(`http://localhost:3000/api/bookings/${booking.booking_id}/services`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                );
                const servicesResults = await Promise.allSettled(servicesPromises);
                const map = {};
                response.data.forEach((booking, idx) => {
                    if (servicesResults[idx].status === 'fulfilled') {
                        map[booking.booking_id] = servicesResults[idx].value.data || [];
                    } else {
                        map[booking.booking_id] = [];
                    }
                });
                setServicesMap(map);

                // Fetch seats for each booking
                const seatsPromises = response.data.map((booking) =>
                    axios.get(`http://localhost:3000/api/bookings/${booking.booking_id}/seats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                );
                const seatsResults = await Promise.allSettled(seatsPromises);
                const seatMap = {};
                response.data.forEach((booking, idx) => {
                    if (seatsResults[idx].status === 'fulfilled') {
                        seatMap[booking.booking_id] = seatsResults[idx].value.data || [];
                    } else {
                        seatMap[booking.booking_id] = [];
                    }
                });
                setSeatsMap(seatMap);

                // Fetch payments for each booking
                const paymentsResponse = await axios.get('http://localhost:3000/api/payments/my', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const payMap = {};
                paymentsResponse.data.forEach((payment) => {
                    payMap[payment.booking_id] = payment;
                });
                setPaymentsMap(payMap);

                // Fetch passengers for each booking
                const passengersPromises = response.data.map((booking) =>
                    axios.get(`http://localhost:3000/api/bookings/${booking.booking_id}/passengers`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                );
                const passengersResults = await Promise.allSettled(passengersPromises);
                const passMap = {};
                response.data.forEach((booking, idx) => {
                    if (passengersResults[idx].status === 'fulfilled') {
                        passMap[booking.booking_id] = passengersResults[idx].value.data || [];
                    } else {
                        passMap[booking.booking_id] = [];
                    }
                });
                setPassengersMap(passMap);
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

    const handleOpenPaymentModal = (booking) => {
        setPaymentBooking(booking);
        setPaymentAmount('');
        setPaymentMethod('Card');
        setTransactionRef('');
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/payments/initiate', {
                bookingId: paymentBooking.booking_id,
                amount: paymentAmount,
                method: paymentMethod,
                transactionRef,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Payment successful!');
            setShowPaymentModal(false);
            setPaymentBooking(null);
            // Refresh payments
            const paymentsResponse = await axios.get('http://localhost:3000/api/payments/my', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const payMap = {};
            paymentsResponse.data.forEach((payment) => {
                payMap[payment.booking_id] = payment;
            });
            setPaymentsMap(payMap);
        } catch (err) {
            toast.error('Payment failed!');
        }
    };

    const handleOpenPassengerModal = (booking) => {
        setPassengerBooking(booking);
        setNewPassengers([{ name: '', age: '', gender: 'M', passport_no: '' }]);
        setShowPassengerModal(true);
    };

    const handleAddPassengerField = () => {
        setNewPassengers([...newPassengers, { name: '', age: '', gender: 'M', passport_no: '' }]);
    };

    const handlePassengerChange = (idx, field, value) => {
        setNewPassengers((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
        );
    };

    const handleAddPassengers = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/bookings/${passengerBooking.booking_id}/passengers`, {
                passengers: newPassengers,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Passengers added!');
            setShowPassengerModal(false);
            // Refresh passengers
            const res = await axios.get(`http://localhost:3000/api/bookings/${passengerBooking.booking_id}/passengers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPassengersMap((prev) => ({ ...prev, [passengerBooking.booking_id]: res.data }));
        } catch (err) {
            toast.error('Failed to add passengers!');
        }
    };

    const handleDeletePassenger = async (passengerId, bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/passengers/${passengerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Passenger deleted!');
            // Refresh passengers
            const res = await axios.get(`http://localhost:3000/api/bookings/${bookingId}/passengers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPassengersMap((prev) => ({ ...prev, [bookingId]: res.data }));
        } catch (err) {
            toast.error('Failed to delete passenger!');
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
                            {seatsMap[booking.booking_id] && seatsMap[booking.booking_id].length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold">Reserved Seats:</p>
                                    <ul className="list-disc ml-6">
                                        {seatsMap[booking.booking_id].map((seat) => (
                                            <li key={seat.seat_id}>{seat.seat_number} ({seat.seat_class})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {servicesMap[booking.booking_id] && servicesMap[booking.booking_id].length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold">Extra Services:</p>
                                    <ul className="list-disc ml-6">
                                        {servicesMap[booking.booking_id].map((service) => (
                                            <li key={service.service_id}>{service.name} (₹{service.price})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-2">
                                <p className="font-semibold">Payment Status:</p>
                                {paymentsMap[booking.booking_id] ? (
                                    <span className={`inline-block px-2 py-1 rounded text-white ${paymentsMap[booking.booking_id].status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {paymentsMap[booking.booking_id].status}
                                    </span>
                                ) : (
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                        onClick={() => handleOpenPaymentModal(booking)}
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                            {passengersMap[booking.booking_id] && (
                                <div className="mt-2">
                                    <p className="font-semibold">Passengers:</p>
                                    <ul className="list-disc ml-6">
                                        {passengersMap[booking.booking_id].map((p) => (
                                            <li key={p.passenger_id} className="flex items-center justify-between">
                                                <span>{p.name} ({p.gender}, {p.age}) {p.passport_no && <>- {p.passport_no}</>}</span>
                                                <button className="ml-2 bg-red-400 text-white px-2 py-1 rounded" onClick={() => handleDeletePassenger(p.passenger_id, booking.booking_id)}>Delete</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleOpenPassengerModal(booking)}>
                                        Add Passenger
                                    </button>
                                </div>
                            )}
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

            {/* Payment Modal */}
            {showPaymentModal && paymentBooking && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Make Payment</h2>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Card">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Netbanking">Netbanking</option>
                                    <option value="Wallet">Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transaction Ref</label>
                                <input
                                    type="text"
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Pay</button>
                            <button type="button" className="btn bg-gray-400 text-white py-2 px-4 rounded ml-2" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Passenger Modal */}
            {showPassengerModal && passengerBooking && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Add Passengers</h2>
                        <form onSubmit={handleAddPassengers} className="space-y-4">
                            {newPassengers.map((p, idx) => (
                                <div key={idx} className="border p-2 rounded mb-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input type="text" value={p.name} onChange={e => handlePassengerChange(idx, 'name', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Age</label>
                                        <input type="number" min="0" value={p.age} onChange={e => handlePassengerChange(idx, 'age', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                                        <select value={p.gender} onChange={e => handlePassengerChange(idx, 'gender', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Passport No</label>
                                        <input type="text" value={p.passport_no} onChange={e => handlePassengerChange(idx, 'passport_no', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="bg-gray-300 px-2 py-1 rounded" onClick={handleAddPassengerField}>Add Another</button>
                            <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Add Passengers</button>
                            <button type="button" className="btn bg-gray-400 text-white py-2 px-4 rounded ml-2" onClick={() => setShowPassengerModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;