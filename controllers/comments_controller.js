const Comment = require("../models/Comment");

const setComment = async (req, res) => {
  // check if post exists.
  if (true) {
    let comment = new Comment({
      postId: req.body.postId,
      comment: req.body.comment,
      userAddress: req.body.userAddress,
      userName:
        req.body.userAddress.slice(0, 7) +
        "..." +
        req.body.userAddress.slice(35, 42),
    });
    await comment.save();
    res.json({
      comment: comment,
    });
  } else {
    res.json({
      message: "post id does not exists.",
    });
  }
};

const getComments = async (req, res) => {
  let comments = await Comment.find({
    postId: req.params.id,
  });
  if (comments) {
    res.json({
      comments: comments,
    });
  } else {
    res.json({
      comments: [],
    });
  }
};

module.exports = {
  setComment,
  getComments,
};
