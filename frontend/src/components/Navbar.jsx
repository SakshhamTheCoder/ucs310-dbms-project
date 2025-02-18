import React from 'react';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className='top-0 px-8 bg-accent text-tertiary h-1/12 rounded-2xl flex items-center justify-between'>
      <div className='text-3xl'>
        Air Yatra <span className='text-sm'>(Logged in as {user.username})</span>
      </div>
      <button className='p-2 bg-red-400 hover:bg-red-600 rounded-2xl cursor-pointer'>
        LogOut
      </button>
    </header>
  );
};

export default Navbar;

