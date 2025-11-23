const socketIo = require("socket.io");
const http = require('http');
const app = require('./index.js');
const pool=require('../db/db.js')

const port = process.env.PORT;
const server = http.createServer(app);


// Initialize Socket.IO with the server
let io = socketIo(server);
io=socketIo(server,{
    cors:{
        origin:"*"
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


    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

io.on("disconnect",(socket)=>{
    console.log('client disconnected',socket.id)
})

server.listen(port, () => console.log(`Server running on port ${port} with Socket.IO enabled`));