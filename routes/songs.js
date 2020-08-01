const express = require('express')
const router = express.Router()
var song_controller = require('../controller/songs')

module.exports = router;

router.get('/get_all_playlist/:user_id', song_controller.all_playlist_of_users)
router.post('/create_playlist', song_controller.create_playlist)
router.post('/add_songs', song_controller.add_songs)