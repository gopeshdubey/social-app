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
var registers = require('./queries/register')
require('./db/db')
const link = "https://jiviz.com"

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/chat', chat)
app.use('/start', register)
app.use('/songs', songs)
app.use('/users', users)
// app.use('/api/get/', express.static(path.join(__dirname )));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/link/:referral_id', (req, res) => {
  var { referral_id } = req.params
  res.json({
    code: 200,
    message: "success",
    result: link + '/query_data?id='+ referral_id
  })
})

var server = app.listen(3030, () => {
  console.log("listen On port number 3030");
});

var io = socket(server);
var idArray = [];

io.on("connection", (socket) => {
  console.log('A user has connected to the server.');
  idArray.push(socket.id)

  // store all id in array
  socket.on('get-id', (data) => {
    io.emit('get-id', idArray)
    console.log('id array :::::', idArray);
  })

  socket.on('chat', (data) => {
    console.log('data :::::', data);
    socket.broadcast.to(data.address).emit('recievedMessage', data)
    try {
      chats.insertChat(data.user_id, data.reciever_id, data.message)
    } catch (error) {
      console.log('error in socket :::::', error);
    }
  })

  // ====================== Upload status ===============================
  socket.on('uploadStatus',(data)=>{
    registers.uploadStatus(data.user_id, data.status).then(result => {
      io.emit('status',result);
    })
  });

  socket.on('uploadPosts',(data)=>{
    const statusData = registers.uploadPost(data.user_id,data.status)
    statusData.then(function(result){
      io.emit('status',result);
    })
  });

  // disconnect
  socket.on('disconnect', function(){
    // DELETE DATA FROM ARRAY BY NAME
    idArray.splice(idArray.indexOf(socket.id), 1)
    io.emit('get-id', idArray)
    console.log(socket.id + ' user disconnected');
  });
});
