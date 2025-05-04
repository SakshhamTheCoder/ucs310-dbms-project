import React, { useEffect, useState } from 'react';
import api from '../utils/apiClient'; // Import your API client
import toast from 'react-hot-toast';

const AddService = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // Fetch services from the API
  const fetchServices = async () => {
    try {
      const res = await api.get('/services'); 
      setServices(res); 
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices(); // Fetch services when component mounts
  }, []);

  // Handle service deletion
  const handleDelete = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Service deleted successfully');
      fetchServices(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
    }
  };

  // Handle form submission to add a new service
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior

    // Validation
    if (!serviceName || !price || !quantity) {
      toast.error('Service name, price, and quantity are required');
      return;
    }

    try {
      const res = await api.post('/services', {
        name: serviceName,
        description,
        price,
        available_quantity: quantity,
      });
      toast.success('Service added successfully');
      fetchServices(); // Refresh the list after adding the service
      // Clear form fields after submission
      setServiceName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setShowForm(false); // Hide the form after successful submission
    } catch (err) {
      console.error('Error adding service:', err);
      toast.error('Failed to add service');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add or Manage Services</h2>

      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm(!showForm)} // Toggle form visibility
        className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {showForm ? 'Cancel' : 'Add New Service'}
      </button>

      {/* Services List Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-medium text-gray-700 mb-4">Services List</h3>
        {services.length === 0 ? (
          <p className="text-gray-500">No services found.</p>
        ) : (
          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service.service_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
                <span className="text-gray-800">{service.name} - `INR ${service.price}`</span>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDelete(service.service_id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Service Form Section - Visible when showForm is true */}
      {showForm && (
        <div>
          <h3 className="text-2xl font-medium text-gray-700 mb-4">Add a New Service</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Service Name"
              />
            </div>
            <div>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
              />
            </div>
            <div>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Service
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddService;
