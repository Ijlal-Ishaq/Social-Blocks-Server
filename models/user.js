const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    address: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

const User = mongoose.model("user", user);

module.exports = User;
