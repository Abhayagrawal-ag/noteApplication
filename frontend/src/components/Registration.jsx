import React from 'react';
import { useState } from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !password) {
      return toast.error('Error: Please fill in all fields', {
        autoClose: 1500,
      });
    }
    if (!emailRegex.test(email)) {
      return toast.error('Error: Please enter a valid email address', {
        autoClose: 1500});
      }
    try{
      await axios.delete('https://notesapp-production-97fe.up.railway.app/auth/delete', { data: { email, password } });
      toast.success('Account deleted. you can register again.', {
        autoClose: 1500,
      });
      localStorage.removeItem('email');
      setEmail('');
      setPassword('');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting account'; 
        toast.error('Error deleting account', {
          autoClose: 1500,  
        });
      } 
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Error: Please fill in all fields', {
        autoClose: 1500,
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('Error: Please enter a valid email address', {
        autoClose: 1500});
      }
    try {
      const response = await axios.post('https://notesapp-production-97fe.up.railway.app/auth/register', { email, password });
      localStorage.setItem('email', email);
      toast.success('Sign up successful', {
        autoClose: 1500,
      });
      navigate('/login');
    } catch (error) {
      toast.error('User already exists', {
        autoClose: 1500,
      });
    }
  };
  return (
    <>
    <h1 style={{background: '#3366FF'}} className='w-full text-white text-center p-3'>NoteKeeper</h1>
    <div className='flex flex-col items-center justify-center '>
      <form onSubmit={handleRegistration} className='flex flex-col items-center gap-12 mt-20 sm:mt-22 md:mt-24'>
        <input  type="text" placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border border-gray-300 p-3 rounded-md w-60 sm:w-70 md:w-80 placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl' ></input>
        <input type="password" placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
         className='border border-gray-300 p-3 rounded-md w-60 sm:w-70 md:w-80 placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl' />
        <button  type="submit" className='bg-blue-500 text-white  p-3 rounded-md w-60 sm:w-70 md:w-80 font-bold '>Sign up</button>
      </form>
      <p className='text-gray-500 mt-4'>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => navigate('/login')}>Sign in</span></p>
            <p  className='text-gray-500 mt-4'>Stuck or want to re-register? {''}<span onClick={handleDeleteAccount} className='text-blue-500 cursor-pointer'>DeleteAccount</span></p>
      </div>
    </>   
  );
}
export default Registration;