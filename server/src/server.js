const socketIo = require("socket.io");
const http = require('http');
const app = require('./index.js');
const pool=require('../db/db.js')
const formatMessage=require('../utils/messages.js')
const {jammerJoin,getRoomCount}=require('../utils/jammers.js');
const redisClient = require("./redisClient.js");

const port = process.env.PORT;
const server = http.createServer(app);


// Initialize Socket.IO with the server
let io = socketIo(server);
io=socketIo(server,{
    cors:{
        origin:process.env.FROTEND_URL,
        credentials:true
    }
})

io.on("connection", async (socket)=>{
    socket.on("join", async (data) => {
      if(socket.joined) return;
      socket.joined = true;
      console.log(`Client joined: ${socket.id}`);


       const userId = Number(data.userId);


      if (!userId) {
        return socket.emit("error", { message: "Invalid user data" });
      }

      await pool.query(
        "UPDATE users SET socketid = ($1) WHERE id = ($2)",
        [socket.id, userId]
      );
    });

    socket.on("join_room",async({username,jamName})=>{
       const user=jammerJoin(socket.id,username,jamName);

       socket.join(jamName)

       const count=getRoomCount(io,jamName);

       socket.emit("message",formatMessage("TuneVote","welcome to tunevote!!"))
      //  console.log(socket.rooms); 
       const messages=await redisClient.lRange(`jam:${jamName}:chat`,0,-1);
       const parsedMessages=messages.map(msg=>JSON.parse(msg));

       socket.emit("initial_chat", parsedMessages);
       io.to(jamName).emit("room_users",{count});
    })
    

    socket.on("chat",async({jamName,username,message,timestamp})=>{
       let chat=JSON.stringify({username,message,timestamp})
       await redisClient.rPush(`jam:${jamName}:chat`,chat)

       const chatFron = { username, message, timestamp };
       io.to(jamName).emit("chat_message", chatFron);
    })

    socket.on("upvote_song_id",async({songid,userid,jamName})=>{

      let resp=await redisClient.zRangeWithScores(`jam:${jamName}:votes`, 0, -1, { WITHSCORES: true });


      const resp1=await redisClient.SISMEMBER(`jam:${jamName}:song:${songid}`,userid);
      //  console.log(resp1,"resp1")

       if(resp1==0){
         const user=await redisClient.SADD(`jam:${jamName}:song:${songid}`,userid);

         await redisClient.ZINCRBY(`jam:${jamName}:votes`,1,songid)
         resp= await redisClient.zRangeWithScores(`jam:${jamName}:votes`, 0, -1, { WITHSCORES: true });

       }

       io.to(jamName).emit("upvote_updated_count",resp);
    })
    
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

io.on("disconnect",(socket)=>{
    console.log('client disconnected',socket.id)
})

server.listen(port, () => console.log(`Server running on port ${port} with Socket.IO enabled`));