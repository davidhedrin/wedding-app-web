import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConfirmProps, ToastProps, useConfirmStore, useToastStore, userLoginData } from "./zustand";
import { signOutAuth } from "@/server/auth";
import { TableShortList, TableThModel } from "./model-types";
import { RolesEnum } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export const roleLabels: Record<RolesEnum, string> = {
  ADMIN: 'Admin',
  CLIENT: 'Client',
};

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
};

export function modalAction(btnId: string) {
  const closeButton = document.getElementById(btnId) as HTMLButtonElement | null;
  closeButton?.click();
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

  localStorage.clear();
  userLoginData.getState().clearuserData();
  toast({
    type: "success",
    title: "Logged Out!",
    message: "We'll be here when you're ready to log back in."
  });
  await signOutAuth();
};

export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  return await bcrypt.hash(password, salt);
};

export function generateOtp(length: number): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export function removeListStateByIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
};

export function sortListToOrderBy(sortList: TableShortList[]): Record<string, any>[] {
  return sortList
  .filter(col => col.sort?.trim())
  .map(col => {
    const keys = col.key.split(".");
    return keys.reduceRight((acc, key, i) => ({ [key]: i === keys.length - 1 ? col.sort : acc }), {});
  });
};

export function normalizeSelectObj(tblThColomns: TableThModel[]): Record<string, any> {
  const selectObj: Record<string, any> = {};

  const parse = (str: string): any => {
    const stack: any[] = [];
    let curr: any = {};
    let key = '', i = 0;

    const pushKey = () => {
      if (key.trim()) curr[key.trim()] = true;
      key = '';
    };

    while (i < str.length) {
      const char = str[i];

      if (char === '[') {
        const parentKey = key.trim();
        key = '';
        const newObj: any = {};
        curr[parentKey] = { select: newObj };
        stack.push(curr);
        curr = newObj;
      } else if (char === ']') {
        pushKey();
        curr = stack.pop();
      } else if (char === ',') {
        pushKey();
      } else {
        key += char;
      }
      i++;
    }
    pushKey();
    return curr;
  };

  const deepMerge = (target: any, source: any): any => {
    for (const key in source) {
      if (
        source[key] instanceof Object &&
        target[key] instanceof Object
      ) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  tblThColomns.forEach(col => {
    if (!col.IsVisible || !col.key) return;
    const parsed = parse(col.key);
    deepMerge(selectObj, parsed);
  });

  return selectObj;
};

export function formatDate(dateString: string | Date, dtStyle: "short" | "full" | "long" | "medium" = "short", tmStyle?: "short" | "full" | "long" | "medium") {
  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: dtStyle });
  const timeFormatter = tmStyle ? new Intl.DateTimeFormat("id-ID", { timeStyle: tmStyle }) : null;

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter ? timeFormatter.format(date) : "";

  return tmStyle ? `${formattedDate} ${formattedTime}` : formattedDate;
};

type StringWithTimestampFunction = {
  (length?: number, tmp?: boolean, prefix?: string): string;
  v2: (length?: number, tmp?: boolean, prefix?: string) => string;
};
export const stringWithTimestamp: StringWithTimestampFunction = function (length: number = 5, tmp: boolean = false, prefix?: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomChar = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChar += characters[randomIndex];
  }

  const timestamp = tmp === true ? Date.now() : "";
  return `${prefix !== undefined ? prefix + "/" : "" }${randomChar}${timestamp}`;
} as StringWithTimestampFunction;
stringWithTimestamp.v2 = function (length: number = 5, tmp: boolean = false, prefix?: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChar = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChar += characters[randomIndex];
  }

  const timestamp = tmp === true ? Date.now() : "";
  return `${prefix !== undefined ? prefix + "/" : "" }${randomChar}${timestamp}`;
};