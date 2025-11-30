const ApiResponse = require("../utils/ApiResponse")
const QRCode =require("qrcode")
const pool = require("../db/db.js");
const redisClient =require('../src/redisClient.js')

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
    // console.log(req.params)
   try {
      const resp=await pool.query(`SELECT u.username as created_by, js.songslist FROM jamsessions js JOIN users u on u.id=js.user_id AND js.jamname=($1)`,[jamName])
    //   console.log(resp.rows[0])

      const songslist=resp.rows[0].songslist;

      return res.status(200).json(new ApiResponse(200,true,"Fetched Successfully!",{songslist,created_by:resp.rows[0].created_by}))

   } catch (error) {
    // console.log(error.message)
     return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"))
   }
}

const endJamSession=async(req,res)=>{
    const jamName=req.params.jamName;
    try {
        const response=await pool.query(`UPDATE jamsessions SET expires=($1) WHERE jamname=($2) RETURNING *`,[true,jamName])
         
        if(response.rows[0].length==0){
            return res.status(404).json(new ApiResponse(404,false,"Jam Session is not found"))
        }

        await redisClient.del(`jam:${jamName}:chat`)

        return res.status(200).json(new ApiResponse(200,true,"Jam Session Ended Successfully!"));
    } catch (error) {
        // console.log(error.message);
        return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"));
    }
}

const songsVotes=async(req,res)=>{
    const jamName=req.params.jamName;
    // console.log(jamName,"songsvoteee")
    try {
        const response=await redisClient.zRangeWithScores(`jam:${jamName}:votes`, 0, -1, { WITHSCORES: true });
        // console.log(response,"ressss")
        return res.status(200).json(new ApiResponse(200,true,"Fetched Successfully",response));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"));
    }
}

module.exports={
    createQRCode,
    validateRoomCode,
    getJamList,
    endJamSession,
    songsVotes
}