import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import api from '../utils/apiClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate=useNavigate();
    const [showAddFlightModal, setShowAddFlightModal] = useState(false);
    const [showAddAirportModal, setShowAddAirportModal] = useState(false);
    const [showAddAirlineModal, setShowAddAirlineModal] = useState(false);
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [flights, setFlights] = useState([]);
    const [showAddCrewModal, setShowAddCrewModal] = useState(false);
    const [services, setServices] = useState([]);
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showEditServiceModal, setShowEditServiceModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [notifUserId, setNotifUserId] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [gates, setGates] = useState([]);
    const [lounges, setLounges] = useState([]);
    const [loadingGates, setLoadingGates] = useState(false);
    const [loadingLounges, setLoadingLounges] = useState(false);
    const [showAddGateModal, setShowAddGateModal] = useState(false);
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

    const handleAddFlight = async () => {
        try {
            const responseAirports = await api.get('/airports');
            setAirports(responseAirports);

            const responseAirlines = await api.get('/airlines');
            setAirlines(responseAirlines);

            setShowAddFlightModal(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        };
    };

        const handleAddAirport = () => {
            setShowAddAirportModal(true);
        };

        const handleAddAirline = () => {
            setShowAddAirlineModal(true);
        };

        const handleAddCrew = async () => {
            setShowAddCrewModal(true);
        };

        const handleCloseModal = () => {
            setShowAddFlightModal(false);
            setShowAddAirportModal(false);
            setShowAddAirlineModal(false);
            setShowAddCrewModal(false);
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
                });

                if (response.flight_id) {
                    toast.success('Flight Added succesfully');
                    handleCloseModal();
                }
            } catch (error) {
                console.error('Error adding flight:', error);
            }
        };

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
                console.error('Error adding airport:', error);
            }
        };

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
                console.error('Error adding airline:', error);
            }
        };

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
                }
            } catch (error) {
                console.error('Error adding crew member:', error);
                toast.error('Failed to add crew member');
            }
        };

        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const handleAddService = () => {
            setShowAddServiceModal(true);
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
                await api.post('/notifications', { userId: notifUserId, message: notifMessage });
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

        const handleAddGate = async (e) => {
            e.preventDefault();
            try {
                await api.post('/gates', { terminal: gateTerminal, gate_number: gateNumber });
                toast.success('Gate added');
                setShowAddGateModal(false);
                setGateTerminal('');
                setGateNumber('');
            } catch (error) {
                toast.error('Failed to add gate');
            }
        };

        const fetchFlights = async () => {
            try {
                const response = await api.get('/flights');
                setFlights(response);
            } catch (error) {
                toast.error('Failed to fetch flights');
            }
        };

        const fetchFlightCrew = async (flightId) => {
            try {
                const response = await api.get(`/flights/${flightId}/crew`);
                setFlightCrewMap((prev) => ({ ...prev, [flightId]: response }));
            } catch (error) {
                setFlightCrewMap((prev) => ({ ...prev, [flightId]: [] }));
            }
        };

        const handleOpenAssignCrewModal = (flightId) => {
            setSelectedFlight(flightId);
            setAssignCrewId('');
            setAssignRole('');
            setAssignCrewModal(true);
        };

        const handleAssignCrew = async (e) => {
            e.preventDefault();
            try {
                await api.post(`/flights/${selectedFlight}/crew`, {
                    crew_id: assignCrewId,
                    assigned_role: assignRole,
                });
                toast.success('Crew assigned');
                setAssignCrewModal(false);
                fetchFlightCrew(selectedFlight);
            } catch (error) {
                toast.error('Failed to assign crew');
            }
        };

        useEffect(() => {
            fetchServices();
            fetchPayments();
            fetchNotifications();
        }, []);

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin</h1>
                <div className='flex flex-col justify-center items-center gap-4'>
                    <button className="btn w-72 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleAddFlight}>
                        Add Flight
                    </button>
                    <button className="btn w-72 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleAddAirport}>
                        Add Airport
                    </button>
                    <button className="btn w-72 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleAddAirline}>
                        Add Airline
                    </button>
                    <button className="btn w-72 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => setShowAddCrewModal(true)}>
                        Add Crew Member
                    </button>
                    <button className="btn w-72 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => navigate('/admin/crew')}>
                        Manage Crew
                    </button>

                </div>
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
                        <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                            Submit
                        </button>
                    </form>
                </Modal>

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

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Manage Services</h2>
                    <button className="btn bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={handleAddService}>
                        Add Service
                    </button>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Name</th>
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Price</th>
                                    <th className="py-2 px-4 border">Available</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service.service_id}>
                                        <td className="py-2 px-4 border">{service.name}</td>
                                        <td className="py-2 px-4 border">{service.description}</td>
                                        <td className="py-2 px-4 border">₹{service.price}</td>
                                        <td className="py-2 px-4 border">{service.available_quantity}</td>
                                        <td className="py-2 px-4 border">
                                            <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEditService(service)}>Edit</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteService(service.service_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal show={showAddServiceModal} onClose={() => setShowAddServiceModal(false)}>
                    <h2 className="text-xl font-bold mb-4">Add Service</h2>
                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" name="price" min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
                            <input type="number" name="available_quantity" min="0" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Submit</button>
                    </form>
                </Modal>
                <Modal show={showEditServiceModal} onClose={() => setShowEditServiceModal(false)}>
                    <h2 className="text-xl font-bold mb-4">Edit Service</h2>
                    <form onSubmit={handleServiceEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" defaultValue={editingService?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" defaultValue={editingService?.description} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" name="price" min="0" step="0.01" defaultValue={editingService?.price} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
                            <input type="number" name="available_quantity" min="0" defaultValue={editingService?.available_quantity} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <button type="submit" className="btn bg-green-500 text-white py-2 px-4 rounded">Update</button>
                    </form>
                </Modal>
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Payments Dashboard</h2>
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
                                            <td className="py-2 px-4 border">{new Date(payment.payment_date).toLocaleString()}</td>
                                            <td className="py-2 px-4 border">
                                                <select
                                                    value={payment.status}
                                                    onChange={(e) => handleStatusChange(payment.payment_id, e.target.value)}
                                                    className="border rounded px-2 py-1"
                                                >
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
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Notifications Management</h2>
                    <button className="btn bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={() => setShowNotifModal(true)}>
                        Send Notification
                    </button>
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
                                    {notifications.map((notif) => (
                                        <tr key={notif.notification_id}>
                                            <td className="py-2 px-4 border">{notif.notification_id}</td>
                                            <td className="py-2 px-4 border">{notif.username} (ID: {notif.user_id})</td>
                                            <td className="py-2 px-4 border">{notif.message}</td>
                                            <td className="py-2 px-4 border">{notif.is_read ? 'Yes' : 'No'}</td>
                                            <td className="py-2 px-4 border">{new Date(notif.created_at).toLocaleString()}</td>
                                            <td className="py-2 px-4 border">
                                                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteNotification(notif.notification_id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Crew Assignment</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Flight ID</th>
                                    <th className="py-2 px-4 border">Route</th>
                                    <th className="py-2 px-4 border">Assigned Crew</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.flight_id}>
                                        <td className="py-2 px-4 border">{flight.flight_id}</td>
                                        <td className="py-2 px-4 border">{flight.departure_airport} → {flight.arrival_airport}</td>
                                        <td className="py-2 px-4 border">
                                            <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => fetchFlightCrew(flight.flight_id)}>
                                                View Crew
                                            </button>
                                            {flightCrewMap[flight.flight_id] && flightCrewMap[flight.flight_id].length > 0 && (
                                                <ul className="list-disc ml-4 mt-2">
                                                    {flightCrewMap[flight.flight_id].map((c) => (
                                                        <li key={c.crew_id}>{c.name} ({c.assigned_role})</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleOpenAssignCrewModal(flight.flight_id)}>
                                                Assign Crew
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {assignCrewModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded shadow-md w-96">
                                <h2 className="text-xl font-bold mb-4">Assign Crew to Flight</h2>
                                <form onSubmit={handleAssignCrew} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Crew Member</label>
                                        <select value={assignCrewId} onChange={e => setAssignCrewId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="">Select Crew</option>
                                            {crew.map((c) => (
                                                <option key={c.crew_id} value={c.crew_id}>{c.name} ({c.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select value={assignRole} onChange={e => setAssignRole(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
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
                </div>
            </div>
        );
    };
    export default Admin;
