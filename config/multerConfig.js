/** @format */

import s3Client from "../config/s3ClientConfig.js";
import multer from "multer";
import multerS3 from "multer-s3";

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const folder = req.query.folder;
      const filename = `${folder}/${Date.now().toString()}-${
        file.originalname
      }`;
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

export default upload;
