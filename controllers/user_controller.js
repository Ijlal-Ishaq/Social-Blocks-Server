const User = require("../models/user");
const Like = require("../models/likes");
const axios = require("axios");

const getRisingCreators = async (_, res) => {
  try {
    const likes = (await Like.find({}))
      .sort((a, b) => Number(b.likesArray.length) - Number(a.likesArray.length))
      .slice(0, 10);

    let posts = likes.map((like) => {
      return like.postId;
    });

    let addressesString = "";

    posts.forEach((e) => {
      addressesString += '"' + e + '",';
    });

    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/socialblocksgraphone",
      {
        query: `
        {
          posts(where:{id_in:[${addressesString}]}){
            id
            creator{
              id
              address
              userName
              displayName
              bio
              image
              rewardClaimed
              createdAt
            }
          }
        }
      `,
      }
    );

    let users = result?.data?.data?.posts?.map((e) => {
      return e.creator;
    });

    const distinctUsers = [];

    for (let user of users) {
      if (distinctUsers.length === 4) break;

      const found = distinctUsers.findIndex((u) => u.address === user.address);

      if (found === -1) {
        distinctUsers.push(user);
      }
    }

    return res.status(200).json(distinctUsers);
  } catch (err) {
    console.log("err in new rp", err);
    res.status(500).json(err);
  }
};

const followUser = async (req, res) => {
  try {
    let user = await User.findOne({ address: req.body.address });
    let user1 = await User.findOne({ address: req.body.followUser });

    if (!user) {
      user = new User({
        address: req.body.address,
        followers: [],
        following: [req.body.followUser],
      });
      await user.save();
    } else {
      user.following.push(req.body.followUser);
      await user.save();
    }

    if (!user1) {
      user1 = new User({
        address: req.body.followUser,
        followers: [req.body.address],
        following: [],
      });
      await user1.save();
    } else {
      user1.followers.push(req.body.address);
      await user1.save();
    }

    res.status(200).json({
      user,
      user1,
    });
  } catch (error) {
    console.log(error);
  }
};

const unFollowUser = async (req, res) => {
  try {
    const followingPromise = User.findOneAndUpdate(
      { address: req.body.address },
      { $pull: { following: req.body.followUser } }
    );
    const followerPromise = User.findOneAndUpdate(
      { address: req.body.followUser },
      { $pull: { followers: req.body.address } }
    );

    const [following, follower] = await Promise.all([
      followingPromise,
      followerPromise,
    ]);

    res.status(200).json({
      following,
      follower,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });

    if (!user) {
      res.status(200).json({
        data: [],
      });
    } else {
      res.status(200).json({
        data: user.followers,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });

    if (!user) {
      res.status(200).json({
        data: [],
      });
    } else {
      res.status(200).json({
        data: user.following,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  followUser,
  unFollowUser,
  getUserFollowers,
  getUserFollowing,
  getRisingCreators,
};
