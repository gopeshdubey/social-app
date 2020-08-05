var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Chat = require("../Model/chats");

const insertChat = async (user_id, reciever_id, message) => {
  try {
    var data_of_chat = await Chat.find({
      user_id: user_id,
      reciever_id: reciever_id,
    });
    var data_of_chat2 = await Chat.find({
      user_id: reciever_id,
      reciever_id: user_id,
    });
    if (data_of_chat.length == 0 && data_of_chat2.length == 0) {
      await make_new_chat_module(user_id, reciever_id, message);
    } else {
      await push_chats(user_id, reciever_id, message);
    }
  } catch (error) {
    return error;
  }
};

const make_new_chat_module = async (user_id, reciever_id, message) => {
  try {
    const chat = new Chat({
      user_id: user_id,
      reciever_id: reciever_id,
    });
    var saved_msg = await chat.save();
    await push_chats(user_id, reciever_id, message);
  } catch (error) {
    return error;
  }
};

const push_chats = async (user_id, reciever_id, message) => {
  try {
    if (message) {
      var data_of_chat = await Chat.find({
        user_id: user_id,
        reciever_id: reciever_id,
      });

      var update_data

      if (data_of_chat.length > 0) {
        update_data = await Chat.updateOne(
            { user_id: user_id, reciever_id: reciever_id },
            {
              $push: {
                chats: [
                  {
                    user_id: user_id,
                    message: message,
                  },
                ],
              },
            }
          );
      } else {
        update_data = await Chat.updateOne(
            { user_id: reciever_id, reciever_id: user_id },
            {
              $push: {
                chats: [
                  {
                    user_id: user_id,
                    message: message,
                  },
                ],
              },
            }
          );
      }
    }
  } catch (error) {
    return error;
  }
};

const getAllChats = async (user_id, reciever_id) => {
  try {
    var data_of_chat = await Chat.aggregate([
      { $match: { user_id: user_id, reciever_id: reciever_id } },
      { $unwind: "$chats" },
      { $sort: { "chats._id": 1 } },
    ]);
    var data_of_chats = await Chat.aggregate([
      { $match: { user_id: reciever_id, reciever_id: user_id } },
      { $unwind: "$chats" },
      { $sort: { "chats._id": 1 } },
    ]);
    if (data_of_chat.length == 0 && data_of_chats.length == 0) {
      return data_of_chats;
    } else {
      if (data_of_chat.length == 0) {
        return data_of_chats;
      }
      if (data_of_chats.length == 0) {
        return data_of_chat;
      }
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  insertChat,
  getAllChats,
};
