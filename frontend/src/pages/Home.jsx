import React from 'react';

const Home = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted');
    };

    return (
        <div className='flex flex-col justify-center items-center flex-1'>
            <h1 className='text-6xl font-bold text-center'>Welcome to Quiz Portal</h1>


        </div>
    );
};

export default Home;