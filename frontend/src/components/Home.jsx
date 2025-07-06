import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const [text, setText] = React.useState('');
  const handleAddNote = async () => {
     if (!text.trim()){
      return toast.error('Error: Please enter a note',{
        autoClose: 1500,
      });
    }
     try {
      const userEmail = localStorage.getItem('email');
      const response = await axios.post('https://noteapplication-backend.onrender.com/notes', { text,userEmail });
      toast.success('Note added successfully', {
        autoClose: 1500,
      });
      setText(''); 
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }
  const changeRoute = () => {
    navigate('/notes');
  }
  return (
    <div style={{background: '#F9FAFB'}} className="min-h-screen w-full flex flex-col items-center justify-start p-4"> 
      <h1 style={{background:'#3366FF'}} className="  w-screen text-center text-white text-2xl sm:text-4xl md:text-3xl font-semibold p-2 rounded-md">Notepad</h1>
      <div className='flex flex-col items-center gap-9 mt-4'>
        <textarea value={text}
        onChange={(e) => setText(e.target.value)} style={{background: '#FFFFFF'}}
        className=" h-[170px] w-[260px] sm:h-[250px] sm:w-[250px] md:h-[230px] md:w-[500px] text-xl pt-2 pl-2 sm:text-2xl md:text-3xl rounded-md shadow-md  mt-0 resize-none placeholder:text-xl sm:placeholder:text-3xl md:placeholder:text-xl placeholder:font-bold "
        placeholder="Write a note..."
       ></textarea>
        <button onClick={handleAddNote} style={{background :'#3366FF'}} className=" text-white outline outline-offset-2 h-[40px] w-[120px]  font-bold rounded-md" >Add Note</button>
        <button onClick={changeRoute} className=" mt-22 outline outline-offset-2 bg-white h-[40px] w-[140px] font-bold rounded-md text-black">View Notes</button>
      </div>
    </div>
  );
}
export default Home
