var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var friendRequestSchema = new Schema({
    sender_id : { type: Object, required: true, default: "" },
    reciver_id : { type: Object, required: true, default: "" },
	status: { type: String, require: true, default: "unaccepted" },
    created_at : { type: String, required: true, default: "" },
    updated_at : { type: String, required:true,default: "" }
});
  
var friendRequest = mongoose.model('friendRequest', friendRequestSchema);

module.exports = friendRequest;