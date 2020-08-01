var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    user_id: { type: String, required: true },
    reciever_id: { type: String, required: true },
    chats: [{
        user_id: { type: String, default: ""},
        message: { type: String, default: "" },
        created_at: { type: String, default: new Date() },
    }]
})

module.exports = mongoose.model('chats', ChatSchema);