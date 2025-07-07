
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NotesList from './components/NotesList';
import Registration from './components/Registration';
import Login from './components/Login';
import ShareNotes from './components/ShareNotes';
import AllSharedNotes from './components/AllSharedNotes';
import First from './components/First';
import About from './components/About';
import EmailFP from './components/EmailFP';
import VerifyOTP from './components/VerifyOTP';
import NewPassword from './components/NewPassword';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="signup" element={<Registration />}/>
      <Route path="/home" element={<Home />} />
      <Route path="/notes" element={<NotesList />} />
      <Route path="/sharenotes" element={<ShareNotes />} />
      <Route path="/allsharenote" element={<AllSharedNotes />} />
       <Route path="/" element={<First />} />
        <Route path="about" element={<About />} />
        <Route path="emailfp" element={<EmailFP />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        <Route path="/newpassword" element={<NewPassword />} />

      
    </Routes>
  );
}

export default App;

