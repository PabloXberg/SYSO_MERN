import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from "dotenv";
dotenv.config();


// Configuration 
const cloudinaryConfig = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_SECRET
 });
}

export default cloudinaryConfig