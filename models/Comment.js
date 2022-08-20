const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    userAddress: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", comment);

module.exports = Comment;
