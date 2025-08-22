"use client";

import { useLoading } from "@/components/loading/loading-context";
import { useEffect } from "react";

export default function CatalogPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);
  
  return (
    <div>CatalogPage</div>
  )
}
