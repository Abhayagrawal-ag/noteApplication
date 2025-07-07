import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {Eye, EyeOff} from 'lucide-react'
 function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const changeroute = () => {
    navigate("/emailfp")
  }
  

  const handleLogin = async (e) => {
  e.preventDefault();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !password) {
    return toast.error('Error: Please fill in all fields', {
      autoClose: 1500,
    });
  }
  
  if (!emailRegex.test(email)) {
    return toast.error('Error: Please enter a valid email address', {
      autoClose: 1500,
    });
  }
  
  if (password.length < 8) {
    return toast.error('Error: Password must be at least 8 characters long', {
      autoClose: 1500,
    });
  }

  try {
    const response = await axios.post('http://localhost:3000/auth/login', { 
      email, 
      password 
    });
    
    localStorage.setItem('email', email);
    toast.success('Sign in successful', {
      autoClose: 1500,
    });
    navigate('/home');
    
  } catch (error) {
    // Console log to see what exact error message is coming from server
    console.log('Error response:', error.response?.data);
    console.log('Error message:', error.response?.data?.message);
    console.log('Error status:', error.response?.status);
    
    const errorMessage = error.response?.data?.message || 'error during Sign in';
    const statusCode = error.response?.status;
    
    // Handle different error messages based on your backend responses
    if (errorMessage === 'Invalid email') {
      toast.error('User not registered or not verified', {
        autoClose: 1500,
      });
      
    } else if (errorMessage === 'Invalid password') {
      toast.error('Incorrect credentials', {
        autoClose: 1500,
      });
      
    } else if (errorMessage.includes('Please verify your email before logging in')) {
      toast.error('Account not verified. Please verify your email', {
        autoClose: 1500,
      });
      
    } else if (errorMessage === 'Email and password are required') {
      toast.error('Please fill in all fields', {
        autoClose: 1500,
      });
      
    } else if (errorMessage === 'Invalid email format') {
      toast.error('Please enter a valid email address', {
        autoClose: 1500,
      });
      
    } else if (statusCode === 500) {
      toast.error('Server error. Please try again later.', {
        autoClose: 1500,
      });
      
    } else {
      // Generic error message for other cases
      toast.error('An error occurred during sign in. Please try again.', {
        autoClose: 1500,
      });
    }
  }
};

 
  return (
    <>
      <p style={{background: '#3366FF'}} className='w-full font-bold p-3 text-2xl sm:text-3xl md:text-4xl text-white text-center'>Welcome Back to DailyDrafts</p>
      <div className='flex flex- items-center  justify-center mt-8'>
        <div className='bg-gray-100 h-[310px] w-[250px] sm:h-[350px] sm:w-[400px] md:h-[500px] md:w-[500px] rounded-md shadow-md flex flex-col items-center justify-center'>
          <form onSubmit={handleLogin} className='flex flex-col items-center gap-6 sm:gap-10  '>
          <p className='mb-4 text-center font-bold sm:text-xl md:text-2xl'>Login to your account !</p>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='border border-gray-300 p-3 rounded-md w-50 sm:w-80 md:w-80 placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl' ></input>

          

        <div className="relative w-50 sm:w-80 md:w-80">
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
           <span onClick={changeroute} className='text-blue-500 cursor-pointer'>Forgot password</span>
          <button  type="submit" className='bg-blue-500 text-white text-xl p-3 rounded-md w-50 sm:w-80 md:w-80 font-bold '>Sign in</button>
          </form> 
        </div>
      </div>   
    </>
  );
}
export default Login
