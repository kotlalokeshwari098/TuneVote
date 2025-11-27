const express =require  ("express");
const  AuthController = require('../controller/auth.controller.js');
const verifyToken=require('../middleware/verifyToken.js')
const route = express.Router();


route.post('/register',AuthController.registerUser)
route.post('/login',AuthController.loginUser)
route.get('/profile',verifyToken,AuthController.profile)
route.post('/logout',AuthController.logout)

module.exports=route