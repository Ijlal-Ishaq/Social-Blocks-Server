const User = require("../models/user");
const axios = require("axios");

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
};
