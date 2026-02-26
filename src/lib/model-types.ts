import { EventGiftTypeEnum, GroomBrideEnum, ScheduleEnum, TradRecepType } from "@/generated/prisma";

export type BreadcrumbType = {
  url: string | null;
  name: string;
};

export type Color = {
  name: string;
  value: string;
};

export type StatusType = | "secondary" | "primary" | "success" | "warning" | "danger";

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

export type FormState = {
  title?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
  success?: boolean;
  message?: string;
};

export type TableThModel = {
  key: string;
  name: string;
  key_sort: string;
  IsVisible?: boolean;
};

export type TableShortList = {
  key: string;
  sort?: "asc" | "desc" | "";
};

export type CommonParams = {
  curPage?: number;
  perPage?: number;
};

export type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UploadFileRespons = {
  status: boolean;
  message: string | null;
  filename: string | null;
  path: string | null;
};

export type CategoryKeyProps = {
  key: string;
  name: string;
  status: boolean;
};

export type MusicGroupProps = {
  key: string;
  items: MusicThemeProps[];
};

export type MusicThemeProps = {
  name: string;
  url: string;
};

export type PaymentMethodProps = {
  key: string;
  name: string;
  icon: string;
  status: boolean;
};

export type GroomBrideProps = {
  fullname: string;
  birth_date: Date;
  birth_place: string;
  type: GroomBrideEnum;
  shortname: string;
  birth_order: number;
  father_name: string | null;
  mother_name: string | null;
  place_origin: string | null;
  occupation: string | null;
  personal_msg: string | null;
  img_name: string | null;
  img_path: string | null;
};
export type EventInitProps = {
  event_time: Date | undefined;
  greeting_msg: string | null;
  couple_img_name: string | null;
  couple_img_path: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  music_url: string | null;
  schedule_note: string | null;
  wishlist_address: string | null;
  gb_info: GroomBrideProps[];
  schedule_info: {
    type: ScheduleEnum;
    date: Date;
    start_time: string;
    end_time: string | null;
    location: string | null;
    address: string | null;
    latitude: string | null;
    longitude: string | null;
    notes: string[];
    ceremony_type: TradRecepType | null;
    use_main_loc: boolean;
  }[];
  event_galleries: {
    img_name: string | null;
    img_path: string | null;
  }[];
  event_histories: {
    name: string;
    desc: string | null;
    month: string;
    year: string;
    gallery: {
      img_path: string | null;
    } | null;
  }[];
  event_gifts: {
    name: string;
    type: EventGiftTypeEnum;
    account: string | null;
    no_rek: string | null;
    qty: number | null;
    product_url: string | null;
    product_price: number | null;
    reserve_qty: number;
  }[];
  event_faq: {
    question: string;
    answer: string;
  }[];
  event_rsvp: {
    name: string;
    event_id: number;
    phone: string | null;
    rsvp: boolean | null;
  };
};

export type InvitationParams = {
  code?: string;
};