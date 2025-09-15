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
  img_name: string | null;
  img_url: string | null;
  file_img: File | null;
};

export type DtoTemplates = {
  id: number | null;
  name: string;
  price: number;
  disc_price: number | null;
  short_desc: string | null;
  desc: string | null;
  ctg_key: string | null;
  url: string;
  flag_name: string | null;
  flag_color: string | null;
  is_active: boolean | null;
  colors: string | null;
  language: string | null;
  layouts: string | null;

  captures: DtoCaptureTemplate[];
};

export type DtoCaptureTemplate = {
  id: number | null;
  file: File | null;
  file_name: string | null;
  file_path: string | null;
  idx: number;
}