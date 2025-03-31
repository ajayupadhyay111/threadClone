import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const addPost = async (request, response) => {
  try {
    const userId = request.user?._id;

    // Validate post content
    if (!request.body.text || request.body.text.trim().length === 0) {
      return response.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // Create post
    const post = await Post.create({
      admin: userId,
      text: request.body.text.trim(),
      media: request.file?.path || null,
      public_id: request.file?.filename || null,
    });

    // Add post to user's threads
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { threads: post._id },
      },
      {
        new: true,
      }
    );

    return response.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Add Post Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

export const getPosts = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch posts from MongoDB with pagination
    const posts = await Post.find()
      .populate({ path: "likes", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "admin", model: "User" },
      })
      .populate({ path: "admin", select: "-password" })
      .skip(skip) // Skip the posts based on the page
      .limit(limit) // Limit the number of posts per page
      .sort({ createdAt: -1 }); // Optionally, sort posts by creation date

    if (posts.length === 0) {
      return response.status(404).json({ message: "No posts found." });
    }
    return response.status(200).json(posts);
  } catch (error) {}
};

export const deletePost = async (request, response) => {
  try {
    const { id: postId } = request.params;
    const userId = request.user?._id;

    // Validate postId
    if (!postId) {
      return response.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Verify post ownership
    if (post.admin.toString() !== userId.toString()) {
      return response.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Delete associated media from Cloudinary
    if (post.media && post.public_id) {
      try {
        await cloudinary.uploader.destroy(post.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary Delete Error:", cloudinaryError);
        // Continue with post deletion even if media deletion fails
      }
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({
      _id: { $in: post.comments },
    });

    // Update user references
    await User.updateMany(
      {
        $or: [{ threads: postId }, { replies: postId }, { reposts: postId }],
      },
      {
        $pull: {
          threads: postId,
          replies: postId,
          reposts: postId,
        },
      }
    );

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return response.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

export const likeDislikePost = async (request, response) => {
  try {
    const { id: postId } = request.params;
    const userId = request.user?._id;

    // Validate inputs
    if (!postId || !userId) {
      return response.status(400).json({
        success: false,
        message: "Post ID and user authentication required",
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

    // Check if user has already liked the post
    const isLiked = post.likes.includes(userId);

    // Update post likes
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        [isLiked ? "$pull" : "$push"]: { likes: userId },
      },
      {
        new: true,
      }
    );

    return response.status(200).json({
      success: true,
      message: isLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
    });
  } catch (error) {
    console.error("Like/Unlike Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error processing like/unlike",
      error: error.message,
    });
  }
};

export const repost = async (request, response) => {
  try {
    const { id: postId } = request.params;
    const userId = request.user?._id;

    // Validate input and authentication
    if (!postId || !userId) {
      return response.status(400).json({
        success: false,
        message: "Post ID and user authentication required",
      });
    }

    // Find post and validate existence
    const post = await Post.findById(postId);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is trying to repost their own post
    if (post.admin.toString() === userId.toString()) {
      return response.status(400).json({
        success: false,
        message: "Cannot repost your own post",
      });
    }

    // Check if already reposted
    const user = await User.findById(userId);
    if (user.reposts.includes(post._id)) {
      return response.status(200).json({
        success: true,
        message: "You already reposted this post.",
      });
    }

    // Add repost
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { reposts: postId },
      },
      {
        new: true,
      }
    );

    return response.status(200).json({
      success: true,
      message: "Post reposted successfully",
    });
  } catch (error) {
    console.error("Repost Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error processing repost",
      error: error.message,
    });
  }
};

export const singlePost = async (request, response) => {
    try {
      const { id: postId } = request.params;
  
      // Validate post ID
      if (!postId) {
        return response.status(400).json({
          success: false,
          message: "Post ID is required"
        });
      }
  
      // Find and populate post data
      const post = await Post.findById(postId)
        .populate({path:"admin",select:"-password"})
        .populate({
          path: 'comments',
          populate: {
            path: 'admin',
            select: '-password'
          },
          options: { sort: { createdAt: -1 } }
        })
        .populate({path:'likes',select:"-password"})
        .lean();
  
      // Check if post exists
      if (!post) {
        return response.status(404).json({
          success: false,
          message: "Post not found"
        });
      }
  
      // Format response data
      const formattedPost = {
        ...post,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        isLiked: request.user ? post.likes.some(like => 
          like._id.toString() === request.user._id.toString()
        ) : false
      };
  
      return response.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        data: formattedPost
      });
  
    } catch (error) {
      console.error("Single Post Error:", error);
      return response.status(500).json({
        success: false,
        message: "Error fetching post",
        error: error.message
      });
    }
  };
