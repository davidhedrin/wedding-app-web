"use client";

import { useToastStore } from "@/lib/zustand";
import { JSX } from "react";

const styles = {
  success: 'text-teal-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  danger: 'text-red-500',
}

const icons: Record<string, JSX.Element> = {
  success: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.02L7.48 9.42 5.38 7.32a.75.75 0 1 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.08-.02l3.99-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  ),
  info: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.41-1 4.7c-.07.34.03.53.3.53.19 0 .49-.07.69-.25l-.09.42c-.29.35-.92.6-1.47.6-.7 0-1-.42-.8-1.32l.74-3.47c.06-.29 0-.4-.29-.47l-.45-.08.08-.38 2.29-.29zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  ),
  warning: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.9.9 0 0 0-.9 1l.35 3.5a.55.55 0 0 0 1.1 0l.35-3.5A.9.9 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  ),
  danger: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.35 4.65a.5.5 0 0 0-.7.7L7.29 8l-2.65 2.65a.5.5 0 0 0 .7.7L8 8.7l2.65 2.65a.5.5 0 0 0 .7-.7L8.7 8l2.65-2.65a.5.5 0 0 0-.7-.7L8 7.29 5.35 4.65z" />
    </svg>
  ),
}

export const ToastProvider = () => {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-62">
      {toasts.map((t) => (
        <div key={t.id} className="w-xs p-3 bg-white border border-gray-200 rounded-xl shadow-lg" role="alert">
          <div className="flex justify-between gap-3">
            <div className="flex gap-3">
              <div className={`shrink-0 ${styles[t.type]} mt-0.5`}>
                {icons[t.type]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{t.title || "Title Toast"}</p>
                <p className="text-sm text-muted">{t.message || "This is a normal message."}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if(t.id) remove(t.id)
              }}
              className="size-5 text-gray-800 opacity-50 hover:opacity-100"
            >
              <svg className="size-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
