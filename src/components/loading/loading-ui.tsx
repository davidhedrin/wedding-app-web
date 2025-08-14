"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Configs from "@/lib/config";
import { cn } from "@/lib/utils";

export default function LoadingUI({ className, ...props }: React.ComponentProps<"div">) {
  const [mounted, setMounted] = useState(false);
  const appName = Configs.app_name;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-1">
        <i className='bx bx-shopping-bag bx-tada text-3xl'></i>
        <p className='text-sm font-medium'>{appName}...</p>
      </div>
    </div>,
    document.body
  );
}