const Likes = require("../models/likes");
const Post = require("../models/post");

// const URL = 'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks';

const getPosts = async (req, res) => {
  try {
    let result = await Post.find({}).lean();
    const checkLikes = await Likes.find({});

    result = result.map((post) => {
      let likesArray = [];
      checkLikes.map((like) => {
        if (parseInt(like.postId) === parseInt(post._id)) {
          likesArray = like.likesArray;
        }
      });
      return { ...post, likesArray };
    });

    console.log(result);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const query =
      req.query.type === "owner"
        ? { "owner.id": req.query.address }
        : req.query.type === "creator"
        ? { "creator.id": req.query.address }
        : {
            $or: [
              { "creator.id": req.query.address },
              { "owner.id": req.query.address },
            ],
          };

    let result = await Post.find(query).lean();
    const checkLikes = await Likes.find({});

    result = result.map((post) => {
      let likesArray = [];
      checkLikes.map((like) => {
        if (parseInt(like.postId) === parseInt(post._id)) {
          likesArray = like.likesArray;
        }
      });
      return { ...post, likesArray };
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const getSinglePost = async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });
    let checkLikes = await Likes.findOne({ postId: req.params.id });

    post = {
      ...post,
      likesArray: checkLikes.likesArray,
    };

    console.log(checkLikes.likesArray);

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
  }
};

const removeAllPosts = async (req, res) => {
  try {
    await Post.deleteMany({});
    res.status(200).json({ message: "All posts deleted" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getPosts: getPosts,
  getUserPosts: getUserPosts,
  getSinglePost,
};