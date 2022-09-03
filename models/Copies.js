const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const copies = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    distanceFromWhite: {
      type: Number,
      required: true,
    },
    copyOf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Copies = mongoose.model("copies", copies);

module.exports = Copies;
