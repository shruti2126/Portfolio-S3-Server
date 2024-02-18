/** @format */

import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3ClientConfig.js";

const listAllObjectsInBucket = async (bucket) => {
  const output = await s3Client.send(new ListObjectsV2Command({
    Bucket: bucket,
  }));
  return output.Contents;
};
export default listAllObjectsInBucket;
