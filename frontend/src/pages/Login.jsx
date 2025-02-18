import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
    const { login, isLoggedIn, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            alert('Login successful!');
        } catch (error) {
            alert('Invalid email or password');
        }
    };

    return (
        <div className='flex flex-col justify-center items-center flex-1'>
            <h1 className='text-6xl font-bold text-center'>Welcome to Air Yatra</h1>
            <p className='text-2xl mt-4 text-center'>Please login to start booking</p>

            <form className='mt-8 flex flex-col w-1/3' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Username'
                    onChange={(e) => setEmail(e.target.value)}
                    className='p-2 border rounded-md bg-tertiary text-primary'
                />
                <input
                    type='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-2 border rounded-md mt-4 bg-tertiary text-primary'
                />
                <button
                    type='submit'
                    className='p-2 bg-accent text-tertiary rounded-md mt-4 cursor-pointer'
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;