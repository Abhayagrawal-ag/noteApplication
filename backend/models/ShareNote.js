import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  sharedFrom: {
    type: String,
    required:true
  },
  originalNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  isShared: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ShareNote', noteSchema);
