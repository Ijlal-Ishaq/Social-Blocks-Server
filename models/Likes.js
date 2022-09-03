const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const like = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    likesArray: {
      type: Array,
      required: true,
    },
    claimedlikesCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Likes = mongoose.model("likes", like);

module.exports = Likes;
