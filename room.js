var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    name : {type: String, required: true, default: ""},
    icon_url : {type: String, default: ""}, // group icon
    created_by : {type: Object, required: true, default: ""},    // user id who created this group
    users: [{
        user_id : {type : Object, default: ""},
        is_admin :  {type : Boolean, default: false},
        status: {type: String, default: "joined"},
        join_at: {type: String, required: true},
        display_name : {type: String, default: ""}
    }],
    invitations: [{                                   //new added
        sender_id : {type : Object, default: ""},
        receiver_id : {type : Object, default: ""}
    }],
    open_to_all : {type: Boolean, default:false},
    created_at : {type: String, required: true},    
    updated_at : {type: String, required: true},    //new added
    is_group : {type : Boolean, default : true},
    history_enable : {type : Boolean, default : true}, // for retrive old message for techmeth it will be true and for veetrend it will be false.
    invitation_blocked : {type : Boolean, default : true},
    is_deleted : {type : Boolean, default: false},
    group_address: {type: String, default: ""},
	location : {
		type : {type : Object, default: "Point"},
		coordinates : {type : Array, required: true, default: ""}
	}
  });
  
  var Room = mongoose.model('rooms', RoomSchema);
  
  module.exports = Room;