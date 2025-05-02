// AdminCrew.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/apiClient';
import AuthContext from '../utils/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Modal'; 

const AdminCrew = () => {
    const { user } = useContext(AuthContext);
    const [crew, setCrew] = useState([]);
    const [editing, setEditing] = useState(null); 
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState('');

    const fetchCrew = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/crew', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("GET Response:", res);
            setCrew(res);
        } catch (err) {
            console.error('Error fetching crew:', err);
            toast.error('Failed to fetch crew');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/crew/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Crew member deleted');
            fetchCrew(); 
        } catch (err) {
            console.error('Error deleting crew:', err);
            toast.error('Failed to delete crew member');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await api.patch(`/crew/${editing.crew_id}`, {
                contact,
                status,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Crew member updated');
            setEditing(null);
            setContact('');
            setStatus('');
            fetchCrew(); 
        } catch (err) {
            console.error('Error updating crew:', err);
            toast.error('Failed to update crew member');
        }
    };

    const handleEditClick = (member) => {
        setEditing(member);
        setContact(member.contact);
        setStatus(member.status);
    };

    useEffect(() => {
        fetchCrew();
    }, []);

    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-4">Manage Crew</h2>
            {crew.length === 0 ? (
                <p>No crew members found.</p>
            ) : (
                <ul className="space-y-2">
                    {crew.map((member) => (
                        <li
                            key={member.crew_id}
                            className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
                        >
                            <div className="flex-grow max-w-xl truncate">
                                <span>{member.name} - {member.role} | {member.status} | {member.contact}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(member)} // Set the selected member to edit
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member.crew_id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modal show={editing !== null} onClose={() => setEditing(null)}>
                <h3 className="text-lg font-semibold mb-4">Edit Crew Member</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                        <input
                            type="text"
                            value={contact} 
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Added text-black
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)} 
                            className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Added text-black
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="OnLeave">On Leave</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                    >
                        Update
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminCrew;
