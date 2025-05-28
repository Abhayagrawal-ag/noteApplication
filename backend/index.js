import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './models/Note.js';
import auth from './routes/auth.js';
import cors from 'cors';
dotenv.config();
// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected '))
.catch(err => console.log('MongoDB error ', err));
 // DB connection completed
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://notes-app-eight-black.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.get("/", (req, res) => {
  res.send("this is note applicaiton")
})
app.use('/auth', auth)
app.get('/notes', async (req, res) =>{
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const notes = await Note.find({ userEmail });
    res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
 
})

app.post('/notes', async (req,res)=> {
  const {text, userEmail} = req.body;
  if(!text || !userEmail) {
    return res.status(400).json({error:'text and userEmail is required'});
  }
  try{
    const note = new Note({
      text,
      userEmail
    });
    await note.save();
    res.status(201).json(note);
  }catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }  
})

app.delete('/notes/:id', async (req,res)=>{
  const userEmail = req.query.email;
  if(!userEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try{
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    if(note.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await note.deleteOne();
    res.status(200).json({ message: 'Note deleted successfully' });
  }catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
