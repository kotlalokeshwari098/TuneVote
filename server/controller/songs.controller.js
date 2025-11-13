const ApiResponse = require("../utils/ApiResponse")
const {getAccessToken}=require("../utils/spotifyAuth.js")
const axios=require("axios")
const pool=require('../db/db.js')

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

        const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            q: songName,
            type: 'track',
            limit: 5
        }
        });
        // console.log(response.data)
        
        const track = response.data.tracks.items.map((item)=>({
             name:item.name,
            id:item.id,
            image:item.album.images
        }
            
        ));
        // console.log(track);
        return res.status(200).json(new ApiResponse(200, true, 'Song fetched successfully', track));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, false, 'Internal Server Error'));
    }

}

const createJam=async(req,res)=>{
    // console.log(req.body);
    const {name,songs}=req.body;
    try {
        const response=await pool.query(`INSERT INTO jamsessions (user_id,jamname,songsList) values($1,$2,$3)`,[req.userId,name,JSON.stringify(songs)]);
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
        // console.log(response)
        return res.status(201).json(new ApiResponse(201,"true","Fetched successfully!!",response.rows))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,"false","Internal Server Error"))
    }
}

module.exports={
    searchSong,
    createJam,
    getJamList
}