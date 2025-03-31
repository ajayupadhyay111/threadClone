import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { addComment, deleteComment } from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/addComment/:id",authenticateToken,addComment); 
router.delete("/comment/:postId/:id",authenticateToken,deleteComment);

export default router;
