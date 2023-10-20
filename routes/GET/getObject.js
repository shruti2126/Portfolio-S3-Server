/** @format */

import { GetObjectCommand } from "@aws-sdk/client-s3";
const getObjectByKey = async (key) => {
  // Read the object.
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: myportfoliomedia,
      Key: key,
    })
	);
	console.log("body of object retrieved = ", Body.transformToString());
	return Body;
  
};
export default getObjectByKey;