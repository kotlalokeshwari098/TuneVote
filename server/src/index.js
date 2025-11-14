const express=require('express');
const app=express();
const port=5656;
const pool=require('../db/db.js')
const cors=require('cors')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

const authRoutes = require('../routes/auth.route.js');
const songRoutes=require('../routes/songs.route.js');
const jamRoutes=require('../routes/jam.route.js')

app.use('/api/auth', authRoutes);
app.use('/api/songs',songRoutes);
app.use('/api/jam',jamRoutes)


pool.connect().then(()=>console.log("database is connected!!!"))

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});