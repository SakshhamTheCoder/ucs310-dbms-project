import React, { useState, useContext, useEffect } from 'react';
import api from './apiClient';

const AuthContext = React.createContext({
    isLoggedIn: false,
    login: () => { },
    register: () => { },
    logout: () => { },
    user: null,
    loading: true,
});

export const AuthContextProvider = (props) => {
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if the user is logged in on page load
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log

        if (token) {
            api.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log('User data fetched:', response); // Debug log
                    setUser(response.user);
                    setUserIsLoggedIn(true);
                })
                .catch((error) => {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                });
        }
        setLoading(false);
    }, []);

    const registerHandler = async ({ username, email, password, phone, passport }) => {
        try {
            const response = await api.post('/auth/register', {
                username, email, password, phone, passport
            });

            const { token, user } = response;

            localStorage.setItem('token', token);
            console.log('Token saved to localStorage:', token); // Debug log
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(user);
            console.log('User state set:', user); // Debug log
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const loginHandler = async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response; // Ensure the backend returns the user object

            localStorage.setItem('token', token);
            console.log('Token saved to localStorage:', token); // Debug log
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(user); // Update the user state
            console.log('User state set:', user); // Debug log
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('token');
        api.removeAuthHeader();
        setUserIsLoggedIn(false);
        setUser(null);
    };

    const contextValue = {
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        register: registerHandler,
        logout: logoutHandler,
        user: user,
        loading: loading,
    };

    console.log('AuthContext state:', contextValue); // Debug log

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;