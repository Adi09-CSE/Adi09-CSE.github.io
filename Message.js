import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: { type:String, required:true, trim:true, maxlength:100 },
  email: { type:String, required:true, trim:true, lowercase:true },
  message: { type:String, required:true, trim:true, maxlength:5000 }
}, { timestamps:true });

export default mongoose.model('Message', MessageSchema);
