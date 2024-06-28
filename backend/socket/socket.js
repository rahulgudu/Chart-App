import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  // socket.on() is used to the events that can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

export { app, server, io }