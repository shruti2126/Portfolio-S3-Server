/** @format */

import { PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3ClientConfig";
import fs from "fs";

/**
 * Adds an image to a specified folder in a given bucket.
 *
 * @param {string} bucket - The name of the bucket
 * @param {string} folder - The name of the folder
 * @param {object} file - The file to be added
 * @return {object} An object with a message indicating success or 
 *   an object with an error if the image could not be added
 */
const addImageInFolder = async (bucket, folder, file) => {
  const fileStream = fs.createReadStream(file.path);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${folder}/${file.originalname}`, // Use the original file name
    Body: fileStream,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  // Check if the image exists after upload
  const check = new ListObjectsCommand({
    Bucket: bucket,
    Prefix: `${folder}/${file.originalname}`,
  });
  const { Contents } = await s3Client.send(check);
  const exists = Contents.some(
    (object) => object.Key === `${folder}/${file.originalname}`
  );

  // Delete the temporary file
  fs.unlinkSync(file.path);

  if (exists) {
    return { message: "Image added to folder successfully" };
  } else {
    throw new Error("Failed to add image to folder!");
  }
};

export default addImageInFolder;