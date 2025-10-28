import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createComment, getComments, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

// Public routes
router.get("/:postId", getComments);

// Protected routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", protectRoute, deleteComment);

export default router;