const express=require('express');
const app=express();
const port=5656;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Hello World!');
});


app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});