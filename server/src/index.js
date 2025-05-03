import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cookieParser());
app.set("trust proxy", 1); // 👈 only needed in production (Render, etc.)
app.use(
  cors({
    origin: ["https://thread-clone-three-pi.vercel.app","http://localhost:5173"],
    credentials: true,
  })
);
// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
