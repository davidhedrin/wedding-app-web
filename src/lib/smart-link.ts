"use client";

import { useLoading } from "@/components/loading/loading-context";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export function useSmartLink() {
  const pathname = usePathname();
  const { setLoading } = useLoading();

  const handleSmartClick = useCallback(
    (targetHref?: string | null | undefined) => {
      if(targetHref === null || targetHref === undefined) return;
      if (pathname !== targetHref) setLoading(true);
    },
    [pathname, setLoading]
  );

  return handleSmartClick;
}
