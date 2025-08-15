import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility untuk menggabungkan class Tailwind dengan pintar.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
};