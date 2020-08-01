const jwt = require('jsonwebtoken')

var obj = {};

obj.generateJWT = async (id, first_name, last_name, email, dob, gender) => {
  return jwt.sign(
    {
      id: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      dob: dob,
      gender: gender
    },
    "secretkey",
  );
};

module.exports = obj;
