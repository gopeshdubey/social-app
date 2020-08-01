var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    user_id : { type: String, required: true, default: "" },
    post_id : { type: String, required: true, default: "" },
	comment: { type: String, require: true, default: "" },
    created_at : { type: String, required: true, default: "" },
    updated_at : { type: String, default: "" }
});
  
var postcomment = mongoose.model('postcomment', postSchema);

module.exports = postcomment;