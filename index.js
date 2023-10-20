/** @format */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// This is used for getting user input.
import { createInterface } from "readline/promises";

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";

// Load AWS credentials and region from environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

// Ensure valid credentials and region
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  console.error("AWS credentials and region are missing.");
  process.exit(1); // Exit the application with an error code
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origins: ["http://localhost:3000", "https://shrutis.io"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

  // Create an S3 client with the configured credentials and region
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  // Put an object into an Amazon S3 bucket.
  await s3Client.send(
    new PutObjectCommand({
      Bucket: "myportfoliomedia",
      Key: "my-first-object.txt",
      Body: "Hello JavaScript SDK!",
    })
  );

  //get object
  app.get("/getMedia", async (req, res) => {
    const { key } = req.params;
    try {
      const obj = await getObjectByKey(key);
      
      res.status(200).sendFile(obj);
    } catch (error) {
      res.sendStatus(500).json({ error });
      console.log(error);
    }
  });

  

  // Confirm resource deletion.
  // const prompt = createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // const result = await prompt.question("Empty and delete bucket? (y/n) ");
  // prompt.close();

  // if (result === "y") {
  //   // Create an async iterator over lists of objects in a bucket.
  //   const paginator = paginateListObjectsV2(
  //     { client: s3Client },
  //     { Bucket: "myportfoliomedia" }
  //   );
  //   for await (const page of paginator) {
  //     const objects = page.Contents;
  //     if (objects) {
  //       // For every object in each page, delete it.
  //       for (const object of objects) {
  //         await s3Client.send(
  //           new DeleteObjectCommand({
  //             Bucket: "myportfoliomedia",
  //             Key: object.Key,
  //           })
  //         );
  //       }
  //     }
  //   }

  //   // Once all the objects are gone, the bucket can be deleted.
  //   await s3Client.send(
  //     new DeleteBucketCommand({ Bucket: "myportfoliomedia" })
  //   );
  // }


// Call a function if this file was run directly. This allows the file
// to be runnable without running on import.
// import { fileURLToPath } from "url";
// if (process.argv[1] === fileURLToPath(import.meta.url)) {
//   main();
// }

app.get("/", (req, res) => {
  res.send("Hello! I am up and running on port ", process.env.PORT || 8081);
});

export default app;
