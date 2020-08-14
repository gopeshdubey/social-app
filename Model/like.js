var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var likesSchema = new Schema({
    user_id : { type: Object, required: true, default: "" },
    status_id : { type: Object, default: "" },
    post_id : { type: Object, default: "" },
    status: { type: String, default: "unlike" },
    created_at : { type: String, default: "" },
    updated_at : { type: String, default: "" }
});
  
var likes = mongoose.model('likes', likesSchema);

module.exports = likes;