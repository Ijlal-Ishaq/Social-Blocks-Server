const axios = require("axios");
const Promise = require("bluebird");
const phash = require("sharp-phash");
const dist = require("sharp-phash/distance");

const User = require("../models/User");
const Copies = require("../models/Copies");
const distance = require("sharp-phash/distance");
const {addressesAndLinks} = require("../utils");

const {CONTRACT, SUBGRAPH} = addressesAndLinks()
const getCopies = async (req, res) => {
	const postId = req.params.id;

	let post = await Copies.findOne({ postId: postId });

	if (post) {
		res.json({
			copyOf: post.copyOf,
		});
	} else {
		const result = await axios.post(SUBGRAPH, {
			query: `
        {
          post(id:"${postId}"){
            id
            metaData
          }
        }
      `,
		});

		post = result?.data?.data?.post;

		if (post) {
			const imgUrl = "https://benjaminkor2.infura-ipfs.io/ipfs/" + JSON.parse(post?.metaData)?.image;

			const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
			const imgBuffer = Buffer.from(response.data, "utf-8");

			const imgHash = await phash(imgBuffer);

			const copies = await Copies.find({}).sort({ postId: 1 });

			let distance = 0;
			let minDistance = 64;
			let copyPostId;

			for (let i = 0; i < copies.length && copies[i].postId < post.id; i++) {
				distance = dist(imgHash, copies[i].pHash);
				if (distance < minDistance) {
					minDistance = distance;
					copyPostId = copies[i].postId;
				}
			}

			const CopiesObj = new Copies({
				postId: post.id,
				pHash: imgHash,
				copyOf: minDistance <= 9 ? copyPostId : 0,
			});

			await CopiesObj.save();

			res.json({
				copyOf: CopiesObj.copyOf,
			});
		} else {
			res.json({
				copyOf: 0,
			});
		}
	}
};

const getTransferHistory = async (req, res) => {
	let id = req.params.id;

	const result = await axios.post(SUBGRAPH, {
		query: `
      {
        post(id:"${id}"){
          transferHistory
        }
      }
    `,
	});

	let transferArr = result?.data?.data?.post?.transferHistory;

	let addressesString = "";

	transferArr.forEach((e) => {
		addressesString += '"' + e.toString() + '",';
	});

	const result1 = await axios.post(SUBGRAPH, {
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
	});

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
