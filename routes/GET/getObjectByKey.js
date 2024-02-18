/** @format */

import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3ClientConfig.js";

const getObjectByKey = async (subdirectory, key) => {
  // Read the object from the specified subdirectory.
  let keyOfObj = `${key}`;
  if (subdirectory !== undefined) {
    keyOfObj = `${subdirectory}/${key}`;
  }
  console.log(keyOfObj);
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: "myportfoliomedia",
      Key: keyOfObj, // Combine subdirectory and key
    })
  );

  return Body;
};

export default getObjectByKey;
