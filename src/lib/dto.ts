import { DiscTypeEnum, EventStatusEnum, RolesEnum } from "@/generated/prisma";

export type StatusType = | "secondary" | "primary" | "success" | "warning" | "danger";

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
};

export type DtoEvents = {
  id: number | null;
  user_id: number | null;
  tmp_id: number;
  tmp_status: EventStatusEnum;
  tmp_ctg: string;
  tmp_ctg_key: string;
};

export type DtoSnapMidtrans = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string | null;
    email: string;
    phone: string | null;
  };
  item_details: {
    id: number | null;
    price: number;
    quantity: number;
    name: string;
    category: string | null;
    merchant_name: string | null;
  }[];
};

export type MidtransSnapResponse = {
  token: string;
  redirect_url: string;
};

export type DtoVouchers = {
  id: number | null;
  code: string,
  disc_type: DiscTypeEnum,
  disc_amount: number,
  valid_from: string,
  valid_to: string,
  total_qty: number,
  is_one_use: boolean,
  desc: string | null,
  is_active: boolean | null;
};

export type DtoTr = {
  event_id: number;
  voucher_id: number | null;
  add_ons1: boolean | null;
  add_ons1_amount: number | null;
}