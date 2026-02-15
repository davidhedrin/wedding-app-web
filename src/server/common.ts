"use server";

import { UploadFileRespons } from '@/lib/model-types';
import { stringWithTimestamp } from '@/lib/utils';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from "path";
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

function getExtSharp(format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo): string {
  if (typeof format === "string") return format.toLowerCase();
  if ("id" in format) return format.id;
  throw new Error("Invalid image format");
};

function getCompressionParams(sizeKB: number) {
  if (sizeKB >= 4096) return { quality: 50, effort: 4 };
  if (sizeKB >= 2048) return { quality: 80, effort: 4 };
  if (sizeKB >= 1024) return { quality: 100, effort: 3 };
  if (sizeKB >= 500) return { quality: 140, effort: 3 };
  // < 500 KB
  return { quality: 165, effort: 2 };
};

export async function compressImage(
  file: File,
  to_format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  quality: number = 75,
  effort: number = 4 // 4 for webp, 5 for avif
): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return await sharp(buffer).toFormat(to_format, {
    quality,
    effort
  }).toBuffer();
};

export async function UploadFile(file: File, loc: string, prefix?: string): Promise<UploadFileRespons> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    const uploadsDir = path.join(process.cwd(), loc);
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  
    const randomName = stringWithTimestamp(5, true);
    const originalExt = path.extname(file.name);
    if (!originalExt) {
      throw new Error("File must have an extension");
    }

    const fileName = `${prefix ? prefix + '-' : ''}${randomName}${originalExt}`;
    const filePath = path.join(uploadsDir, fileName);
  
    await writeFile(filePath, buffer);
    return {
      status: true,
      filename: fileName,
      message: "File upload successfully",
      path: filePath
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
      filename: null,
      path: null
    };
  }
};

export async function DeleteFile(loc: string, filename: string): Promise<UploadFileRespons> {
  try {
    const filePath = path.join(process.cwd(), loc, filename);
    if (!existsSync(filePath)) {
      return {
        status: false,
        message: "File was not found.",
        filename: filename,
        path: null
      };
    }

    unlinkSync(filePath);
    return {
      status: true,
      message: "File deleted successfully.",
      filename: filename,
      path: null
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
      filename: filename,
      path: null
    };
  }
};

export async function UploadFileCompress(
  file: File,
  to_format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  loc: string,
  prefix?: string,
): Promise<UploadFileRespons> {
  try {
    const arrayFileBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayFileBuffer);

    const sizeKb = fileBuffer.length / 1024;
    let { quality, effort } = getCompressionParams(sizeKb);

    const compressedBuffer = await sharp(fileBuffer).toFormat(to_format, {
      quality,
      effort,
      chromaSubsampling: "4:2:0"
    }).toBuffer();

    const uploadsDir = path.join(process.cwd(), loc);

    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const randomName = stringWithTimestamp(5, true);
    const ext = getExtSharp(to_format);
    const fileName = `${prefix ? prefix + '-' : ''}${randomName}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, compressedBuffer);

    return {
      status: true,
      message: "File upload successfully",
      filename: fileName,
      path: filePath
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
      filename: null,
      path: null
    };
  }
};

const cloudflare_s3 = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_URL_S3,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});
export async function CloudflareUploadFile(
  file: File,
  to_format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  bucket: string,
  prefix?: string,
): Promise<UploadFileRespons> {
  try {
    const arrayFileBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayFileBuffer);

    const sizeKb = fileBuffer.length / 1024;
    let { quality, effort } = getCompressionParams(sizeKb);

    const compressedBuffer = await sharp(fileBuffer).toFormat(to_format, {
      quality,
      effort,
      chromaSubsampling: "4:2:0"
    }).toBuffer();

    const randomName = stringWithTimestamp(5, true);
    const ext = getExtSharp(to_format);
    const fileName = `${prefix ? prefix + '-' : ''}${randomName}.${ext}`;

    const putObjectCmd = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: compressedBuffer,
      ContentType: `image/${ext}`,
    });
    
    const res = await cloudflare_s3.send(putObjectCmd);
    const fileUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_ENDPOINT}/${fileName}`;
    return {
      status: true,
      message: "File upload successfully",
      filename: fileName,
      path: fileUrl
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
      filename: null,
      path: null
    };
  }
};

export async function CloudflareDeleteFile(bucket: string, filename: string): Promise<UploadFileRespons> {
  try{
    const deleteCmd = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filename,
    });

    await cloudflare_s3.send(deleteCmd);

    return {
      status: true,
      message: "File deleted successfully.",
      filename: filename,
      path: null
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
      filename: null,
      path: null
    };
  }
}