import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
function NotesList(){
  const [notes, setNotes] = useState([]);
  useEffect(() => {
  const fetchNotes = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      const response = await axios.get('http://notesapp-production-97fe.up.railway.app/notes',{params: { email: userEmail }});
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  fetchNotes();
},[])
const deleteNote = async (id) => {
  try {
    const userEmail = localStorage.getItem('email');
    await axios.delete(`http://notesapp-production-97fe.up.railway.app/notes/${id}`, { params: { email: userEmail } });
    setNotes(notes.filter(note => note._id !== id));
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}  
  return(
    <>
      <div style={{background :'#3366FF'}} className="  w-full text-2xl font-bold text-center p-4 text-white ">All Notes here...</div>
      <div className="  w-full flex flex-col items-center bg-gray-100 gap-1 py-8">
      {notes.map((note) => (
        <div key={note._id} className="bg-white p-4 m-4  rounded-md  w-[350px] sm:w-[500px] md:w-[600px]">
          <div className='flex items-center justify-between'>
            <div className='flex flex-col  justify-start'>
            <p className='text-black font-bold'>{note.text}</p>
            <p className="text-blue-500 text-sm mt-2">
            Created at: {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown'}
            </p>
            </div>
            <div style={{background : '#FF0000'}} className=' text-white p-2 rounded-md'><button onClick={() => deleteNote(note._id)} className="outline outline-offset-2">DELETE</button></div> 
          </div>
        </div>
      ))}
      </div>
    </> 
  );
}
export default NotesList