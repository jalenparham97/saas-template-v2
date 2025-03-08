/**
 * S3 client and utility functions for handling file operations with Cloudflare R2
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
 * Configured S3 client instance for Cloudflare R2
 */
export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a pre-signed URL for uploading a file to R2
 * @param imageKey - The unique key/path where the file will be stored in the bucket
 * @returns Promise<string> A temporary signed URL valid for 60 seconds
 */
export async function getUploadUrl(imageKey: string) {
  const putCommand = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: imageKey,
  });
  return await getSignedUrl(s3Client, putCommand, { expiresIn: 60 });
}

/**
 * Deletes a file from the R2 bucket
 * @param fileKey - The key/path of the file to delete from the bucket
 * @returns Promise<DeleteObjectCommandOutput> The response from the delete operation
 */
export async function deleteFile(fileKey: string) {
  const deleteParams = {
    Bucket: env.R2_BUCKET_NAME,
    Key: fileKey,
  };

  return await s3Client.send(new DeleteObjectCommand(deleteParams));
}
