import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return response.status(403).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // Get user from database
    const user = await User.findById(decoded.token)
      .select("-password")
      .populate("threads")
      .populate("replies")
      .populate("reposts")
      .populate("followers")
      

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user to request object
    request.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return response.status(403).json({
        success: false,
        message: "Invalid token format.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return response.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    console.error("Auth Middleware Error:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error in authentication.",
      error: error.message,
    });
  }
};
