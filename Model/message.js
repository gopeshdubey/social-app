var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    sender_id : {type: Object, required: true, default: ""},
    room_id : {type: Object, required: true, default: ""},
    content_type : {type: String, required: true, default: ""},
    file_url : {type : String, default : ""},
    file_size : {type : String, default : ""},
    created_at : {type: String, required: true},
    updated_at : {type: String, required: false},  /// new added
    thumbnail_data: {type : String, default : ""},
    recalled: {type : Boolean, default : false},
    retain_count: {type : Number, default : ""},
    content: {type : Object, default : ""},
    parent_msg: {type : Object, default : ""},
    read_id: [{type : String, default : ""}],
    delivered_to: [{type : String, default : ""}],
    like_id: [{type : String, default : ""}], ///new added
    deleted_id: [{type : Object, default : ""}],
    deleteTime : {type : Date, default: new Date()},
    is_withdraw : {type : Boolean ,default : false},
    read_info : [{user_id : Object, status : {type: String, default : "pending"}, date : String}]
  });
  
  var Message = mongoose.model('message', MessageSchema);
  
  module.exports = Message;