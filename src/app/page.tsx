"use client";

import { useLoading } from "@/components/loading/loading-context";
import { useEffect } from "react";

export default function Page() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);
  
  return (
    <div>
      <img src="/assets/img/2149043983.jpg" className="h-screen w-full object-cover" />
      <div className="max-w-5xl px-4 xl:px-0 mx-auto">

      </div>
    </div>
  );
}