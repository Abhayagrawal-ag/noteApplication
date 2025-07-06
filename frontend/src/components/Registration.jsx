import React from 'react';
import { useState, useEffect } from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Eye, EyeOff} from 'lucide-react';
function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[showOtpBox, setShowOtpBox] = useState(false);
  const[otp,setOtp] = useState("");
   const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const otpPending = localStorage.getItem('otpPending');
    
    if (storedEmail && otpPending === 'true') {
      setShowOtpBox(true);
    }
  }, []);


  const handleVerifyOtp = async () => {
    if (!otp) {
      return toast.error('Please enter OTP', {
        autoClose: 1500,
      });
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/verify', { 
        code: otp 
      });
      toast.success(response.data.message || 'Email verified successfully!', {
        autoClose: 1500,
      });
      setShowOtpBox(false);
      setOtp('');
      localStorage.removeItem('email'); 
      localStorage.removeItem('otpPending');   //
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    }
  };

   const handleResendOtp = async () => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      return toast.error('Email not found. Please register again.', {
        autoClose: 1500,
      });
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/resend-otp', {
        email: storedEmail
      });
      toast.success(response.data.message || 'New OTP sent successfully!', {
        autoClose: 1500,
      });
      setOtp(''); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    }
  };

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
      if (password.length < 8) {
       return toast.error('Error: Password must be at least 8 characters long', {
        autoClose: 1500,
      });
    }

    try{
      await axios.delete('http://localhost:3000/auth/delete', { data: { email, password } });
      toast.success('Account deleted. you can register again.', {
        autoClose: 1500,
      });
      localStorage.removeItem('email');
      localStorage.removeItem('showOtpBox');   ///
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
       if (password.length < 8) {
       return toast.error('Error: Password must be at least 8 characters long', {
        autoClose: 1500,
      });
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { email, password });
        localStorage.setItem('email', email);
         localStorage.setItem('otpPending', 'true');
        toast.success("Sign up successfull, now verify your Email", {
          autoClose:1500,
        })
        setEmail('');
        setPassword('');
        setShowOtpBox(true)
    } catch (error) { 
      toast.error('User already exists', {
        autoClose: 1500,
      });
    }
      
  };
  return (
    <>
    <h1 style={{background: '#3366FF'}} className='w-full text-white text-center text-xl p-3'>NotesKeeper</h1>
     <p className='text-gray-500 mt-4 text-center  md:text-xl'>Already have an account? <span  className='text-blue-500 cursor-pointer ' onClick={() => navigate('/login')}>Sign in</span></p>
    <div className='flex flex-col items-center justify-center '>
      <form onSubmit={handleRegistration} className='flex flex-col items-center gap-12 mt-20 sm:mt-22 md:mt-24'>
        <input  type="text" placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border border-gray-300 p-3 rounded-md w-60 sm:w-70 md:w-80 placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl' ></input>
       

       <div className="relative w-60 sm:w-70 md:w-80">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 p-3 rounded-md w-full placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl pr-12' 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >

                      {showPassword ? (
              <EyeOff size={20} className="cursor-pointer" />
            ) : (
              <Eye size={20} className="cursor-pointer" />
            )}


          </button> 
         </div>

        <button  type="submit" className='bg-blue-500 text-white  p-3 rounded-md w-60 sm:w-70 md:w-80 font-bold '>Sign up</button>
      </form>
      <p className='text-gray-500 mt-8'>Click here to verify your email. <span onClick={setShowOtpBox} className='text-blue-500 cursor-pointer text-center '>Verify Email</span></p>
      <p  className='text-gray-500 mt-4 text-center'>Stuck or want to re-register? {''}<span onClick={handleDeleteAccount} className='text-blue-500 cursor-pointer'>DeleteAccount</span></p>
      </div>

        {showOtpBox && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl  w-50 sm:w-80 md:w-80 ">
            <h2 className="text-xl font-semibold mb-4 text-center ">Enter OTP</h2>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="placeholder:text-xl w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />
             <div className="mt-6"></div>
            <button
              onClick={handleVerifyOtp}
              className="  w-full font-bold bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >Verify OTP
            </button>
              <div className="mt-6"></div>
             <button onClick={handleResendOtp}
              className="  w-full font-bold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >Resend OTP
            </button>
             
          </div>
        </div>
      )} 


    </>   
  );
  
}
export default Registration;

  