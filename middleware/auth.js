const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .json({code: 401, message: "Access denied", result: "No Token provided"});

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.tokenData = decoded;
    next();
  } catch (ex) {
    res
      .status(400)
      .json({code: 400, message: "Invalid token", result: "Invalid token"});
  }
};
