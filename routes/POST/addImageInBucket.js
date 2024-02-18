/** @format */

import s3Client from "../../config/s3ClientConfig.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const addImageInBucket = async (bucket, key) => {
  const { Body } = await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
  return Body;
};
export default addImageInBucket;
