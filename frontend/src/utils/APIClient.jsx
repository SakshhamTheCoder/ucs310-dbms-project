import axios from 'axios';
import api_url from './Config';

const axiosClient = axios.create({
    baseURL: api_url, // Use the correct api_url
    headers: {
        'Content-Type': 'application/json',
    },
});

const api = {
    get: (url) => {
        const token = localStorage.getItem('token');
        console.log('GET Request to:', url); // Debug log
        console.log('Token being sent:', token); // Debug log

        return axiosClient
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log('GET Response:', response.data); // Debug log
                return response.data;
            })
            .catch((error) => {
                console.error('GET Error:', error); // Debug log
                // Log the actual error message from the server
                if (error.response && error.response.data) {
                    console.error('Server error message:', error.response.data);
                }
                throw error;
            });
    },

    post: (url, data) => {
        const token = localStorage.getItem('token');
        console.log('POST Request to:', url); // Debug log
        console.log('Payload:', data); // Debug log
        console.log('Token being sent:', token); // Debug log

        return axiosClient
            .post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log('POST Response:', response.data); // Debug log
                return response.data;
            })
            .catch((error) => {
                console.error('POST Error:', error); // Debug log
                // Log the actual error message from the server
                if (error.response && error.response.data) {
                    console.error('Server error message:', error.response.data);
                }
                throw error;
            });
    },

    setAuthHeader: (token) => {
        console.log('Setting Auth Header with Token:', token); // Debug log
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    removeAuthHeader: () => {
        console.log('Removing Auth Header'); // Debug log
        delete axiosClient.defaults.headers.common['Authorization'];
    },
    delete: (url) => {
        const token = localStorage.getItem('token');
        console.log('DELETE Request to:', url);
        return axiosClient
            .delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log('DELETE Response:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('DELETE Error:', error);
                // Log the actual error message from the server
                if (error.response && error.response.data) {
                    console.error('Server error message:', error.response.data);
                }
                throw error;
            });
    },
    patch: (url, data) => {
        const token = localStorage.getItem('token');
        console.log('PATCH Request to:', url);
        console.log('Payload:', data);
        return axiosClient
            .patch(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log('PATCH Response:', response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('PATCH Error:', error);
                // Log the actual error message from the server
                if (error.response && error.response.data) {
                    console.error('Server error message:', error.response.data);
                }
                throw error;
            });
    }
};

export default api;