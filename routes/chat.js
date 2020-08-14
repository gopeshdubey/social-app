const express = require('express')
var router = express.Router()
const chat_controller = require('../controller/chat')

router.post('/get_all_chats', chat_controller.get_all_chats);
router.get('/get_user_chat/:user_id', chat_controller.get_user_chats)

module.exports = router;