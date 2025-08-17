import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT || undefined, // optional for R2/MinIO
  forcePathStyle: !!process.env.S3_ENDPOINT,      // only needed for non-AWS
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(req: Request) {
  const { contentType, placeId } = await req.json();
  if (!contentType || !placeId) return NextResponse.json({ error: "missing" }, { status: 400 });

  const key = `places/${placeId}/${randomUUID()}`;
  const putCmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ACL: "public-read" as any // if supported; otherwise set bucket policy public
  });

  const url = await getSignedUrl(s3, putCmd, { expiresIn: 60 });
  const publicUrl = process.env.S3_ENDPOINT 
    ? `${process.env.S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`
    : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl: url, publicUrl });
}
