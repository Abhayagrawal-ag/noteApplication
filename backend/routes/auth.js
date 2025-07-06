
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Note from '../models/Note.js';
import ShareNote from '../models/ShareNote.js';
import validator from 'validator';
import {SendVerificationCode} from '../middleware/Email.js'
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try{
  const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format' });
    }
    const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists and is verified. Please login.' 
        });
      }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      email,
      password: hashedPassword,
      verificationCode,
      isVerified:false,
      verificationCodeExpires
    });
    await user.save();
    SendVerificationCode(user.email, verificationCode);
    res.status(201).json({message: 'User registered successfully' });
  }catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try{
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({message: 'Invalid email format' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!user.isVerified) {
  return res.status(400).json({ 
    message: 'Please verify your email before logging in. Check your email for verification code.' 
  });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({message: 'Invalid password' });
  }
  res.status(200).json({ message: 'Login successful' 
     });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//delete route
router.delete('/delete', async (req, res) => {
  const { email,password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid password' });
    }
    await User.deleteOne({email})
    await Note.deleteMany({userEmail: email});
    await ShareNote.deleteMany({userEmail: email}); // Also delete shared notes
    res.status(200).json({ message: 'User and associated notes deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// verify
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;
    console.log('Verification attempt with code:', code);
    if (!code) {
      return res.status(400).json({ 
        message: "Verification code is required" 
      });
    }
    const user = await User.findOne({
      verificationCode: code,
    });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(400).json({  
        message: "Invalid or expired verification code" 
      });
    }

    if(new Date() > user.verificationCodeExpires){
      return res.status(400).json({
        message: "Verification code has expired. please request a new one"
      })
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { 
        $set: { isVerified: true },
        $unset: { verificationCode: 1,
        verificationCodeExpires:1
         }
      }
    );
    console.log('User verified successfully:', user.email);
    res.status(200).json({ 
      message: "Email verified successfully! You can now log in." 
    }); 
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({  
      message: "Internal server error" 
    });
  }
})

//Resend otp route
router.post('/resend-otp',async(req,res) => {
  try{
    const{email} = req.body;
    if(!email){
       return res.status(400).json({ message: 'Email is required' });
    }
    if(!validator.isEmail(email)){
      return res.status(400).json({
        message: "Invalid email format"
      })
    }
    const user = await User.findOne({email})
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); 
    await User.findOneAndUpdate(
      { email },
      { 
        verificationCode,
        verificationCodeExpires
      }
    );

    SendVerificationCode(email, verificationCode);

    res.status(200).json({ message: 'New verification code sent successfully' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
})

// Get a specific note by ID (from Notes collection)
router.get('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    if (!noteId) {
      return res.status(400).json({ message: 'Note ID is required' });
    }

    // Find the note by ID and check if user has access
    const note = await Note.findOne({ 
      _id: noteId, 
      userEmail: userEmail 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or you do not have access to this note' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific shared note by ID (from ShareNotes collection)
router.get('/shared-notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    if (!noteId) {
      return res.status(400).json({ message: 'Note ID is required' });
    }

    // Find the shared note by ID and check if user has access
    const sharedNote = await ShareNote.findOne({ 
      _id: noteId, 
      userEmail: userEmail 
    });

    if (!sharedNote) {
      return res.status(404).json({ message: 'Shared note not found or you do not have access to this note' });
    }

    res.status(200).json(sharedNote);
  } catch (error) {
    console.error('Error fetching shared note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Share a note with another user
router.post('/share-note', async (req, res) => {
  try {
    const { noteId, senderEmail, recipientEmail, noteText } = req.body;

    // Validate required fields
    if (!noteId || !senderEmail || !recipientEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Note ID, sender email, and recipient email are required' 
      });
    }

    // Check if sender exists and is verified
    const sender = await User.findOne({ email: senderEmail, isVerified: true });
    if (!sender) {
      return res.status(401).json({ 
        success: false, 
        message: 'Sender not found or not verified' 
      });
    }

    // Check if recipient exists and is verified
    const recipient = await User.findOne({ email: recipientEmail, isVerified: true });
    if (!recipient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recipient not found or not registered. Notes can only be shared with registered users.' 
      });
    }

    // Check if the note exists and belongs to the sender
    const originalNote = await Note.findOne({ 
      _id: noteId, 
      userEmail: senderEmail 
    });

    if (!originalNote) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found or you do not have permission to share this note' 
      });
    }

    // Create a new ShareNote for the recipient (using ShareNote model)
    const shareNote = new ShareNote({
      text: noteText || originalNote.text,
      userEmail: recipientEmail,
      sharedFrom: senderEmail,
      originalNoteId: noteId,
      isShared: true
    });

    await shareNote.save();

    res.status(200).json({ 
      success: true, 
      message: 'Note shared successfully!' 
    });

  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all shared notes for a user
router.get('/shared-notes', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists and is verified
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found or not verified' 
      });
    }

    // Fetch shared notes from ShareNote collection
    const sharedNotes = await ShareNote.find({ 
      userEmail: email 
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: sharedNotes.length,
      notes: sharedNotes
    });

  } catch (error) {
    console.error('Error fetching shared notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a shared note
router.delete('/shared-notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!noteId) {
      return res.status(400).json({ message: 'Note ID is required' });
    }

    // Check if user exists and is verified
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found or not verified' 
      });
    }

    // Find and delete the shared note from ShareNote collection
    const deletedNote = await ShareNote.findOneAndDelete({ 
      _id: noteId, 
      userEmail: email 
    });

    if (!deletedNote) {
      return res.status(404).json({ 
        message: 'Shared note not found or you do not have permission to delete this note' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Shared note deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting shared note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


