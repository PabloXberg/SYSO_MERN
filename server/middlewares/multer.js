import multer from "multer";
import path from "path";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

const multerUploads = multer({
  storage: multer.diskStorage({}),
  limits: {
    // 10 MB max upload — matches body-parser limit in index.js
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // BUG FIX: previous version missed .JPG / .PNG (uppercase) and modern
    // mobile formats like .heic that iPhones produce by default.
    const extension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return cb(
        new Error(
          `Formato no soportado. Usa: ${ALLOWED_EXTENSIONS.join(", ")}`
        ),
        false
      );
    }
    cb(null, true);
  },
});

export { multerUploads };
