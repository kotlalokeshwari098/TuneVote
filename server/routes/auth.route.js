const Router =require  ("express");
const { registerUser,loginUser } = require('../controller/auth.controller');
const route = Router();


route.post('/register',registerUser)
route.post('/login',loginUser)

module.exports=route