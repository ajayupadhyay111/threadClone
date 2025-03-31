import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from 'uuid';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "threadClone", // optional, you can specify a folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // specify allowed file formats
    public_id: (req, file) => {
      // Generate a unique filename using UUID and the original filename
      return uuidv4() + "-" + Date.now() + "-" + file.originalname;
    },
  },
});

export { cloudinary, storage };
