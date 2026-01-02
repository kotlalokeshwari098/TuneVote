import ApiResponse from "../utils/ApiResponse.js";
import { getAccessToken } from "../utils/spotifyAuth.js";
import formatMessage from '../utils/messages.js';
import axios from "axios";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import pool from '../db/db.js';
import redisClient from '../src/redisClient.js';

const searchSong=async(req,res)=>{
    // console.log(req.query.query)   
    const songName=req.query.query;
    try {
        if (!songName) {
            return res.status(400).json(new ApiResponse(400, false, 'Missing song name'));
        }
        // console.log(songName)

        const token = await getAccessToken();
        // console.log(token);

        const searchFun=async()=>{
           return await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: songName,
                type: 'track',
                limit: 10
            }
          });
        }
        

        let results=null;
        let song=null;
        const key=songName.toLowerCase()
        const value=await redisClient.get(key)
        // console.log(value)

        if(value){
            // console.log(value,"cache hit!!")
            results=JSON.parse(value)
            song=results.map((item)=>({
            name:item.name,
            id:item.id,
            image:item.image
        }))
        }
        else{
          results=await searchFun()
          song=results.data.tracks.items.map((item)=>({
            name:item.name,
            id:item.id,
            image:item.album.images
        }))
        // console.log(results)
        // console.log(song)
        await redisClient.set(key, JSON.stringify(song),{
            EX:500
        })
        // console.log("cache miss")
    }
        
        // console.log(track);
        return res.status(200).json(new ApiResponse(200, true, 'Song fetched successfully', song));
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error'));
    }

}

const createJam=async(req,res)=>{
    let {name,roomId}=req.body;
    const songsData = typeof req.body.songs === "string" ? JSON.parse(req.body.songs) : req.body.songs;

    // console.log(songs,"songssss")
    try {
        let qrUrl="";
        let qrPublicId="";
        if (req.file) {
          const uploadResult = await uploadOnCloudinary(req.file.path);
          originalFileName = req.file.originalname; 


          if (!uploadResult) {
            return res.status(500).json({ message: "Failed to upload resume" });
          }
          qrUrl = uploadResult.secure_url;
          qrPublicId = uploadResult.public_id;
        }

        const response=await pool.query(`INSERT INTO jamsessions (user_id,jamname,songsList,qrcodeurl,qrcodepublicid,uniqueroomjamid) values($1,$2,$3,$4,$5,$6)`,[req.userId,name,JSON.stringify(songsData),qrUrl,qrPublicId,roomId]);

        const welcomeMessage=JSON.stringify({username:"TuneVote",message:`welcome to ${name}!!`})
        await redisClient.lPush(`jam:${name}:chat`, welcomeMessage);

        //to store the vote count of each song with id
        await Promise.all(
            songsData.map((song) => {
                if (!song.id) {
                console.error("Missing ID in song:", song);
                throw new Error("Song ID is missing");
                }
                return redisClient.zAdd(`jam:${name}:votes`, [
            { score: 0, value: song.id }
            ]);
          })
        );

        // console.log(response)
        return res.status(201).json(new ApiResponse(201,"true","Jam added successfully"))
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500,false,'Internal Server Error'))
    }
}

const getJamList = async (req, res) => {
  try {
    const resp = await pool.query(
      "SELECT * FROM jamsessions WHERE user_id = ($1)",
      [req.userId]
    );
    // console.log(resp.rows)


    return res.status(201).json(
      new ApiResponse(201, "true", "Fetched successfully!!", resp.rows)
    );
  } catch (err) {
    // console.log(err.message);
    return res.status(500).json(
      new ApiResponse(500, "false", "Internal Server Error")
    );
  }
};


const getAllJams=async(req,res)=>{
    try {
        const response=await pool.query(`SELECT jamsessions.*, u.username FROM jamsessions JOIN users u ON jamsessions.user_id = u.id`)
        
        return res.status(201).json(new ApiResponse(201,"true","Fetched successfully!!",response.rows))
    }
        catch (error) { 
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500,"false","Internal Server Error"))
    }
}


export {
    searchSong,
    createJam,
    getJamList,
    getAllJams
};