var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var cors = require('cors');
const path = require('path')
var socket = require("socket.io");
const chat = require('./routes/chat')
const register = require('./routes/register')
const songs = require('./routes/songs')
const users = require('./routes/users')
const chats = require('./queries/chat')
require('./db/db')

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/chat', chat)
app.use('/start', register)
app.use('/songs', songs)
app.use('/users', users)
app.use('/api/get/', express.static(path.join(__dirname )));

var server = app.listen(3030, () => {
  console.log("listen On port number 3030");
});

var io = socket(server);

io.on("connection", (socket) => {

  app.get('/socketId', (req, res) => {
    res.json({
      success: 200,
      message: 'success',
      result: socket.id
    })
  })
  
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on('chat', async (data) => {
    console.log('message data :::::', data);
    try {
      io.to(data.address).emit('chat', data)
      await chats.insertChat(data.user_id, data.reciever_id, data.message)
    } catch (error) {
      console.log('error in socket :::::', error);
    }
  })
});
