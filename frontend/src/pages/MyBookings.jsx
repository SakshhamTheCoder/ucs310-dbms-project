import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/apiClient";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [seatsMap, setSeatsMap] = useState({});
  const [paymentsMap, setPaymentsMap] = useState({});
  const [loungeAccessMap, setLoungeAccessMap] = useState({});
  const [passengersMap, setPassengersMap] = useState({});

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [services, setServices] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [transactionRef, setTransactionRef] = useState('');

  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passengerBooking, setPassengerBooking] = useState(null);
  const [newPassengers, setNewPassengers] = useState([
    { name: '', age: '', gender: 'M', passport_no: '' }
  ]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:3000/api/bookings', {
            headers: { Authorization: `Bearer ${token}` }
          });
      
          const rawBookings = response.data;
      
          // Fetch gate info per booking
          const bookingsWithGates = await Promise.all(
            rawBookings.map(async booking => {
              try {
                const gateInfo = await axios.get(`http://localhost:3000/api/flights/${booking.flight_id}/gate`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                return {
                  ...booking,
                  gate: gateInfo.data?.id ? gateInfo.data : null
                };
              } catch (err) {
                return booking; // return booking as-is if gate fetch fails
              }
            })
          );
      
          setBookings(bookingsWithGates);
      
          // Fetch services per booking
          const servicesPromises = bookingsWithGates.map(bk =>
            axios.get(
              `http://localhost:3000/api/bookings/${bk.booking_id}/services`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          const servicesResults = await Promise.allSettled(servicesPromises);
          const svcMap = {};
          bookingsWithGates.forEach((bk, i) => {
            svcMap[bk.booking_id] =
              servicesResults[i].status === 'fulfilled'
                ? servicesResults[i].value.data || []
                : [];
          });
          setServicesMap(svcMap);
      
          // Fetch seats per booking
          const seatsPromises = bookingsWithGates.map(bk =>
            axios.get(
              `http://localhost:3000/api/bookings/${bk.booking_id}/seats`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          const seatsResults = await Promise.allSettled(seatsPromises);
          const stMap = {};
          bookingsWithGates.forEach((bk, i) => {
            stMap[bk.booking_id] =
              seatsResults[i].status === 'fulfilled'
                ? seatsResults[i].value.data || []
                : [];
          });
          setSeatsMap(stMap);
      
          // Fetch payments
          const paymentsResponse = await axios.get('http://localhost:3000/api/payments/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const payMap = {};
          paymentsResponse.data.forEach(pmt => {
            payMap[pmt.booking_id] = pmt;
          });
          setPaymentsMap(payMap);
      
          // Fetch lounge access
          const loungePromises = bookingsWithGates.map(bk =>
            axios.get(
              `http://localhost:3000/api/bookings/${bk.booking_id}/lounges`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          const loungeResults = await Promise.allSettled(loungePromises);
          const lgMap = {};
          bookingsWithGates.forEach((bk, i) => {
            lgMap[bk.booking_id] =
              loungeResults[i].status === 'fulfilled'
                ? loungeResults[i].value.data || []
                : [];
          });
          setLoungeAccessMap(lgMap);
      
          // Fetch passengers
          const passengersPromises = bookingsWithGates.map(bk =>
            axios.get(
              `http://localhost:3000/api/bookings/${bk.booking_id}/passengers`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          const passengersResults = await Promise.allSettled(passengersPromises);
          const psMap = {};
          bookingsWithGates.forEach((bk, i) => {
            psMap[bk.booking_id] =
              passengersResults[i].status === 'fulfilled'
                ? passengersResults[i].value.data || []
                : [];
          });
          setPassengersMap(psMap);
      
        } catch (err) {
          console.error('Error fetching bookings:', err);
          toast?.error?.('Failed to fetch bookings');
        }
      };
      

    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(prev => prev.filter(bk => bk.booking_id !== bookingId));
      toast.success('Booking deleted successfully!');
    } catch {
      toast.error('Failed to delete booking.');
    }
  };

  // Payment handlers
  const handleOpenPaymentModal = (booking) => {
    setPaymentBooking(booking);
    setPaymentAmount(''); setPaymentMethod('Card'); setTransactionRef('');
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
        transactionRef
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Payment successful!');
      setShowPaymentModal(false);
      // refresh payments
      const resp = await axios.get('http://localhost:3000/api/payments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payMap = {};
      resp.data.forEach(pmt => { payMap[pmt.booking_id] = pmt; });
      setPaymentsMap(payMap);
    } catch {
      toast.error('Payment failed!');
    }
  };

  // Passenger handlers
  const handleOpenPassengerModal = (booking) => {
    setPassengerBooking(booking);
    setNewPassengers([{ name: '', age: '', gender: 'M', passport_no: '' }]);
    setShowPassengerModal(true);
  };
  const handleAddPassengerField = () =>
    setNewPassengers(prev => [...prev, { name: '', age: '', gender: 'M', passport_no: '' }]);
  const handlePassengerChange = (idx, field, value) =>
    setNewPassengers(prev => prev.map((p,i) => i===idx ? { ...p, [field]: value } : p));
  const handleAddPassengers = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/bookings/${passengerBooking.booking_id}/passengers`,
        { passengers: newPassengers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Passengers added!');
      setShowPassengerModal(false);
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${passengerBooking.booking_id}/passengers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassengersMap(prev => ({ ...prev, [passengerBooking.booking_id]: res.data }));
    } catch {
      toast.error('Failed to add passengers!');
    }
  };
  const handleDeletePassenger = async (passengerId, bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/passengers/${passengerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Passenger deleted!');
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${bookingId}/passengers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassengersMap(prev => ({ ...prev, [bookingId]: res.data }));
    } catch {
      toast.error('Failed to delete passenger!');
    }
  };

  // Service handlers
  const handleOpenServiceModal = (booking) => {
    setCurrentBooking(booking);
    setSelectedService(null);
    setServiceQuantity(1);
    setShowServiceModal(true);
    axios.get('http://localhost:3000/api/services', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => setServices(r.data))
    .catch(() => toast.error('Failed to fetch services'));
  };

    // Update the handleAddService function
    const handleAddService = async () => {
        if (!selectedService || !serviceQuantity) {
          toast.error('Please select a service and quantity');
          return;
        }
      
        try {
          // Make sure we're using the API client for consistent headers
          const response = await api.post(
            `/bookings/${currentBooking.booking_id}/services`, 
            { 
              serviceId: selectedService.service_id,
              quantity: parseInt(serviceQuantity, 10)
            }
          );
      
          toast.success('Service added successfully');
          setShowServiceModal(false);
      
          // Refresh services for this booking
          const updatedServices = await api.get(`/bookings/${currentBooking.booking_id}/services`);
          setServicesMap(prev => ({ ...prev, [currentBooking.booking_id]: updatedServices }));
          
          // Also refresh available services as quantities may have changed
          const allServices = await api.get('/services');
          setServices(allServices);
        } catch (error) {
          console.error('Add service error:', error);
          toast.error(error.response?.data?.message || 'Failed to add service');
        }
      };

    // Update the handleRemoveService function
    const handleRemoveService = async (bookingId, serviceId) => {
    try {
        await api.delete(`/bookings/${bookingId}/services/${serviceId}`);
        toast.success('Service removed');
        
        // Refresh services for this booking
        const updatedServices = await api.get(`/bookings/${bookingId}/services`);
        setServicesMap(prev => ({ ...prev, [bookingId]: updatedServices }));
        
        // Also refresh available services as quantities may have been adjusted
        const allServices = await api.get('/services');
        setServices(allServices);
    } catch (error) {
        toast.error('Failed to remove service');
    }
    };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Your Bookings</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(booking => (
            <div key={booking.booking_id} className="border p-4 rounded-md shadow-md bg-white">
              <h3 className="text-xl font-semibold">
                {booking.airline_name} - {booking.flight_id}
              </h3>
              <p>From: {booking.departure_airport} → To: {booking.arrival_airport}</p>
              <p>Departure: {new Date(booking.departure_time).toLocaleString()}</p>
              <p>Arrival: {new Date(booking.arrival_time).toLocaleString()}</p>

              {/* Seats */}
              {seatsMap[booking.booking_id]?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Reserved Seats:</p>
                  <ul className="list-disc ml-6">
                    {seatsMap[booking.booking_id].map(seat => (
                      <li key={seat.seat_id}>
                        {seat.seat_number} ({seat.seat_class})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Services */}
              {servicesMap[booking.booking_id]?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Extra Services:</p>
                  <ul className="list-disc ml-6">
                    {servicesMap[booking.booking_id].map(svc => (
                      <li key={svc.service_id} className="flex justify-between items-center">
                        <span>
                          {svc.name} (₹{svc.price}) x{svc.quantity}
                        </span>
                        <button
                          onClick={() => handleRemoveService(booking.booking_id, svc.service_id)}
                          className="bg-red-400 text-white px-2 py-1 rounded ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleOpenServiceModal(booking)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Add Service
                  </button>
                </div>
              )}
              {!servicesMap[booking.booking_id]?.length && (
                <div className="mt-2">
                  <button
                    onClick={() => handleOpenServiceModal(booking)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Service
                  </button>
                </div>
              )}

              {/* Gate Information */}
              {booking.gate && (
                <div className="mt-2">
                  <p className="font-semibold">Assigned Gate:</p>
                  <p>{booking.gate.terminal} - {booking.gate.gate_number}</p>
                </div>
              )}

              {/* Payment Status */}
              <div className="mt-2">
                <p className="font-semibold">Payment Status:</p>
                {paymentsMap[booking.booking_id] ? (
                  <span
                    className={`inline-block px-2 py-1 rounded text-white ${
                      paymentsMap[booking.booking_id].status === 'Completed'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {paymentsMap[booking.booking_id].status}
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenPaymentModal(booking)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Pay Now
                  </button>
                )}
              </div>

              {/* Lounge Access */}
              {loungeAccessMap[booking.booking_id]?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Lounge Access:</p>
                  <ul className="list-disc ml-6">
                    {loungeAccessMap[booking.booking_id].map(access => (
                      <li key={access.access_id}>
                        {access.name} ({access.location}) - {' '}
                        {new Date(access.access_time).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Passengers */}
              {passengersMap[booking.booking_id] && (
                <div className="mt-2">
                  <p className="font-semibold">Passengers:</p>
                  <ul className="list-disc ml-6">
                    {passengersMap[booking.booking_id].map(p => (
                      <li key={p.passenger_id} className="flex items-center justify-between">
                        <span>
                          {p.name} ({p.gender}, {p.age}){' '}
                          {p.passport_no && `- ${p.passport_no}`}
                        </span>
                        <button
                          onClick={() => handleDeletePassenger(p.passenger_id, booking.booking_id)}
                          className="ml-2 bg-red-400 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleOpenPassengerModal(booking)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Passenger
                  </button>
                </div>
              )}

              <button
                onClick={() => handleDeleteBooking(booking.booking_id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>
          No bookings found. Book a flight from the{' '}
          <Link to="/flights" className="text-blue-500">
            Flights page
          </Link>.
        </p>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Make Payment</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                min="1"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />

              <label className="block text-sm font-medium text-gray-700">
                Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              >
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Netbanking">Netbanking</option>
                <option value="Wallet">Wallet</option>
              </select>

              <label className="block text-sm font-medium text-gray-700">
                Transaction Ref
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Pay
                </button>
              </div>
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
            <div key={idx} className="border p-2 rounded mb-2 relative">
                {/* Delete button for each passenger (except the first one) */}
                {idx > 0 && (
                <button
                    type="button"
                    onClick={() => setNewPassengers(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-red-500 bg-transparent border-none"
                >
                    ✕
                </button>
                )}

                <label className="block text-sm font-medium text-gray-700">
                Name
                </label>
                <input
                type="text"
                value={p.name}
                onChange={e => handlePassengerChange(idx, 'name', e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                />

                <label className="block text-sm font-medium text-gray-700">
                Age
                </label>
                <input
                type="number"
                min="0"
                value={p.age}
                onChange={e => handlePassengerChange(idx, 'age', e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                />

                <label className="block text-sm font-medium text-gray-700">
                Gender
                </label>
                <select
                value={p.gender}
                onChange={e => handlePassengerChange(idx, 'gender', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
                </select>

                <label className="block text-sm font-medium text-gray-700">
                Passport No
                </label>
                <input
                type="text"
                value={p.passport_no}
                onChange={e => handlePassengerChange(idx, 'passport_no', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
            </div>
            ))}

            <div className="flex justify-between">
            <button
                type="button"
                className="bg-gray-300 px-2 py-1 rounded"
                onClick={handleAddPassengerField}
            >
                Add Another
            </button>
            <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowPassengerModal(false)}
            >
                Cancel
            </button>
            </div>

            <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
            Add Passengers
            </button>
        </form>
        </div>
    </div>
    )}


      {/* Add Service Modal */}
      {showServiceModal && currentBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add Service</h2>
            <div className="space-y-4">
              <select
                onChange={e =>
                  setSelectedService(
                    services.find(s => s.service_id == e.target.value)
                  )
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Service</option>
                {services.map(service => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name} (₹{service.price}) - Available: {service.available_quantity}
                  </option>
                ))}
              </select>

              {selectedService && (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedService.available_quantity}
                    value={serviceQuantity}
                    onChange={e => setServiceQuantity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={handleAddService}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Add Service
                  </button>
                </>
              )}

              <button
                onClick={() => setShowServiceModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
