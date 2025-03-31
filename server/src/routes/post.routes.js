import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { addPost, deletePost, getPosts, likeDislikePost, repost, singlePost } from "../controllers/post.controller.js";
import upload from "../config/multer.js";
const router = express.Router();

router.post(
  "/post/addpost",
  authenticateToken,
  upload.single("image"),
  addPost
);
router.get("/posts", authenticateToken, getPosts); // this route will be use when user scroll
router.delete("/deletepost/:id",authenticateToken,deletePost);
router.put("/repost/:id",authenticateToken,repost)
router.get("/post/:id",authenticateToken,singlePost)
export default router;
