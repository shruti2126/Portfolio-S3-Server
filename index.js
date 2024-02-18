/** @format */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import corsConfig from "./config/corsConfig.js";
import addBucket from "./routes/POST/addBucket.js";
import addFolderInBucket from "./routes/POST/addFolderInBucket.js";
import listAllObjectsInBucket from "./routes/GET/listAllObjectsInBucket.js";
import getObjectByKey from "./routes/GET/getObjectByKey.js";
import upload from "./config/multerConfig.js"

const app = express();
app.use(express.json());
app.use(corsConfig);


//get object
// Example URL: /getObjectByKey?subdirectory=dir&key=my-image.jpg
app.get("/getObjectByKey", async (req, res) => {
  const { subdirectory, key } = req.query;
  try {
    // Set the appropriate content type for the image
    res.setHeader("Content-Type", "image/png");
    const data = await getObjectByKey(subdirectory, key);
    data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

//list all object in a bucket
app.get("/listAllObjectsInBucket", async (req, res) => {
  const { bucket } = req.query;
  console.log("bucket name = ", bucket);
  try {
    const list = await listAllObjectsInBucket(bucket);
    console.log("listOfObjects = ", list);
    res.status(200).send(list);
  } catch (error) {
    res.json({ error });
  }
});

/**
 * Add a bucket in S3
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {express.Response}
 */
app.post("/addBucket", async (req, res) => {
  const { bucket } = req.query;
  console.log("bucket name = ", bucket);
  try {
    const bucketDetails = await addBucket(bucket);
    console.log("bucketDetails = ", bucketDetails);
    res.status(200).json({
      message: "Bucket added successfully",
      bucketDetails: bucketDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a folder in S3
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {express.Response} details of folder added
 */
app.post("/addFolderInBucket", async (req, res) => {
  const { bucket, folder } = req.query;
  try {
    const result = await addFolderInBucket(bucket, folder);
    console.log("Result:", result);
    res.status(200).json(result); // Sending the confirmation message as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add an image to a specified folder in a given bucket
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {express.Response} details of image added
 */
app.post("/addImageInFolder", upload.single("image"), (req, res) => {
  // After multer-s3 has processed the file upload, you can access the result through req.file
  if (req.file) {
    // Check if the file upload was successful
    console.log("Upload Successful", req.file);
    res.status(200).json({
      message: "Image uploaded successfully",
      fileLocation: req.file.location, // Location of the uploaded file in S3
    });
  } else {
    // If multer did not attach a file object to the request, the upload failed
    res.status(500).json({ message: "Failed to upload image" });
  }
});


// app.post("/addImageInFolder", async (req, res) => {
//   const { bucket, folder, image } = req.query;
//   try {
//     const result = await addImageInFolder(bucket, folder, key);
//     console.log("Result:", result);
//     res.status(200).json(result); // Sending the confirmation message as JSON
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port = ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).send({ message: `Hello! I am up and running on ${PORT}` });
  console.log("Hello! I am up and running on port ", process.env.PORT || 8080);
});

export default app;
