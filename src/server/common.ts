"use server";

import { UploadFileRespons } from '@/lib/model-types';
import { stringWithTimestamp } from '@/lib/utils';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from "path";

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