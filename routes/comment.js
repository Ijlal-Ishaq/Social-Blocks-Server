const express = require("express");

const CommentController = require("../controllers/comments_controller");
const { verifySignature } = require("../middlewares");

const router = express.Router();

router.post("/setcomment", verifySignature, CommentController.setComment);
router.get("/getcomments/:id", CommentController.getComments);

module.exports = {
  router: router,
};
