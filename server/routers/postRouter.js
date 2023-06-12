const router = require("express").Router();
const postController = require("../controllers/postController");
const requireUser = require("../middleware/requireUser");

router.get("/all", requireUser, postController.getAllPostsController);

module.exports = router;
