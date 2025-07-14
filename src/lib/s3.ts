/**
 * S3 client and utility functions for handling file operations with Tigris Data
 * This module provides functionality for file uploads and deletions using S3-compatible API
 */

import { env } from "@/env";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Configured S3 client instance for interacting with Tigris Data
 */
export const s3Client = new S3Client({
  region: "auto",
  endpoint: env.S3_ENDPOINT_URL,
  forcePathStyle: false,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a pre-signed URL for uploading a file to Tigris Data
 * @param imageKey - The unique key/path where the file will be stored in the bucket
 * @returns Promise<string> A temporary signed URL valid for 60 seconds
 */
export async function getUploadUrl(imageKey: string) {
  const putCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: imageKey,
  });
  return await getSignedUrl(s3Client, putCommand, { expiresIn: 60 });
}

/**
 * Deletes a file from the Tigris Data bucket
 * @param fileKey - The key/path of the file to delete from the bucket
 * @returns Promise<DeleteObjectCommandOutput> The response from the delete operation
 */
export async function deleteFile(fileKey: string) {
  const deleteParams = {
    Bucket: env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
}

/**
 * Uploads a file to the Tigris Data bucket
 * @param fileKey - The key/path where the file will be stored in the bucket
 * @param buffer - The file content as a Buffer
 * @returns Promise<PutObjectCommandOutput> The response from the upload operation
 */
export async function uploadFile(fileKey: string, buffer: Buffer) {
  const uploadParams = {
    Bucket: env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: "image/svg+xml",
  };

  return await s3Client.send(new PutObjectCommand(uploadParams));
}
