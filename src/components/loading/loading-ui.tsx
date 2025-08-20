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
        <img src="/assets/img/logo/wedlyvite-logo-web.png" className="w-8 h-auto tada-animation" />
        <p className='text-sm font-medium'>{appName}...</p>
      </div>
    </div>,
    document.body
  );
}