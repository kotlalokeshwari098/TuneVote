const express =require  ("express");
const route=express.Router();
const songsController=require('../controller/songs.controller.js')
const verifyToken=require('../middleware/verifyToken.js')



route.get('/search-song',songsController.searchSong);
route.post('/create-jam',verifyToken,songsController.createJam);
route.get('/get-jamList',verifyToken,songsController.getJamList);




module.exports=route;