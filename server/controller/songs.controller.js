const ApiResponse = require("../utils/ApiResponse")
const {getAccessToken}=require("../utils/spotifyAuth.js")
const formatMessage=require('../utils/messages.js')
const axios=require("axios")
const {uploadOnCloudinary}=require('../utils/cloudinary.js')
const pool=require('../db/db.js')
const redisClient =require('../src/redisClient.js')
// console.log(redisClient)

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
    // console.log(req.body);
    const {name,songs,roomId}=req.body;
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

        const response=await pool.query(`INSERT INTO jamsessions (user_id,jamname,songsList,qrcodeurl,qrcodepublicid,uniqueroomjamid) values($1,$2,$3,$4,$5,$6)`,[req.userId,name,JSON.stringify(songs),qrUrl,qrPublicId,roomId]);

        const welcomeMessage=JSON.stringify({username:"TuneVote",message:`welcome to ${name}!!`})
        await redisClient.lPush(`jam:${name}:chat`, welcomeMessage);

        // console.log(response)
        return res.status(201).json(new ApiResponse(201,"true","Jam added successfully"))
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500,false,'Internal Server Error'))
    }
}

const getJamList=async(req,res)=>{
    try {
        const response=await pool.query(`SELECT * FROM jamsessions WHERE user_id=($1)`,[req.userId])
        // console.log(response.rows)


        const response1=response.rows.map((r)=>{
            if(r.songslist) return {...r,songslist:(JSON.parse(r.songslist))}
            else return r
        })

        // console.log(Array.isArray(response1[0].songslist))  // true
        // console.log(response1[0].songslist[0].name)   
        return res.status(201).json(new ApiResponse(201,"true","Fetched successfully!!",response1))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,"false","Internal Server Error"))
    }
}

const getAllJams=async(req,res)=>{
    try {
        const response=await pool.query(`SELECT jamsessions.*, u.username FROM jamsessions JOIN users u ON jamsessions.user_id = u.id`)
        // console.log(response.rows)
        const response1=response.rows.map((r)=>{
            if(r.songslist) return {...r,songslist:(JSON.parse(r.songslist))}
            else return r
        })
        
        return res.status(201).json(new ApiResponse(201,"true","Fetched successfully!!",response1))
    }
        catch (error) { 
        return res.status(500).json(new ApiResponse(500,"false","Internal Server Error"))
    }
}


module.exports={
    searchSong,
    createJam,
    getJamList,
    getAllJams
}