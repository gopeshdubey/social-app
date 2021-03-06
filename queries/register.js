const Register = require("../Model/users");
const like = require("../Model/like");
const friendRequest = require("../Model/friendRequest");
const stat = require("../Model/status");
var mongoose = require("mongoose");
var encryption = require("../utilities/encryption");
const likes = require("../Model/like");
const { resolve } = require("path");
var ObjectId = mongoose.Types.ObjectId;

var ObjectData = {};

ObjectData.register = (first_name, last_name, email, dob, gender, password) => {
  return new Promise((resolve, reject) => {
    const register = new Register({
      first_name: first_name,
      last_name: last_name,
      email: email,
      dob: dob,
      gender: gender,
      password: password,
      created_at: Date.now().toString(),
      last_login: Date.now().toString(),
    });
    Register.find({ email: email }, (err, dataOfFind) => {
      if (err) {
        reject(err);
      } else {
        console.log("data of register :::::", dataOfFind);
        if (dataOfFind.length > 0) {
          reject("Already registered");
        } else {
          register.save((err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        }
      }
    });
  });
};

ObjectData.login = async (email, password) => {
  return new Promise((resolve, reject) => {
    Register.find({ email: email }, async (err, data) => {
      if (err) reject(err);
      else {
        if (data.length > 0) {
          rehash = await encryption.decryptPassword(password, data[0].password);
          if (!rehash) {
            reject("Password incorrect");
          } else {
            resolve(data);
          }
        } else {
          reject("Not registered");
        }
      }
    });
  });
};

ObjectData.update_user = async (
  first_name,
  last_name,
  email,
  phone,
  dob,
  gender,
  about,
  website_link,
  country,
  state,
  city,
  birthplace,
  occupation,
  status_type,
  religious_belief,
  political_incline
) => {
  try {
    var updated_data = await Register.updateOne(
      { email: email },
      {
        $set: {
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          dob: dob,
          gender: gender,
          about: about,
          website_link: website_link,
          country: country,
          state: state,
          city: city,
          birthplace: birthplace,
          occupation: occupation,
          status_type: status_type,
          religious_belief: religious_belief,
          political_incline: political_incline,
        },
      }
    );
    if (updated_data.nModified == 1) {
      return updated_data;
    } else {
      return "Not inserted song to playlist";
    }
  } catch (error) {
    return error;
  }
};

ObjectData.getUserData = (id) => {
  return new Promise((resolve, reject) => {
    Register.aggregate(
      [
        {
          $match: { _id: ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "friends.friend_id",
            foreignField: "_id",
            as: "friends_details",
          },
        },
      ],
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

ObjectData.updateSocketId = async (id, socket_id) => {
  try {
    var updated_data = await Register.updateOne(
      { _id: ObjectId(id) },
      {
        $set: { socket_id: socket_id },
      }
    );
    return updated_data;
  } catch (error) {
    return error;
  }
};

ObjectData.addFriend = async (
  friend_id,
  user_id,
  display_name,
  friendSocketId,
  friendImageUrl
) => {
  try {
    var err_msg = "";
    // console.log('entern in added friend',user_id);
    const frienddata = await Register.find({ _id: ObjectId(friend_id) });
    if (frienddata != "" || frienddata != null || frienddata.length > 0) {
      // console.log('entern in frienddata',frienddata);
      const userdata = await Register.find({ _id: ObjectId(user_id) });
      if (userdata != "" || userdata != null || userdata.length > 0) {
        const friendAddedData = await Register.updateOne(
          { _id: ObjectId(user_id) },
          {
            $push: {
              friends: [
                {
                  join_at: Date.now().toString(),
                  friend_id: ObjectId(friend_id),
                  display_name: display_name,
                  friendSocketId: friendSocketId,
                  friendImageUrl: friendImageUrl,
                },
              ],
            },
          }
        );
        const newFriendAddedData = await Register.updateOne(
          { _id: ObjectId(friend_id) },
          {
            $push: {
              friends: [
                {
                  join_at: Date.now().toString(),
                  friend_id: ObjectId(user_id),
                  display_name: userdata[0].first_name,
                  friendSocketId: userdata[0].socket_id,
                  friendImageUrl: userdata[0].profile_image_url,
                },
              ],
            },
          }
        );

        if (
          friendAddedData.nModified == 1 &&
          newFriendAddedData.nModified == 1
        ) {
          const updateRequestStatus = await friendRequest.updateOne(
            { reciver_id: ObjectId(user_id), sender_id: ObjectId(friend_id) },
            { $set: { status: "accepted" } }
          );
          console.log(updateRequestStatus);
          if (updateRequestStatus.nModified == 1) {
            return userdata;
          } else {
            err_msg = "Request Status Not Updated";
            return err_msg;
          }
        } else {
          console.log("Friend Not Added");
          err_msg = "Friend Not Added";
          return err_msg;
        }
      } else {
        console.log("user not exist");
        err_msg = "Friend Not Added";
        return err_msg;
      }
    } else {
      console.log("user friend not exist");
      err_msg = "Friend Not Added";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.showFriends = async (user_id) => {
  //error not defined
  try {
    const friendData = await Register.aggregate([
      { $match: { _id: ObjectId(user_id) } },
      { $unwind: "$friends" },
      { $group: { _id: "$_id", friends: { $push: "$friends" } } },
    ]);
    if (friendData != "" || friendData != null || friendData.length > 0) {
      return friendData;
    } else {
      return "Friends are not present";
    }
  } catch (error) {
    return error;
  }
};

ObjectData.searchFriends = async (name) => {
  try {
    const searchResult = await Register.find({
      $or: [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } },
      ],
    });
    if (searchResult.length != 0) {
      return searchResult;
    } else {
      var msg = "oops no one is there";
      return msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.friendRequest = async (sender_id, reciver_id) => {
  try {
    var err_msg = "";
    const frienddata = await Register.find({ _id: ObjectId(reciver_id) });
    if (frienddata.length != 0) {
      const userdata = await Register.find({ _id: ObjectId(sender_id) });
      if (userdata.length != 0) {
        const newSenderId = ObjectId(sender_id);
        const newReciverId = ObjectId(reciver_id);
        var request = new friendRequest({
          sender_id: newSenderId,
          reciver_id: newReciverId,
          created_at: Date.now().toString(),
          updated_at: Date.now().toString(),
        });
        const friendRequestData = await request.save();
        if (friendRequestData) {
          return friendRequestData;
        } else {
          err_msg = "Friend Request Not send";
          return err_msg;
        }
      } else {
        err_msg = "sender id not exist";
        return err_msg;
      }
    } else {
      err_msg = "reciver id not exist";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.showFriendRequest = async (user_id) => {
  try {
    // var user_id = ObjectId(user_id);
    const friendData = await Register.aggregate([
      { $match: { _id: ObjectId(user_id) } },
      {
        $lookup: {
          from: "friendrequests",
          localField: "_id",
          foreignField: "reciver_id",
          as: "FriendRequests",
        },
      },
      { $unwind: "$FriendRequests" },
      { $match: { "FriendRequests.status": "unaccepted" } },
      {
        $lookup: {
          from: "users",
          localField: "FriendRequests.sender_id",
          foreignField: "_id",
          as: "sender_data",
        },
      },
    ]);
    if (friendData.length != 0) {
      return friendData;
    } else {
      return "not data";
    }
  } catch (error) {
    console.log("error :::::", error);
    return error;
  }
};

ObjectData.upload_profile = async (id, link) => {
  try {
    var upload_image = await Register.updateOne(
      { _id: ObjectId(id) },
      {
        $set: { profile_image_url: link },
      }
    );
    return upload_image;
  } catch (error) {
    return error;
  }
};

ObjectData.upload_header_profile = async (id, link) => {
  try {
    var upload_image = await Register.updateOne(
      { _id: ObjectId(id) },
      {
        $set: { header_image_url: link },
      }
    );
    return upload_image;
  } catch (error) {
    return error;
  }
};

ObjectData.generateprivateKey = async (user_id, name) => {
  try {
    const userdata = await Register.find({ _id: ObjectId(user_id) });
    if (userdata.length > 0) {
      var length = 50;
      var chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var result = "";
      for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      result = result + name;
      const data = await Register.find({ "private_key :::::": result });
      if (data.length == 0) {
        const updatedPrivateKey = await Register.updateOne(
          { _id: ObjectId(user_id) },
          { $set: { private_key: result, benifit: false, points: 0 } }
        );
        if (updatedPrivateKey.nModified != 0) {
          return updatedPrivateKey;
        } else {
          console.log("private Keys are not updated");
          var msg = "private Keys are not updated";
          return msg;
        }
      } else {
        console.log("Key is matched");
        var msg = "Key is matched";
        return msg;
      }
    } else {
      console.log("user not exist");
      err_msg = "user not exist";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.givePoints = async (private_key) => {
  try {
    const data = await Register.find({ private_key: private_key });
    if (data.length > 0) {
      if (data[0].points == 0) {
        const updatedPoints = await Register.updateOne(
          { private_key: private_key },
          { $inc: { points: 50 }, $set: { benifit: true } }
        );
        if (updatedPoints.nModified != 0) {
          return updatedPoints;
        } else {
          console.log("Points are not updated by 50");
          var msg = "Points are not updated by 50";
          return msg;
        }
      } else {
        const updatedPoints1 = await Register.updateOne(
          { private_key: private_key },
          { $inc: { points: 25 }, $set: { benifit: true } }
        );
        if (updatedPoints1.nModified != 0) {
          return updatedPoints1;
        } else {
          console.log("Points are not updated by 25");
          var msg = "Points are not updated by 25";
          return msg;
        }
      }
    } else {
      console.log("Key not matched");
      var msg = "Key not matched";
      return msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.friendSuggetion = async (user_id) => {
  try {
    var err_msg = "";
    const friendData = await Register.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: ObjectId(user_id) } },
            { "friends.friend_id": { $ne: ObjectId(user_id) } },
          ],
        },
      },
      {
        $lookup: {
          from: "friendrequests",
          localField: "_id",
          foreignField: "reciver_id",
          as: "FriendRequests",
        },
      },
      { $match: { "FriendRequests.sender_id": { $ne: ObjectId(user_id) } } },
    ]);
    if (friendData.length != 0) {
      return friendData;
    } else {
      err_msg = "Problem in friend suggestion";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.addHobbyAndIntrests = async (user_id, description) => {
  try {
    var err_msg = "";
    console.log(user_id);
    const userdata = await Register.find({ _id: ObjectId(user_id) });
    console.log("----------------", userdata);
    if (userdata.length > 0) {
      const addedData = await Register.updateOne(
        { _id: ObjectId(user_id) },
        { $push: { hobby_and_intrests: [{ description: description }] } }
      );
      if (addedData.nModified == 1) {
        return addedData;
      } else {
        err_msg = "Hobby and Intrest are Not Updated";
        return err_msg;
      }
    } else {
      err_msg = "user not exist";
      throw err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.addEducationHIstory = async (
  user_id,
  description,
  title,
  duration
) => {
  try {
    var err_msg = "";
    const userdata = await Register.find({ _id: ObjectId(user_id) });
    if (userdata.length > 0) {
      const addedData = await Register.updateOne(
        { _id: ObjectId(user_id) },
        {
          $push: {
            education_history: [
              { title: title, duration: duration, description: description },
            ],
          },
        }
      );
      if (addedData.length != 0 || addedData.nModified == 1) {
        return userdata;
      } else {
        err_msg = "Education History are Not Updated";
        return err_msg;
      }
    } else {
      console.log("user not exist");
      err_msg = "user not exist";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.addEmploymentHIstory = async (
  user_id,
  description,
  title,
  duration
) => {
  try {
    var err_msg = "";
    const userdata = await Register.find({ _id: ObjectId(user_id) });
    if (userdata.length > 0) {
      const addedData = await Register.updateOne(
        { _id: ObjectId(user_id) },
        {
          $push: {
            employment_history: [
              { title: title, duration: duration, description: description },
            ],
          },
        }
      );
      if (addedData.length != 0 || addedData.nModified == 1) {
        return userdata;
      } else {
        err_msg = "Employment History are Not Updated";
        return err_msg;
      }
    } else {
      console.log("user not exist");
      err_msg = "user not exist";
      return err_msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.uploadStatus = async (user_id, status) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var date = new Date();
    var getAm = date.getHours() >= 12 ? "pm" : "am";
    var time =
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear() +
      " " +
      date.getHours() +
      getAm;
    console.log("time:::::", time);
    var saveStatus = new stat({
      user_id: ObjectId(user_id),
      status: status,
      created_at: time.toString(),
      updated_at: Date.now().toString(),
    });
    const statusSaved = await saveStatus.save();

    if (statusSaved.length != 0) {
      const getStatus = await stat
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_data",
            },
          },
        ])
        .sort({ _id: -1 });
      if (getStatus.length > 0) {
        return getStatus;
      } else {
        var msg = "no status found";
        return msg;
      }
    } else {
      console.log("oops status not uploaded");
      var msg = "oops status not uploaded";
      return msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.getAllStatus = async () => {
  try {
    const getStatus = await stat
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_data",
          },
        },
        { $unwind: "$user_data" },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "status_id",
            as: "like_data",
          },
        },
      ])
      .sort({ _id: -1 });
    return getStatus;
  } catch (error) {
    return error;
  }
};

ObjectData.uploadPost = async (user_id, post) => {
  try {
    console.log(user_id, post);
    var savePosts = new posts({
      user_id: ObjectId(user_id),
      post: post,
      created_at: Date.now().toString(),
      updated_at: Date.now().toString(),
    });
    const savedPosts = await savePosts.save();
    console.log(savedPosts);
    if (savedPosts.length != 0) {
      const getPosts = await posts.find().sort({ _id: -1 });
      if (getPosts.length > 0) {
        return getPosts;
      } else {
        var msg = "no posts found";
        return msg;
      }
    } else {
      console.log("oops posts not uploaded");
      var msg = "oops posts not uploaded";
      return msg;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.addLikes = (user_id, status_id, status) => {
  return new Promise((resolve, reject) => {
    likes.find(
      { user_id: ObjectId(user_id), status_id: ObjectId(status_id) },
      (err, dataOfLikes) => {
        if (err) {
          reject(err);
        } else {
          if (dataOfLikes.length > 0) {
            likes.updateOne(
              {
                user_id: ObjectId(user_id),
                status_id: ObjectId(status_id),
              },
              {
                $set: { status: status },
              },
              (err, updated_data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(updated_data);
                }
              }
            );
          } else {
            var like = new likes({
              user_id: ObjectId(user_id),
              status_id: ObjectId(status_id),
              status: status,
              created_at: Date.now().toString(),
              updated_at: Date.now().toString(),
            });
            like.save((err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          }
        }
      }
    );
  });
};

ObjectData.getAllLikesByUserId = (user_id, status_id) => {
  return new Promise((resolve, reject) => {
    like.find(
      {
        user_id: ObjectId(user_id),
        status_id: ObjectId(status_id),
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.length > 0) {
            resolve(data);
          } else {
            reject("No Data Found");
          }
        }
      }
    );
  });
};

module.exports = ObjectData;

// ========================== CONVERT ARRAY TO BSON THEN PUT CONDITION =========================
// {"$unwind":"$FriendRequests"},
// {"$match": {"FriendRequests.sender_id" : { $ne: ObjectId("5f2581ad28a5f805c0d55e40") }}}

// ================= GET DATA FROM ARRAY OF OBJECTS ===============================

// db.getCollection("users").find({"friends.friend_id" : ObjectId("5f1f0c75e66bdc3ed4079f79")})

// ================= DELETE DATA FROM ARRAY OF OBJECTS ===============================
// db.getCollection("users").update(
//     { "_id" : ObjectId("5f1f08dfe911fc1d7cdeab8b")},
//     { $pull: { "friends": { "friend_id" : ObjectId("5f1f0c75e66bdc3ed4079f79") }}}
// )

// ========================== AND CONDITION WITH TWO CONDITION NE MEANS NOT EQUAL ==========
// db.getCollection("users").find({
//   $and: [
//     { _id: { $ne: ObjectId("5f2581ad28a5f805c0d55e40") } },
//     { "friends.friend_id": { $ne: ObjectId("5f2581ad28a5f805c0d55e40") } },
//   ],
// });
