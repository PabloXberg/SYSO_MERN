import { v2 as cloudinary } from "cloudinary";

// Note: dotenv.config() runs once in index.js — no need to repeat here.

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
};

export default cloudinaryConfig;
