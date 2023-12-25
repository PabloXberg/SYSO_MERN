import multer from "multer";
import path from "path";

const multerUploads = multer({ 
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {

    // check if the extencion is correct
    let extension = path.extname(file.originalname);
    if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
      cb(new Error("File extension not supported"), false);
      return;
    }

    // chek if the files is not to big or heavy

    cb(null, true);
  },
});

export {multerUploads}