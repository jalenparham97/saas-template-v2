import { env } from "@/env";

export function createImageUploadUrl(fileKey: string) {
  return `${env.NEXT_PUBLIC_S3_PUBLIC_BUCKET_URL}/${fileKey}`;
}
