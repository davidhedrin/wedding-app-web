import { RolesEnum } from "@prisma/client";

export type DtoSignIn = {
  email: string;
  password: string;
};

export type DtoSignUp = {
  fullname: string;
  email: string;
  password: string;
};

export type DtoOtpVerify = {
  token: string;
  otp: string;
};

export type DtoResetPassword = {
  token: string;
  password: string;
};

export type DtoUser = {
  id: number | null;
  email: string;
  role: RolesEnum;
  fullname: string;
  is_active: boolean;
  no_phone: string | null;
  gender: string | null;
  birth_date: Date | null;
  birth_place: string | null;
  img_url: string | null;
  file_img: File | null;
};