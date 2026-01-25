"use server";

import { UploadFileRespons } from '@/lib/model-types';
import { stringWithTimestamp } from '@/lib/utils';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from "path";
import sharp from 'sharp';

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

function getExtSharp(format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo): string {
  if (typeof format === "string") return format.toLowerCase();
  if ("id" in format) return format.id;
  throw new Error("Invalid image format");
}
export async function UploadFileCompress(
  file: File,
  to_format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  loc: string,
  prefix?: string,

  quality: number = 75, // 75 for webp, 60 for avif
  effort: number = 4, // 4 for webp, 5 for avif
): Promise<UploadFileRespons> {
  try {
    const arrayFileBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayFileBuffer);

    const compressedBuffer = await sharp(fileBuffer).toFormat(to_format, {
      quality,
      effort
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