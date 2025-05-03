import React, { useState, useContext, useEffect } from 'react';
import api from './apiClient';

const AuthContext = React.createContext({
    isLoggedIn: null,
    login: () => { },
    register: () => { },
    logout: () => { },
    user: null,
    loading: true,
    isAdmin: false,
});

export const AuthContextProvider = (props) => {
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);

        if (token) {
            api.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log('User data fetched:', response);
                    setUser(response.user);
                    setUserIsLoggedIn(true);
                    setIsAdmin(response.user && response.user.role === 'admin');
                })
                .catch((error) => {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const registerHandler = async ({ username, email, password, phone, passport }) => {
        try {
            const response = await api.post('/auth/register', {
                username, email, password, phone, passport
            });

            const { token, user } = response;

            localStorage.setItem('token', token);
            console.log('Token saved to localStorage:', token);
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(user);
            setIsAdmin(user && user.role === 'admin');
            console.log('User state set:', user);
            
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            // Pass the error through so the component can handle it
            throw error;
        }
    };

    const loginHandler = async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response;

            localStorage.setItem('token', token);
            console.log('Token saved to localStorage:', token);
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(user);
            setIsAdmin(user && user.role === 'admin');
            console.log('User state set:', user);
            
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            // Pass the error through so the component can handle it
            throw error;
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('token');
        api.removeAuthHeader();
        setUserIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
    };

    const contextValue = {
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        register: registerHandler,
        logout: logoutHandler,
        user: user,
        loading: loading,
        isAdmin: isAdmin,
    };

    console.log('AuthContext state:', contextValue);

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;