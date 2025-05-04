import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [showAddFlightModal, setShowAddFlightModal] = useState(false);
    const [showAddAirportModal, setShowAddAirportModal] = useState(false);
    const [showAddAirlineModal, setShowAddAirlineModal] = useState(false);
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [flights, setFlights] = useState([]);
    const [showAddCrewModal, setShowAddCrewModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [notifUserId, setNotifUserId] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [gates, setGates] = useState([]);
    const [loungeAccess, setLoungeAccess] = useState([]);
    const [showAssignLoungeModal, setShowAssignLoungeModal] = useState(false);
    const [assignBookingId, setAssignBookingId] = useState('');
    const [selectedLoungeId, setSelectedLoungeId] = useState('');
    const [crew, setCrew] = useState([]);
    const [bookingUser, setBookingUser] = useState(null);
    const [lounges, setLounges] = useState([]);
    const [loadingGates, setLoadingGates] = useState(false);
    const [loadingLounges, setLoadingLounges] = useState(false);
    const [showAddLoungeModal, setShowAddLoungeModal] = useState(false);
    const [gateTerminal, setGateTerminal] = useState('');
    const [gateNumber, setGateNumber] = useState('');
    const [loungeName, setLoungeName] = useState('');
    const [loungeLocation, setLoungeLocation] = useState('');
    const [loungeCapacity, setLoungeCapacity] = useState('');
    const [flightCrewMap, setFlightCrewMap] = useState({});
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [assignCrewModal, setAssignCrewModal] = useState(false);
    const [assignCrewId, setAssignCrewId] = useState('');
    const [assignRole, setAssignRole] = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [userBookings, setUserBookings] = useState([]);
    const [showAddGateModal, setShowAddGateModal] = useState(false);
    const [showAssignGateModal, setShowAssignGateModal] = useState(false);
    const [selectedFlightForGate, setSelectedFlightForGate] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [serviceOrders, setServiceOrders] = useState([]);
    const [loadingServiceOrders, setLoadingServiceOrders] = useState(false);
    const [showReadNotifications, setShowReadNotifications] = useState(false);

    // Flight Management
    const handleAddFlight = async () => {
        try {
            const [responseAirports, responseAirlines] = await Promise.all([
                api.get('/airports'),
                api.get('/airlines')
            ]);
            setAirports(responseAirports);
            setAirlines(responseAirlines);
            setShowAddFlightModal(true);
        } catch (error) {
            toast.error('Error fetching data');
        }
    };

    const handleFlightSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/flights/add', {
                departureStation: event.target.departureStation.value,
                arrivalStation: event.target.arrivalStation.value,
                airlineId: event.target.airlineId.value,
                departureTime: event.target.departureTime.value,
                arrivalTime: event.target.arrivalTime.value,
                terminal: event.target.terminal.value,
                price: event.target.price.value,
            });
            if (response.flight_id) {
                toast.success('Flight Added successfully');
                handleCloseModal();
                fetchFlights();
            }
        } catch (error) {
            toast.error('Error adding flight');
        }
    };

    // Airport Management
    const handleAddAirport = () => setShowAddAirportModal(true);

    const handleAirportSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/airports/add', {
                airportName: event.target.airportName.value,
                city: event.target.city.value,
            });
            if (response.airport_id) {
                toast.success('Airport added');
                handleCloseModal();
            }
        } catch (error) {
            toast.error('Error adding airport');
        }
    };

    // Airline Management
    const handleAddAirline = () => setShowAddAirlineModal(true);

    const handleAirlineSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/airlines/add', {
                airlineName: event.target.airlineName.value,
            });
            if (response.airline_id) {
                toast.success('Airline added');
                handleCloseModal();
            }
        } catch (error) {
            toast.error('Error adding airline');
        }
    };

    // Crew Management
    const handleAddCrew = () => setShowAddCrewModal(true);

    const handleCrewSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/crew', {
                name: event.target.name.value,
                role: event.target.role.value,
                license_no: event.target.license_no.value,
                contact: event.target.contact.value,
                hired_date: event.target.hired_date.value,
                status: event.target.status.value,
            });
            if (response.crew_id) {
                toast.success('Crew member added');
                handleCloseModal();
                fetchCrew();
            }
        } catch (error) {
            toast.error('Failed to add crew member');
        }
    };

    // Service Management
    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response);
        } catch (error) {
            toast.error('Error fetching services');
        }
    };

    const fetchServiceOrders = async () => {
        setLoadingServiceOrders(true);
        try {
            const response = await api.get('/service-orders/all');
            setServiceOrders(response);
        } catch (error) {
            toast.error('Failed to fetch service orders');
        } finally {
            setLoadingServiceOrders(false);
        }
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            // This will need to be implemented in the backend - a summary of all reviews
            const response = await api.get('/reviews/all');
            setReviews(response);
        } catch (error) {
            toast.error('Failed to fetch reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    // Add this function to delete reviews
    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const handleAddService = async (serviceId) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/bookings/${booking.booking_id}/services`, {
                service_id: serviceId,
                quantity: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh services
            const res = await api.get(`/bookings/${booking.booking_id}/services`);
            setServicesMap(prev => ({ ...prev, [booking.booking_id]: res.data }));
            toast.success('Service added');
        } catch (error) {
            toast.error('Failed to add service');
        }
    };

    const handleRemoveService = async (serviceId) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/bookings/${booking.booking_id}/services/${serviceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh services
            const res = await api.get(`/bookings/${booking.booking_id}/services`);
            setServicesMap(prev => ({ ...prev, [booking.booking_id]: res.data }));
            toast.success('Service removed');
        } catch (error) {
            toast.error('Failed to remove service');
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setShowEditServiceModal(true);
    };

    const handleDeleteService = async (serviceId) => {
        try {
            await api.delete(`/services/${serviceId}`);
            toast.success('Service deleted');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const handleServiceSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/services', {
                name: event.target.name.value,
                description: event.target.description.value,
                price: event.target.price.value,
                available_quantity: event.target.available_quantity.value,
            });
            if (response.service_id) {
                toast.success('Service added');
                setShowAddServiceModal(false);
                fetchServices();
            }
        } catch (error) {
            toast.error('Failed to add service');
        }
    };

    const handleServiceEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.patch(`/services/${editingService.service_id}`, {
                name: event.target.name.value,
                description: event.target.description.value,
                price: event.target.price.value,
                available_quantity: event.target.available_quantity.value,
            });
            toast.success('Service updated');
            setShowEditServiceModal(false);
            setEditingService(null);
            fetchServices();
        } catch (error) {
            toast.error('Failed to update service');
        }
    };

    // Payment Management
    const fetchPayments = async () => {
        setLoadingPayments(true);
        try {
            const response = await api.get('/payments/all');
            setPayments(response);
        } catch (error) {
            toast.error('Failed to fetch payments');
        } finally {
            setLoadingPayments(false);
        }
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            await api.patch(`/payments/${paymentId}/status`, { status: newStatus });
            toast.success('Payment status updated');
            fetchPayments();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Notification Management
    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        try {
            const response = await api.get('/notifications/all');
            setNotifications(response);
        } catch (error) {
            toast.error('Failed to fetch notifications');
        } finally {
            setLoadingNotifications(false);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notifications', {
                userId: notifUserId,
                message: notifMessage
            });
            toast.success('Notification sent');
            setShowNotifModal(false);
            setNotifUserId('');
            setNotifMessage('');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to send notification');
        }
    };

    const handleDeleteNotification = async (notifId) => {
        try {
            await api.delete(`/notifications/${notifId}`);
            toast.success('Notification deleted');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    // Lounge Management
    const fetchLounges = async () => {
        setLoadingLounges(true);
        try {
            const response = await api.get('/lounges');
            setLounges(response);
        } catch (error) {
            toast.error('Failed to fetch lounges');
        } finally {
            setLoadingLounges(false);
        }
    };

    const fetchLoungeAccess = async () => {
        try {
            const response = await api.get('/lounge-access/all');
            setLoungeAccess(response);
        } catch (error) {
            toast.error('Failed to fetch lounge accesses');
        }
    };

    const handleAddLounge = async (e) => {
        e.preventDefault();
        try {
            await api.post('/lounges', {
                name: loungeName,
                location: loungeLocation,
                capacity: loungeCapacity
            });
            toast.success('Lounge added successfully');
            setShowAddLoungeModal(false);
            fetchLounges();
        } catch (error) {
            toast.error('Failed to add lounge');
        }
    };

    const handleAssignLounge = async (e) => {
        e.preventDefault();
        try {
            if (!assignBookingId || !selectedLoungeId) {
                throw new Error('Please select both booking and lounge');
            }

            const response = await api.post(`/bookings/${assignBookingId}/lounges`, {
                lounge_id: selectedLoungeId
            });

            if (response.access_id) {
                toast.success('Lounge access assigned successfully');
                setShowAssignLoungeModal(false);
                fetchLoungeAccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign lounge access');
        }
    };

    const handleDeleteLoungeAccess = async (accessId, bookingId) => {
        try {
            await api.delete(`/bookings/${bookingId}/lounges/${accessId}`);
            toast.success('Access revoked');
            fetchLoungeAccess();
        } catch (error) {
            toast.error('Failed to revoke access');
        }
    };

    // Gate Management
    const fetchGates = async () => {
        setLoadingGates(true);
        try {
            const response = await api.get('/gates');
            setGates(response);
        } catch (error) {
            toast.error('Failed to fetch gates');
        } finally {
            setLoadingGates(false);
        }
    };

    const handleAddGate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/gates', {
                terminal: gateTerminal,
                gate_number: gateNumber
            });
            toast.success('Gate added');
            setShowAddGateModal(false);
            setGateTerminal('');
            setGateNumber('');
            fetchGates();
        } catch (error) {
            toast.error('Failed to add gate');
        }
    };

    // Flight Operations
    const fetchFlights = async () => {
        try {
            const response = await api.get('/flights');

            // Fetch gate information for each flight
            const flightsWithGates = await Promise.all(
                response.map(async flight => {
                    try {
                        const gateInfo = await api.get(`/flights/${flight.flight_id}/gate`);
                        return { ...flight, gate: gateInfo.id ? gateInfo : null };
                    } catch (err) {
                        return flight;
                    }
                })
            );

            setFlights(flightsWithGates);
        } catch (error) {
            toast.error('Failed to fetch flights');
        }
    };

    const fetchFlightCrew = async (flightId) => {
        try {
            const response = await api.get(`/flights/${flightId}/crew`);
            setFlightCrewMap(prev => ({ ...prev, [flightId]: response }));
        } catch (error) {
            setFlightCrewMap(prev => ({ ...prev, [flightId]: [] }));
        }
    };

    const handleOpenAssignCrewModal = (flightId) => {
        setSelectedFlight(flightId);
        setAssignCrewId('');
        setAssignRole('');
        setAssignCrewModal(true);
    };

    // Update handleAssignCrew function
    const handleAssignCrew = async (e) => {
        e.preventDefault();
        try {
            const crewMember = crew.find(c => c.crew_id === Number(assignCrewId));

            if (!crewMember) throw new Error('Crew member not found');

            // Prevent retired crew from being selected
            if (crewMember.status === 'Retired') {
                throw new Error('Cannot assign retired crew member');
            }

            // Check if crew member already assigned to this flight with the same role
            const existingAssignments = flightCrewMap[selectedFlight] || [];
            if (existingAssignments.some(
                assignment => assignment.crew_id === Number(assignCrewId) &&
                    assignment.assigned_role === assignRole
            )) {
                throw new Error(`${crewMember.name} is already assigned as ${assignRole} on this flight`);
            }

            // Handle on-leave crew logic
            if (crewMember.status === 'OnLeave') {
                const flight = flights.find(f => f.flight_id === selectedFlight);
                if (!flight) throw new Error('Flight not found');

                const departureTime = new Date(flight.departure_time);
                const hoursToDeparture = (departureTime - new Date()) / (1000 * 60 * 60);

                if (hoursToDeparture > 24) {
                    throw new Error('Crew is on leave and flight is more than 24 hours away');
                }
            }

            await api.post(`/flights/${selectedFlight}/crew`, {
                crew_id: assignCrewId,
                assigned_role: assignRole,
            });

            toast.success('Crew assigned successfully');
            setAssignCrewModal(false);
            fetchFlightCrew(selectedFlight);
        } catch (error) {
            toast.error(error.message || 'Failed to assign crew');
        }
    };


    // Gate Assignment
    const handleAssignGate = (flightId) => {
        setSelectedFlightForGate(flightId);
        setShowAssignGateModal(true);
    };

    const handleGateAssignment = async (gateId) => {
        try {
            // Don't update gate status directly - let the backend handle it
            // as part of the transaction

            // Assign gate to flight
            await api.post(`/flights/${selectedFlightForGate}/gate`, { gate_id: gateId });

            toast.success('Gate assigned successfully');
            fetchFlights();
            fetchGates(); // Refresh gates list
            setShowAssignGateModal(false);
        } catch (error) {
            console.error('Gate assignment error:', error);
            toast.error(error.response?.data?.message || 'Failed to assign gate');
        }
    };

    // User Bookings
    const fetchUserBookings = async () => {
        try {
            // The endpoint should be /bookings/search, not /flights/bookings/search
            const response = await api.get(`/bookings/search?username=${searchUsername}`);
            setUserBookings(response);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error(error.response?.data?.message || 'Error fetching bookings');
            setUserBookings([]);
        }
    };

    // General Functions
    const handleCloseModal = () => {
        setShowAddFlightModal(false);
        setShowAddAirportModal(false);
        setShowAddAirlineModal(false);
        setShowAddCrewModal(false);
        setShowAddServiceModal(false);
        setShowEditServiceModal(false);
        setShowAddLoungeModal(false);
        setShowAssignLoungeModal(false);
        setShowAddGateModal(false);
    };

    // Add this function before the useEffect (around line 472)
    const fetchCrew = async () => {
        try {
            const response = await api.get('/crew');
            setCrew(response);
        } catch (error) {
            toast.error('Failed to fetch crew members');
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchNotifications();
        fetchLounges();
        fetchFlights();
        fetchLoungeAccess();
        fetchCrew();
        fetchGates();
        fetchReviews();
        fetchServiceOrders();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={handleAddFlight}>
                    Add Flight
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={handleAddAirport}>
                    Add Airport
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={handleAddAirline}>
                    Add Airline
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => setShowAddCrewModal(true)}>
                    Add Crew Member
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => navigate('/admin/crew')}>
                    Manage Crew
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => setShowAddLoungeModal(true)}>
                    Add Lounge
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => setShowAssignLoungeModal(true)}>
                    Assign Lounge Access
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => setShowAddGateModal(true)}>
                    Add New Gate
                </button>
                <button className="btn bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700" onClick={() => navigate('/admin/service')}>
                    Manage Services
                </button>
            </div>

            {/* Flight Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Flight List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Flight ID</th>
                                <th className="py-2 px-4 border">Route</th>
                                <th className="py-2 px-4 border">Assigned Crew</th>
                                <th className="py-2 px-4 border">Gate</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight) => (
                                <tr key={flight.flight_id}>
                                    <td className="py-2 px-4 border">{flight.flight_id}</td>
                                    <td className="py-2 px-4 border">
                                        {flight.departure_airport} → {flight.arrival_airport}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            className={`${flightCrewMap[flight.flight_id]?.length > 0
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                                } px-2 py-1 rounded`}
                                            onClick={() => fetchFlightCrew(flight.flight_id)}
                                        >
                                            View Crew
                                        </button>
                                        {flightCrewMap[flight.flight_id]?.map((c) => (
                                            <div key={c.crew_id} className="text-sm">
                                                {c.name} ({c.assigned_role})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleAssignGate(flight.flight_id)}>
                                            Assign Gate
                                        </button>
                                        {flight.gate && (
                                            <div className="mt-1 text-sm">
                                                {flight.gate.terminal} - {flight.gate.gate_number}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() => handleOpenAssignCrewModal(flight.flight_id)}>
                                            Assign Crew
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Payment Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Payment Management</h2>
                {loadingPayments ? (
                    <div>Loading payments...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Payment ID</th>
                                    <th className="py-2 px-4 border">Booking ID</th>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Amount</th>
                                    <th className="py-2 px-4 border">Method</th>
                                    <th className="py-2 px-4 border">Status</th>
                                    <th className="py-2 px-4 border">Date</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.payment_id}>
                                        <td className="py-2 px-4 border">{payment.payment_id}</td>
                                        <td className="py-2 px-4 border">{payment.booking_id}</td>
                                        <td className="py-2 px-4 border">{payment.username}</td>
                                        <td className="py-2 px-4 border">₹{payment.amount}</td>
                                        <td className="py-2 px-4 border">{payment.method}</td>
                                        <td className="py-2 px-4 border">{payment.status}</td>
                                        <td className="py-2 px-4 border">
                                            {new Date(payment.payment_date).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <select value={payment.status}
                                                onChange={(e) => handleStatusChange(payment.payment_id, e.target.value)}
                                                className="border rounded px-2 py-1">
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Refunded">Refunded</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Notifications Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Notifications Management</h2>
                <div className="flex space-x-2 mb-4">
                    <button className="btn bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => setShowNotifModal(true)}>
                        Send Notification
                    </button>
                    <button className={`btn py-2 px-4 rounded ${showReadNotifications ? 'bg-gray-500' : 'bg-gray-300'}`}
                        onClick={() => setShowReadNotifications(!showReadNotifications)}>
                        {showReadNotifications ? 'Hide Read' : 'Show Read'}
                    </button>
                </div>
                {loadingNotifications ? (
                    <div>Loading notifications...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Message</th>
                                    <th className="py-2 px-4 border">Read</th>
                                    <th className="py-2 px-4 border">Date</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications
                                    .filter(notif => showReadNotifications || !notif.is_read)
                                    .map((notif) => (
                                        <tr key={notif.notification_id} className={notif.is_read ? 'bg-gray-50' : ''}>
                                            <td className="py-2 px-4 border">{notif.notification_id}</td>
                                            <td className="py-2 px-4 border">{notif.username} (ID: {notif.user_id})</td>
                                            <td className="py-2 px-4 border">{notif.message}</td>
                                            <td className="py-2 px-4 border">{notif.is_read ? 'Yes' : 'No'}</td>
                                            <td className="py-2 px-4 border">{new Date(notif.created_at).toLocaleString()}</td>
                                            <td className="py-2 px-4 border">
                                                <button className="bg-red-500 text-white px-2 py-1 rounded"
                                                    onClick={() => handleDeleteNotification(notif.notification_id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Gate Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Gate Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Terminal</th>
                                <th className="py-2 px-4 border">Gate Number</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gates.map(gate => (
                                <tr key={gate.gate_id}>
                                    <td className="py-2 px-4 border">{gate.terminal}</td>
                                    <td className="py-2 px-4 border">{gate.gate_number}</td>
                                    <td className="py-2 px-4 border">
                                        <select
                                            value={gate.status}
                                            onChange={async (e) => {
                                                try {
                                                    await api.patch(`/gates/${gate.gate_id}`, { status: e.target.value });
                                                    fetchGates();
                                                } catch (error) {
                                                    console.error('Update gate status error:', error);
                                                    toast.error(error.response?.data?.message || 'Failed to update gate status');
                                                }
                                            }}
                                            className="border rounded px-2 py-1">
                                            <option value="Open">Open</option>
                                            <option value="Occupied">Occupied</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this gate?')) {
                                                    await api.delete(`/gates/${gate.gate_id}`);
                                                    fetchGates();
                                                }
                                            }}
                                            className="bg-red-500 text-white px-2 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lounges Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Lounges</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Location</th>
                                <th className="py-2 px-4 border">Capacity</th>
                                <th className="py-2 px-4 border">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lounges.map(lounge => (
                                <tr key={lounge.lounge_id}>
                                    <td className="py-2 px-4 border">{lounge.name}</td>
                                    <td className="py-2 px-4 border">{lounge.location}</td>
                                    <td className="py-2 px-4 border">{lounge.capacity}</td>
                                    <td className="py-2 px-4 border">
                                        {new Date(lounge.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lounge Access Management */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Lounge Access</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Access ID</th>
                                <th className="py-2 px-4 border">Booking ID</th>
                                <th className="py-2 px-4 border">Lounge</th>
                                <th className="py-2 px-4 border">Access Time</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loungeAccess.map(access => (
                                <tr key={access.access_id}>
                                    <td className="py-2 px-4 border">{access.access_id}</td>
                                    <td className="py-2 px-4 border">{access.booking_id}</td>
                                    <td className="py-2 px-4 border">{access.name}</td>
                                    <td className="py-2 px-4 border">
                                        {new Date(access.access_time).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleDeleteLoungeAccess(access.access_id, access.booking_id)}>
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals Section */}
            {/* Add Flight Modal */}
            <Modal show={showAddFlightModal} onClose={handleCloseModal}>
                <h2 className="text-xl font-bold mb-4">Add Flight</h2>
                <form onSubmit={handleFlightSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departure Station</label>
                        <select name="departureStation" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Departure Station</option>
                            {airports && airports.map((airport) => (
                                <option key={airport.airport_id} value={airport.airport_id}>
                                    {airport.airport_name} ({airport.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Arrival Station</label>
                        <select name="arrivalStation" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Arrival Station</option>
                            {airports && airports.map((airport) => (
                                <option key={airport.airport_id} value={airport.airport_id}>
                                    {airport.airport_name} ({airport.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airline</label>
                        <select name="airlineId" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Airline</option>
                            {airlines && airlines.map((airline) => (
                                <option key={airline.airline_id} value={airline.airline_id}>
                                    {airline.airline_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Terminal</label>
                        <input placeholder='Enter Terminal Number' type="text" name="terminal" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                        <input type="datetime-local" name="departureTime" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                        <input type="datetime-local" name="arrivalTime" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                        <input
                            type="number" name="price" min="0" step="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter flight price"/>
                    </div>

                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </Modal>

            {/* Add Airport Modal */}
            <Modal show={showAddAirportModal} onClose={handleCloseModal}>
                <h2 className="text-xl font-bold mb-4">Add Airport</h2>
                <form onSubmit={handleAirportSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airport Name</label>
                        <input placeholder='Enter Airport Name Code' type="text" name="airportName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input placeholder='Enter Airport City' type="text" name="city" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </Modal>

            {/* Add Airline Modal */}
            <Modal show={showAddAirlineModal} onClose={handleCloseModal}>
                <h2 className="text-xl font-bold mb-4">Add Airline</h2>
                <form onSubmit={handleAirlineSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Airline Name</label>
                        <input placeholder='Enter Airline Name' type="text" name="airlineName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                        Submit
                    </button>
                </form>
            </Modal>

            {/* Add Crew Modal */}
            <Modal show={showAddCrewModal} onClose={handleCloseModal}>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Add Crew Member</h2>
                <form onSubmit={handleCrewSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                        <select name="role" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Role</option>
                            <option value="Pilot">Pilot</option>
                            <option value="CoPilot">CoPilot</option>
                            <option value="CabinCrew">Cabin Crew</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">License No</label>
                        <input type="text" name="license_no" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                        <input type="text" name="contact" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Hired Date</label>
                        <input type="date" name="hired_date" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                        <select name="status" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Active">Active</option>
                            <option value="OnLeave">On Leave</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </Modal>

            {/* Notification Modal */}
            {showNotifModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Send Notification</h2>
                        <form onSubmit={handleSendNotification} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User ID</label>
                                <input
                                    type="number"
                                    value={notifUserId}
                                    onChange={(e) => setNotifUserId(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    value={notifMessage}
                                    onChange={(e) => setNotifMessage(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Send</button>
                            <button type="button" className="btn bg-gray-400 text-white py-2 px-4 rounded ml-2" onClick={() => setShowNotifModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Crew Modal */}
            {assignCrewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Assign Crew</h2>
                        <form onSubmit={handleAssignCrew} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Crew Member</label>
                                <select value={assignCrewId}
                                    onChange={e => setAssignCrewId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-md">
                                    <option value="">Select Crew</option>
                                    {crew
                                        .filter(c => c.status !== 'Retired')
                                        .map(c => (
                                            <option key={c.crew_id} value={c.crew_id}>
                                                {c.name} ({c.role}) - {c.status}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select value={assignRole}
                                    onChange={e => setAssignRole(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="">Select Role</option>
                                    <option value="Pilot">Pilot</option>
                                    <option value="CoPilot">CoPilot</option>
                                    <option value="CabinCrew">Cabin Crew</option>
                                </select>
                            </div>
                            <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Assign</button>
                            <button type="button" className="btn bg-gray-400 text-white py-2 px-4 rounded ml-2" onClick={() => setAssignCrewModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Gate Assignment Modal */}
            {showAssignGateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Assign Gate</h2>
                        <div className="space-y-4">
                            {gates
                                .filter(g => g.status === 'Open')  // Match the enum in the database
                                .map(gate => (
                                    <div key={gate.gate_id} className="border p-2 rounded">
                                        <div className="flex justify-between items-center">
                                            <span>{gate.terminal} - Gate {gate.gate_number}</span>
                                            <button onClick={() => handleGateAssignment(gate.gate_id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded">
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            <button onClick={() => setShowAssignGateModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Gate Modal */}
            <Modal show={showAddGateModal} onClose={() => setShowAddGateModal(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Gate</h2>
                <form onSubmit={handleAddGate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Terminal</label>
                        <input type="text" required
                            value={gateTerminal}
                            onChange={(e) => setGateTerminal(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gate Number</label>
                        <input type="text" required
                            value={gateNumber}
                            onChange={(e) => setGateNumber(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">
                        Add Gate
                    </button>
                </form>
            </Modal>

            {/* Add Lounge Modal */}
            <Modal show={showAddLoungeModal} onClose={() => setShowAddLoungeModal(false)}>
                <h2 className="text-xl font-bold mb-4">Add Lounge</h2>
                <form onSubmit={handleAddLounge} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" required
                            onChange={(e) => setLoungeName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" required
                            onChange={(e) => setLoungeLocation(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input type="number" required
                            onChange={(e) => setLoungeCapacity(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">
                        Add Lounge
                    </button>
                </form>
            </Modal>

            {/* Assign Lounge Access Modal */}
            <Modal show={showAssignLoungeModal} onClose={() => setShowAssignLoungeModal(false)}>
                <h2 className="text-xl font-bold mb-4">Assign Lounge Access</h2>
                <form onSubmit={handleAssignLounge} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="flex gap-2">
                            <input type="text"
                                value={searchUsername}
                                onChange={(e) => setSearchUsername(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md" />
                            <button type="button"
                                onClick={fetchUserBookings}
                                className="bg-blue-500 text-white px-4 py-2 rounded">
                                Search
                            </button>
                        </div>
                    </div>

                    {userBookings.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Booking</label>
                            <select required
                                onChange={(e) => setAssignBookingId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md">
                                <option value="">Select Booking</option>
                                {userBookings.map(booking => (
                                    <option key={booking.booking_id} value={booking.booking_id}>
                                        Booking #{booking.booking_id} - {booking.departure_airport} → {booking.arrival_airport}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lounge</label>
                        <select required
                            onChange={(e) => setSelectedLoungeId(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md">
                            <option value="">Select Lounge</option>
                            {lounges.map(lounge => (
                                <option key={lounge.lounge_id} value={lounge.lounge_id}>
                                    {lounge.name} ({lounge.location})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">
                        Assign Access
                    </button>
                </form>
            </Modal>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Reviews Management</h2>
                {loadingReviews ? (
                    <div>Loading reviews...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Flight</th>
                                    <th className="py-2 px-4 border">Passenger</th>
                                    <th className="py-2 px-4 border">Rating</th>
                                    <th className="py-2 px-4 border">Comment</th>
                                    <th className="py-2 px-4 border">Date</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.review_id}>
                                        <td className="py-2 px-4 border">{review.flight_id}</td>
                                        <td className="py-2 px-4 border">{review.passenger_name}</td>
                                        <td className="py-2 px-4 border">{"⭐".repeat(review.rating)}</td>
                                        <td className="py-2 px-4 border">{review.comment}</td>
                                        <td className="py-2 px-4 border">{new Date(review.created_at).toLocaleString()}</td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleDeleteReview(review.review_id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Service Orders</h2>
                {loadingServiceOrders ? (
                    <div>Loading service orders...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Order ID</th>
                                    <th className="py-2 px-4 border">Booking</th>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Service</th>
                                    <th className="py-2 px-4 border">Quantity</th>
                                    <th className="py-2 px-4 border">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-2 px-4 border">{order.id}</td>
                                        <td className="py-2 px-4 border">{order.booking_id}</td>
                                        <td className="py-2 px-4 border">{order.username}</td>
                                        <td className="py-2 px-4 border">{order.service_name}</td>
                                        <td className="py-2 px-4 border">{order.quantity}</td>
                                        <td className="py-2 px-4 border">{new Date(order.added_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Admin;
