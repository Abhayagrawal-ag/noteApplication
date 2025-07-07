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
  },
   passwordResetCode:{
    type:String,
     // Optional field
  },
  passwordResetCodeExpires:{
    type:Date,
     // Optional field
  }
  
}, { timestamps: true });
export default mongoose.model('User', userSchema);
  