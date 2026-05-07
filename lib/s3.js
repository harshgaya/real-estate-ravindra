import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET = process.env.AWS_S3_BUCKET || "";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || "";
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const PUBLIC_URL = process.env.AWS_S3_PUBLIC_URL || "";
const APP_PREFIX = process.env.AWS_S3_APP_PREFIX || "real-estate-ravindra";

let client = null;
function getClient() {
  if (client) return client;
  if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) return null;
  client = new S3Client({
    region: REGION,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  });
  return client;
}

export function isS3Configured() {
  return !!(BUCKET && ACCESS_KEY && SECRET_KEY);
}

export function buildKey(folder, filename) {
  const ext = filename.includes(".")
    ? filename.split(".").pop().toLowerCase()
    : "bin";
  const safeExt = ext.replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
  const id = randomUUID();
  return `${APP_PREFIX}/${folder}/${id}.${safeExt}`;
}

export function getPublicUrl(key) {
  if (PUBLIC_URL) {
    const base = PUBLIC_URL.replace(/\/$/, "");
    return `${base}/${key}`;
  }
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function getPresignedUploadUrl(key, contentType) {
  const c = getClient();
  if (!c) throw new Error("S3 not configured");
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(c, command, { expiresIn: 600 });
  return { uploadUrl, key, publicUrl: getPublicUrl(key) };
}
