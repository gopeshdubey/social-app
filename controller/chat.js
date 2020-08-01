const chats_controller = require("../queries/chat");

const get_all_chats = async (req, res) => {
  try {
    var { user_id, reciever_id } = req.body;
    var chats_data = await chats_controller.getAllChats(user_id, reciever_id);
    res.json({
      code: 200,
      message: "success",
      result: chats_data,
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
  get_all_chats,
};
