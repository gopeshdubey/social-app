var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongsSchema = new Schema({
    user_id: {type: String, default: ""},
    playlist_name: {type: String, default: ""},
    songs_of_playlist: [{
        playlist_name: {type: String, default: ""},
        songs_name: {type: String, default: ""}
    }],
    created_at: {type: String, default: new Date()}
})

module.exports = mongoose.model('songs', SongsSchema);