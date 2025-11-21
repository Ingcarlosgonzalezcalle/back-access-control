import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/fotos");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    cb(null, uuid() + ext);
  }
});

export const upload = multer({ storage });
