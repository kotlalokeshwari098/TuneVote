import express from "express";
const route = express.Router();
import {createQRCode, validateRoomCode,getJamList, endJamSession, songsVotes} from '../controller/jams.controller.js'

route.post('/generate-QR-Code',createQRCode)
route.post('/:roomcode',validateRoomCode)
route.get('/:jamName',getJamList)
route.put('/end-session/:jamName',endJamSession)
route.get('/songs-vote/:jamName',songsVotes)

export default route;