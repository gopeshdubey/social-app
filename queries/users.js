const Register = require("../Model/users");

var ObjectData = {}

ObjectData.getAllUsers = async () => {
    return new Promise((resolve, reject) => {
      Register.find({}, (err, data) => {
        if (err) reject(err);
        else{
         resolve(data);   
        }
      })
    })
  }

  module.exports = ObjectData;