const express =require  ("express");
const route=express.Router();
const jamsController=require('../controller/jams.controller.js')



route.post('/generate-QR-Code',jamsController.createQRCode)
route.post('/:roomcode',jamsController.validateRoomCode)
route.get('/:jamName',jamsController.getJamList)
route.put('/end-session/:jamName',jamsController.endJamSession)
route.get('/songs-vote/:jamName',jamsController.songsVotes)

module.exports=route;