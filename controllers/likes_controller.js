const Likes = require("../models/likes");

const setLike = async (req, res) => {
  let checkLike = await Likes.findOne({
    postId: req.body.postId,
  });
  if (checkLike) {
    let likesArray = checkLike.likesArray;
    let index = likesArray.indexOf(req.body.userAddress);
    if (index > -1) {
      res.json({
        likesArray,
      });
    } else {
      likesArray.push(req.body.userAddress);
      checkLike.likesArray = likesArray;
      checkLike.save();
      res.json({
        likesArray,
      });
    }
  } else {
    let likesArray = [];
    likesArray.push(req.body.userAddress);
    const newLike = new Likes({
      postId: req.body.postId,
      likesArray,
    });
    newLike.save();
    res.json({
      likesArray,
    });
  }
};

const getLikes = async (req, res) => {
  let checkLike = await Likes.findOne({
    postId: req.body.postId,
  });
  if (checkLike) {
    res.json({
      likesArray: checkLike.likesArray,
    });
  } else {
    res.json({
      likesArray: [],
    });
  }
};

module.exports = {
  setLike: setLike,
  getLikes: getLikes,
};
