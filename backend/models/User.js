import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required:true,
    minlength:8
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  verificationCode:{
    type:String,
    required:true
  },
  verificationCodeExpires:{
    type:Date,
    required:true
  }
  
}, { timestamps: true });
export default mongoose.model('User', userSchema);
  