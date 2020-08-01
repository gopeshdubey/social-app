var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var client = 0;

io.on("connection", (socket) => {
  console.log("user get connected");
  client++;
  socket.on("hello", () => {
    socket.emit("broadcast", {message: "welcome to chat app"});
    socket.broadcast.emit("broadcast", {message: client + "connected Users"});
  });

  socket.on("disconnect", function () {
    client--;
    socket.broadcast.emit("broadcast", {message: client + "connected Users"});
    console.log("A user disconnected");
  });
});

module.exports = io;