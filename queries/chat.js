var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Chat = require("../Model/chats");
var Register = require("../Model/users");

const insertChat = async (user_id, reciever_id, message) => {
  try {
    console.log('id :::::', mongoose.Types.ObjectId(user_id));
    var data_of_chat = await Chat.find({
      user_id: ObjectId(user_id),
      reciever_id: ObjectId(reciever_id),
    });
    var data_of_chat2 = await Chat.find({
      user_id: ObjectId(reciever_id),
      reciever_id: ObjectId(user_id),
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
    const user = ObjectId(user_id)
    const reciever = ObjectId(reciever_id)
    const chat = new Chat({
      user_id: user,
      reciever_id: reciever,
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
        user_id: ObjectId(user_id),
        reciever_id: ObjectId(reciever_id),
      });

      var update_data;

      if (data_of_chat.length > 0) {
        update_data = await Chat.updateOne(
          { user_id: ObjectId(user_id), reciever_id: ObjectId(reciever_id) },
          {
            $push: {
              chats: [
                {
                  user_id: ObjectId(user_id),
                  message: message,
                },
              ],
            },
          }
        );
      } else {
        update_data = await Chat.updateOne(
          { user_id: ObjectId(reciever_id), reciever_id: ObjectId(user_id) },
          {
            $push: {
              chats: [
                {
                  user_id: ObjectId(user_id),
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
      { $match: { user_id: ObjectId(user_id), reciever_id: ObjectId(reciever_id) } },
      { $unwind: "$chats" },
      { $sort: { "chats._id": 1 } },
    ]);
    var data_of_chats = await Chat.aggregate([
      { $match: { user_id: ObjectId(reciever_id), reciever_id: ObjectId(user_id) } },
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

const get_last_chats_of_user = async (user_id) => {
  try {
    var chat_data = await Chat.aggregate([
      // Expand the chats array into a stream of documents
      { $unwind: '$chats' },
  
      // Filter chats
      { $match: {
          $and: [
              {
                $or: [
                  { user_id: { $eq: ObjectId(user_id) } },
                  { reciever_id: { $eq: ObjectId(user_id) } },
                ],
              },
              {"chats.user_id":{$ne: ObjectId(user_id) }}
            ]
      }},
  
      // Sort in descending order
      { $sort: { 'chats._id': -1 }},
      
      // Grouping data
      { $group:  {
          _id: '$_id', 
          "user_id": { $first: "$user_id" },
          "reciever_id": { $first: "$reciever_id" },
          'chats': { $push: '$chats' } 
          } },
          
      // Look up
      {$lookup: {from: "users", localField: "chats.user_id", foreignField: "_id", as: "user_details"}},

      // Get feilds which we want with limit to 1 for chats
      { "$project": { 
        "chats": { "$slice": [ "$chats", 1 ] },
        "user_id": 1,
        "reciever_id": 1,
        "user_details": 1
    }},
  ])
    return chat_data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  insertChat,
  getAllChats,
  get_last_chats_of_user,
};
