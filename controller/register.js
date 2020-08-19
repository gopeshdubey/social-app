const registerData = require("../queries/register");
const encryption = require("../validation/jwtAuth");
const store = require("../upload_file/delete_file");
const encrypt = require("../utilities/encryption");
const path = require("path");

// ===================================== REGISTER =============================
const register = async (req, res) => {
  try {
    var { first_name, last_name, email, dob, gender, password } = req.body;
    var hashed_password = await encrypt.hashPassword(password);

    var dataOfRegister = await registerData.register(
      first_name,
      last_name,
      email,
      dob,
      gender,
      hashed_password
    );
    res.json({
      code: 200,
      message: "success",
      result: dataOfRegister,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

// ========================== LOGIN ========================================
const login = async (req, res) => {
  try {
    var { email, password } = req.body;
    var dataOfLogin = await registerData.login(email, password);
    const token = await encryption.generateJWT(
      dataOfLogin[0]._id,
      dataOfLogin[0].first_name,
      dataOfLogin[0].last_name,
      dataOfLogin[0].dob,
      dataOfLogin[0].gender
    );
    res.header("x-auth-token", token).status(200).json({
      code: 200,
      message: "Login succesfully",
      result: token,
      data: dataOfLogin,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const update_account = async (req, res) => {
  try {
    var {
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
      political_incline,
    } = req.body;

    var updated_data = await registerData.update_user(
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
    );
    res.json({ code: 200, message: "success", result: updated_data });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

// =========================== get user data ==========================================

const getUserDeatils = async (req, res) => {
  try {
    var { id } = req.params;
    var dataOfUsers = await registerData.getUserData(id);
    if (dataOfUsers.length == 0) {
      res.json({
        code: 400,
        message: "error",
        error: "No such data",
      });
    } else {
      res.json({ code: 200, message: "success", result: dataOfUsers });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

// ========================== UPDATE SOCKET ID ========================================
const updateSocketId = async (req, res) => {
  try {
    var { email, socket_id } = req.body;
    var dataOfUpdate = await registerData.updateSocketId(email, socket_id);
    res.json({
      code: 200,
      message: "Updated successfully",
      result: dataOfUpdate,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const addFriend = async (req, res) => {
  try {
    var {
      friend_id,
      user_id,
      display_name,
      friendSocketId,
      friendImageUrl,
    } = req.body;
    var dataOfAddedFriend = await registerData.addFriend(
      friend_id,
      user_id,
      display_name,
      friendSocketId,
      friendImageUrl
    );
    res.json({
      code: 200,
      message: "Friend Added successfully",
      result: dataOfAddedFriend,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const showFriends = async (req, res) => {
  try {
    var user_id = req.body._id;
    var friends = await registerData.showFriends(user_id);
    res.json({
      code: 200,
      message: "Friend Showed successfully",
      result: friends,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const searchFriends = async (req, res) => {
  try {
    var name = req.body.name;
    var searchfriends = await registerData.searchFriends(name);
    console.log(searchfriends.length);
    res.json({
      code: 200,
      message: "Friend Showed successfully",
      result: searchfriends,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const friendRequest = async (req, res) => {
  try {
    var { reciever_id, sender_id } = req.body;
    var requestData = await registerData.friendRequest(sender_id, reciever_id);
    res.json({
      code: 200,
      message: "Friend request send successfully",
      result: requestData,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const showFriendRequests = async (req, res) => {
  try {
    var user_id = req.body._id;
    var friends = await registerData.showFriendRequest(user_id);
    res.json({
      code: 200,
      message: "Friend Requests Showed successfully",
      result: friends,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

// router to add profile pic of user
const uploadProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      var image = null;
      res.status(200).json({
        code: 200,
        message: "Image uploaded successfully",
        result: image,
        filepath: image,
      });
    } else {
      var ext = path.extname(file.originalname);
      if (ext == ".png" || ext == ".jpg") {
        let value = file.path;
        var image = "https://jiviz.com/" + value.substring(8, value.length);
        var upload_data = await registerData.upload_profile(id, image);
        res.json({
          code: 200,
          message: "success",
          result: image,
        });
      } else {
        store.deleteImage(req.file.path);
        res.json({
          code: 400,
          result: "image cannot be uploaded",
          message: "Image file is not jpg or png.",
        });
      }
    }
  } catch (error) {
    store.deleteImage(file.path);
    res.json({
      code: 400,
      result: error.sqlMessage,
      message: "cannot upload image",
    });
  }
};

// router to add header pic of user
const uploadHeaderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      var image = null;
      res.status(200).json({
        code: 200,
        message: "Image uploaded successfully",
        result: image,
        filepath: image,
      });
    } else {
      var ext = path.extname(file.originalname);
      if (ext == ".png" || ext == ".jpg") {
        let value = file.path;
        var image = "https://jiviz.com/" + value.substring(8, value.length);
        var upload_data = await registerData.upload_header_profile(id, image);
        res.json({
          code: 200,
          message: "success",
          result: image,
        });
      } else {
        store.deleteImage(req.file.path);
        res.json({
          code: 400,
          result: "image cannot be uploaded",
          message: "Image file is not jpg or png.",
        });
      }
    }
  } catch (error) {
    store.deleteImage(file.path);
    res.json({
      code: 400,
      result: error.sqlMessage,
      message: "cannot upload image",
    });
  }
};

const generateprivateKey = async (req, res) => {
  try {
    var user_id = req.body.user_id;
    var name = req.body.name;
    var privatekeyData = await registerData.generateprivateKey(user_id, name);
    res.json({
      code: 200,
      message: "Private key created successfully",
      result: privatekeyData,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const givePoints = async (req, res) => {
  try {
    var private_key = req.body.private_key;
    var getBenifitData = await registerData.givePoints(private_key);
    res.json({
      code: 200,
      message: "Points are given successfully",
      result: getBenifitData,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const friendSuggetion = async (req, res) => {
  try {
    var user_id = req.body._id;
    var friends = await registerData.friendSuggetion(user_id);
    res.json({
      code: 200,
      message: "Friend Showed successfully",
      result: friends,
    });
  } catch (error) {
    console.log("error :::::", error);
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const addHobbyAndInterest = async (req, res) => {
  try {
    var { user_id, description } = req.body;
    var dataOfPost = await registerData.addHobbyAndIntrests(
      user_id,
      description
    );
    res.json({ code: 200, message: "Success", result: dataOfPost });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const addEducationHIstory = async (req, res) => {
  try {
    var user_id = req.body.user_id;
    var description = req.body.description;
    var title = req.body.title;
    var duration = req.body.duration;
    var educationHIstory = await registerData.addEducationHIstory(
      user_id,
      description,
      title,
      duration
    );
    res.json({
      code: 200,
      message: "educationHIstory added successfully",
      result: educationHIstory,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const addEmploymentHIstory = async (req, res) => {
  try {
    var user_id = req.body.user_id;
    var description = req.body.description;
    var title = req.body.title;
    var duration = req.body.duration;
    var educationHIstory = await registerData.addEmploymentHIstory(
      user_id,
      description,
      title,
      duration
    );
    res.json({
      code: 200,
      message: "addEmploymentHIstory added successfully",
      result: educationHIstory,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const getAllStatus = async (req, res) => {
  try {
    const statusData = await registerData.getAllStatus()
    res.json({
      code: 200,
      message: "success",
      result: statusData,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
}

const addLikes = async (req, res) => {
  try {
    var { user_id, status_id, status } = req.body;
    var likeData = await registerData.addLikes(
      user_id,
      status_id,
      status
    );
    res.json({
      code: 200,
      message: "Like added successfully",
      result: likeData,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error.toString(),
    });
  }
};

module.exports = {
  register,
  login,
  update_account,
  updateSocketId,
  addFriend,
  showFriends,
  searchFriends,
  friendRequest,
  showFriendRequests,
  getUserDeatils,
  uploadProfile,
  uploadHeaderProfile,
  generateprivateKey,
  givePoints,
  friendSuggetion,
  addHobbyAndInterest,
  addEducationHIstory,
  addEmploymentHIstory,
  getAllStatus,
  addLikes
};
