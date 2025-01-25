import React, { useState, useContext, useEffect } from 'react';
import api from './apiClient';

const AuthContext = React.createContext({
    isLoggedIn: false,
    login: () => { },
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
            api.setAuthHeader(token);
            setUserIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

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
        logout: logoutHandler,
        user: user,
        loading: loading,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

