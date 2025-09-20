import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function getAllItems(s3Client, bucketName) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
  });

  const response = await s3Client.send(command);
  return {
    objects: response.Contents || [],
    delimitedPrefixes: response.CommonPrefixes || [],
  };
}
