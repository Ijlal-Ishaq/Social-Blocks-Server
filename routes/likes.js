const express = require("express");

const LikesController = require("../controllers/likes_controller");
const { verifySignature } = require("../middlewares");
const { createSignature } = require("../utils");

const router = express.Router();

router.post("/setlikes", verifySignature, LikesController.setLike);
router.post("/getlikes", LikesController.getLikes);
router.post("/getLikesHash", verifySignature, async (req, res) => {
  const data = await createSignature(req.body.postId);
  res.json(data);
});

/**
 * {
 *  signature: "",
 *  userAddress: "",
 *  likes: 23
 * }
 */

module.exports = {
  router: router,
};
