const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/posts");

router.get("/", auth, postCtrl.getAllposts);
router.post("/", auth, multer, postCtrl.createpost);
router.put("/:id", auth, multer, postCtrl.modifyposts);
router.delete("/:id", auth, postCtrl.deletepost);
router.post("/:id/like", auth, postCtrl.likePost);

module.exports = router;
