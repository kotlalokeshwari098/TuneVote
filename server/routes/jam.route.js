const express =require  ("express");
const route=express.Router();
const jamsController=require('../controller/jams.controller.js')



route.post('/generate-QR-Code',jamsController.createQRCode)
route.post('/:roomcode',jamsController.validateRoomCode)


module.exports=route;