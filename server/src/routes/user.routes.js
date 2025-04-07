import express from "express";
import {
  followUser,
  login,
  logout,
  myInfo,
  searchUser,
  signin,
  updateProfile,
  userDetails,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/login", login);

router.get("/user/:id", authenticateToken, userDetails);
router.put("/user/follow/:id", authenticateToken, followUser);
router.put(
  "/user/updateProfile",
  authenticateToken,
  upload.single("image"),
  updateProfile
);
router.post("/user/search",authenticateToken,searchUser)
router.post("/user/logout",authenticateToken,logout)
router.get("/profile",authenticateToken,myInfo)

const protect = (req, res) => {
    res.json(req.file);
};
router.put("/demo", authenticateToken,upload.single("image"), protect);
export default router;
