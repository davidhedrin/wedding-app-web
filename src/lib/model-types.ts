export type BreadcrumbType = {
  url: string | null;
  name: string;
};

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