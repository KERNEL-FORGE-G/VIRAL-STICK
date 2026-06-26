const express = require("express");
const router = express.Router();
const ForumController = require("../controllers/forumController");

router.get("/memes", ForumController.getMemes);
router.get("/leaderboard", ForumController.getLeaderboard);
router.post("/like/:id", ForumController.likeMeme);
router.post("/publish", ForumController.publishMeme);

module.exports = router;
