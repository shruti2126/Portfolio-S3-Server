/** @format */

import s3Client from "../../config/s3ClientConfig.js";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
const addBucket = async (bucketName) => {
  const { Body } = await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
  return Body;
};
export default addBucket;
