const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const type = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'image',
    },
  },
  { timestamps: true },
);

const Type = mongoose.model('type', type);

module.exports = Type;
