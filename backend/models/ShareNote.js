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
    default: null
  },
  originalNoteId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  isShared: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ShareNote', noteSchema);
