import React from 'react'

const Navbar = () => {
  return (
    <header className='top-0 bg-accent text-tertiary h-1/10 rounded-2xl flex items-center justify-between'>
      <div className='p-1 text-6xl'>
        Quizz : Let's Practice 
      </div>
      <button className=' mr-1.5 p-2 bg-red-400 hover:bg-red-600 rounded-2xl cursor-pointer'>
        LogOut
      </button>
    </header>
  )
}

export default Navbar;

