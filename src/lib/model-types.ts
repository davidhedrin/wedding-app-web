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