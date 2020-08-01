const UsersData = require("../queries/users");

// =============================== GET ALL USERS ==================================
const getAllUsers = async (req, res) => {
  try {
    var dataOfUsers = await UsersData.getAllUsers();
    res.json({
      code: 200,
      message: "success",
      result: dataOfUsers,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

module.exports = {
    getAllUsers
}
