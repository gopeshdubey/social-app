const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var registerSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    default: "",
  },
  gender: {
    type: String,
  },
  password: {
      type: String,
      required: true
  },
  socket_id: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("register", registerSchema);
