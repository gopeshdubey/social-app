const songsController = require("../queries/songs");

const all_playlist_of_users = async (req, res) => {
  try {
    var { user_id } = req.params;
    var data_of_songs = await songsController.get_all_playlist_of_user(user_id);
    res.json({
      code: 200,
      message: "success",
      result: data_of_songs,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const create_playlist = async (req, res) => {
  try {
    var { user_id, playlist_name } = req.body;
    var data_of_songs = await songsController.create_playlist(
      user_id,
      playlist_name
    );
    res.json({
      code: 200,
      message: "success",
      result: data_of_songs,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
      error: error,
    });
  }
};

const add_songs = async (req, res) => {
  try {
    var { user_id, playlist_name, songs_name } = req.body;
    var data_of_songs = await songsController.add_song_to_playlist(
      user_id,
      playlist_name,
      songs_name
    );
    res.json({
      code: 200,
      message: "success",
      result: data_of_songs,
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
  all_playlist_of_users,
  create_playlist,
  add_songs,
};
