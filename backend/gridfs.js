import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const conn = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
});

const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return { filename: file.originalname, bucketName: "uploads" };
  },
});

const upload = multer({ storage });

export { gfs, upload };
