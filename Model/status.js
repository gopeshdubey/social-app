var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var statusSchema = new Schema({
    user_id : { type: Object, required: true, default: "" },
    status : { type: String, required: true, default: "" },
    created_at : { type: String, required: true, default: "" },
    updated_at : { type: String, required:true,default: "" }
});
  
var status = mongoose.model('status', statusSchema);

module.exports = status;