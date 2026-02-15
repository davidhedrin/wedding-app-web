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