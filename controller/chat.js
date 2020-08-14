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

const get_user_chats = async (req, res) => {
  try {
    var { user_id } = req.params;
    var chat_data = await chats_controller.get_last_chats_of_user(user_id)
    res.json({
      code: 200,
      message: "success",
      result: chat_data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
}

module.exports = {
  get_all_chats,
  get_user_chats
};
