import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConfirmProps, ToastProps, useConfirmStore, useToastStore } from "./zustand";
import { signOutAuth } from "@/server/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
};

export function toast(params: ToastProps) {
  useToastStore.getState().add(params);
};

export function showConfirm(props: ConfirmProps): Promise<boolean> {
  return useConfirmStore.getState().open(props);
};

export async function signOutAction() {
  const confirmed = await showConfirm({
    title: 'Want to Logout?',
    message: 'Are you sure you want to log out of your account?',
    confirmText: 'Log Me Out',
    cancelText: 'Not Now',
    icon: 'bx bx-log-out bx-tada text-red-500'
  });
  if (!confirmed) return;

  toast({
    type: "success",
    title: "Logged Out!",
    message: "We'll be here when you're ready to log back in."
  });
  localStorage.clear();
  // clearuserData();
  await signOutAuth();
}