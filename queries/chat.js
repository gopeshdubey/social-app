var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var Chat = require('../Model/chats')

const insertChat = async (user_id, reciever_id, message) => {
    try {
        var data_of_chat = await Chat.find({ user_id: user_id, reciever_id: reciever_id })
        console.log("chat data :::::", data_of_chat);
        if (data_of_chat.length == 0) {
            const chat = new Chat({
                user_id: user_id,
                reciever_id: reciever_id,
            })
            var saved_msg = await chat.save()
            console.log("saved msg :::::", saved_msg);
            if (message) {
                await Chat.updateOne(
                    { user_id: user_id, reciever_id: reciever_id },
                    {
                        $push: {
                            chats: [
                                {
                                    user_id: user_id,
                                    message: message
                                }
                            ]
                        }
                    }
                )
            }
        } else {
            if (message) {
                await Chat.updateOne(
                    { user_id: user_id, reciever_id: reciever_id },
                    {
                        $push: {
                            chats: [
                                {
                                    user_id: user_id,
                                    message: message
                                }
                            ]
                        }
                    }
                )
            }
        }
    } catch (error) {
        return error
    }
}

const getAllChats = async (user_id, reciever_id) => {
    try {
        var data_of_chat = await Chat.aggregate([
            { $match: { "user_id":  user_id, "reciever_id": reciever_id } },
            { $unwind: "$chats" },
            { $sort : { "chats._id": 1 }}
        ])
        return data_of_chat;
    } catch (error) {
        return error
    }
}

module.exports = {
    insertChat,
    getAllChats
}