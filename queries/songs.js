var mongoose = require("mongoose");
const Songs = require("../Model/songs");
var ObjectId = mongoose.Types.ObjectId;

var ObjectData = {};

ObjectData.create_playlist = async (user_id, playlist_name) => {
  try {
    const songs = new Songs({
      user_id: user_id,
      playlist_name: playlist_name,
    });
    var songs_data = await Songs.find({
      user_id: ObjectId(user_id),
      playlist_name: playlist_name,
    });
    if (songs_data.length > 0) {
      return "Change playlist name, this name already exist";
    } else {
      var songs_saved_data = await songs.save();
      return songs_saved_data;
    }
  } catch (error) {
    return error;
  }
};

ObjectData.add_song_to_playlist = async (
  user_id,
  playlist_name,
  songs_name
) => {
  try {
    var data_of_update = await Songs.updateOne(
      { user_id: user_id, playlist_name: playlist_name },
      {
        $push: {
          songs_of_playlist: [
            {
              playlist_name: playlist_name,
              songs_name: songs_name,
            },
          ],
        },
      }
    );
    if (data_of_update.nModified == 1) {
      return data_of_update
    } else {
      return "Not inserted song to playlist"
    }
  } catch (error) {
      return error
  }
};

ObjectData.get_all_playlist_of_user = async (user_id) => {
    try {
        var all_playlist = await Songs.find({ user_id : user_id })
        if (all_playlist < 0) {
            return "No playlist exist"
        } else {
            return all_playlist
        }
    } catch (error) {
        return error
    }
}

module.exports = ObjectData;
