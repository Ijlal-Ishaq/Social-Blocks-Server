const express = require("express");
const router = express.Router();
const PostsController = require("../controllers/post_controller");

router.get("/getTransferHistory/:id", PostsController.getTransferHistory);

module.exports = {
  router: router,
};
