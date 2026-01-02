import express from "express";
import {registerUser,loginUser,profile,logout} from '../controller/auth.controller.js';
import verifyToken from '../middleware/verifyToken.js';
const route = express.Router();


route.post('/register',registerUser)
route.post('/login',loginUser)
route.get('/profile',verifyToken,profile)
route.post('/logout',logout)

export default route;