const express =require  ("express");
const route=express.Router();
const songsController=require('../controller/songs.controller.js')

route.get('/search-song',songsController.searchSong);






module.exports=route;