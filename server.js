import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Message from './models/Message.js';

dotenv.config();

// Add these debug lines
console.log('PORT from env:', process.env.PORT);
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
console.log('Current working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5500','http://localhost:5500','http://localhost:3000'], // VS Code Live Server / dev
  methods: ['POST','GET'],
}));

async function connectDB(){
  const uri = process.env.MONGODB_URI;
  if(!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }
  try{
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
    });
    console.log('MongoDB connected');
  }catch(err){
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
connectDB();

app.get('/health', (_req,res)=> res.json({ok:true}));

app.post('/api/contact', async (req,res)=>{
  try{
    const { name, email, message } = req.body || {};
    if(!name || !email || !message){
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // Very basic email pattern
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailOk) return res.status(400).json({ error:'Invalid email.' });

    const doc = await Message.create({ name, email, message });
    return res.status(201).json({ id: doc._id, ok:true });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`));