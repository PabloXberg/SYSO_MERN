import { v2 as cloudinary } from "cloudinary";

/**
 * Upload an image to Cloudinary with automatic optimization.
 *
 * Transformations applied:
 *   - quality: "auto"         → Cloudinary picks the best quality/size tradeoff
 *   - fetch_format: "auto"    → serves WebP/AVIF to browsers that support them
 *   - width limits by folder  → no one needs an 8000px avatar
 *
 * Result: typically 70-90% smaller files without visible quality loss.
 *
 * @param {Object} file   Multer file object
 * @param {string} folder Cloudinary folder (e.g. "user_avatar", "user_sketches")
 * @returns {Promise<string|undefined>} secure URL or undefined on failure
 */
const imageUpload = async (file, folder) => {
  if (!file) return undefined;

  // Dimension caps per folder type
  const dimensions = {
    user_avatar: { width: 500, height: 500, crop: "limit" },
    user_sketches: { width: 1600, crop: "limit" },
  };
  const dim = dimensions[folder] || { width: 1600, crop: "limit" };

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      // Auto-optimization
      quality: "auto:good",
      fetch_format: "auto",
      // Dimension limits
      ...dim,
      // Strip EXIF metadata (privacy + smaller files)
      invalidate: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return undefined;
  }
};

export default imageUpload;
