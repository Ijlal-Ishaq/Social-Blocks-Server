const axios = require("axios");
const Promise = require("bluebird");
const phash = require("sharp-phash");
const dist = require("sharp-phash/distance");

const User = require("../models/User");
const Copies = require("../models/Copies");

const getCopies = async (req, res) => {
  const postId = req.params.id;

  let post = await Copies.findOne({ postId: postId });

  if (post) {
    res.json({
      copyOf: post.copyOf,
    });
  } else {
    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/socialblocksgraphone",
      {
        query: `
        {
          post(id:"${postId}"){
            id
            metaData
          }
        }
      `,
      }
    );

    post = result?.data?.data?.post;

    if (post) {
      const imgUrl =
        "https://benjaminkor2.infura-ipfs.io/ipfs/" +
        JSON.parse(post?.metaData)?.image;

      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      const imgBuffer = Buffer.from(response.data, "utf-8");

      const hashWhite = 1100110011001001111001100111000001001000111100100011111100011101;

      const hashImg = await phash(imgBuffer);
      const distanceFromWhite = dist(hashImg, hashWhite);

      const copies = await Copies.find({
        distanceFromWhite: {
          $gt: distanceFromWhite - 3,
          $lt: distanceFromWhite + 3,
        },
      }).sort({ postId: 1 });

      if (copies.length > 0) {
        const CopiesObj = new Copies({
          postId: post.id,
          distanceFromWhite: distanceFromWhite,
          copyOf: copies[0].postId,
        });

        await CopiesObj.save();
        res.json({
          copyOf: CopiesObj.copyOf,
        });
      } else {
        const CopiesObj = new Copies({
          postId: post.id,
          distanceFromWhite: distanceFromWhite,
          copyOf: 0,
        });

        await CopiesObj.save();
        res.json({
          copyOf: CopiesObj.copyOf,
        });
      }
    } else {
      res.json({
        copyOf: 0,
      });
    }
  }
};

const getTransferHistory = async (req, res) => {
  let id = req.params.id;

  const result = await axios.post(
    "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/socialblocksgraphone",
    {
      query: `
      {
        post(id:"${id}"){
          transferHistory
        }
      }
    `,
    }
  );

  let transferArr = result?.data?.data?.post?.transferHistory;

  let addressesString = "";

  transferArr.forEach((e) => {
    addressesString += '"' + e.toString() + '",';
  });

  const result1 = await axios.post(
    "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/socialblocksgraphone",
    {
      query: `
      {
        users(where:{id_in:[${addressesString}]}){
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
    `,
    }
  );

  let users = result1?.data.data.users;
  let finalUsers = [];

  transferArr?.forEach((e) => {
    for (let i = 0; i < transferArr.length; i++) {
      if (e.toLowerCase() == users[i].id.toLowerCase()) {
        finalUsers.push(users[i]);
        break;
      }
    }
  });

  res.json({
    usersInOrder: finalUsers,
  });
};

module.exports = {
  getTransferHistory,
  getCopies,
};
