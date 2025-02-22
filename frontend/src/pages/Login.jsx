import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/'); // Redirect to home page after login
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className='flex flex-col justify-center items-center flex-1'>
            <h1 className='text-6xl font-bold text-center'>Welcome to Air Yatra</h1>
            <p className='text-2xl mt-4 text-center'>Please login to start booking</p>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <form className='mt-8 flex flex-col w-1/3' onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='p-2 border rounded-md bg-tertiary text-primary'
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-2 border rounded-md mt-4 bg-tertiary text-primary'
                    required
                />
                <button
                    type='submit'
                    className='p-2 bg-blue-500 text-white rounded-md mt-4 cursor-pointer'
                >
                    Login
                </button>
            </form>

            <p className='mt-4'>
                New User? <Link to="/" className="text-blue-500">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;