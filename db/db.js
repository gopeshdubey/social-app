const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://gopesh:gopesh123@cluster0.on5bp.mongodb.net/jiviz?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo DB....");
});

module.exports = mongoose;
