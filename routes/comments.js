// const { Router } = require("express");

const express = require("express");
const commentsController = require("../controller");
const router = express.Router();

router.post("/register", commentsController.comments.register);
router.put("/edit", commentsController.comments.edit);
router.delete("/:id/remove", commentsController.comments.remove);

module.exports = router;
