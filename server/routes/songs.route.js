import express from "express";
const route = express.Router();
import {searchSong,createJam,getAllJams,getJamList} from '../controller/songs.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/multer.middleware.js';


route.get('/search-song',searchSong);
route.post('/create-jam',verifyToken,upload.single('qrcode'),createJam);
route.get('/get-jamList',verifyToken,getJamList);
route.get('/get-all-jams',getAllJams);


export default route;