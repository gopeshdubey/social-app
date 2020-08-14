var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ChatSchema = new Schema({
    user_id: { type: Object, required: true },
    reciever_id: { type: Object, required: true },
    chats: [{
        user_id: { type: Object, default: ""},
        message: { type: String, default: "" },
        created_at: { type: String, default: new Date() },
    }]
})

module.exports = mongoose.model('chats', ChatSchema);