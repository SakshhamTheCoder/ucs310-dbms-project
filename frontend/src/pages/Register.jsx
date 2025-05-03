import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const { register, isLoggedIn, user } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [passport, setPassport] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Only send passport if it's not empty
            const userData = {
                username,
                email,
                password,
                phone: phone || undefined
            };
            
            // Only include passport if it's provided
            if (passport.trim() !== '') {
                userData.passport = passport;
            }
            
            await register(userData);
            toast.success('Registration successful!');
        } catch (error) {
            console.error("Registration error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
                toast.error('Registration failed');
            }
        }
    };

    return (
        <div className='flex flex-col justify-center items-center flex-1'>
            <h1 className='text-6xl font-bold text-center'>Welcome to Air Yatra</h1>
            <p className='text-2xl mt-4 text-center'>Please register to start booking</p>

            {error && (
                <div className="w-1/3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    <p>{error}</p>
                </div>
            )}

            <form className='mt-8 flex flex-col w-1/3' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='p-2 border rounded-md bg-tertiary text-primary'
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='p-2 border rounded-md mt-4 bg-tertiary text-primary'
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
                <input
                    type='text'
                    placeholder='Phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='p-2 border rounded-md mt-4 bg-tertiary text-primary'
                />
                <input
                    type='text'
                    placeholder='Passport Number'
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    className='p-2 border rounded-md mt-4 bg-tertiary text-primary'
                />
                <button
                    type='submit'
                    className='p-2 bg-accent text-tertiary rounded-md mt-4 cursor-pointer'
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;