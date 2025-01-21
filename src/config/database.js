const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://pandadust20:94xeg7WlPq7AUn32@devtinder.ztku6.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
