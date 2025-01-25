import React from 'react';
import Navbar from '../components/Navbar';
import Question from '../components/Question';
const Home = () => {
    return (
        <>
        <Navbar/>
        <div className='flex flex-col justify-center items-center flex-1'>
            <Question/>
        </div>
        </>
    );
};

export default Home;