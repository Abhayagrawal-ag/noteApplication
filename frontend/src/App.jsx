
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NotesList from './components/NotesList';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Registration />}/>
      <Route path="/home" element={<Home />} />
      <Route path="/notes" element={<NotesList />} />
    </Routes>
  );
}

export default App;

