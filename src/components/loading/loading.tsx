"use client";
import { useLoading } from "./loading-context";
import LoadingUI from "./loading-ui";

export default function Loading() {
  const { isLoading, className, activeTitle } = useLoading();
  if (!isLoading) return null;
  return <LoadingUI className={className !== undefined ? className : "backdrop-blur-sm"} activeTitle={activeTitle} />
}