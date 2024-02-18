/** @format */

import { PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3ClientConfig.js";

const addFolderInBucket = async (bucket, folder) => {
  // Using PutObjectCommand to simulate creating a folder
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: folder + "/", // Ensuring the key ends with a slash
  });

  await s3Client.send(command); // Sending the command to S3
  console.log("PutObjectCommand sent for", folder);

  // Check if the folder was created by listing objects with the folder prefix
  const check = new ListObjectsCommand({
    Bucket: bucket,
    Prefix: folder + "/", // Ensure the prefix ends with a slash
  });

  const response = await s3Client.send(check);
  const exists = response.Contents.some(
    (object) => object.Key === folder + "/"
  );

  // Log the result of the check
  console.log(folder + " exists in bucket " + bucket + ": " + exists);

  // Return the appropriate message based on whether the folder exists
  if (exists) {
    console.log("Folder created successfully in bucket", bucket);
    return { message: "Folder created successfully" };
  } else {
    console.log("Failed to create folder in bucket", bucket);
    throw new Error("Failed to create folder"); // or handle this case as needed
  }
};

export default addFolderInBucket;
