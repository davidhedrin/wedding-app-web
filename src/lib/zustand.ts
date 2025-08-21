import { create } from 'zustand';
import { ToastType } from './model-types';
import { Session } from 'next-auth';

interface UserLoginData {
  userData: Session | null,
  statusLogin: "authenticated" | "loading" | "unauthenticated",
  fetchuserData: (data: Session | null, status: "unauthenticated" | "authenticated" | "loading") => void,
  clearuserData: () => void,
};
export const userLoginData = create<UserLoginData>((set) => ({
  userData: null,
  statusLogin: 'unauthenticated',
  fetchuserData: (data: Session | null, status: "unauthenticated" | "authenticated" | "loading") => {
    set({ userData: data, statusLogin: status });
  },
  clearuserData: () => set({ userData: null, statusLogin: 'unauthenticated' })
}));

export type ToastProps = {
  id?: string;
  type: ToastType;
  title?: string;
  message?: string;
  duration?: number;
};
type ToastStore = {
  toasts: ToastProps[];
  add: (toast: Omit<ToastProps, 'id'>) => void;
  remove: (id: string) => void;
};
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = crypto.randomUUID()
    const newToast = { ...toast, id }

    set((state) => ({ toasts: [...state.toasts, newToast] }))

    if (toast.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, toast.duration)
    }
  },
  remove: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  }))
}));


export type ConfirmProps = {
  title?: string;
  message?: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
}
type ConfirmState = ConfirmProps & {
  isOpen: boolean;
  open: (props: ConfirmProps) => Promise<boolean>;
  close: () => void;
  resolve: ((value: boolean) => void) | null;
  choose: (result: boolean) => void;
};

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  title: 'Confirm Action',
  icon: 'bx bx-bell bx-tada',
  message: 'Continue confirmation action needed',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  resolve: null,

  open: (props: ConfirmProps) => new Promise<boolean>((resolve) => {
    set({
      isOpen: true,
      title: props.title || 'Confirm Action',
      icon: props.icon || 'bx bx-bell bx-tada',
      message: props.message || 'Continue confirmation action needed',
      confirmText: props.confirmText || 'Confirm',
      cancelText: props.cancelText || 'Cancel',
      resolve,
    });
  }),

  close: () => {
    set({
      isOpen: false,
      resolve: null,
    });
  },

  choose: (result) => {
    const resolve = get().resolve;
    if (resolve) resolve(result);
    get().close();
  },
}));