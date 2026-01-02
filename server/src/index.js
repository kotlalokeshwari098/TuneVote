import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express()
app.use(cookieParser())
app.use(cors({ 
    origin: process.env.FROTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

import authRoutes from '../routes/auth.route.js';
import songRoutes from '../routes/songs.route.js';
import jamRoutes from '../routes/jam.route.js';

app.use('/api/auth', authRoutes);
app.use('/api/songs',songRoutes);
app.use('/api/jam',jamRoutes)



export default app;