import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const addComment = async (request, response) => {
  try {
    const { id: postId } = request.params;
    const { text } = request.body;
    const userId = request.user?._id;

    // Input validation
    if (!text || !text.trim()) {
      return response.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    if (!postId) {
      return response.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment
    const comment = new Comment({
      admin: userId,
      post: postId,
      text: text.trim(),
    });

    // Save comment
    await comment.save();

    // Update post with comment reference
    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment._id },
      },
      {
        new: true,
      }
    );

    // Update user's replies
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { replies: comment._id },
      },
      {
        new: true,
      }
    );

    return response.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};
export const deleteComment = async (request, response) => {
  try {
    const { postId, id: commentId } = request.params;
    const userId = request.user?._id;

    // Validate inputs
    if (!commentId || !postId) {
      return response.status(400).json({
        success: false,
        message: "Comment ID and Post ID are required",
      });
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return response.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is authorized to delete comment
    if (comment.admin.toString() !== userId.toString()) {
      return response.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Find post
    const post = await Post.findById(postId);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Verify comment belongs to post
    if (!post.comments.includes(commentId)) {
      return response.status(400).json({
        success: false,
        message: "Comment does not belong to this post",
      });
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    // Remove comment reference from post
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    // Remove comment reference from user's replies
    await User.findByIdAndUpdate(userId, {
      $pull: { replies: commentId },
    });

    return response.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};
