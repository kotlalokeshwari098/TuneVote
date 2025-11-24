const ApiResponse = require("../utils/ApiResponse")
const QRCode =require("qrcode")
const pool = require("../db/db.js");


const createQRCode=async(req,res)=>{
    const {url}=req.body;
    console.log(url)
    try {
        const response=await QRCode.toDataURL(url); 
        // console.log(response)
        return res.status(200).json(new ApiResponse(201,true,"QRCode generated!!",response))
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"));
    }
}

const validateRoomCode=async(req,res)=>{
    const {roomcode}=req.params;
    try {
        const response=await pool.query(`SELECT * FROM jamsessions WHERE uniqueroomjamid=($1)`,[roomcode])
        if(!response.rows[0]){
            return res.status(403).json(new ApiResponse(403,false,"Wrong Room Id"))
        }
        return res.status(200).json(new ApiResponse(200,true,"Entered The Correct RoomId"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,false,"Error Validating RoomCode"))
    }
}

const getJamList=async(req,res)=>{
    const jamName=req.params.jamName;
    console.log(req.params)
   try {
      const response=await pool.query(`SELECT songslist FROM jamsessions WHERE jamname=($1)`,[jamName])
    //   console.log(response.rows[0])
      const songslist=JSON.parse(response.rows[0].songslist)
      return res.status(200).json(new ApiResponse(200,true,"Fetched Successfully!",songslist))
   } catch (error) {
     return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"))
   }
}

module.exports={
    createQRCode,
    validateRoomCode,
    getJamList
}