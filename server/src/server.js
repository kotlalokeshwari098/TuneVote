import { Server } from "socket.io";
import http from "http";
import app from "./index.js";
import pool from "../db/db.js";
import formatMessage from "../utils/messages.js";
import { jammerJoin, getRoomCount } from "../utils/jammers.js";
import redisClient from "./redisClient.js";
import logger from "../core/logger.js";

const port = process.env.PORT;
const server = http.createServer(app);

let io;

if (process.env.NODE_ENV !== "test") {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      if (socket.joined) return;
      socket.joined = true;

      const userId = Number(data.userId);
      if (!userId) {
        return socket.emit("error", { message: "Invalid user data" });
      }

      await pool.query(
        "UPDATE users SET socketid = $1 WHERE id = $2",
        [socket.id, userId]
      );
    });

    socket.on("join_room", async ({ username, jamName }) => {
      jammerJoin(socket.id, username, jamName);
      socket.join(jamName);

      const count = getRoomCount(io, jamName);

      socket.emit(
        "message",
        formatMessage("TuneVote", "welcome to tunevote!!")
      );

      const messages = await redisClient.lRange(
        `jam:${jamName}:chat`,
        0,
        -1
      );

      socket.emit(
        "initial_chat",
        messages.map((msg) => JSON.parse(msg))
      );

      io.to(jamName).emit("room_users", { count });
    });

    socket.on("chat", async ({ jamName, username, message, timestamp }) => {
      await redisClient.rPush(
        `jam:${jamName}:chat`,
        JSON.stringify({ username, message, timestamp })
      );

      io.to(jamName).emit("chat_message", {
        username,
        message,
        timestamp,
      });
    });

    socket.on("upvote_song_id", async ({ songid, userid, jamName }) => {
      const alreadyVoted = await redisClient.SISMEMBER(
        `jam:${jamName}:song:${songid}`,
        userid
      );

      if (!alreadyVoted) {
        await redisClient.SADD(
          `jam:${jamName}:song:${songid}`,
          userid
        );
        await redisClient.ZINCRBY(
          `jam:${jamName}:votes`,
          1,
          songid
        );
      }

      const votes = await redisClient.zRangeWithScores(
        `jam:${jamName}:votes`,
        0,
        -1
      );

      io.to(jamName).emit("upvote_updated_count", votes);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  pool.connect().then(() =>
    logger.info("Database connected")
  );

  server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

export default server;
