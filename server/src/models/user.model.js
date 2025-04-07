import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    link:{
      type:String
    },
    profilePic: {
      type: String,
      default: "https://www.vecteezy.com/free-vector/default-user",
    },
    public_id: {
      type: String,
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;