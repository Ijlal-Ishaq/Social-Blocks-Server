const express = require("express");
const user_controller = require("../controllers/user_controller");
const { verifySignature } = require("../middlewares");
const router = express.Router();

router.post("/follow", verifySignature, user_controller.followUser);
router.post("/unfollow", verifySignature, user_controller.unFollowUser);
router.get("/getFollowers/:address", user_controller.getUserFollowers);
router.get("/getFollowing/:address", user_controller.getUserFollowing);
router.get("/getRisingCreators", user_controller.getRisingCreators);

module.exports = {
  router: router,
};
