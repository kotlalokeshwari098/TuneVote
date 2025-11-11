const ApiResponse = require("../utils/ApiResponse")
const {getAccessToken}=require("../utils/spotifyAuth.js")
const axios=require("axios")
// - Token Caching: Avoid fetching the token on every request — cache it until it expires.
// 
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
        
        const track = response.data.tracks.items;
        // console.log(track);
        return res.status(200).json(new ApiResponse(200, true, 'Song fetched successfully', track));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, false, error.message));
    }

}

module.exports={searchSong}