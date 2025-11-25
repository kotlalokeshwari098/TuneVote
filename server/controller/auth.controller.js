const pool = require("../db/db.js");
const ApiResponse=require('../utils/ApiResponse')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');

const registerUser=async(req,res)=>{
    const {email,password,username,role}=req.body

    try {
        const userExist=await pool.query(`SELECT * FROM users WHERE email=($1)`,[email])

        if(userExist.rows.length!==0) return res.status(409).json(new ApiResponse(409,"false","User already exits!"))

        const hashedPassword=bcrypt.hashSync(password,12)

        const response=await pool.query(`INSERT INTO users (email,password,username,role) values ($1,$2,$3,$4) `,[email,hashedPassword,username,role])


        return res.status(201).json(new ApiResponse(201,"true","User registered successfully!"))
        
    } catch (error) {

        return res.status(500).json(new ApiResponse(400,"false",error.message))
    }
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body
    
    try {
        const response=await pool.query(`SELECT * FROM users WHERE email=($1)`,[email])

        if(response.rows.length===0) return res.status(404).json(new ApiResponse(401,"error","User does not exists!"))

        const hashedPassword=response.rows[0].password
        const checkPassword=bcrypt.compareSync(password,hashedPassword)

        const id=response.rows[0].id;
        if(!checkPassword) return res.status(401).json(new ApiResponse(401,"false","Password is incorrect!"))
        const token=jwt.sign({id},process.env.JWT_SECRET,{ expiresIn: '2h' })

        const user=response.rows[0]
        const {password:hashedPasswordFromDB,...userWithoutPassword}=user
        // console.log(userWithoutPassword)

        res.cookie("jwt",token,{
            maxAge:7 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV != "development"
        })

        return res.status(200).json(new ApiResponse(200,"true","Login successful",{token,userWithoutPassword}))
    } catch (error) {
// console.log(error.message)
        return res.status(500).json(new ApiResponse(400,"false",error.message))
    }
}

const logout=async(req,res)=>{
     res.cookie("jwt","",{maxAge:0});
     return res.status(200).json(new ApiResponse(200,"true","Logged Out Successfully!!"))
}


module.exports={
    registerUser,
    loginUser,
    logout
}