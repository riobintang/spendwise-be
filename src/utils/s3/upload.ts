import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "./s3-client";

function generateKey(folder: string, userId: number, originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop() || "jpg";
  return `${folder}/${userId}-${timestamp}-${random}.${ext}`;
}

export async function uploadToS3(
  file: Express.Multer.File,
  folder: string,
  userId: number
): Promise<string> {
  const key = generateKey(folder, userId, file.originalname);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
}

export async function deleteFromS3(url: string): Promise<void> {
  const urlParts = url.split("/");
  const key = urlParts.slice(urlParts.indexOf(S3_BUCKET) + 2).join("/");

  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}
