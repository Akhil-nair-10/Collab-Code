import React from 'react'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen w-screen flex justify-center items-center flex-col gap-4'>
      <img src='cat_error.png' className='h-3/4 w-auto border-2 rounded-2xl'></img>
      <button className='bg-blue-400 h-10 w-30 rounded-lg shadow-lg font-bold active:97 cursor-pointer' onClick={()=>{navigate('/')}}>GO BACK</button>
    </div>
  )
}

export default Unauthorized
