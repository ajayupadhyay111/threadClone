import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { cloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

export const signin = async (request, response, next) => {
  try {
    const { username, email, password } = request.body;

    // Check if all fields are present
    if (!username || !email || !password) {
      return response.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(savedUser._id);

    if (!token) {
      return response
        .status(400)
        .json({ message: "Error while generating accessToken" });
    }

    response.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    // Return success response
    response.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    response
      .status(400)
      .json({ message: "Error in sign Controller", error: error.message });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    // Check if all fields are present
    if (!email || !password) {
      return response.status(400).json({ message: "All fields required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    if (!token) {
      return response
        .status(400)
        .json({ message: "Error while generating accessToken" });
    }

    // Set cookie with token
    response.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    // Return success response
    response.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error in login controller", error: error.message });
  }
};

export const userDetails = async (request, response) => {
  try {
    // const userId = request.user?._id;
    const { id: userId } = request.params;
    if (!userId) {
      return response.status(401).json({ message: "Unauthorized access" });
    }

    // Find user by ID and exclude password
    const user = await User.findById(new mongoose.Types.ObjectId(userId))
      .select("-password")
      .populate("followers")
      .populate("following")
      .populate({
        path: "threads",
        populate: [{ path: "likes" }, { path: "comments" }, { path: "admin" }],
      })
      .populate({
        path: "replies",
        populate: {
          path: "post",
          populate: {
            path: "admin", // yeh post ke andar wali field hai
          },
        },
      })
      .populate({
        path: "reposts",
        populate: [{ path: "admin" }, { path: "likes" }, { path: "comments" }],
      });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Return user details
    response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

export const followUser = async (request, response) => {
  try {
    const { id } = request.params; // ID of user to follow/unfollow
    const userID = request.user._id; // Current user's ID

    // Validate input ID
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Prevent self-following
    if (id === userID.toString()) {
      return response.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Find target user
    const userToFollow = await User.findById(id);
    if (!userToFollow) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find current user
    const currentUser = await User.findById(userID);
    if (!currentUser) {
      return response.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    // Check if already following
    if (userToFollow.followers.includes(userID)) {
      // Unfollow logic
      await Promise.all([
        User.findByIdAndUpdate(
          userToFollow._id,
          {
            $pull: { followers: userID },
          },
          { new: true }
        ),
        User.findByIdAndUpdate(
          userID,
          {
            $pull: { following: userToFollow._id },
          },
          { new: true }
        ),
      ]);

      return response.status(200).json({
        success: true,
        message: `Unfollowed ${userToFollow.username}`,
        isFollowing: false,
        user: currentUser,
      });
    }

    // Follow logic
    await Promise.all([
      User.findByIdAndUpdate(
        userToFollow._id,
        {
          $push: { followers: userID },
        },
        { new: true }
      ),
      User.findByIdAndUpdate(
        userID,
        {
          $push: { following: userToFollow._id },
        },
        { new: true }
      ),
    ]);

    return response.status(200).json({
      success: true,
      message: `Following ${userToFollow.username}`,
      isFollowing: true,
      user: currentUser,
    });
  } catch (error) {
    console.error("Follow error:", error);
    return response.status(500).json({
      success: false,
      message: "Error processing follow/unfollow request",
      error: error.message,
    });
  }
};

export const updateProfile = async (request, response) => {
  try {
    const userId = request.user._id; // Get correct user ID from auth middleware
    const { bio, link } = request.body;
    // Input validation
    if (link && !isValidUrl(link)) {
      return response.status(400).json({
        success: false,
        message: "Please provide a valid URL",
      });
    }

    // Find user and validate existence
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle profile picture upload
    if (request.file) {
      try {
        // Delete old image if exists
        if (user.public_id) {
          await cloudinary.uploader.destroy(user.public_id);
        }

        // Update with new image
        user.profilePic = request.file.path;
        user.public_id = request.file.filename;
      } catch (cloudinaryError) {
        return response.status(500).json({
          success: false,
          message: "Error updating profile picture",
          error: cloudinaryError.message,
        });
      }
    }

    // Update user fields
    user.bio = bio || user.bio;
    user.link = link || user.link;

    // Save updates
    const updatedUser = await user.save();

    // Return success response with updated data
    return response.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        bio: updatedUser.bio,
        link: updatedUser.link,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// URL validation helper
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

export const searchUser = async (request, response) => {
  try {
    const { query } = request.body;
    // Validate search query
    if (!query || query.length < 1) {
      return response.status(400).json({
        success: false,
        message: "Search query is required",
        data: [],
      });
    }
    // Sanitize the search query
    const sanitizedQuery = query.trim().replace(/[^a-zA-Z0-9@._-]/g, "");

    let users = await User.find({
      $or: [
        { username: { $regex: sanitizedQuery, $options: "i" } },
        { email: { $regex: sanitizedQuery, $options: "i" } },
      ],
    })
      .select("username email profilePic bio followers following")
      .limit(10);

    users = users.filter(
      (i) => i._id.toString() !== request.user._id.toString()
    );

    // Return error if no users found
    if (!users || users.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    // Return success response
    return response.status(200).json({
      success: true,
      message: "Users found successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Search Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};

export const logout = async (request, response) => {
  try {
    // Clear the token cookie
    response.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0), // Set expiration to past date to immediately expire
    });

    return response.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
};

export const myInfo = async (request, response) => {
  try {
    const userId = request.user?._id;

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find user and populate related data
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user information
    return response.status(200).json({
      success: true,
      message: "User information retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("MyInfo Error:", error);
    return response.status(500).json({
      success: false,
      message: "Error fetching user information",
      error: error.message,
    });
  }
};
