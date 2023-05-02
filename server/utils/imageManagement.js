import { v2 as cloudinary } from "cloudinary";

const imageUpload = async(file, folder) => {
  if (file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, { folder: folder });
      console.log(result);
      return result.secure_url;
    } catch(e) {
      console.log(e);
      return undefined
    }
  } else {
    return undefined
  }
}

export default imageUpload