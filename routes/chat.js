const express = require('express')
var router = express.Router()
const chat_controller = require('../controller/chat')

router.post('/get_all_chats', chat_controller.get_all_chats);

module.exports = router;