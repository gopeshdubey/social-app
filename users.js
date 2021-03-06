var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://gopesh:gopesh123@cluster0.on5bp.mongodb.net/jiviz?retryWrites=true&w=majority', {useNewUrlParser: true});

var UserSchema = new Schema({
  first_name : {type: String, required: true, default: ""},
  last_name : {type: String, default: ""},
  phone : {type: String, default: ""},   //new added
  about : {type: String, default: ""},   //new added
  profile_image_url : {type: String, default: ""},
  photos:[{type: string, default: ""}],// it is array of photo_url of the user.
  videos:[{type: string, default: ""}],// it is array of vedios_url of the user.
  posts:[{type: string, default: ""}], // it is array of posts_url of the user. we can also store text over there. 
  status:[{type: string, default: ""}], 


  // for push notification on one signal
  notification_token : {type: Object, default: ""},
  access_token : {type: String, default: ""},   //new added

  socket_id : {type: Object, default: ""}, //always update on every login time
  online_status : {type: Boolean, default: true}, //if socket id is available then it set to online else offline
  is_login : {type: Boolean, default: true}, //for login and logout

  is_blocked : {type: Boolean, default: false},   //new added

  created_at : {type: String, required: true},
  last_login : {type: String, required: true},

  groups : [{type: ObjectId, default: ""}],  //new added
  invitations: [{                                   //new added
      sender_id : {type : Object, default: ""},
      room_id : {type : Object, default: ""}
  }],

  friends: [{
    friend_id : {type : Object, default: ""},
    join_at: {type: String, required: true},
    display_name : {type: String, default: ""}
  }],//this for storing object Id of all the freinds.
  blocked_friends:[{type:ObjectId}],// store the frinds object list wants to block.
  friend_requests : [{type : ObjectId}],

  blocked_group : [{type: Object, default: ""}],
  muted_group : [{type: ObjectId, default: ""}],
 
});

var User = mongoose.model('users', UserSchema);

module.exports = User;