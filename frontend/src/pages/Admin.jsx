import React, { useState } from 'react';
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




            </div>
        );
    };
    export default Admin;
