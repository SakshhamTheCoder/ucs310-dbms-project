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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.post('/auth/me', { token })
                .then((response) => {
                    setUser(response.user);
                    setUserIsLoggedIn(true);
                    console.log('Token verified:', response);
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
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(user);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };


    const loginHandler = async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response;

            localStorage.setItem('token', token);
            api.setAuthHeader(token);

            setUserIsLoggedIn(true);
            setUser(userData);
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

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

