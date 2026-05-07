import { NextResponse } from "next/server";
import { isS3Configured, getPresignedUploadUrl, buildKey } from "@/lib/s3";
import { getCurrentUserFull } from "@/lib/auth";

export async function POST(req) {
  const user = await getCurrentUserFull();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isS3Configured()) {
    return NextResponse.json({ error: "S3 not configured. Set AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in .env" }, { status: 500 });
  }
  try {
    const body = await req.json();
    const { filename, contentType, folder } = body;
    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType required" }, { status: 400 });
    }
    const allowedFolders = ["properties", "projects", "testimonials", "users", "documents", "logos", "favicons", "site-visits"];
    const safeFolder = allowedFolders.includes(folder) ? folder : "uploads";
    const key = buildKey(safeFolder, filename);
    const result = await getPresignedUploadUrl(key, contentType);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[S3 PRESIGN]", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
